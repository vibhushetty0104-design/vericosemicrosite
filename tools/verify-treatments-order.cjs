const path = require('path');
const fs = require('fs');

const playwrightPath = 'C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(playwrightPath);

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('=== STARTING TREATMENTS ORDER VERIFICATION ===\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });

  // TEST 1: Desktop Viewport (1440x900)
  console.log('--- TEST 1: Desktop Viewport (1440x900) ---');
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/#treatments', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Audit TreatmentComparison Tabs
  const comparisonTabs = await page.evaluate(() => {
    const section = document.getElementById('treatment-comparison');
    if (!section) return null;
    const tabContainer = section.querySelector('.flex.flex-wrap');
    const tabButtons = tabContainer ? Array.from(tabContainer.querySelectorAll('button')) : [];
    const activeTab = tabButtons.find(b => b.className.includes('bg-mv-forest'));
    const dossierTitle = section.querySelector('h2.font-serif.text-2xl, h2.font-serif.text-3xl');
    return {
      tabCount: tabButtons.length,
      tabLabels: tabButtons.map(b => b.textContent.trim()),
      activeTabLabel: activeTab ? activeTab.textContent.trim() : null,
      dossierTitle: dossierTitle ? dossierTitle.textContent.trim() : null
    };
  });
  console.log('TreatmentComparison Tabs Audit:', comparisonTabs);

  // 2. Audit Table Column Headers in Side-by-Side Matrix
  console.log('Switching to Side-by-Side Table view...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('#treatment-comparison button'));
    const tableBtn = buttons.find(b => b.textContent.includes('Side-by-Side Table'));
    if (tableBtn) tableBtn.click();
  });
  await page.waitForTimeout(300);

  const tableHeaders = await page.evaluate(() => {
    const section = document.getElementById('treatment-comparison');
    if (!section) return null;
    const ths = Array.from(section.querySelectorAll('thead th'));
    return ths.map(th => {
      const title = th.querySelector('.font-serif') || th;
      return title.textContent.trim();
    });
  });
  console.log('Side-by-Side Table Column Headers:', tableHeaders);

  const shot1 = path.join(SCREENSHOT_DIR, 'treatments-01-desktop-table.png');
  const compSection = await page.$('#treatment-comparison');
  if (compSection) {
    await compSection.screenshot({ path: shot1 });
    console.log('Saved screenshot:', shot1);
  }

  // Switch back to Dossier view and test clicking through modalities
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('#treatment-comparison button'));
    const dossierBtn = buttons.find(b => b.textContent.includes('Detailed Dossiers'));
    if (dossierBtn) dossierBtn.click();
  });
  await page.waitForTimeout(200);

  // Click on "Micro-Phlebectomy"
  await page.evaluate(() => {
    const tabContainer = document.querySelector('#treatment-comparison .flex.flex-wrap');
    const buttons = tabContainer ? Array.from(tabContainer.querySelectorAll('button')) : [];
    const btn = buttons.find(b => b.textContent.includes('Micro-Phlebectomy'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(200);

  const phlebTitle = await page.evaluate(() => {
    const h2 = document.querySelector('#treatment-comparison h2.font-serif.text-2xl, #treatment-comparison h2.font-serif.text-3xl');
    return h2 ? h2.textContent.trim() : null;
  });
  console.log('Clicked Micro-Phlebectomy, dossier title:', phlebTitle);

  // Click back to "Parameter"
  await page.evaluate(() => {
    const tabContainer = document.querySelector('#treatment-comparison .flex.flex-wrap');
    const buttons = tabContainer ? Array.from(tabContainer.querySelectorAll('button')) : [];
    const btn = buttons.find(b => b.textContent.trim() === 'Parameter');
    if (btn) btn.click();
  });
  await page.waitForTimeout(200);

  const shot2 = path.join(SCREENSHOT_DIR, 'treatments-02-desktop-parameter-dossier.png');
  if (compSection) {
    await compSection.screenshot({ path: shot2 });
    console.log('Saved screenshot:', shot2);
  }

  // 3. Audit TreatmentModalities section
  console.log('\n--- Auditing TreatmentModalities Section ---');
  await page.evaluate(() => {
    const el = document.getElementById('treatment');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(400);

  const modalitiesAudit = await page.evaluate(() => {
    const section = document.getElementById('treatment');
    if (!section) return null;
    const buttons = Array.from(section.querySelectorAll('.grid > div:first-child button'));
    const titles = buttons.map(b => {
      const span = b.querySelector('.font-serif');
      return span ? span.textContent.trim() : '';
    });
    const currentHeading = section.querySelector('h3.font-serif');
    return {
      optionCount: buttons.length,
      optionTitles: titles,
      activeHeading: currentHeading ? currentHeading.textContent.trim() : null
    };
  });
  console.log('TreatmentModalities Audit:', modalitiesAudit);

  const shot3 = path.join(SCREENSHOT_DIR, 'treatments-03-desktop-modalities.png');
  const modSection = await page.$('#treatment');
  if (modSection) {
    await modSection.screenshot({ path: shot3 });
    console.log('Saved screenshot:', shot3);
  }

  // TEST 2: Mobile Viewport (390x844)
  console.log('\n--- TEST 2: Mobile Viewport (390x844) ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:5173/#treatments', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(500);

  const mobileAudit = await pageMobile.evaluate(() => {
    const section = document.getElementById('treatment-comparison');
    if (!section) return null;
    const tabContainer = section.querySelector('.flex.flex-wrap');
    const tabButtons = tabContainer ? Array.from(tabContainer.querySelectorAll('button')) : [];
    const activeTab = tabButtons.find(b => b.className.includes('bg-mv-forest'));
    return {
      tabCount: tabButtons.length,
      tabLabels: tabButtons.map(b => b.textContent.trim()),
      activeTab: activeTab ? activeTab.textContent.trim() : null
    };
  });
  console.log('Mobile Treatment Tabs Audit:', mobileAudit);

  const shot4 = path.join(SCREENSHOT_DIR, 'treatments-04-mobile-dossier.png');
  const compSectionMobile = await pageMobile.$('#treatment-comparison');
  if (compSectionMobile) {
    await compSectionMobile.screenshot({ path: shot4 });
    console.log('Saved screenshot:', shot4);
  }

  // Mobile Modalities check
  await pageMobile.evaluate(() => {
    const el = document.getElementById('treatment');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await pageMobile.waitForTimeout(400);

  const shot5 = path.join(SCREENSHOT_DIR, 'treatments-05-mobile-modalities.png');
  const modSectionMobile = await pageMobile.$('#treatment');
  if (modSectionMobile) {
    await modSectionMobile.screenshot({ path: shot5 });
    console.log('Saved screenshot:', shot5);
  }

  await browser.close();
  console.log('\n=== ALL PLAYWRIGHT CHECKS COMPLETED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
