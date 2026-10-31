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

  // 1. Desktop Test (1440x900)
  console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Verification checks in page
  const sectionChecks = await page.evaluate(() => {
    const s1 = document.getElementById('patient-first');
    const s2 = document.getElementById('core-business');
    const s3 = document.getElementById('sustainable-business');

    const s1Title = s1 ? s1.querySelector('h2')?.textContent.trim() : null;
    const s1Principles = s1 ? s1.querySelectorAll('ol li').length : 0;

    const s2Title = s2 ? s2.querySelector('h2')?.textContent.trim() : null;
    const s2Services = s2 ? s2.querySelectorAll('article').length : 0;
    const s2Responsibility = s2 ? s2.querySelector('blockquote')?.textContent.trim() : null;

    const s3Title = s3 ? s3.querySelector('h2')?.textContent.trim() : null;
    const s3Priorities = s3 ? s3.querySelectorAll('.grid > div').length : 0;
    const s3Quote = s3 ? s3.querySelector('blockquote')?.textContent.trim() : null;

    const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;

    return {
      hasPatientFirst: Boolean(s1),
      s1Title,
      s1PrinciplesCount: s1Principles,
      hasCoreBusiness: Boolean(s2),
      s2Title,
      s2ServicesCount: s2Services,
      hasResponsibilityStatement: Boolean(s2Responsibility && s2Responsibility.includes('Medical decisions')),
      hasSustainableBusiness: Boolean(s3),
      s3Title,
      s3PrioritiesCount: s3Priorities,
      hasConcludingQuote: Boolean(s3Quote && s3Quote.includes('sustainable growth in healthcare')),
      hasHorizontalOverflow
    };
  });

  console.log('Section Structural Checks:', sectionChecks);

  // Take element screenshot of Section 1: Patient First
  const s1Elem = await page.$('#patient-first');
  if (s1Elem) {
    const s1Path = path.join(SCREENSHOT_DIR, 'new-sections-patient-first-desktop.png');
    await s1Elem.screenshot({ path: s1Path });
    console.log('Saved Section 1 screenshot:', s1Path);
  }

  // Take element screenshot of Section 2: Core Business Focus
  const s2Elem = await page.$('#core-business');
  if (s2Elem) {
    const s2Path = path.join(SCREENSHOT_DIR, 'new-sections-core-business-desktop.png');
    await s2Elem.screenshot({ path: s2Path });
    console.log('Saved Section 2 screenshot:', s2Path);
  }

  // Take element screenshot of Section 3: Sustainable Business
  const s3Elem = await page.$('#sustainable-business');
  if (s3Elem) {
    const s3Path = path.join(SCREENSHOT_DIR, 'new-sections-sustainable-business-desktop.png');
    await s3Elem.screenshot({ path: s3Path });
    console.log('Saved Section 3 screenshot:', s3Path);
  }

  // Take full narrative flow capture
  const flowPath = path.join(SCREENSHOT_DIR, 'new-sections-homepage-flow-desktop.png');
  await page.screenshot({ path: flowPath, clip: { x: 0, y: 700, width: 1440, height: 2800 } });
  console.log('Saved homepage flow screenshot:', flowPath);

  // 2. Tablet Test (768x1024)
  console.log('\n--- 2. Testing Tablet Viewport (768x1024) ---');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Tablet horizontal overflow?', tabletOverflow);

  const tabletPath = path.join(SCREENSHOT_DIR, 'new-sections-tablet.png');
  await tabletPage.screenshot({ path: tabletPath, clip: { x: 0, y: 700, width: 768, height: 2600 } });
  console.log('Saved tablet screenshot:', tabletPath);

  // 3. Mobile Test (390x844)
  console.log('\n--- 3. Testing Mobile Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('Mobile horizontal overflow?', mobileOverflow);

  const mobilePath = path.join(SCREENSHOT_DIR, 'new-sections-mobile.png');
  await mobilePage.screenshot({ path: mobilePath, clip: { x: 0, y: 700, width: 390, height: 2600 } });
  console.log('Saved mobile screenshot:', mobilePath);

  // Copy screenshots to artifact directory
  const artifactDir = path.resolve('C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e/screenshots');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const filesToCopy = [
    'new-sections-patient-first-desktop.png',
    'new-sections-core-business-desktop.png',
    'new-sections-sustainable-business-desktop.png',
    'new-sections-homepage-flow-desktop.png',
    'new-sections-tablet.png',
    'new-sections-mobile.png'
  ];

  for (const f of filesToCopy) {
    const src = path.join(SCREENSHOT_DIR, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(artifactDir, f));
    }
  }
  console.log('Copied all new-sections screenshots to artifact directory.');

  await browser.close();
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});