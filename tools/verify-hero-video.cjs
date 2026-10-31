const { chromium } = require('C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verify() {
  console.log('Launching browser with Chrome executable...');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  // 1. Desktop Test
  console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Wait 1.5 seconds for video playback to advance
  await page.waitForTimeout(1500);

  const videoChecks = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-title"]');
    const video = hero ? hero.querySelector('video') : null;
    const title = document.getElementById('hero-title');
    const tagline = hero ? hero.querySelector('.mv-hero-tagline') : null;
    const primaryCta = hero ? hero.querySelector('button') : null;

    if (!video) return { error: 'No video element found in hero' };

    return {
      hasVideo: true,
      src: video.querySelector('source')?.getAttribute('src') || video.src,
      poster: video.getAttribute('poster'),
      autoplay: video.hasAttribute('autoplay'),
      muted: video.muted,
      loop: video.loop,
      playsInline: video.hasAttribute('playsinline'),
      preload: video.getAttribute('preload'),
      controls: video.controls,
      isPaused: video.paused,
      currentTime: video.currentTime,
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      hasTitle: Boolean(title && title.textContent.trim().length > 0),
      hasTagline: Boolean(tagline && tagline.textContent.includes('Better clarity')),
      hasCta: Boolean(primaryCta)
    };
  });

  console.log('Desktop Video Checks:', videoChecks);

  const desktopScreenshot = path.join(SCREENSHOT_DIR, 'hero-video-desktop.png');
  await page.screenshot({ path: desktopScreenshot, clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved desktop screenshot to:', desktopScreenshot);

  // 2. Tablet Test
  console.log('\n--- 2. Testing Tablet Viewport (768x1024) ---');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await tabletPage.waitForTimeout(1000);

  const tabletScreenshot = path.join(SCREENSHOT_DIR, 'hero-video-tablet.png');
  await tabletPage.screenshot({ path: tabletScreenshot, clip: { x: 0, y: 0, width: 768, height: 800 } });
  console.log('Saved tablet screenshot to:', tabletScreenshot);

  // 3. Mobile Test
  console.log('\n--- 3. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const mobileScreenshot = path.join(SCREENSHOT_DIR, 'hero-video-mobile.png');
  await mobilePage.screenshot({ path: mobileScreenshot, clip: { x: 0, y: 0, width: 390, height: 850 } });
  console.log('Saved mobile screenshot to:', mobileScreenshot);

  // 4. Reduced Motion Test
  console.log('\n--- 4. Testing Reduced Motion (prefers-reduced-motion: reduce) ---');
  const reducedMotionContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const rmPage = await reducedMotionContext.newPage();
  await rmPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await rmPage.waitForTimeout(1000);

  const rmChecks = await rmPage.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-title"]');
    const video = hero ? hero.querySelector('video') : null;
    const img = hero ? hero.querySelector('img[src*="meridian-hero-poster.jpg"]') : null;
    return {
      hasVideo: Boolean(video),
      hasPosterImg: Boolean(img),
      posterSrc: img ? img.getAttribute('src') : null
    };
  });

  console.log('Reduced Motion Checks:', rmChecks);

  const rmScreenshot = path.join(SCREENSHOT_DIR, 'hero-video-reduced-motion.png');
  await rmPage.screenshot({ path: rmScreenshot, clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved reduced motion screenshot to:', rmScreenshot);

  // Copy screenshots to artifact directory
  const artifactDir = path.resolve('C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }
  fs.copyFileSync(desktopScreenshot, path.join(artifactDir, 'hero-video-desktop.png'));
  fs.copyFileSync(tabletScreenshot, path.join(artifactDir, 'hero-video-tablet.png'));
  fs.copyFileSync(mobileScreenshot, path.join(artifactDir, 'hero-video-mobile.png'));
  fs.copyFileSync(rmScreenshot, path.join(artifactDir, 'hero-video-reduced-motion.png'));
  console.log('Copied all screenshots to artifact directory.');

  await browser.close();
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});