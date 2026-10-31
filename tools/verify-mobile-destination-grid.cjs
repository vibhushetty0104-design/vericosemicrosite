const path = require('path');
const fs = require('fs');

const playwrightPath = 'C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(playwrightPath);

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('=== STARTING MOBILE DESTINATION GRID VERIFICATION ===\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });

  const viewports = [
    { width: 320, height: 640, label: '320px-small-phone' },
    { width: 360, height: 740, label: '360px-phone' },
    { width: 390, height: 844, label: '390px-phone' },
    { width: 430, height: 932, label: '430px-phone-max' },
    { width: 768, height: 1024, label: '768px-tablet' },
    { width: 1440, height: 900, label: '1440px-desktop' }
  ];

  for (const vp of viewports) {
    console.log(`--- Testing Viewport: ${vp.width}x${vp.height} (${vp.label}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.width <= 768
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Scroll to explore-leg-health section
    await page.evaluate(() => {
      const el = document.getElementById('explore-leg-health');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(400);

    const audit = await page.evaluate((width) => {
      const section = document.getElementById('explore-leg-health');
      if (!section) return { error: 'Section not found' };

      const cardsContainer = section.querySelector('.grid');
      const cards = Array.from(section.querySelectorAll('[id^="explore-card-"]'));

      // Check grid columns
      const containerStyle = window.getComputedStyle(cardsContainer);
      const gridColumns = containerStyle.gridTemplateColumns.split(' ').filter(Boolean).length;

      // Card measurements
      const firstCard = cards[0];
      const secondCard = cards[1];
      const cardRect1 = firstCard ? firstCard.getBoundingClientRect() : null;
      const cardRect2 = secondCard ? secondCard.getBoundingClientRect() : null;

      // Illustration size
      const firstImg = firstCard ? firstCard.querySelector('img') : null;
      const imgRect = firstImg ? firstImg.getBoundingClientRect() : null;

      // Primary Action (Explore link)
      const exploreLinks = firstCard ? firstCard.querySelectorAll('a') : [];
      let exploreTouchHeight = 0;
      let exploreText = '';
      for (const a of exploreLinks) {
        if (a.textContent.includes('Explore') || a.textContent.includes('view') || a.textContent.includes('Review')) {
          exploreTouchHeight = Math.max(exploreTouchHeight, a.getBoundingClientRect().height);
          if (a.textContent.trim().startsWith('Explore')) exploreText = a.textContent.trim();
        }
      }

      // Check horizontal overflow
      const bodyScrollWidth = document.body.scrollWidth;
      const sectionScrollWidth = section.scrollWidth;
      const sectionClientWidth = section.clientWidth;
      const hasOverflow = bodyScrollWidth > window.innerWidth || sectionScrollWidth > sectionClientWidth;

      return {
        cardCount: cards.length,
        gridColumns,
        firstCardWidth: cardRect1 ? Math.round(cardRect1.width) : 0,
        secondCardWidth: cardRect2 ? Math.round(cardRect2.width) : 0,
        illustrationHeight: imgRect ? Math.round(imgRect.height) : 0,
        illustrationWidth: imgRect ? Math.round(imgRect.width) : 0,
        exploreTouchHeight: Math.round(exploreTouchHeight),
        exploreText,
        bodyScrollWidth,
        viewportWidth: window.innerWidth,
        hasOverflow
      };
    }, vp.width);

    console.log(`Result for ${vp.label}:`, audit);

    // Save screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `destinations-grid-${vp.label}.png`);
    const sectionEl = await page.$('#explore-leg-health');
    if (sectionEl) {
      await sectionEl.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    }

    // On 390px phone, test filter tabs and clinical note toggle
    if (vp.width === 390) {
      console.log('Testing filter tab interaction on 390px phone...');
      // Click on "Tests & Treatments" tab
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('#explore-leg-health button'));
        const txButton = buttons.find(b => b.textContent.includes('Tests & Treatments'));
        if (txButton) txButton.click();
      });
      await page.waitForTimeout(300);

      const filterAudit = await page.evaluate(() => {
        const section = document.getElementById('explore-leg-health');
        const cards = Array.from(section.querySelectorAll('[id^="explore-card-"]'));
        const containerStyle = window.getComputedStyle(section.querySelector('.grid'));
        const gridColumns = containerStyle.gridTemplateColumns.split(' ').filter(Boolean).length;
        return {
          filteredCardCount: cards.length,
          gridColumns
        };
      });
      console.log('Filtered 390px audit (Tests & Treatments):', filterAudit);

      // Open a clinical note drawer
      console.log('Testing clinical note toggle on first card...');
      await page.evaluate(() => {
        const firstCard = document.querySelector('[id^="explore-card-"]');
        if (firstCard) {
          const noteBtn = firstCard.querySelector('button[aria-controls^="info-drawer-"]');
          if (noteBtn) noteBtn.click();
        }
      });
      await page.waitForTimeout(300);

      const noteOpenShot = path.join(SCREENSHOT_DIR, 'destinations-grid-390px-note-open.png');
      const sectionEl2 = await page.$('#explore-leg-health');
      if (sectionEl2) {
        await sectionEl2.screenshot({ path: noteOpenShot });
        console.log(`Saved note open screenshot: ${noteOpenShot}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('\n=== ALL PLAYWRIGHT AUDITS COMPLETED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
