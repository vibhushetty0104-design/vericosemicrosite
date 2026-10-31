// Milestone 1 evidence: doctor card, demo request form and completion screen at 390x844.
// Run: playwright-cli -s=<session> --raw run-code --filename=docs/redesign/evidence/m1/capture-surfaces.js
async page => {
  const OUT = 'docs/redesign/evidence/m1/after';
  const requests = [];
  page.on('request', (r) => requests.push(r.method() + ' ' + r.url()));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5179/#specialists');
  await page.waitForTimeout(1200);

  const card = page.locator('[data-demo-label]').first();
  await card.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -160));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/390x844-doctor-card.png` });

  await page.getByRole('button', { name: 'Request (demo)' }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/390x844-request-form.png` });

  const dialog = page.getByRole('dialog');
  await dialog.locator('input[type=text]').first().fill('Sample Patient');
  await dialog.locator('input[type=email]').fill('sample@example.invalid');
  await dialog.locator('input[type=tel]').fill('+91 00000 00000');
  await dialog.locator('button[type=submit]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/390x844-request-result.png` });

  const resultText = await dialog.innerText();
  return JSON.stringify({
    resultHeading: (resultText.match(/Demo request: not sent to any clinic/) || [null])[0],
    mentionsSimulationId: /simulation id/i.test(resultText),
    showsPatientName: resultText.includes('Sample Patient'),
    nonGetRequestsDuringFlow: requests.filter((r) => !r.startsWith('GET ')),
  }, null, 2);
}
