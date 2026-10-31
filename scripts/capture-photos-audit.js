async page => {
  const BASE_URL = 'http://localhost:5173/';
  const OUT_DIR = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots';

  // Desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Homepage Hero with atmospheric medical photography
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT_DIR}/hero-photography-desktop.png`, fullPage: false });

  // 2. Scroll to Image-Led Clinical Service Cards
  const pathwaySection = await page.$('#pathway-title');
  if (pathwaySection) {
    await pathwaySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT_DIR}/service-cards-desktop.png`, fullPage: false });
  }

  // 3. Treatments with photographic dossier
  await page.goto(BASE_URL + '#treatments');
  await page.waitForTimeout(1500);
  const treatmentDossier = await page.$('#treatment');
  if (treatmentDossier) {
    await treatmentDossier.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT_DIR}/treatments-photography-desktop.png`, fullPage: false });
  }

  // 4. Learn Topic: Leg Circulation
  await page.goto(BASE_URL + '#learn/leg-circulation');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT_DIR}/learn-circulation-photography.png`, fullPage: false });

  // 5. Learn Topic: Circulation Habits
  await page.goto(BASE_URL + '#learn/circulation-habits');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT_DIR}/learn-habits-photography.png`, fullPage: false });

  // 6. Learn Topic: DVT Warning Signs
  await page.goto(BASE_URL + '#learn/dvt-warning-signs');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT_DIR}/learn-dvt-photography.png`, fullPage: false });

  // 7. Mobile Viewport: 390x844 (iPhone 14)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT_DIR}/hero-photography-mobile.png`, fullPage: false });

  return 'ALL_SCREENSHOTS_CAPTURED';
}
