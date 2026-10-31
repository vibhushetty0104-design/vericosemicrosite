// Venous valve prototype audit (dev server only; the page is not part of the production build).
//
//   npx vite --port 5179 --strictPort
//   playwright-cli -s=valve open about:blank
//   playwright-cli -s=valve --raw run-code --filename=docs/redesign/evidence/prototype-valve/valve-audit.js > docs/redesign/evidence/prototype-valve/results.json
// Automated Chromium checks only; not a substitute for real-device, screen-reader or clinical review.
async page => {
  const URL = 'http://localhost:5179/prototypes/venous-valve.html';
  const OUT = 'docs/redesign/evidence/prototype-valve';
  const results = [];
  const check = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail: String(detail) });
  const errors = [];
  const external = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('http://localhost:5179') && !u.startsWith('data:') && !/fonts\.(googleapis|gstatic)\.com/.test(u)) external.push(u); });

  const load = async (w = 390, h = 844) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('about:blank');
    await page.goto(URL);
    await page.waitForSelector('.vv');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
  };
  const running = () => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect && a.effect.getTiming().iterations === Infinity).length);
  const playBtn = () => page.locator('.vv-play');

  // ------------------------------------------------------------ Labels and wording
  await load();
  const text = await page.evaluate(() => document.querySelector('.vv').innerText);
  check('Visual is labelled as an educational illustration', /Educational illustration/i.test(text) && /not a scan/i.test(text));
  check('Badge sits on the close-up visual itself', await page.evaluate(() => !!document.querySelector('.vv-card--closeup .vv-badge')));
  check('No measurement-like values (ms, s, mm, cm, MHz, kHz, mmHg, %)', !/\b\d+(\.\d+)?\s?(ms|s|mm|cm|MHz|kHz|mmHg|%)\b/.test(text), (text.match(/\b\d+(\.\d+)?\s?(ms|s|mm|cm|MHz|kHz|mmHg|%)\b/g) || []).join(', '));
  check('No diagnostic or validation wording', !/patholog|normal result|abnormal|diagnosed|validated|clinically (proven|reviewed)|medically reviewed/i.test(text));
  check('States that wording has not been clinically reviewed', /not yet been reviewed by a clinician/i.test(text));
  check('Concept sheet is explained, not displayed', /flattened image/i.test(text) && (await page.locator('.vv img').count()) === 0);

  // ------------------------------------------------------------ Playback rules
  check('Starts paused: no running animations on load', (await running()) === 0, await running());
  await playBtn().click();
  await page.waitForTimeout(200);
  const afterPlay = await running();
  check('Play starts the flow animation', afterPlay > 0 && (await playBtn().innerText()).includes('Pause flow'), afterPlay);
  await playBtn().click();
  await page.waitForTimeout(200);
  check('Pause stops all animation', (await running()) === 0);
  await page.locator('label[for$="-closed"]').click();
  await playBtn().click();
  await page.waitForTimeout(200);
  check('Closed valve: nothing flows past it even while playing', (await running()) === 0);
  await page.locator('label[for$="-reflux"]').click();
  await page.waitForTimeout(500);
  check('Leaky valve: backward flow animates while playing', (await running()) > 0);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const offTop = await page.evaluate(() => Math.round(document.querySelector('.vv-card--closeup').getBoundingClientRect().bottom));
  check('Off-screen: animation stops while the close-up is scrolled away', offTop < 0 ? (await running()) === 0 : true, `closeup bottom ${offTop}px, running ${await running()}`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  check('Back on screen: animation resumes', (await running()) > 0);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(200);
  check('Hidden tab: animation stops', (await running()) === 0);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(200);
  check('Visible tab again: animation resumes', (await running()) > 0);

  // Frame timing while animating at 4x CPU slowdown (budget P8: median <= 18ms, 95% <= 33ms)
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const frames = await page.evaluate(() => new Promise((resolve) => {
    const t = []; let last = performance.now(); const end = last + 5000;
    const tick = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(tick); else resolve(t); };
    requestAnimationFrame(tick);
  }));
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const sorted = [...frames].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const within33 = frames.filter((f) => f <= 33.4).length / frames.length;
  check('Frame timing at 4x CPU while animating: median <= 18ms and >= 95% of frames <= 33ms', median <= 18 && within33 >= 0.95, `median ${median.toFixed(1)}ms, ${(within33 * 100).toFixed(1)}% <= 33ms over ${frames.length} frames`);
  await playBtn().click();

  // ------------------------------------------------------------ States, captions and geometry
  await load();
  const geo = {};
  for (const s of ['open', 'closed', 'reflux']) {
    await page.locator(`label[for$="-${s}"]`).click();
    await page.waitForTimeout(500);
    // Flap tips are drawn meeting at (120,150); each state is a transform around the wall hinge.
    // Rendered bounding boxes of transformed SVG paths proved unreliable, so the transforms are checked.
    geo[s] = await page.evaluate(() => {
      const m = (sel) => { const t = getComputedStyle(document.querySelector(sel)).transform; return new DOMMatrix(t === 'none' ? undefined : t); };
      const l = m('.vv-leaflet--left'), r = m('.vv-leaflet--right');
      const angle = (x) => Math.round((Math.atan2(x.b, x.a) * 180) / Math.PI);
      return { left: { angle: angle(l), dx: Math.round(l.e) }, right: { angle: angle(r), dx: Math.round(r.e) }, status: document.querySelector('.vv-status').textContent, title: document.querySelector('.vv-closeup title').textContent };
    });
  }
  const tips = await page.evaluate(() => [...document.querySelectorAll('.vv-leaflet')].map((p) => { const t = p.getPointAtLength(p.getTotalLength()); return [Math.round(t.x), Math.round(t.y)]; }));
  check('Closed: both flaps are untransformed and their tips meet at the centre line', geo.closed.left.angle === 0 && geo.closed.right.angle === 0 && tips.every(([x, y]) => x === 120 && y === 150), JSON.stringify({ closed: geo.closed.left, tips }));
  check('Open: flaps rotate back toward their walls', geo.open.left.angle < -20 && geo.open.right.angle > 20, JSON.stringify([geo.open.left, geo.open.right]));
  check('Leaky: walls and flaps move apart so the tips cannot meet', geo.reflux.left.angle < 0 && geo.reflux.right.angle > 0 && geo.reflux.left.dx < 0 && geo.reflux.right.dx > 0, JSON.stringify([geo.reflux.left, geo.reflux.right]));
  check('Live caption and SVG title follow the selected state', /open/i.test(geo.open.status) && /closed/i.test(geo.closed.status) && /leaky/i.test(geo.reflux.status) && /leaky/i.test(geo.reflux.title), JSON.stringify(Object.values(geo).map((g) => g.status)));
  check('Live caption is a polite live region', (await page.getAttribute('.vv-status', 'aria-live')) === 'polite');

  // ------------------------------------------------------------ Keyboard and focus
  await load();
  await page.keyboard.press('Tab');
  let a = await page.evaluate(() => ({ type: document.activeElement.type, value: document.activeElement.value }));
  const focusOutline = await page.evaluate(() => { const l = document.querySelector('.vv-radio:focus-visible + .vv-segment-label'); return l ? getComputedStyle(l).outlineStyle + ' ' + getComputedStyle(l).outlineWidth : 'none'; });
  // the banner "Back to the site" link is first; Tab again to reach the radio group
  if (a.type !== 'radio') { await page.keyboard.press('Tab'); a = await page.evaluate(() => ({ type: document.activeElement.type, value: document.activeElement.value })); }
  check('State selector is reachable by keyboard', a.type === 'radio' && a.value === 'open', JSON.stringify(a));
  const ring = await page.evaluate(() => { const l = document.querySelector('.vv-radio:focus-visible + .vv-segment-label'); return l ? `${getComputedStyle(l).outlineStyle} ${getComputedStyle(l).outlineWidth}` : 'none'; });
  check('Focused state option shows a visible 2px outline', /solid 2px/.test(ring), ring + ' / first stop: ' + focusOutline);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(150);
  check('Arrow keys change the state', (await page.evaluate(() => document.activeElement.value)) === 'closed' && /closed/i.test(await page.textContent('.vv-status')));
  await page.keyboard.press('Tab');
  check('Tab moves from the state selector to Play', (await page.evaluate(() => document.activeElement.className)).includes('vv-play'));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  check('Play/Pause works from the keyboard', (await playBtn().innerText()).includes('Pause flow'));
  await page.keyboard.press('Enter');
  const playOutline = await page.evaluate(() => `${getComputedStyle(document.activeElement).outlineStyle} ${getComputedStyle(document.activeElement).outlineWidth}`);
  check('Play button shows a visible focus outline', /solid 2px/.test(playOutline), playOutline);
  await page.keyboard.press('Tab');
  const isToggle = await page.evaluate(() => document.activeElement.className.includes('vv-layer-toggle'));
  await page.keyboard.press('Enter');
  check('Layer toggles are keyboard operable and report aria-pressed', isToggle && (await page.evaluate(() => document.activeElement.getAttribute('aria-pressed'))) === 'false' && (await page.locator('.vv-layer--superficial').count()) === 0);

  // ------------------------------------------------------------ Size rules and reflow
  for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1280, 800]]) {
    await load(w, h);
    const m = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const controls = [...document.querySelectorAll('.vv-segment-label, .vv-play, .vv-layer-toggle')].filter(vis);
      const small = controls.filter((c) => { const r = c.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).map((c) => c.textContent.trim());
      const texts = [...document.querySelectorAll('.vv *')].filter((e) => vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
      const tiny = texts.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => e.textContent.trim().slice(0, 30));
      const body = [...document.querySelectorAll('.vv-body')].map((p) => parseFloat(getComputedStyle(p).fontSize));
      return { overflow: document.documentElement.scrollWidth > innerWidth, small, tiny, body };
    });
    check(`${w}px: no horizontal overflow`, !m.overflow);
    check(`${w}px: every control at least 44x44`, m.small.length === 0, m.small.join(', '));
    check(`${w}px: no text under 12px; explanation text 16px`, m.tiny.length === 0 && m.body.every((s) => s >= 16), `${m.tiny.join(', ')} body=${m.body}`);
    for (const s of ['open', 'closed', 'reflux']) {
      await page.locator(`label[for$="-${s}"]`).click();
      await page.waitForTimeout(450);
      await page.screenshot({ path: `${OUT}/${w}x${h}-${s}.png`, fullPage: w <= 390 && s === 'open' });
    }
  }

  // ------------------------------------------------------------ Reduced motion
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load();
  const rm = await page.evaluate(() => ({
    play: !!document.querySelector('.vv-play'),
    note: document.querySelector('.vv-motion-note')?.textContent || '',
    leafletTransition: getComputedStyle(document.querySelector('.vv-leaflet')).transitionDuration,
  }));
  await page.locator('label[for$="-reflux"]').click();
  await page.waitForTimeout(100);
  check('Reduced motion: no Play button; a note explains still arrows', !rm.play && /still arrows/.test(rm.note), JSON.stringify(rm));
  check('Reduced motion: flaps change state effectively instantly (transition <= 0.01ms) and nothing runs', parseFloat(rm.leafletTransition) <= 0.00001 && (await running()) === 0, rm.leafletTransition);
  await page.screenshot({ path: `${OUT}/390x844-reduced-motion-reflux.png` });
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  check('No console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('No external requests other than Google Fonts', external.length === 0, external.join(', '));
  const passed = results.filter((r) => r.pass).length;
  return JSON.stringify({ capturedAt: new Date().toISOString(), passed, failed: results.length - passed, frameSample: { median: +median.toFixed(1), within33: +(within33 * 100).toFixed(1), frames: frames.length }, results });
}
