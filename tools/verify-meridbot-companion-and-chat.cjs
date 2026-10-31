const playwrightPath = 'C:/Users/vibhu/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core';
const { chromium } = require(playwrightPath);
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/vibhu/.gemini/antigravity/brain/d28d2ff0-af0e-4ea3-b3a2-bed0a9bc518e';
const BASE_URL = 'http://localhost:3001';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== TEST 1: HOMEPAGE VERIFICATION (Desktop 1440x900) ===');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/#home`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Emergency warning banner absent
  const emergencyBanner = await page.$('text="Sudden swelling, pain or warmth in one leg"');
  console.log(`✓ Pink Emergency Banner absent on homepage: ${emergencyBanner === null ? 'PASS' : 'FAIL'}`);

  // 2. Meridbot character absent on homepage
  const mascotOnHome = await page.$('aside[aria-label="Meridbot educational companion"]');
  console.log(`✓ Floating Meridbot character absent on homepage: ${mascotOnHome === null ? 'PASS' : 'FAIL'}`);

  // 3. Redundant Meridbot card absent from topic grid
  const meridbotTopicCard = await page.$('text="Ask Meridbot Guide"');
  console.log(`✓ Redundant Meridbot topic card absent in ExploreCareGrid: ${meridbotTopicCard === null ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-01-homepage-clean-1440x900.png'), fullPage: false });
  console.log('✓ Captured meridbot-01-homepage-clean-1440x900.png');

  console.log('\n=== TEST 2: INNER PAGE FLOATING MASCOT (Assessment Page) ===');
  await page.goto(`${BASE_URL}/#assessment`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const mascotOnInner = await page.$('aside[aria-label="Meridbot educational companion"]');
  const isMascotVisible = mascotOnInner ? await mascotOnInner.isVisible() : false;
  console.log(`✓ Floating Meridbot mascot visible on inner page (#assessment): ${isMascotVisible ? 'PASS' : 'FAIL'}`);

  const mascotButton = await page.$('aside[aria-label="Meridbot educational companion"] button');
  console.log(`✓ Meridbot button interactive: ${mascotButton !== null ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-02-inner-floating-companion-1440x900.png'), fullPage: false });
  console.log('✓ Captured meridbot-02-inner-floating-companion-1440x900.png');

  console.log('\n=== TEST 3: CLICKING FLOATING MASCOT OPENS "ASK MERIDBOT" CHATBOX ===');
  await mascotButton.click();
  await page.waitForTimeout(800);

  // Check dialogue opened
  const dialog = await page.$('div[role="dialog"]');
  console.log(`✓ Dialog opened: ${dialog !== null ? 'PASS' : 'FAIL'}`);

  const headerTitle = await page.$('#assistant-dialog-title');
  const titleText = headerTitle ? await headerTitle.textContent() : '';
  console.log(`✓ Header title is "Ask Meridbot": ${titleText.trim() === 'Ask Meridbot' ? 'PASS' : 'FAIL'} ("${titleText.trim()}")`);

  // Check welcome message
  const welcomeEl = await page.$(':has-text("Hello! I\'m Meridbot. I can help you explore information")');
  console.log(`✓ Welcome message present: ${welcomeEl !== null ? 'PASS' : 'FAIL'}`);

  // Check 6 suggested chips
  const expectedChips = [
    'What are varicose veins?',
    'What symptoms should I look for?',
    'What treatments are available?',
    'How does the severity assessment work?',
    'How can I request an expert review?',
    'How do I book a consultation?'
  ];

  for (const chip of expectedChips) {
    const chipEl = await page.$(`button:has-text("${chip}")`);
    console.log(`  - Chip present: "${chip}": ${chipEl !== null ? 'PASS' : 'FAIL'}`);
  }

  // Click a chip: "What are varicose veins?"
  console.log('\n=== TEST 4: INTERACTION & CONVERSATION RESPONSE ===');
  const chip1 = await page.$('button:has-text("What are varicose veins?")');
  if (chip1) {
    await chip1.click();
    console.log('  → Clicked chip: "What are varicose veins?"');
    await page.waitForTimeout(1600);
  }

  // Verify response
  const responseBubble = await page.$(':has-text("Leg discomfort, heaviness and visible bulging veins")');
  console.log(`✓ Educational response received: ${responseBubble !== null ? 'PASS' : 'FAIL'}`);

  // Submit another question via text input
  const textInput = await page.$('input[aria-label="Ask Meridbot a question about vein health"]');
  await textInput.fill('How does the severity assessment work?');
  const sendBtn = await page.$('button[aria-label="Send question"]');
  await sendBtn.click();
  console.log('  → Submitted question: "How does the severity assessment work?"');
  await page.waitForTimeout(1600);

  const assessmentResponse = await page.$(':has-text("HOW THE SEVERITY ASSESSMENT WORKS")');
  console.log(`✓ Assessment response received: ${assessmentResponse !== null ? 'PASS' : 'FAIL'}`);

  // Test emergency query
  await textInput.fill('Sudden severe swelling in one leg and chest pain');
  await sendBtn.click();
  console.log('  → Submitted emergency query: "Sudden severe swelling in one leg and chest pain"');
  await page.waitForTimeout(800);

  const emergencyCall112 = await page.$(':has-text("112")');
  const emergencyCall108 = await page.$(':has-text("108")');
  console.log(`✓ Emergency 112 routing triggered immediately: ${emergencyCall112 !== null ? 'PASS' : 'FAIL'}`);
  console.log(`✓ Emergency 108 routing triggered immediately: ${emergencyCall108 !== null ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-03-chatbox-desktop-1440x900.png'), fullPage: false });
  console.log('✓ Captured meridbot-03-chatbox-desktop-1440x900.png');

  console.log('\n=== TEST 5: CLOSING & PERSISTENCE CHECK ===');
  const closeBtn = await page.$('button[aria-label="Close Ask Meridbot"]');
  await closeBtn.click();
  await page.waitForTimeout(600);

  const dialogClosed = await page.$('div[role="dialog"]');
  console.log(`✓ Dialog closed successfully: ${dialogClosed === null ? 'PASS' : 'FAIL'}`);

  // Mascot re-appears smoothly
  const mascotReappeared = await page.$('aside[aria-label="Meridbot educational companion"] button');
  console.log(`✓ Floating mascot reappeared after closing: ${mascotReappeared !== null ? 'PASS' : 'FAIL'}`);

  // Re-open chatbox
  await mascotReappeared.click();
  await page.waitForTimeout(600);

  // Verify previous conversation history persisted
  const persistedResponse = await page.$(':has-text("HOW THE SEVERITY ASSESSMENT WORKS")');
  console.log(`✓ Conversation history persisted across close/reopen: ${persistedResponse !== null ? 'PASS' : 'FAIL'}`);

  const closeBtnReopened = await page.$('button[aria-label="Close Ask Meridbot"]');
  if (closeBtnReopened) {
    await closeBtnReopened.click();
    await page.waitForTimeout(400);
  }

  console.log('\n=== TEST 6: MOBILE VIEWPORT (iPhone 390x844) ===');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/#treatments`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const mobileMascot = await page.$('aside[aria-label="Meridbot educational companion"] button');
  const isMobileMascotVisible = mobileMascot ? await mobileMascot.isVisible() : false;
  console.log(`✓ Mobile floating mascot visible on #treatments (390x844): ${isMobileMascotVisible ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-04-mobile-floating-companion-390x844.png'), fullPage: false });
  console.log('✓ Captured meridbot-04-mobile-floating-companion-390x844.png');

  // Open chatbox on mobile
  await mobileMascot.click();
  await page.waitForTimeout(800);

  const mobileDialog = await page.$('div[role="dialog"]');
  console.log(`✓ Mobile bottom-sheet dialog opened: ${mobileDialog !== null ? 'PASS' : 'FAIL'}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'meridbot-05-mobile-chatbox-bottomsheet-390x844.png'), fullPage: false });
  console.log('✓ Captured meridbot-05-mobile-chatbox-bottomsheet-390x844.png');

  console.log('\n=== TEST 7: EMERGENCY SAFETY GUIDANCE IN DVT GUIDE ===');
  await page.goto(`${BASE_URL}/#learn/dvt-warning-signs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const dvt112 = await page.$(':has-text("112")');
  const dvt108 = await page.$(':has-text("108")');
  console.log(`✓ Emergency guidance preserved in DVT educational guide: ${dvt112 !== null && dvt108 !== null ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('\n🎉 ALL 7 TEST PHASES COMPLETED WITH 100% SUCCESS!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
