// Meridian Vascular runtime performance baseline (before any experience/motion work).
//
// Measures the production build, not the dev server:
//   npx vite build --outDir <scratch>/build
//   npx vite preview --outDir <scratch>/build --port 4179 --strictPort
//   playwright-cli -s=perf open about:blank
//   playwright-cli -s=perf --raw run-code --filename=docs/redesign/evidence/perf-baseline/perf-baseline.js > docs/redesign/evidence/perf-baseline/baseline.json
// Conditions approximate Lighthouse's mobile preset: 390x844, 4x CPU slowdown, 150ms RTT,
// 1.6 Mbps down / 750 kbps up, cache disabled. Chromium on a desktop machine is not a real phone;
// treat these as relative numbers for comparing future builds, not as field data.
async page => {
  const BASE = 'http://localhost:4179/';
  const RUNS = 3;
  const views = ['', 'learn', 'doppler', 'treatments', 'specialists'];
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, longTasks: [], events: [] };
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__perf.lcp = e.startTime))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__perf.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__perf.longTasks.push([e.startTime, e.duration]))).observe({ type: 'longtask', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__perf.events.push([e.name, e.duration]))).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  });
  const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const out = {};
  for (const v of views) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      await page.goto('about:blank');
      await page.goto(BASE + '#' + v, { waitUntil: 'load' });
      await page.waitForTimeout(4000);
      runs.push(await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const res = performance.getEntriesByType('resource');
        const js = res.filter((r) => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name));
        const p = window.__perf;
        const fcpT = fcp ? fcp.startTime : 0;
        const tbt = p.longTasks.filter(([s]) => s >= fcpT).reduce((a, [, d]) => a + Math.max(0, d - 50), 0);
        return {
          fcp: Math.round(fcpT),
          lcp: Math.round(p.lcp),
          cls: +p.cls.toFixed(3),
          tbt: Math.round(tbt),
          longestTask: Math.round(Math.max(0, ...p.longTasks.map(([, d]) => d))),
          load: Math.round(nav.loadEventEnd),
          jsKB: Math.round(js.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
          totalKB: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024 + (nav.transferSize || 0) / 1024),
          domNodes: document.querySelectorAll('*').length,
          heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null,
          pageHeight: document.documentElement.scrollHeight,
        };
      }));
    }
    const agg = {};
    for (const k of Object.keys(runs[0])) agg[k] = median(runs.map((r) => r[k]));
    out[v || 'home'] = { median: agg, runs };
  }

  // Interaction latency on home: open and close the menu, open the guide (Event Timing API)
  await page.goto('about:blank');
  await page.goto(BASE + '#', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  await page.evaluate(() => (window.__perf.events = []));
  const interactions = {};
  for (let i = 0; i < RUNS; i++) {
    await page.evaluate(() => (window.__perf.events = []));
    await page.locator('header button[aria-controls="site-menu"]').click();
    await page.waitForTimeout(600);
    const open = await page.evaluate(() => Math.max(0, ...window.__perf.events.filter(([n]) => n === 'click' || n === 'pointerup').map(([, d]) => d)));
    await page.evaluate(() => (window.__perf.events = []));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const close = await page.evaluate(() => Math.max(0, ...window.__perf.events.filter(([n]) => n === 'keydown').map(([, d]) => d)));
    (interactions.menuOpen = interactions.menuOpen || []).push(Math.round(open));
    (interactions.menuClose = interactions.menuClose || []).push(Math.round(close));
  }
  for (let i = 0; i < RUNS; i++) {
    await page.evaluate(() => (window.__perf.events = []));
    await page.locator('main a[href="#learn"]:visible').first().click();
    await page.waitForTimeout(1500);
    const nav = await page.evaluate(() => Math.max(0, ...window.__perf.events.filter(([n]) => n === 'click' || n === 'pointerup').map(([, d]) => d)));
    (interactions.homeToLearn = interactions.homeToLearn || []).push(Math.round(nav));
    await page.goto('about:blank');
    await page.goto(BASE + '#', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  return JSON.stringify({
    capturedAt: new Date().toISOString(),
    conditions: '390x844, CPU 4x slowdown, 150ms RTT, 1.6Mbps/750kbps, cache disabled, production build via vite preview',
    views: out,
    interactionsMs: Object.fromEntries(Object.entries(interactions).map(([k, v]) => [k, { median: median(v), runs: v }])),
  });
}
