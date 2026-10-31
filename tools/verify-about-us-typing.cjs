const path = require('path');
const fs = require('fs');

const playwrightPath = 'C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(playwrightPath);

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('=== STARTING ABOUT US TYPING ANIMATION VERIFICATION ===\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });

  // TEST 1: Normal Viewport Scroll & Typing Progression (Desktop 1440x900)
  console.log('--- TEST 1: Desktop Viewport Scroll & Typing Animation ---');
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Verify that at the top of the page, the About Us section is not yet scrolled into view
  const initialSectionState = await page.evaluate(() => {
    const el = document.getElementById('patient-first');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const typedTextEl = el.querySelector('#patient-first-title .whitespace-nowrap span');
    return {
      top: rect.top,
      isBelowFold: rect.top > window.innerHeight,
      textBeforeScroll: typedTextEl ? typedTextEl.textContent : ''
    };
  });
  console.log('Initial State (top of page):', initialSectionState);

  // Now scroll the section into view instantly to cleanly measure typing timing
  console.log('Scrolling #patient-first into view instantly...');
  await page.evaluate(() => {
    document.getElementById('patient-first').scrollIntoView({ behavior: 'instant' });
  });

  // Wait 120ms (start pause) + 270ms (3 chars in: 'ABO')
  await page.waitForTimeout(390);

  // Capture early-typing state
  const step1State = await page.evaluate(() => {
    const el = document.getElementById('patient-first');
    const typedSpan = el.querySelector('#patient-first-title .whitespace-nowrap span');
    const cursor = el.querySelector('.animate-cursor-blink');
    return {
      typedText: typedSpan ? typedSpan.textContent : '',
      cursorPresent: !!cursor
    };
  });
  console.log('Step 1 (early typing ~390ms):', step1State);

  const shot1 = path.join(SCREENSHOT_DIR, 'about-us-01-mid-typing.png');
  const sectionElMid = await page.$('#patient-first');
  if (sectionElMid) {
    await sectionElMid.screenshot({ path: shot1 });
    console.log('Saved mid-typing screenshot:', shot1);
  }

  // Wait another 450ms (typing finishes: 8 chars total)
  await page.waitForTimeout(450);

  const completedState = await page.evaluate(() => {
    const el = document.getElementById('patient-first');
    const titleEl = el.querySelector('#patient-first-title');
    const typedSpan = titleEl.querySelector('.whitespace-nowrap span');
    const srOnly = titleEl.querySelector('.sr-only');
    const subtitle = el.querySelector('h3');
    const cards = el.querySelectorAll('article');
    const computedHeading = window.getComputedStyle(titleEl);
    const cursor = el.querySelector('.animate-cursor-blink');

    return {
      typedText: typedSpan ? typedSpan.textContent : '',
      cursorBlinkingDuringFadeWindow: !!cursor,
      srOnlyText: srOnly ? srOnly.textContent : '',
      subtitleText: subtitle ? subtitle.textContent : '',
      cardCount: cards.length,
      fontSize: computedHeading.fontSize,
      fontWeight: computedHeading.fontWeight,
      color: computedHeading.color
    };
  });
  console.log('Completed typing state (~840ms):', completedState);

  // Wait another 650ms for cursor fade out
  await page.waitForTimeout(650);

  const cursorFadeState = await page.evaluate(() => {
    const el = document.getElementById('patient-first');
    const blinkingCursor = el.querySelector('.animate-cursor-blink');
    const cursorEl = el.querySelector('.whitespace-nowrap span + span');
    return {
      blinkingCursorActive: !!blinkingCursor,
      cursorRendered: !!cursorEl
    };
  });
  console.log('Post-fade cursor state:', cursorFadeState);

  const shot2 = path.join(SCREENSHOT_DIR, 'about-us-02-desktop-completed.png');
  const sectionEl = await page.$('#patient-first');
  if (sectionEl) {
    await sectionEl.screenshot({ path: shot2 });
    console.log('Saved section screenshot:', shot2);
  }

  // TEST 2: Reduced Motion Accessibility Check
  console.log('\n--- TEST 2: prefers-reduced-motion check ---');
  const contextRM = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const pageRM = await contextRM.newPage();
  await pageRM.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Check state under reduced motion immediately without waiting for typing
  const reducedMotionState = await pageRM.evaluate(() => {
    const el = document.getElementById('patient-first');
    const typedSpan = el.querySelector('#patient-first-title .whitespace-nowrap span');
    const cursor = el.querySelector('.animate-cursor-blink');
    return {
      typedText: typedSpan ? typedSpan.textContent : '',
      cursorPresent: !!cursor
    };
  });
  console.log('Reduced Motion State (immediate render):', reducedMotionState);

  const shot3 = path.join(SCREENSHOT_DIR, 'about-us-03-reduced-motion.png');
  const sectionElRM = await pageRM.$('#patient-first');
  if (sectionElRM) {
    await sectionElRM.screenshot({ path: shot3 });
    console.log('Saved reduced motion screenshot:', shot3);
  }

  // TEST 3: Mobile Viewport (390x844) & Horizontal Overflow Check
  console.log('\n--- TEST 3: Mobile Responsiveness & Overflow Check ---');
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  await pageMobile.evaluate(() => {
    document.getElementById('patient-first').scrollIntoView({ behavior: 'instant' });
  });
  await pageMobile.waitForTimeout(1200);

  const mobileCheck = await pageMobile.evaluate(() => {
    const el = document.getElementById('patient-first');
    const titleEl = el.querySelector('#patient-first-title');
    const typedSpan = titleEl.querySelector('.whitespace-nowrap span');
    const computedHeading = window.getComputedStyle(titleEl);

    return {
      typedText: typedSpan ? typedSpan.textContent : '',
      fontSize: computedHeading.fontSize,
      sectionScrollWidth: el.scrollWidth,
      sectionClientWidth: el.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
      hasOverflow: el.scrollWidth > el.clientWidth || document.body.scrollWidth > window.innerWidth
    };
  });
  console.log('Mobile Check (390x844):', mobileCheck);

  const shot4 = path.join(SCREENSHOT_DIR, 'about-us-04-mobile-view.png');
  const sectionElMobile = await pageMobile.$('#patient-first');
  if (sectionElMobile) {
    await sectionElMobile.screenshot({ path: shot4 });
    console.log('Saved mobile screenshot:', shot4);
  }

  await browser.close();
  console.log('\n=== ALL PLAYWRIGHT CHECKS COMPLETED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
