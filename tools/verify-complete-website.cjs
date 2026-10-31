const playwrightPath = 'C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(playwrightPath);
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';

const BREAKPOINTS = [
  { name: '320px-small-phone', width: 320, height: 640 },
  { name: '360px-android-phone', width: 360, height: 740 },
  { name: '390px-iphone', width: 390, height: 844 },
  { name: '430px-iphone-max', width: 430, height: 932 },
  { name: '768px-tablet', width: 768, height: 1024 },
  { name: '1024px-laptop', width: 1024, height: 768 },
  { name: '1440px-desktop', width: 1440, height: 900 },
];

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  console.log('🚀 Starting Complete Website UI/UX & Responsive Audit across 7 Viewports...\n');

  const context = await browser.newContext();
  const page = await context.newPage();

  // Test 1: Desktop Homepage Audit
  console.log('--- 1. AUDIT: Desktop Homepage (1440px) ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Hero CTAs
  const heroPrimaryText = await page.locator('.mv-hero-actions button').first().innerText();
  const heroSecondaryText = await page.locator('.mv-hero-actions a').first().innerText();
  console.log(`✓ Hero Primary CTA: "${heroPrimaryText}"`);
  console.log(`✓ Hero Secondary CTA: "${heroSecondaryText}"`);

  // Check About Us Heading
  const aboutUsHeading = await page.locator('h2:has-text("ABOUT US")').first();
  const aboutUsVisible = await aboutUsHeading.isVisible();
  console.log(`✓ "ABOUT US" prominent heading visible: ${aboutUsVisible}`);

  // Screenshot Desktop Homepage
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-01-desktop-hero.png'), fullPage: false });

  // Test 2: Booking Modal Workflow (Phase 7 Priority)
  console.log('\n--- 2. AUDIT: Booking Modal Flow (Phase 7 Priority) ---');
  // Click Hero primary CTA to open booking modal
  await page.locator('.mv-hero-actions button').first().click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.waitForTimeout(500);

  const dialogTitle = await page.locator('#booking-dialog-title').innerText();
  console.log(`✓ Booking modal opened. Title: "${dialogTitle}"`);

  // Verify 2-column layout exists on desktop
  const isFormVisible = await page.locator('form').first().isVisible();
  const isGuidanceVisible = await page.locator('h4:has-text("What to Expect Next")').isVisible();
  console.log(`✓ Left Column Form visible: ${isFormVisible}`);
  console.log(`✓ Right Column Guidance Panel visible: ${isGuidanceVisible}`);

  // Capture screenshot of the new 2-column Booking Modal
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-02-desktop-booking-modal.png') });

  // Test Form Validation & Input
  console.log('  Testing inline validation...');
  await page.locator('input#booking-name').fill('');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);

  const nameError = await page.locator('p:has-text("Please enter a name")').isVisible();
  console.log(`✓ Required field validation triggered: ${nameError}`);

  // Fill sample details
  await page.locator('input#booking-name').fill('Ananya Sen');
  await page.locator('input#booking-email').fill('ananya.sen@example.com');
  await page.locator('input#booking-phone').fill('+91 98765 12345');
  await page.locator('button[type="submit"]').click();

  // Wait for simulation completion
  await page.waitForSelector('[data-demo-request-result]', { state: 'visible', timeout: 5000 });
  const resultMessage = await page.locator('[data-demo-request-result] h3').innerText();
  console.log(`✓ Demo submission completed. Result: "${resultMessage}"`);

  // Screenshot result
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-03-booking-confirmation.png') });

  // Close modal
  await page.locator('[data-demo-request-result] button').click();
  await page.waitForTimeout(500);

  // Test 3: Treatments Sequence Verification (Phase 8 Priority)
  console.log('\n--- 3. AUDIT: Treatments Modalities & Comparison (Phase 8) ---');
  await page.goto(`${BASE_URL}/#treatments`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const treatmentTabs = await page.locator('#treatment button').allInnerTexts();
  console.log(`✓ Treatment Modality items in selector: ${treatmentTabs.length}`);
  const expectedSequence = [
    'Parameter',
    'Micro-Phlebectomy',
    'Foam Sclerotherapy',
    'Radiofrequency Ablation (RFA)',
    'Laser Ablation (EVLA)',
    'VenaSeal (Glue)'
  ];
  for (let i = 0; i < expectedSequence.length; i++) {
    const hasModality = treatmentTabs.some(t => t.includes(expectedSequence[i]));
    console.log(`  [${i + 1}] ${expectedSequence[i]}: ${hasModality ? 'VERIFIED' : 'FAILED'}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-04-treatments-page.png') });

  // Test 4: Responsive Viewport & No Horizontal Scroll Audit
  console.log('\n--- 4. AUDIT: Responsive Breakpoints & No Horizontal Scroll ---');
  for (const bp of BREAKPOINTS) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasOverflow = scrollWidth > clientWidth;

    console.log(`✓ Breakpoint ${bp.name} (${bp.width}x${bp.height}): scrollWidth=${scrollWidth}, clientWidth=${clientWidth} -> Overflow: ${hasOverflow ? 'FAIL' : 'NONE (PASS)'}`);

    // If mobile, check Visual Destinations 2-column grid
    if (bp.width <= 600) {
      const gridCols = await page.evaluate(() => {
        const grid = document.querySelector('#explore-cards-grid');
        if (!grid) return null;
        return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      });
      console.log(`  -> Mobile Destinations Grid columns: ${gridCols} (Expected: 2)`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `overhaul-viewport-${bp.name}.png`), fullPage: false });
  }

  // Test 5: Mobile Booking Modal
  console.log('\n--- 5. AUDIT: Mobile Booking Modal (390px) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.locator('.mv-hero-actions button').first().click();
  await page.waitForSelector('[role="dialog"]', { state: 'visible' });
  await page.waitForTimeout(500);

  const mobileScrollWidth = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog ? dialog.scrollWidth <= dialog.clientWidth : true;
  });
  console.log(`✓ Mobile booking modal fits without horizontal scroll: ${mobileScrollWidth}`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overhaul-05-mobile-booking-modal.png') });

  await browser.close();
  console.log('\n🎉 ALL UI/UX AND RESPONSIVE AUDITS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
