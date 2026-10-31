const { chromium } = require('C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to inspect-video.html...');
  await page.goto('http://localhost:5173/inspect-video.html');

  // Wait for metadata
  await page.waitForFunction(() => window.__videoData !== undefined, { timeout: 10000 });

  const metadata = await page.evaluate(() => window.__videoData);
  console.log('=== VIDEO METADATA ===');
  console.log('Width:', metadata.videoWidth);
  console.log('Height:', metadata.videoHeight);
  console.log('Duration:', metadata.durationFormatted, `(${metadata.duration} seconds)`);
  console.log('Aspect Ratio:', metadata.aspectRatio);
  console.log('Has Audio:', metadata.hasAudio);
  console.log('======================');

  // Extract poster frame at 1.0s
  console.log('Extracting poster frame at 1.0s...');
  const dataUrl1 = await page.evaluate(() => window.extractPoster(1.0));
  const base64Data1 = dataUrl1.replace(/^data:image\/jpeg;base64,/, '');

  const posterPathAssets = path.resolve('public/assets/meridian-hero-poster.jpg');
  fs.writeFileSync(posterPathAssets, Buffer.from(base64Data1, 'base64'));
  console.log('Saved poster to:', posterPathAssets);

  // Also write to dist/assets for immediate testing
  const distPoster = path.resolve('dist/assets/meridian-hero-poster.jpg');
  fs.writeFileSync(distPoster, Buffer.from(base64Data1, 'base64'));

  // Also extract a frame at 0.5s and 2.5s to inspect
  const dataUrl2 = await page.evaluate(() => window.extractPoster(2.5));
  const base64Data2 = dataUrl2.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(path.resolve('public/assets/meridian-hero-poster-2.jpg'), Buffer.from(base64Data2, 'base64'));

  await browser.close();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});