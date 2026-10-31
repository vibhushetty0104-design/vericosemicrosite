async page => {
  const BASE_URL = 'http://localhost:5173/';
  const OUT_DIR = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots';

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  // 1. Desktop Viewport (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(2500);

  // Inspect the video element
  const videoState = await page.evaluate(() => {
    const v = document.querySelector('section video');
    if (!v) return { found: false };
    return {
      found: true,
      src: v.currentSrc || v.querySelector('source')?.getAttribute('src'),
      muted: v.muted,
      autoplay: v.autoplay,
      loop: v.loop,
      playsInline: v.playsInline,
      hasControls: v.controls,
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      readyState: v.readyState
    };
  });

  console.log('HERO_VIDEO_STATE:', JSON.stringify(videoState));

  // Screenshot Desktop
  await page.screenshot({ path: `${OUT_DIR}/hero-video-desktop.png`, fullPage: false });

  // 2. Tablet Viewport (768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT_DIR}/hero-video-tablet.png`, fullPage: false });

  // 3. Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT_DIR}/hero-video-mobile.png`, fullPage: false });

  // 4. Reduced Motion Emulation (1440x900)
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL + '#home');
  await page.waitForTimeout(1500);

  const reducedMotionState = await page.evaluate(() => {
    const v = document.querySelector('section video');
    const img = document.querySelector('section img[src*="vein-flowing-poster"]');
    return {
      hasVideo: !!v,
      hasPosterImg: !!img,
      posterSrc: img?.getAttribute('src')
    };
  });
  console.log('REDUCED_MOTION_STATE:', JSON.stringify(reducedMotionState));

  await page.screenshot({ path: `${OUT_DIR}/hero-video-reduced-motion.png`, fullPage: false });

  return { videoState, reducedMotionState, consoleErrors: consoleLogs.filter(l => l.type === 'error') };
}
