const { chromium } = require('C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('Launching browser with Chrome executable...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const artifactDir = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots';
  const localDir = path.resolve('screenshots');
  [artifactDir, localDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/#learn/leg-circulation...');
  await page.goto('http://localhost:5173/#learn/leg-circulation', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const pumpSection = await page.$('#calf-muscle-pump');
  if (!pumpSection) {
    console.error('ERROR: #calf-muscle-pump section not found!');
    await browser.close();
    process.exit(1);
  }

  await pumpSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Helper to click mode button
  async function selectMode(modeName) {
    console.log(`Selecting mode: "${modeName}"...`);
    const buttons = await page.$$('#calf-muscle-pump button');
    for (const b of buttons) {
      const text = await b.textContent();
      if (text && text.includes(modeName)) {
        await b.click();
        await page.waitForTimeout(700);
        return;
      }
    }
  }

  // Helper to click sub-button
  async function clickSubButton(subText) {
    console.log(`Clicking sub-control: "${subText}"...`);
    const buttons = await page.$$('#calf-muscle-pump button');
    for (const b of buttons) {
      const text = await b.textContent();
      if (text && text.trim() === subText) {
        await b.click();
        await page.waitForTimeout(700);
        return;
      }
    }
  }

  async function takeShot(filename) {
    const p1 = path.join(artifactDir, filename);
    const p2 = path.join(localDir, filename);
    await pumpSection.screenshot({ path: p1 });
    fs.copyFileSync(p1, p2);
    console.log(`Captured screenshot: ${filename}`);
  }

  // 1. Valve Mode: Competent Closure
  console.log('\n--- State 1: Valve Competent Closure ---');
  await selectMode('Venous Valve');
  await clickSubButton('Competent Closure');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-01-valve-competent.png');

  // 2. Valve Mode: Forward Flow
  console.log('\n--- State 2: Valve Forward Flow ---');
  await clickSubButton('Forward Flow');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-02-valve-forward-flow.png');

  // 3. Valve Mode: Incompetent Reflux
  console.log('\n--- State 3: Valve Incompetent Reflux ---');
  await clickSubButton('Incompetent Valve');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-03-valve-incompetent-reflux.png');

  // 4. Calf-Muscle Pump Mode: Contraction (Stage 1)
  console.log('\n--- State 4: Calf-Muscle Pump Contraction (Stage 1) ---');
  await selectMode('Calf-Muscle Pump');
  // Pause autoplay if active so stage remains steady
  const pauseBtn = await page.$('#calf-muscle-pump button:has-text("Pause")');
  if (pauseBtn) await pauseBtn.click();
  await clickSubButton('1. Squeeze');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-04-pump-contraction.png');

  // 5. Calf-Muscle Pump Mode: Relaxation (Stage 3)
  console.log('\n--- State 5: Calf-Muscle Pump Relaxation (Stage 3) ---');
  await clickSubButton('3. Relax');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-05-pump-relaxation.png');

  // 6. Healthy vs Varicose Mode: Varicose State
  console.log('\n--- State 6: Healthy vs Varicose Veins (Varicose State) ---');
  await selectMode('Healthy vs Varicose');
  await clickSubButton('Varicose-Vein Anatomy');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-06-healthy-vs-varicose.png');

  // 7. Explore Anatomy Mode: Whole Limb
  console.log('\n--- State 7: Explore Anatomy Full View ---');
  await selectMode('Explore Anatomy');
  await page.waitForTimeout(500);
  await takeShot('3d-redesign-07-explore-anatomy.png');

  // 8. Mobile Experience (390x844)
  console.log('\n--- State 8: Mobile Experience (390x844) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await pumpSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow: ${overflow ? 'DETECTED' : 'NONE'}`);

  const pMobile1 = path.join(artifactDir, '3d-redesign-08-mobile.png');
  const pMobile2 = path.join(localDir, '3d-redesign-08-mobile.png');
  await pumpSection.screenshot({ path: pMobile1 });
  fs.copyFileSync(pMobile1, pMobile2);
  console.log(`Captured screenshot: 3d-redesign-08-mobile.png`);

  await browser.close();
  console.log('\nAll 8 verification states successfully captured!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
