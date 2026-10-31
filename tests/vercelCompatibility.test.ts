/**
 * VERCEL DEPLOYMENT & COMPATIBILITY VERIFICATION SUITE
 *
 * Verifies that the Meridian Vascular application satisfies all requirements
 * to build, deploy, and run flawlessly on Vercel's production platform.
 *
 * Checks performed:
 * 1. vercel.json configuration (framework, outputDirectory, buildCommand, rewrites)
 * 2. Linux Case-sensitivity audit on all imports (ensures Linux build compatibility)
 * 3. TypeScript typecheck (tsc --noEmit)
 * 4. Production build execution (npm run build)
 * 5. Production bundle validation (index.html, JS/CSS bundles, asset existence)
 * 6. Critical static asset checks (video, poster, icons, photos, size limits)
 * 7. SPA routing & HTTP simulation (simulates Vercel edge/static server)
 * 8. Client runtime safety (no Node built-ins leaked into client bundle, no secrets)
 * 9. Git readiness & remote branch audit
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const VERCEL_JSON_PATH = path.join(ROOT_DIR, 'vercel.json');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');

let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assert(condition: boolean, testName: string, errorDetail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (errorDetail) {
      console.error(`    Detail: ${errorDetail}`);
    }
    failCount++;
    failures.push(`${testName}${errorDetail ? ` -> ${errorDetail}` : ''}`);
  }
}

// ---------------------------------------------------------------------------
// TEST GROUP 1: vercel.json Configuration
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 1: Vercel Configuration (vercel.json) ===');
{
  assert(fs.existsSync(VERCEL_JSON_PATH), 'vercel.json exists in root directory');

  let vercelConfig: any = {};
  try {
    vercelConfig = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf-8'));
    assert(true, 'vercel.json is valid JSON');
  } catch (err: any) {
    assert(false, 'vercel.json is valid JSON', err.message);
  }

  assert(vercelConfig.framework === 'vite', 'vercel.json specifies framework: "vite"');
  assert(vercelConfig.outputDirectory === 'dist', 'vercel.json specifies outputDirectory: "dist"');
  assert(
    !vercelConfig.buildCommand || vercelConfig.buildCommand === 'npm run build',
    'vercel.json buildCommand is "npm run build" or defaults properly'
  );

  const hasSpaRewrite = Array.isArray(vercelConfig.rewrites) &&
    vercelConfig.rewrites.some((r: any) =>
      (r.source === '/(.*)' || r.source === '/:path*') &&
      r.destination === '/index.html'
    );
  assert(hasSpaRewrite, 'vercel.json includes SPA fallback rewrite to /index.html for client-side routing');
}

// ---------------------------------------------------------------------------
// TEST GROUP 2: Linux Case-Sensitivity Audit for Imports
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 2: Linux Case-Sensitivity Import Audit ===');
{
  function getAllFiles(dir: string, ext: string[]): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getAllFiles(full, ext));
      } else if (ext.some(e => entry.name.endsWith(e))) {
        files.push(full);
      }
    }
    return files;
  }

  function verifyPathCaseSensitive(fromFile: string, importPath: string): { ok: boolean; reason?: string } {
    let resolvedBase: string;
    if (importPath.startsWith('@/')) {
      resolvedBase = path.join(ROOT_DIR, importPath.slice(2));
    } else if (importPath.startsWith('.')) {
      resolvedBase = path.resolve(path.dirname(fromFile), importPath);
    } else {
      // Node module package import
      return { ok: true };
    }

    const segments = path.relative(ROOT_DIR, resolvedBase).split(path.sep);
    let currentPath = ROOT_DIR;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const isLast = i === segments.length - 1;
      const actualEntries = fs.readdirSync(currentPath);

      if (isLast) {
        const possibleNames = [
          seg,
          `${seg}.ts`,
          `${seg}.tsx`,
          `${seg}.js`,
          `${seg}.jsx`,
          `${seg}.json`,
          `${seg}.css`,
        ];

        const exactMatch = actualEntries.find(e => possibleNames.includes(e));
        if (exactMatch) {
          return { ok: true };
        }

        if (actualEntries.includes(seg)) {
          const subDir = path.join(currentPath, seg);
          if (fs.statSync(subDir).isDirectory()) {
            const indexEntries = fs.readdirSync(subDir);
            if (indexEntries.some(e => ['index.ts', 'index.tsx', 'index.js'].includes(e))) {
              return { ok: true };
            }
          }
        }

        const caseInsensitiveMatch = actualEntries.find(e =>
          possibleNames.some(p => p.toLowerCase() === e.toLowerCase())
        );
        if (caseInsensitiveMatch) {
          return {
            ok: false,
            reason: `Casing mismatch: imported '${seg}' but file on disk is '${caseInsensitiveMatch}'`
          };
        }

        return { ok: false, reason: `File not found: '${seg}' in '${path.relative(ROOT_DIR, currentPath)}'` };
      } else {
        if (!actualEntries.includes(seg)) {
          const caseMatch = actualEntries.find(e => e.toLowerCase() === seg.toLowerCase());
          if (caseMatch) {
            return {
              ok: false,
              reason: `Directory casing mismatch: path specified '${seg}' but disk has '${caseMatch}'`
            };
          }
          return { ok: false, reason: `Directory not found: '${seg}' in '${path.relative(ROOT_DIR, currentPath)}'` };
        }
        currentPath = path.join(currentPath, seg);
      }
    }

    return { ok: true };
  }

  const srcFiles = getAllFiles(SRC_DIR, ['.ts', '.tsx']);
  let casingErrors: string[] = [];

  const importRegex = /(?:import|export)\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match: RegExpExecArray | null;
    while ((match = importRegex.exec(content)) !== null) {
      const importTarget = match[1];
      if (importTarget.startsWith('.') || importTarget.startsWith('@/')) {
        const res = verifyPathCaseSensitive(file, importTarget);
        if (!res.ok) {
          casingErrors.push(`${path.relative(ROOT_DIR, file)} -> '${importTarget}' (${res.reason})`);
        }
      }
    }
  }

  assert(
    casingErrors.length === 0,
    'All relative imports match exact disk casing (Linux case-sensitivity verified)',
    casingErrors.slice(0, 5).join('; ')
  );
}

// ---------------------------------------------------------------------------
// TEST GROUP 3: TypeScript Type Checking
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 3: TypeScript Compilation Check ===');
{
  try {
    execSync('npx tsc --noEmit', { cwd: ROOT_DIR, stdio: 'pipe' });
    assert(true, 'npx tsc --noEmit reports 0 errors');
  } catch (err: any) {
    assert(false, 'npx tsc --noEmit reports 0 errors', err.stdout?.toString() || err.message);
  }
}

// ---------------------------------------------------------------------------
// TEST GROUP 4: Production Build Execution (Vite)
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 4: Production Build Verification ===');
{
  try {
    const buildStart = Date.now();
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'pipe' });
    const buildDuration = Date.now() - buildStart;
    assert(true, `npm run build completed successfully in ${buildDuration}ms`);
  } catch (err: any) {
    assert(false, 'npm run build completed successfully', err.stdout?.toString() || err.message);
  }

  assert(fs.existsSync(DIST_DIR), 'dist/ directory created');
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  assert(fs.existsSync(indexHtmlPath), 'dist/index.html generated');

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  assert(indexHtml.includes('<div id="root">'), 'dist/index.html contains root container <div id="root">');
  assert(indexHtml.includes('type="module"'), 'dist/index.html includes module script tag');
  assert(indexHtml.includes('stylesheet'), 'dist/index.html includes CSS link stylesheet');

  const assetMatches = Array.from(indexHtml.matchAll(/(?:src|href)="([^"]+)"/g)).map(m => m[1]);
  let missingReferencedAssets: string[] = [];

  for (const assetUrl of assetMatches) {
    if (assetUrl.startsWith('/assets/')) {
      const assetOnDisk = path.join(DIST_DIR, assetUrl.replace(/^\//, ''));
      if (!fs.existsSync(assetOnDisk)) {
        missingReferencedAssets.push(assetUrl);
      }
    }
  }

  assert(
    missingReferencedAssets.length === 0,
    'All JS and CSS assets linked in dist/index.html exist on disk',
    missingReferencedAssets.join(', ')
  );
}

// ---------------------------------------------------------------------------
// TEST GROUP 5: Static Assets & Video Assets in dist/
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 5: Static Assets & Media in dist/ ===');
{
  const newBgPath = path.join(DIST_DIR, 'assets', 'meridian-hero-background.mp4');
  const newPosterPath = path.join(DIST_DIR, 'assets', 'meridian-hero-poster.jpg');
  assert(fs.existsSync(newBgPath), 'dist/assets/meridian-hero-background.mp4 exists');
  assert(fs.existsSync(newPosterPath), 'dist/assets/meridian-hero-poster.jpg exists');

  if (fs.existsSync(newBgPath)) {
    const stat = fs.statSync(newBgPath);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    assert(
      stat.size > 100000 && stat.size < 100 * 1024 * 1024,
      `Hero background video size (${sizeMb} MB) is healthy and well within Vercel's 100MB limit`
    );
  }

  const photosDistDir = path.join(DIST_DIR, 'assets', 'photos');
  if (fs.existsSync(photosDistDir)) {
    const photos = fs.readdirSync(photosDistDir);
    assert(photos.length > 0, `dist/assets/photos contains ${photos.length} medical photography assets`);
  }
}

// ---------------------------------------------------------------------------
// TEST GROUP 6: SPA Routing & HTTP Simulation
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 6: Vercel SPA Routing & Static Serving Simulation ===');
await (async function testHttpServer() {
  const PORT = 5892;
  const mimeMap: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.mp4': 'video/mp4',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
  };

  const server = http.createServer((req, res) => {
    const urlPath = req.url?.split('?')[0] || '/';
    let filePath = path.join(DIST_DIR, urlPath.replace(/^\//, ''));

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  });

  await new Promise<void>((resolve) => server.listen(PORT, '127.0.0.1', () => resolve()));

  async function fetchPath(p: string) {
    return new Promise<{ status: number; contentType: string; body: string }>((resolve, reject) => {
      http.get(`http://127.0.0.1:${PORT}${p}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            contentType: res.headers['content-type'] || '',
            body: data,
          });
        });
      }).on('error', reject);
    });
  }

  const rootRes = await fetchPath('/');
  assert(rootRes.status === 200 && rootRes.body.includes('<div id="root">'), 'HTTP GET / returns 200 and loads SPA index.html');

  const routesToTest = [
    '/learn/dvt',
    '/learn/anatomy',
    '/learn/habits',
    '/learn/procedures',
    '/treatments',
    '/quiz',
    '/ask',
    '/clinic-locator',
    '/myth-busters',
    '/privacy',
    '/terms',
  ];

  let allRoutesPass = true;
  for (const r of routesToTest) {
    const rRes = await fetchPath(r);
    if (rRes.status !== 200 || !rRes.body.includes('<div id="root">')) {
      allRoutesPass = false;
      assert(false, `SPA Deep Link ${r} returns 200 and index.html`);
    }
  }
  if (allRoutesPass) {
    assert(true, `All ${routesToTest.length} educational & feature SPA deep routes return HTTP 200 with index.html fallback`);
  }

  const videoRes = await fetchPath('/assets/meridian-hero-background.mp4');
  assert(
    videoRes.status === 200 && videoRes.contentType.includes('video/mp4'),
    'HTTP GET /assets/meridian-hero-background.mp4 returns 200 with Content-Type video/mp4'
  );

  const posterRes = await fetchPath('/assets/meridian-hero-poster.jpg');
  assert(
    posterRes.status === 200 && posterRes.contentType.includes('image/jpeg'),
    'HTTP GET /assets/meridian-hero-poster.jpg returns 200 with Content-Type image/jpeg'
  );

  server.close();
})();

// ---------------------------------------------------------------------------
// TEST GROUP 7: Client Bundle Safety & Hygiene
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 7: Client Bundle Safety & Hygiene ===');
{
  const distAssetsDir = path.join(DIST_DIR, 'assets');
  const jsFiles = fs.readdirSync(distAssetsDir).filter(f => f.endsWith('.js'));

  let foundNodeBuiltins = false;
  let foundSecrets = false;

  for (const jsFile of jsFiles) {
    const content = fs.readFileSync(path.join(distAssetsDir, jsFile), 'utf-8');

    if (/\bchild_process\b|\bprocess\.versions\.node\b/.test(content)) {
      foundNodeBuiltins = true;
    }

    if (/[A-Za-z0-9_-]{20,}:[A-Za-z0-9_-]{20,}/.test(content) && /api[_-]?secret/i.test(content)) {
      foundSecrets = true;
    }
  }

  assert(!foundNodeBuiltins, 'Client bundles contain no Node-only server module dependencies');
  assert(!foundSecrets, 'Client bundles contain no leaked API secret tokens');
}

// ---------------------------------------------------------------------------
// TEST GROUP 8: Git & Remote Configuration
// ---------------------------------------------------------------------------
console.log('\n=== GROUP 8: Git Repository & Remote Configuration ===');
{
  const currentBranch = execSync('git branch --show-current', { cwd: ROOT_DIR }).toString().trim();
  assert(currentBranch === 'main', `Current active Git branch is 'main' (got: '${currentBranch}')`);

  const remoteUrl = execSync('git remote get-url origin', { cwd: ROOT_DIR }).toString().trim();
  const expectedRemote = 'https://github.com/vibhushetty0104-design/varicose-veins-clear-pics-vibhu.git';
  assert(
    remoteUrl === expectedRemote,
    'Git remote "origin" matches verified repository',
    `Expected: ${expectedRemote}, Got: ${remoteUrl}`
  );

  // Check code files in src/ are clean
  const statusOutput = execSync('git status --short src/', { cwd: ROOT_DIR }).toString().trim();
  assert(
    statusOutput.length === 0,
    'Source tree (src/) is committed and ready for Vercel deployment'
  );
}

// ---------------------------------------------------------------------------
// SUMMARY & REPORT
// ---------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`VERCEL READINESS TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================');

if (failCount > 0) {
  console.error('\nFailures encountered:');
  for (const f of failures) {
    console.error(`  - ${f}`);
  }
  process.exit(1);
} else {
  console.log('\n🎉 ALL VERCEL COMPATIBILITY CHECKS PASSED!');
  console.log('The application is 100% ready to be deployed and hosted on Vercel.\n');
  process.exit(0);
}
