async page => {
  const BASE_URL = 'http://localhost:5173/#learn/leg-circulation';
  const OUT_DIR = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots';

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  // 1. Desktop Viewport (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);

  // Scroll to #calf-muscle-pump
  const pumpSection = await page.$('#calf-muscle-pump');
  if (pumpSection) {
    await pumpSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }

  // Verify all 5 stage buttons exist
  const stageButtons = await page.$$('[role="tablist"] button[role="tab"]');
  console.log('STAGE_BUTTONS_COUNT:', stageButtons.length);

  // Test Stage 1: Contraction
  if (stageButtons[0]) {
    await stageButtons[0].click();
    await page.waitForTimeout(800);
    await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-stage-1.png` });
  }

  // Test Stage 2: Upward Flow
  if (stageButtons[1]) {
    await stageButtons[1].click();
    await page.waitForTimeout(800);
    await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-stage-2.png` });
  }

  // Test Stage 3: Relaxation
  if (stageButtons[2]) {
    await stageButtons[2].click();
    await page.waitForTimeout(800);
    await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-stage-3.png` });
  }

  // Test Stage 4: Competent Seal
  if (stageButtons[3]) {
    await stageButtons[3].click();
    await page.waitForTimeout(800);
    await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-stage-4.png` });
  }

  // Test Stage 5: Incompetent Gap & Reflux
  if (stageButtons[4]) {
    await stageButtons[4].click();
    await page.waitForTimeout(800);
    await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-stage-5.png` });
  }

  // Test Interactive 3D Pointer Drag on Canvas
  const canvas3D = await page.$('#calf-muscle-pump canvas');
  if (canvas3D) {
    const box = await canvas3D.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 - 20, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-3d-dragged.png` });
    }
  }

  // Test Resting Anatomy Overlay
  const baselineBtn = await page.$('button[title*="resting anatomy"]');
  if (baselineBtn) {
    await baselineBtn.click();
    await page.waitForTimeout(500);
    await pumpSection.screenshot({ path: `${OUT_DIR}/calf-pump-resting-overlay.png` });
    // Click again to turn off
    await baselineBtn.click();
    await page.waitForTimeout(300);
  }

  // 2. Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  await pumpSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT_DIR}/calf-pump-mobile.png`, fullPage: false });

  // 3. Tablet Viewport (768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(800);
  await pumpSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT_DIR}/calf-pump-tablet.png`, fullPage: false });

  console.log('CONSOLE_ERRORS:', JSON.stringify(consoleLogs.filter(l => l.type === 'error')));
  console.log('ALL_CALF_PUMP_TESTS_COMPLETE');
}
