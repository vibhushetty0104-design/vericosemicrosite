// Meridian Vascular mobile audit (Milestone 1 evidence).
//
// Run against a local dev server with the global playwright-cli (no project dependency):
//   npx vite --port 5179 --strictPort
//   playwright-cli -s=audit open about:blank
//   playwright-cli -s=audit --raw run-code --filename=scripts/mobile-audit.js > docs/redesign/evidence/m1/<label>/metrics.json
// Screenshots are written to OUT_DIR. Change BASE_URL or OUT_DIR below if needed.
async page => {
  const BASE_URL = 'http://localhost:5179/';
  const OUT_DIR = 'docs/redesign/evidence/m1/latest';

  const viewports = [
    { w: 360, h: 640 },
    { w: 390, h: 844 },
    { w: 430, h: 932 },
    { w: 768, h: 1024 },
    { w: 640, h: 360 },
    { w: 1440, h: 900 },
  ];
  const views = ['', 'journey', 'assessment', 'doppler', 'treatments', 'specialists', 'dashboard'];
  const screenshotViews = ['', 'specialists', 'doppler'];

  const requests = [];
  page.on('request', (r) => requests.push({ method: r.method(), url: r.url() }));

  const rows = [];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    for (const v of views) {
      await page.goto(BASE_URL + '#' + v);
      await page.waitForTimeout(v === '' ? 2600 : 700);
      const row = await page.evaluate(() => {
        const vw = innerWidth, vh = innerHeight;
        const vis = (e) => {
          const r = e.getBoundingClientRect();
          const s = getComputedStyle(e);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
        };
        const fixed = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && vis(e));
        const targets = [...document.querySelectorAll('main button, main a, main input, main select, main [role=button], main [role=tab]')].filter(vis);
        const under44 = targets.filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44; });
        const tinyText = [...document.querySelectorAll('main *')].filter((e) =>
          vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2) && parseFloat(getComputedStyle(e).fontSize) < 12);
        const firstCta = targets.find((e) => /assess|symptom|evaluate|request|book|check/i.test(e.textContent || ''));
        const ctaTop = firstCta ? Math.round(firstCta.getBoundingClientRect().top) : null;
        const ctaBottom = firstCta ? Math.round(firstCta.getBoundingClientRect().bottom) : null;
        return {
          screens: +(document.documentElement.scrollHeight / vh).toFixed(1),
          horizontalScroll: document.documentElement.scrollWidth > vw,
          fixedPx: fixed.reduce((a, e) => a + Math.round(e.getBoundingClientRect().height), 0),
          targets: targets.length,
          under44: under44.length,
          tinyText: tinyText.length,
          h1Count: document.querySelectorAll('main h1').length,
          firstCtaInFirstScreen: firstCta ? ctaTop >= 0 && ctaBottom <= vh : null,
          firstCtaTop: ctaTop,
          demoLabelCount: (document.body.innerText.match(/Demo profile · fictional/g) || []).length,
        };
      });
      rows.push({ viewport: `${vp.w}x${vp.h}`, view: v || 'home', ...row });
      if (screenshotViews.includes(v)) {
        await page.screenshot({ path: `${OUT_DIR}/${vp.w}x${vp.h}-${v || 'home'}.png` });
      }
    }
  }

  // Educational guide: open it, send two messages (one routine, one urgent), record network traffic.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL + '#');
  await page.waitForTimeout(1500);
  const before = requests.length;
  const opened = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /guide/i.test(x.textContent || x.getAttribute('aria-label') || '') && x.getBoundingClientRect().width > 0);
    if (!b) return false;
    b.click();
    return true;
  });
  const guide = { opened, messages: [] };
  if (opened) {
    await page.waitForTimeout(500);
    const input = page.locator('[role=dialog] input[type=text]').first();
    for (const msg of ['What does SFJ reflux mean on my Doppler?', 'Sudden swelling in one calf and chest pain']) {
      await input.fill(msg);
      await input.press('Enter');
      await page.waitForTimeout(1200);
    }
    guide.messages = await page.evaluate(() =>
      [...document.querySelectorAll('[role=dialog] [aria-live] p')].slice(-2).map((p) => p.textContent.slice(0, 160)));
    guide.urgentNumbersShown = await page.evaluate(() => /112/.test(document.querySelector('[role=dialog]').innerText) && /108/.test(document.querySelector('[role=dialog]').innerText));
    await page.screenshot({ path: `${OUT_DIR}/390x844-guide.png` });
  }
  const guideRequests = requests.slice(before);
  const host = (u) => { try { return new URL(u).host; } catch { return u; } };
  const summarise = (list) => Object.entries(list.reduce((acc, r) => { const k = r.method + ' ' + host(r.url); acc[k] = (acc[k] || 0) + 1; return acc; }, {}));
  guide.requestsDuringGuide = guideRequests.filter((r) => !/\.(js|css|svg|png|woff2?|ts|tsx)(\?|$)|@vite|@react-refresh|node_modules/.test(r.url)).map((r) => r.method + ' ' + r.url);
  guide.externalHostsDuringGuide = [...new Set(guideRequests.map((r) => host(r.url)).filter((h) => !/^localhost(:\d+)?$/.test(h)))];

  return JSON.stringify({ capturedAt: new Date().toISOString(), rows, guide, allRequestHosts: summarise(requests) }, null, 2);
}
