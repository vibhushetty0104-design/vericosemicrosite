const playwrightPath = 'C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(playwrightPath);
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e';
const BASE_URL = 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- 1. AUDIT: Desktop 1440x900 ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Verify Emergency Warning banner is absent
  const emergencyBanner = await page.$('text="Sudden swelling, pain or warmth in one leg"');
  console.log(`✓ Pink Emergency Banner absent on homepage: ${emergencyBanner === null ? 'PASS' : 'FAIL'}`);

  // 2. Verify Old launcher pill is absent
  const oldLauncherPill = await page.$('button[aria-label="Ask Meridbot pre-written educational questions"]');
  console.log(`✓ Old launcher button/pill absent: ${oldLauncherPill === null ? 'PASS' : 'FAIL'}`);

  // 3. Verify Standalone floating Meridbot character exists
  const floatingMascot = await page.$('.mv-floating-character');
  const isMascotVisible = floatingMascot ? await floatingMascot.isVisible() : false;
  console.log(`✓ Standalone floating mascot visible on desktop: ${isMascotVisible ? 'PASS' : 'FAIL'}`);

  // Screenshot Desktop 1440x900
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-validation-1440x900-desktop.png'), fullPage: false });
  console.log('✓ Captured meridbot-validation-1440x900-desktop.png');

  // Test 2: Desktop 1920x1080
  console.log('\n--- 2. AUDIT: Desktop 1920x1080 ---');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-validation-1920x1080-desktop.png'), fullPage: false });
  console.log('✓ Captured meridbot-validation-1920x1080-desktop.png');

  // Test 3: Mobile 390x844 (iPhone)
  console.log('\n--- 3. AUDIT: Mobile 390x844 (iPhone) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobileMascot = await page.$('aside[aria-hidden="true"]');
  const isMobileMascotHidden = mobileMascot ? !(await mobileMascot.isVisible()) : true;
  console.log(`✓ Floating mascot safely hidden on mobile phone to avoid touch obstruction: ${isMobileMascotHidden ? 'PASS' : 'FAIL'}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-validation-390x844-iphone.png'), fullPage: false });
  console.log('✓ Captured meridbot-validation-390x844-iphone.png');

  // Test 4: Mobile 430x932 (iPhone Max)
  console.log('\n--- 4. AUDIT: Mobile 430x932 (iPhone Max) ---');
  await page.setViewportSize({ width: 430, height: 932 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-validation-430x932-iphone-max.png'), fullPage: false });
  console.log('✓ Captured meridbot-validation-430x932-iphone-max.png');

  // Test 5: Verify Emergency Info is preserved in DVT Guide
  console.log('\n--- 5. AUDIT: Emergency Info Preserved in Dedicated Guide ---');
  await page.goto(`${BASE_URL}/#learn/dvt-warning-signs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const dvtCall112 = await page.$(':has-text("112")');
  const dvtCall108 = await page.$(':has-text("108")');
  console.log(`✓ Emergency 112 guidance preserved in DVT guide: ${dvtCall112 !== null ? 'PASS' : 'FAIL'}`);
  console.log(`✓ Emergency 108 guidance preserved in DVT guide: ${dvtCall108 !== null ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('\n🎉 ALL VALIDATION CHECKS COMPLETE!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
