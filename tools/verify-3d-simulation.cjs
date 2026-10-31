const { chromium } = require('C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verify() {
  console.log('Launching Chrome browser for 3D Simulation verification...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  // 1. Desktop Test (1440x900)
  console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await desktopContext.newPage();
  
  console.log('Navigating to http://localhost:5173/#learn/leg-circulation...');
  await page.goto('http://localhost:5173/#learn/leg-circulation', { waitUntil: 'networkidle' });

  // Wait for 3D simulation section
  await page.waitForSelector('#calf-muscle-pump', { timeout: 10000 });
  await page.waitForSelector('#calf-muscle-pump canvas', { timeout: 10000 });
  await page.waitForTimeout(1500); // Allow Three.js canvas to render initial frame

  const canvasState = await page.evaluate(() => {
    const section = document.getElementById('calf-muscle-pump');
    const canvas = section ? section.querySelector('canvas') : null;
    return {
      hasSection: Boolean(section),
      hasCanvas: Boolean(canvas),
      canvasWidth: canvas ? canvas.clientWidth : 0,
      canvasHeight: canvas ? canvas.clientHeight : 0,
      title: section ? section.querySelector('h2')?.textContent.trim() : null,
    };
  });
  console.log('3D Canvas State:', canvasState);

  const sectionElem = await page.$('#calf-muscle-pump');

  // Capture Mode 3 (Venous Valve - Default on load)
  console.log('Capturing Mode 3 (3D Venous Valve - Competent Seal)...');
  const valveCompetentPath = path.join(SCREENSHOT_DIR, 'simulation-valve-competent.png');
  if (sectionElem) await sectionElem.screenshot({ path: valveCompetentPath });

  // Switch to Incompetent Valve
  console.log('Switching to Incompetent Valve (Reflux Gap)...');
  await page.click('button:has-text("Incompetent (Reflux Gap)")');
  await page.waitForTimeout(800);
  const valveIncompetentPath = path.join(SCREENSHOT_DIR, 'simulation-valve-incompetent.png');
  if (sectionElem) await sectionElem.screenshot({ path: valveIncompetentPath });

  // Switch to Mode 4: Calf-Muscle Pump
  console.log('Switching to Mode 4: Calf-Muscle Pump...');
  await page.click('button:has-text("Calf-Muscle Pump")');
  await page.waitForTimeout(800);

  // Stage 1: Contraction
  await page.click('button:has-text("Contraction")');
  await page.waitForTimeout(600);
  const pump1Path = path.join(SCREENSHOT_DIR, 'simulation-pump-contraction.png');
  if (sectionElem) await sectionElem.screenshot({ path: pump1Path });

  // Stage 2: Upward Flow
  await page.click('button:has-text("Upward Flow")');
  await page.waitForTimeout(600);
  const pump2Path = path.join(SCREENSHOT_DIR, 'simulation-pump-upward-flow.png');
  if (sectionElem) await sectionElem.screenshot({ path: pump2Path });

  // Stage 4: Competent Seal
  await page.click('button:has-text("Competent Seal")');
  await page.waitForTimeout(600);
  const pump4Path = path.join(SCREENSHOT_DIR, 'simulation-pump-competent-seal.png');
  if (sectionElem) await sectionElem.screenshot({ path: pump4Path });

  // Stage 5: Incompetent Gap
  await page.click('button:has-text("Incompetent Gap")');
  await page.waitForTimeout(600);
  const pump5Path = path.join(SCREENSHOT_DIR, 'simulation-pump-incompetent-gap.png');
  if (sectionElem) await sectionElem.screenshot({ path: pump5Path });

  // Switch to Mode 2: Healthy vs Varicose
  console.log('Switching to Mode 2: Healthy vs Varicose Veins...');
  await page.click('button:has-text("Healthy vs Varicose")');
  await page.waitForTimeout(800);

  const varicoseHealthyPath = path.join(SCREENSHOT_DIR, 'simulation-varicose-healthy.png');
  if (sectionElem) await sectionElem.screenshot({ path: varicoseHealthyPath });

  await page.click('button:has-text("Varicose Vein")');
  await page.waitForTimeout(800);
  const varicosePathologyPath = path.join(SCREENSHOT_DIR, 'simulation-varicose-pathology.png');
  if (sectionElem) await sectionElem.screenshot({ path: varicosePathologyPath });

  // Switch to Mode 1: Explore Anatomy
  console.log('Switching to Mode 1: Explore Lower-Limb Anatomy...');
  await page.click('button:has-text("Explore Anatomy")');
  await page.waitForTimeout(800);

  // Click on Gastrocnemius quick select
  await page.click('button:has-text("Gastrocnemius")');
  await page.waitForTimeout(600);
  const anatomyPath = path.join(SCREENSHOT_DIR, 'simulation-anatomy-explore.png');
  if (sectionElem) await sectionElem.screenshot({ path: anatomyPath });

  // Full Desktop View
  const desktopFull = path.join(SCREENSHOT_DIR, 'simulation-desktop-full.png');
  await page.screenshot({ path: desktopFull, clip: { x: 0, y: 150, width: 1440, height: 1100 } });

  // 2. Tablet Test (768x1024)
  console.log('\n--- 2. Testing Tablet Viewport (768x1024) ---');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('http://localhost:5173/#learn/leg-circulation', { waitUntil: 'networkidle' });
  await tabletPage.waitForSelector('#calf-muscle-pump canvas', { timeout: 10000 });
  await tabletPage.waitForTimeout(1000);

  const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow?', tabletOverflow);

  const tabletPath = path.join(SCREENSHOT_DIR, 'simulation-tablet.png');
  const tabletElem = await tabletPage.$('#calf-muscle-pump');
  if (tabletElem) await tabletElem.screenshot({ path: tabletPath });

  // 3. Mobile Test (390x844)
  console.log('\n--- 3. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/#learn/leg-circulation', { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('#calf-muscle-pump canvas', { timeout: 10000 });
  await mobilePage.waitForTimeout(1000);

  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile horizontal overflow?', mobileOverflow);

  const mobilePath = path.join(SCREENSHOT_DIR, 'simulation-mobile.png');
  const mobileElem = await mobilePage.$('#calf-muscle-pump');
  if (mobileElem) await mobileElem.screenshot({ path: mobilePath });

  // Copy screenshots to artifact directory
  const artifactDir = path.resolve('C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const screenshots = [
    'simulation-valve-competent.png',
    'simulation-valve-incompetent.png',
    'simulation-pump-contraction.png',
    'simulation-pump-upward-flow.png',
    'simulation-pump-competent-seal.png',
    'simulation-pump-incompetent-gap.png',
    'simulation-varicose-healthy.png',
    'simulation-varicose-pathology.png',
    'simulation-anatomy-explore.png',
    'simulation-desktop-full.png',
    'simulation-tablet.png',
    'simulation-mobile.png',
  ];

  for (const s of screenshots) {
    const src = path.join(SCREENSHOT_DIR, s);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(artifactDir, s));
    }
  }
  console.log('Copied all 3D simulation screenshots to artifact directory.');

  await browser.close();
  console.log('All 3D Simulation verification tests completed successfully!');
}

verify().catch((err) => {
  console.error('3D verification failed:', err);
  process.exit(1);
});