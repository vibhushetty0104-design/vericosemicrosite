async page => {
  const BASE_URL = 'http://localhost:5173/';
  const OUT_DIR = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots';

  // 1. Desktop Viewport (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT_DIR}/hero-living-vascular-desktop.png`, fullPage: false });

  // 2. Tablet Viewport (768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT_DIR}/hero-living-vascular-tablet.png`, fullPage: false });

  // 3. Mobile Viewport (390x844 - iPhone 14)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT_DIR}/hero-living-vascular-mobile.png`, fullPage: false });

  // 4. Reduced Motion Emulation (1440x900)
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT_DIR}/hero-reduced-motion-desktop.png`, fullPage: false });

  return 'HERO_SCREENSHOTS_DONE';
}
