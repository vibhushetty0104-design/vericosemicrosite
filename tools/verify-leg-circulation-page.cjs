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

  // 1. Desktop 1440x900
  console.log('\n--- 1. Desktop 1440x900 Verification ---');
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/#learn/leg-circulation...');
  await page.goto('http://localhost:5173/#learn/leg-circulation', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Check the 5 section elements
  const sections = await page.evaluate(() => {
    const s1 = document.getElementById('explore-circulation');
    const s2 = document.getElementById('valve-simulation');
    const s3 = document.getElementById('venous-networks');
    const s4 = document.getElementById('clinical-assessment');
    const s5 = document.getElementById('next-steps');
    return {
      s1: !!s1 && s1.querySelector('h2')?.textContent?.trim(),
      s2: !!s2 && s2.querySelector('h2')?.textContent?.trim(),
      s3: !!s3 && s3.querySelector('h2')?.textContent?.trim(),
      s4: !!s4 && s4.querySelector('h2')?.textContent?.trim(),
      s5: !!s5 && s5.querySelector('h2')?.textContent?.trim(),
    };
  });

  console.log('Section Structure Audit:');
  console.log(`- Section 1 (Explore Circulation): ${sections.s1}`);
  console.log(`- Section 2 (Valve Simulation): ${sections.s2}`);
  console.log(`- Section 3 (Venous Networks): ${sections.s3}`);
  console.log(`- Section 4 (Clinical Assessment): ${sections.s4}`);
  console.log(`- Section 5 (Next Steps): ${sections.s5}`);

  async function snap(elementSelector, filename) {
    const el = await page.$(elementSelector);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const p1 = path.join(artifactDir, filename);
      const p2 = path.join(localDir, filename);
      await el.screenshot({ path: p1 });
      fs.copyFileSync(p1, p2);
      console.log(`Captured: ${filename}`);
    }
  }

  await snap('#explore-circulation', 'page-redesign-01-explore-circulation.png');
  await snap('#valve-simulation', 'page-redesign-02-valve-simulation.png');
  await snap('#venous-networks', 'page-redesign-03-venous-networks.png');
  await snap('#clinical-assessment', 'page-redesign-04-clinical-assessment.png');
  await snap('#next-steps', 'page-redesign-05-next-steps.png');

  // 2. Tablet 768x1024
  console.log('\n--- 2. Tablet 768x1024 Verification ---');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(600);
  await snap('#explore-circulation', 'page-redesign-06-tablet-s1.png');
  await snap('#venous-networks', 'page-redesign-07-tablet-s3.png');

  // 3. Mobile 390x844
  console.log('\n--- 3. Mobile 390x844 Verification ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await snap('#explore-circulation', 'page-redesign-08-mobile-s1.png');
  await snap('#valve-simulation', 'page-redesign-09-mobile-s2.png');
  await snap('#venous-networks', 'page-redesign-10-mobile-s3.png');

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile horizontal overflow: ${overflow ? 'DETECTED' : 'NONE'}`);

  await browser.close();
  console.log('\nComplete page verification audit successful!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
