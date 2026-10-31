const { chromium } = require('C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('Launching browser with Chrome executable...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Verify DOM Sequence
  const sequence = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return [];
    return Array.from(main.children).map(el => {
      const id = el.id || el.getAttribute('aria-label') || el.className?.slice?.(0, 30) || el.tagName;
      const h2 = el.querySelector('h2')?.textContent?.trim?.() || '';
      return { tag: el.tagName, id, heading: h2 };
    });
  });

  console.log('DOM Section Sequence:');
  sequence.forEach((s, idx) => {
    console.log(` [${idx}] <${s.tag}> id="${s.id}" heading="${s.heading}"`);
  });

  const ids = sequence.map(s => s.id);
  const exploreIdx = ids.findIndex(id => id.includes('explore-leg-health') || id.includes('explore'));
  const patientFirstIdx = ids.findIndex(id => id.includes('patient-first'));
  const coreBusinessIdx = ids.findIndex(id => id.includes('core-business'));
  const sustainableIdx = ids.findIndex(id => id.includes('sustainable-business'));

  console.log(`\nIndices Check:`);
  console.log(`- ExploreCareGrid Index: ${exploreIdx}`);
  console.log(`- PatientFirst Index: ${patientFirstIdx}`);
  console.log(`- CoreBusiness Index: ${coreBusinessIdx}`);
  console.log(`- SustainableBusiness Index: ${sustainableIdx}`);

  const isOrderCorrect = exploreIdx !== -1 && 
                         patientFirstIdx > exploreIdx && 
                         coreBusinessIdx > patientFirstIdx && 
                         sustainableIdx > coreBusinessIdx;
  console.log(`\n>>> Critical requirement: Complete About Us placed AFTER explore icons: ${isOrderCorrect ? 'PASSED (YES)' : 'FAILED (NO)'}`);

  // Screenshot directory in both project and brain artifact directory
  const artifactDir = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots';
  const localDir = path.resolve('screenshots');
  [artifactDir, localDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Desktop view screenshots
  console.log('\nCapturing Desktop screenshots (1440x900)...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(600);

  // Explore Care Grid
  const exploreEl = await page.$('#explore-leg-health');
  if (exploreEl) {
    await exploreEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const p1 = path.join(artifactDir, 'reposition-01-explore-grid.png');
    await page.screenshot({ path: p1 });
    fs.copyFileSync(p1, path.join(localDir, 'reposition-01-explore-grid.png'));
  }

  // Patient First section
  const patientFirstEl = await page.$('#patient-first');
  if (patientFirstEl) {
    await patientFirstEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const p2 = path.join(artifactDir, 'reposition-02-patient-first.png');
    await page.screenshot({ path: p2 });
    fs.copyFileSync(p2, path.join(localDir, 'reposition-02-patient-first.png'));
  }

  // Core Business section
  const coreBusinessEl = await page.$('#core-business');
  if (coreBusinessEl) {
    await coreBusinessEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const p3 = path.join(artifactDir, 'reposition-03-core-business.png');
    await page.screenshot({ path: p3 });
    fs.copyFileSync(p3, path.join(localDir, 'reposition-03-core-business.png'));
  }

  // Sustainable Business section
  const sustainableEl = await page.$('#sustainable-business');
  if (sustainableEl) {
    await sustainableEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const p4 = path.join(artifactDir, 'reposition-04-sustainable-business.png');
    await page.screenshot({ path: p4 });
    fs.copyFileSync(p4, path.join(localDir, 'reposition-04-sustainable-business.png'));
  }

  // Tablet screenshot
  console.log('Capturing Tablet screenshot (768x1024)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(600);
  if (patientFirstEl) {
    await patientFirstEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const p5 = path.join(artifactDir, 'reposition-05-tablet.png');
    await page.screenshot({ path: p5 });
    fs.copyFileSync(p5, path.join(localDir, 'reposition-05-tablet.png'));
  }

  // Mobile screenshot & overflow check
  console.log('Capturing Mobile screenshot (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  if (patientFirstEl) {
    await patientFirstEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const p6 = path.join(artifactDir, 'reposition-06-mobile.png');
    await page.screenshot({ path: p6 });
    fs.copyFileSync(p6, path.join(localDir, 'reposition-06-mobile.png'));
  }

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow: ${overflow ? 'DETECTED' : 'NONE'}`);

  await browser.close();
  console.log('Visual verification complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
