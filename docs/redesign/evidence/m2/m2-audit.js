// Meridian Vascular Milestone 2 audit (layout metrics + screenshots).
//
// Works against both the pre-M2 and post-M2 markup so before/after numbers are comparable.
// Run against a local dev server with the global playwright-cli (no project dependency):
//   npx vite --port 5179 --strictPort
//   playwright-cli -s=m2 open about:blank
//   playwright-cli -s=m2 --raw run-code --filename=docs/redesign/evidence/m2/m2-audit.js > docs/redesign/evidence/m2/<label>/metrics.json
// LABEL controls the screenshot folder. The output is a JSON string; decode it twice.
async page => {
  const BASE_URL = 'http://localhost:5179/';
  const LABEL = 'after';
  const OUT_DIR = `docs/redesign/evidence/m2/${LABEL}`;

  const viewports = [
    { w: 320, h: 640 },
    { w: 360, h: 640 },
    { w: 390, h: 844 },
    { w: 430, h: 932 },
    { w: 640, h: 360 },
    { w: 768, h: 1024 },
    { w: 1024, h: 768 },
    { w: 1280, h: 800 },
    { w: 1440, h: 900 },
    { w: 1920, h: 1080 },
  ];
  const views = ['', 'learn', 'journey', 'assessment', 'doppler', 'treatments', 'specialists', 'dashboard'];
  const screenshotViews = ['', 'learn'];

  const rows = [];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    for (const v of views) {
      await page.goto(BASE_URL + '#' + v);
      // The pre-M2 hero ran a typewriter for ~2.5s; wait it out so text metrics are final.
      await page.waitForTimeout(v === '' ? 2600 : 700);
      await page.evaluate(() => document.fonts.ready);
      const row = await page.evaluate(() => {
        const vw = innerWidth, vh = innerHeight;
        const vis = (e) => {
          const r = e.getBoundingClientRect();
          const s = getComputedStyle(e);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0';
        };
        const pinned = () =>
          [...document.querySelectorAll('body *')]
            .filter((e) => ['fixed', 'sticky'].includes(getComputedStyle(e).position) && vis(e))
            // Count only outermost pinned elements, and only the part inside the viewport.
            .filter((e) => {
              for (let p = e.parentElement; p; p = p.parentElement) {
                if (['fixed', 'sticky'].includes(getComputedStyle(p).position)) return false;
              }
              return true;
            })
            .map((e) => {
              const r = e.getBoundingClientRect();
              return { el: e, top: Math.max(0, r.top), bottom: Math.min(vh, r.bottom) };
            })
            .filter((x) => x.bottom > x.top);

        // Fixed/sticky chrome while scrolled halfway down (sticky headers only count once stuck).
        const y0 = scrollY;
        scrollTo(0, Math.round(document.documentElement.scrollHeight / 2));
        const chrome = pinned();
        const chromePx = chrome.reduce((a, x) => a + Math.round(x.bottom - x.top), 0);
        const floatingCount = chrome.filter((x) => !x.el.closest('header')).length;
        scrollTo(0, y0);

        const scope = document.querySelectorAll('header button, header a, main button, main a, main input, main select, main [role=button], main [role=tab], footer button, footer a');
        const targets = [...scope].filter(vis).filter((e) => !(e.tagName === 'A' && e.closest('p')));
        const under44 = targets.filter((e) => {
          const r = e.getBoundingClientRect();
          return r.height < 44 || r.width < 44;
        });
        const textEls = [...document.querySelectorAll('main *, header *')].filter(
          (e) => vis(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2)
        );
        const tinyText = textEls.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 12);
        const paras = [...document.querySelectorAll('main p')].filter(vis);
        const smallParas = paras.filter((p) => parseFloat(getComputedStyle(p).fontSize) < 16);
        const ctx = document.createElement('canvas').getContext('2d');
        const lineChars = paras.map((p) => {
          const s = getComputedStyle(p);
          ctx.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
          const sample = (p.textContent || '').trim();
          if (sample.length < 40) return 0;
          const avg = ctx.measureText(sample).width / sample.length;
          return Math.round(p.getBoundingClientRect().width / avg);
        });

        const header = document.querySelector('header');
        const headerRect = header ? header.getBoundingClientRect() : null;
        const navItems = header ? [...header.querySelectorAll('nav a, nav button')].filter(vis) : [];
        const wrappedNav = navItems.filter((e) => {
          const s = getComputedStyle(e);
          const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.4;
          const span = e.querySelector('span') || e;
          return span.getBoundingClientRect().height > lh * 1.5;
        });
        const headerControls = header ? [...header.querySelectorAll('a, button')].filter(vis) : [];
        let headerOverlap = 0;
        for (let i = 0; i < headerControls.length; i++)
          for (let j = i + 1; j < headerControls.length; j++) {
            if (headerControls[i].contains(headerControls[j]) || headerControls[j].contains(headerControls[i])) continue;
            const a = headerControls[i].getBoundingClientRect(), b = headerControls[j].getBoundingClientRect();
            if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) headerOverlap++;
          }

        const firstCta =
          document.querySelector('main .mv-btn-primary') ||
          [...document.querySelectorAll('main button, main a')].filter(vis).find((e) => /assess|symptom|evaluate|request|book|check/i.test(e.textContent || ''));
        const ctaRect = firstCta ? firstCta.getBoundingClientRect() : null;
        const telLink = [...document.querySelectorAll('main a[href^="tel:"]')].find(vis);
        const urgentBox = telLink ? telLink.closest('[data-urgent],[role=alert],section,div') : null;
        const urgentRect = urgentBox ? urgentBox.getBoundingClientRect() : null;
        const urgentStrip = document.getElementById('urgent-help');
        const urgentCalls = urgentStrip ? [...urgentStrip.querySelectorAll('a[href^="tel:"]')] : [];

        const headings = [...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')].filter(vis);
        let skips = 0;
        for (let i = 1; i < headings.length; i++) {
          const prev = +headings[i - 1].tagName[1], cur = +headings[i].tagName[1];
          if (cur > prev + 1) skips++;
        }
        const brandMentions = (document.body.innerText.slice(0, 4000).match(/meridian/gi) || []).length;

        return {
          screens: +(document.documentElement.scrollHeight / vh).toFixed(1),
          horizontalScroll: document.documentElement.scrollWidth > vw,
          headerHeight: headerRect ? Math.round(headerRect.height) : null,
          headerTop: headerRect ? Math.round(headerRect.top) : null,
          chromePx,
          floatingCount,
          navVisible: navItems.length,
          navWrapped: wrappedNav.map((e) => e.textContent.trim()),
          headerOverlap,
          targets: targets.length,
          under44: under44.length,
          under44Samples: under44.slice(0, 6).map((e) => {
            const r = e.getBoundingClientRect();
            return `${(e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 40)} ${Math.round(r.width)}x${Math.round(r.height)}`;
          }),
          tinyText: tinyText.length,
          paragraphs: paras.length,
          paragraphsUnder16: smallParas.length,
          maxLineChars: Math.max(0, ...lineChars),
          h1Count: document.querySelectorAll('main h1').length,
          h1Text: [...document.querySelectorAll('main h1')].map((h) => h.textContent.trim().slice(0, 80)),
          headingSkips: skips,
          title: document.title,
          firstCtaText: firstCta ? firstCta.textContent.trim().slice(0, 40) : null,
          firstCtaBottom: ctaRect ? Math.round(ctaRect.bottom) : null,
          firstCtaInFirstScreen: ctaRect ? ctaRect.top >= 0 && ctaRect.bottom <= vh : null,
          urgentBottom: urgentRect ? Math.round(urgentRect.bottom) : null,
          urgentStripTop: urgentStrip ? Math.round(urgentStrip.getBoundingClientRect().top) : null,
          urgentCallsBottom: urgentCalls.length ? Math.round(Math.max(...urgentCalls.map((a) => a.getBoundingClientRect().bottom))) : null,
          skipLink: !!document.querySelector('a[href="#main"]'),
          brandMentionsTop: brandMentions,
          demoLabelCount: (document.body.innerText.match(/Demo profile · fictional/g) || []).length,
        };
      });
      rows.push({ viewport: `${vp.w}x${vp.h}`, view: v || 'home', ...row });
      if (screenshotViews.includes(v)) {
        await page.screenshot({ path: `${OUT_DIR}/${vp.w}x${vp.h}-${v || 'home'}.png` });
      }
    }
  }

  const fontRequests = await page.evaluate(() =>
    [...document.querySelectorAll('link[href*="fonts.googleapis"]')].map((l) => l.href)
  );
  return JSON.stringify({ label: LABEL, capturedAt: new Date().toISOString(), fontRequests, rows });
}
