// Meridian Vascular Milestone 2 interaction audit (keyboard, menu, links, motion).
//
//   npx vite --port 5179 --strictPort
//   playwright-cli -s=m2 open about:blank
//   playwright-cli -s=m2 --raw run-code --filename=docs/redesign/evidence/m2/m2-interaction.js > docs/redesign/evidence/m2/after/interaction.json
// Automated Chromium checks only: they do not replace real-device or screen-reader testing.
async page => {
  const BASE = 'http://localhost:5179/';
  const results = [];
  const check = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail: String(detail) });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  const externalRequests = [];
  page.on('request', (r) => {
    const u = r.url();
    if (!u.startsWith(BASE) && !u.startsWith('data:') && !/fonts\.(googleapis|gstatic)\.com/.test(u)) externalRequests.push(u);
  });

  // Full reload each time so state from a previous check never leaks into the next one.
  const go = async (hash, wait = 500) => {
    await page.goto('about:blank');
    await page.goto(BASE + '#' + hash);
    await page.waitForTimeout(wait);
  };
  // Wait until smooth scrolling has finished (scroll position unchanged for 250ms, max 4s).
  const settle = async () => {
    let last = -1, stable = 0;
    for (let i = 0; i < 40 && stable < 3; i++) {
      await page.waitForTimeout(100);
      const y = await page.evaluate(() => scrollY);
      stable = y === last ? stable + 1 : 0;
      last = y;
    }
  };
  const active = () => page.evaluate(() => {
    const a = document.activeElement;
    return { tag: a.tagName, id: a.id, text: (a.textContent || '').trim().slice(0, 40), inDialog: !!a.closest('#site-menu'), label: a.getAttribute('aria-label') };
  });
  const h1 = () => page.evaluate(() => [...document.querySelectorAll('main h1')].map((h) => h.textContent.trim()));

  // ---------------------------------------------------------------- Skip link
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE);
  await page.waitForTimeout(600);
  await page.keyboard.press('Tab');
  let a = await active();
  const skipVisible = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.top >= 0 && r.height > 0; });
  check('Skip link is the first Tab stop and becomes visible', a.text === 'Skip to main content' && skipVisible, JSON.stringify(a));
  await page.keyboard.press('Enter');
  a = await active();
  check('Skip link moves focus to main content', a.tag === 'MAIN' && a.id === 'main', JSON.stringify(a));

  // ---------------------------------------------------------------- Menu sheet (keyboard)
  await page.goto(BASE);
  await page.waitForTimeout(500);
  const menuBtn = page.locator('header button[aria-controls="site-menu"]');
  const menuBox = await menuBtn.boundingBox();
  check('Menu button is at least 44x44 and has a visible "Menu" label', menuBox && menuBox.width >= 44 && menuBox.height >= 44 && (await menuBtn.innerText()).includes('Menu'), JSON.stringify(menuBox));
  check('Menu button starts collapsed', (await menuBtn.getAttribute('aria-expanded')) === 'false');
  await menuBtn.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  const dialogInfo = await page.evaluate(() => {
    const d = document.getElementById('site-menu');
    return d && { role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'), labelledBy: d.getAttribute('aria-labelledby'), title: document.getElementById(d.getAttribute('aria-labelledby'))?.textContent, bodyOverflow: document.body.style.overflow };
  });
  check('Menu opens as a labelled modal dialog', dialogInfo && dialogInfo.role === 'dialog' && dialogInfo.modal === 'true' && dialogInfo.title === 'Menu', JSON.stringify(dialogInfo));
  check('Menu button reports aria-expanded="true" while open', (await menuBtn.getAttribute('aria-expanded')) === 'true');
  check('Page behind the menu does not scroll while open', dialogInfo && dialogInfo.bodyOverflow === 'hidden', dialogInfo && dialogInfo.bodyOverflow);
  a = await active();
  check('Focus moves into the menu on open', a.inDialog, JSON.stringify(a));
  const focusableCount = await page.evaluate(() => document.getElementById('site-menu').querySelectorAll('a[href], button:not([disabled])').length);
  let escaped = false;
  for (let i = 0; i < focusableCount + 3; i++) {
    await page.keyboard.press('Tab');
    if (!(await active()).inDialog) escaped = true;
  }
  for (let i = 0; i < focusableCount + 3; i++) {
    await page.keyboard.press('Shift+Tab');
    if (!(await active()).inDialog) escaped = true;
  }
  check(`Tab and Shift+Tab stay inside the menu (${focusableCount} stops, cycled both ways)`, !escaped);
  const sheetTargets = await page.evaluate(() =>
    [...document.querySelectorAll('#site-menu a, #site-menu button')].map((e) => { const r = e.getBoundingClientRect(); return { t: (e.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; })
  );
  const smallSheet = sheetTargets.filter((x) => x.w < 44 || x.h < 44);
  check('Every menu control is at least 44x44', smallSheet.length === 0, JSON.stringify(smallSheet));
  const sheetTel = await page.evaluate(() => [...document.querySelectorAll('#site-menu a[href^="tel:"]')].map((e) => e.getAttribute('href')));
  check('Urgent line with tel: 112 and 108 is first in the menu', sheetTel.join(',') === 'tel:112,tel:108' && (await page.evaluate(() => {
    const d = document.getElementById('site-menu');
    const urgent = d.querySelector('a[href^="tel:"]');
    const nav = d.querySelector('nav');
    return urgent.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING;
  })), sheetTel.join(','));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  a = await active();
  check('Escape closes the menu', !(await page.evaluate(() => !!document.getElementById('site-menu'))));
  check('Focus returns to the Menu button', a.tag === 'BUTTON' && a.text.includes('Menu'), JSON.stringify(a));
  check('Menu button reports aria-expanded="false" after closing', (await menuBtn.getAttribute('aria-expanded')) === 'false');
  check('Page scrolling is restored after closing', (await page.evaluate(() => document.body.style.overflow)) !== 'hidden');

  // Close button and choosing a destination
  await menuBtn.click();
  await page.waitForTimeout(300);
  await page.locator('#site-menu button', { hasText: 'Close' }).click();
  await page.waitForTimeout(200);
  a = await active();
  check('Close button closes the menu and returns focus to Menu', !(await page.evaluate(() => !!document.getElementById('site-menu'))) && a.text.includes('Menu'), JSON.stringify(a));
  await menuBtn.click();
  await page.waitForTimeout(300);
  await page.locator('#site-menu nav a', { hasText: 'Learn' }).click();
  await page.waitForTimeout(500);
  a = await active();
  check('Choosing "Learn" in the menu opens #learn and moves focus to main', (await h1()).join() === 'Learn about leg veins' && a.id === 'main' && page.url().endsWith('#learn'), `${(await h1()).join()} ${JSON.stringify(a)} ${page.url()}`);
  await menuBtn.click();
  await page.waitForTimeout(300);
  const current = await page.evaluate(() => document.querySelector('#site-menu [aria-current="page"]')?.textContent.trim());
  check('Menu marks the current view with aria-current="page"', current === 'Learn', current);
  await page.keyboard.press('Escape');

  // Menu closes itself when the window grows to the desktop layout
  await go('');
  await menuBtn.click();
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 1300, height: 800 });
  await page.waitForTimeout(300);
  check('Menu closes when the window widens past 1280px', !(await page.evaluate(() => !!document.getElementById('site-menu'))) && (await page.evaluate(() => document.body.style.overflow)) !== 'hidden');

  // ---------------------------------------------------------------- Desktop header
  for (const w of [1280, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    await go('doppler');
    const hdr = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
      const links = [...document.querySelectorAll('header nav a')].filter(vis);
      const controls = [...document.querySelectorAll('header a, header button')].filter(vis);
      return {
        links: links.map((l) => l.textContent.trim()),
        current: links.filter((l) => l.getAttribute('aria-current') === 'page').map((l) => l.textContent.trim()),
        menuVisible: controls.some((c) => c.getAttribute('aria-controls') === 'site-menu'),
        small: controls.filter((c) => c.getBoundingClientRect().height < 44).map((c) => c.textContent.trim()),
        wrapped: links.filter((l) => l.getBoundingClientRect().height > 48).map((l) => l.textContent.trim()),
        request: controls.some((c) => c.textContent.trim() === 'Request an appointment (demo)'),
        guide: controls.some((c) => c.textContent.trim() === 'Ask the guide'),
        headerH: Math.round(document.querySelector('header').getBoundingClientRect().height),
        right: Math.max(...controls.map((c) => c.getBoundingClientRect().right)),
      };
    });
    check(`${w}px: five header links, no Menu button, guide + demo request shown, nothing wraps or overflows`,
      hdr.links.length === 5 && !hdr.menuVisible && hdr.request && hdr.guide && hdr.small.length === 0 && hdr.wrapped.length === 0 && hdr.right <= w && hdr.headerH === 64,
      JSON.stringify(hdr));
    check(`${w}px: current view marked with aria-current`, hdr.current.join() === 'Doppler guide', hdr.current.join());
  }
  await page.setViewportSize({ width: 1279, height: 800 });
  await go('');
  check('1279px: Menu button shown instead of the desktop links', await page.evaluate(() => !!document.querySelector('header button[aria-controls="site-menu"]').offsetParent && ![...document.querySelectorAll('header nav a')].some((a) => a.offsetParent)));

  // ---------------------------------------------------------------- Views and titles
  await page.setViewportSize({ width: 1280, height: 800 });
  const views = { '': null, learn: 'Learn about leg veins', journey: null, assessment: null, doppler: null, treatments: null, specialists: null, dashboard: null };
  const titles = new Set();
  for (const v of Object.keys(views)) {
    await go(v);
    const hs = await h1();
    const title = await page.title();
    titles.add(title);
    check(`#${v || '(home)'} has exactly one h1`, hs.length === 1 && (!views[v] || hs[0] === views[v]), `${hs.join(' | ')} — ${title}`);
  }
  check('Each view sets a distinct document.title', titles.size === Object.keys(views).length, [...titles].join(' | '));

  // ---------------------------------------------------------------- Footer and section links
  await go('');
  const footerHrefs = await page.evaluate(() => [...document.querySelectorAll('footer a[href^="#"]')].map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })));
  for (const { href, text } of footerHrefs) {
    await go('');
    await page.locator(`footer a[href="${href}"]`).first().click();
    await settle();
    const r = await page.evaluate((h) => {
      const id = h.slice(1);
      const el = id && document.getElementById(id);
      const header = document.querySelector('header').getBoundingClientRect().bottom;
      return {
        h1: [...document.querySelectorAll('main h1')].map((x) => x.textContent.trim()).join(),
        hash: location.hash,
        found: !!el,
        top: el ? Math.round(el.getBoundingClientRect().top) : null,
        header: Math.round(header),
        scrollY: Math.round(scrollY),
      };
    }, href);
    const isView = !r.found;
    const ok = isView ? r.h1.length > 0 && r.scrollY === 0 : r.top >= r.header - 2 && r.top < 400;
    check(`Footer link "${text}" (${href}) reaches its target below the header`, ok, JSON.stringify(r));
  }

  // Learn page "On this page" links
  await go('learn');
  const learnLinks = await page.evaluate(() => [...document.querySelectorAll('nav[aria-label="On this page"] a')].map((a) => a.getAttribute('href')));
  for (const href of learnLinks) {
    await go('learn');
    await page.locator(`nav[aria-label="On this page"] a[href="${href}"]`).click();
    await settle();
    const r = await page.evaluate((h) => { const el = document.getElementById(h.slice(1)); return el ? Math.round(el.getBoundingClientRect().top) : null; }, href);
    check(`Learn contents link ${href} scrolls to its section`, r !== null && r >= 60 && r < 400, r);
  }

  // Direct deep links to relocated sections and old footer anchors
  for (const [hash, id, heading] of [['causes', 'causes', 'Learn about leg veins'], ['what-are', 'circulation-education', 'Learn about leg veins'], ['leg-pain', 'leg-pain-differential', 'Learn about leg veins'], ['duplex-scan', 'duplex-scan', null], ['doppler-education', 'doppler-education', null], ['treatment', 'treatment', null], ['doctor-visit', 'doctor-visit', null]]) {
    await page.goto('about:blank');
    await page.goto(BASE + '#' + hash);
    await page.waitForTimeout(400);
    await settle();
    const r = await page.evaluate((i) => { const el = document.getElementById(i); return el ? Math.round(el.getBoundingClientRect().top) : null; }, id);
    const hs = await h1();
    check(`Deep link #${hash} opens the right view and section`, r !== null && r >= 50 && r < 400 && (!heading || hs[0] === heading), `${r} ${hs.join()}`);
  }

  // Home links into tools and sections
  await go('');
  const homeLinks = await page.evaluate(() => [...document.querySelectorAll('main a[href^="#"]')].filter((a) => a.offsetParent).map((a) => a.getAttribute('href')));
  const homeTargets = [...new Set(homeLinks)];
  for (const href of homeTargets) {
    await go('');
    await page.locator(`main a[href="${href}"]:visible`).first().click();
    await settle();
    const r = await page.evaluate((h) => ({ h1: [...document.querySelectorAll('main h1')].map((x) => x.textContent.trim()).join(), el: !!(h.length > 1 && document.getElementById(h.slice(1))) }), href);
    check(`Home link ${href} leads somewhere real`, r.h1.length > 0 && (['#assessment', '#doppler', '#treatments', '#specialists', '#learn', '#journey'].includes(href) || r.el), JSON.stringify(r));
  }

  // Footer section links survive Back and Forward
  for (const [href, id] of [['#causes', 'causes'], ['#dvt-safety', 'dvt-safety'], ['#duplex-scan', 'duplex-scan'], ['#doctor-visit', 'doctor-visit'], ['#treatment', 'treatment']]) {
    await go('');
    await page.locator(`footer a[href="${href}"]`).first().click();
    await settle();
    await page.goBack();
    await page.waitForTimeout(300);
    await settle();
    const back = await page.evaluate(() => ({ home: !!document.getElementById('hero-title'), hash: location.hash }));
    await page.goForward();
    await page.waitForTimeout(300);
    await settle();
    const fwd = await page.evaluate((i) => { const el = document.getElementById(i); return { top: el ? Math.round(el.getBoundingClientRect().top) : null, hash: location.hash }; }, id);
    check(`Back then Forward around footer link ${href} returns home, then to the section`, back.home && fwd.top !== null && fwd.top >= 50 && fwd.top < 400, `${JSON.stringify(back)} ${JSON.stringify(fwd)}`);
  }

  // Assessment in-page link and back/forward history
  await go('assessment');
  const mediaLink = page.locator('main a[href="#media-upload"]');
  if (await mediaLink.count()) {
    await mediaLink.first().click();
    await settle();
    const top = await page.evaluate(() => Math.round(document.getElementById('media-upload').getBoundingClientRect().top));
    check('Symptom check "#media-upload" link scrolls to the upload section', top >= 50 && top < 400, top);
  }
  await go('');
  await page.locator('header button[aria-controls="site-menu"]').count();
  await page.evaluate(() => { location.hash = 'doppler'; });
  await page.waitForTimeout(400);
  await page.evaluate(() => { location.hash = 'treatments'; });
  await page.waitForTimeout(400);
  await page.goBack();
  await page.waitForTimeout(500);
  const backH1 = await h1();
  await page.goForward();
  await page.waitForTimeout(500);
  const fwdH1 = await h1();
  check('Browser Back and Forward move between views', /Doppler/i.test(backH1.join()) && /Treatment/i.test(fwdH1.join()), `${backH1} / ${fwdH1}`);

  // ---------------------------------------------------------------- Emergency links
  await page.setViewportSize({ width: 360, height: 640 });
  await go('');
  const tel = await page.evaluate(() => [...document.querySelectorAll('a[href^="tel:"]')].filter((a) => a.offsetParent).map((a) => { const r = a.getBoundingClientRect(); return { href: a.getAttribute('href'), w: Math.round(r.width), h: Math.round(r.height), inMain: !!a.closest('main'), inFooter: !!a.closest('footer') }; }));
  check('Home has tap-to-call links for 112 and 108, each at least 44px tall', tel.length >= 4 && tel.every((t) => /^tel:(112|108)$/.test(t.href) && t.h >= 44 && t.w >= 44), JSON.stringify(tel));
  const telNames = await page.evaluate(() => [...document.querySelectorAll('#urgent-help a[href^="tel:"]')].map((a) => a.textContent.replace(/\s+/g, ' ').trim()));
  check('Urgent strip call buttons carry the number and service in their accessible text', telNames.length === 2 && /112/.test(telNames[0]) && /108/.test(telNames[1]) && /ambulance/i.test(telNames[1]) && /emergency/i.test(telNames[0]), telNames.join(' | '));
  const urgentTop = await page.evaluate(() => Math.round(document.getElementById('urgent-help').getBoundingClientRect().top));
  check('360x640: urgent strip starts inside the first screen', urgentTop < 640, urgentTop);
  const firstScreen = await page.evaluate(() => ({
    cta: Math.round(document.querySelector('main .mv-btn-primary').getBoundingClientRect().bottom),
    calls: Math.round(Math.max(...[...document.querySelectorAll('#urgent-help a[href^="tel:"]')].map((a) => a.getBoundingClientRect().bottom))),
  }));
  check('360x640: "Check your symptoms" ends at or above 340px', firstScreen.cta <= 340, firstScreen.cta);
  check('360x640: both emergency call buttons are on the first screen', firstScreen.calls <= 640, firstScreen.calls);
  for (const [w, h] of [[640, 360], [844, 390]]) {
    await page.setViewportSize({ width: w, height: h });
    await go('');
    const b = await page.evaluate(() => Math.round(document.querySelector('main .mv-btn-primary').getBoundingClientRect().bottom));
    check(`${w}x${h} landscape: "Check your symptoms" is visible without scrolling`, b <= h, b);
  }
  await page.setViewportSize({ width: 360, height: 640 });
  await go('');
  const covered = await page.evaluate(async () => {
    const u = document.getElementById('urgent-help');
    const hits = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      const ur = u.getBoundingClientRect();
      for (const e of document.querySelectorAll('body *')) {
        const pos = getComputedStyle(e).position;
        if (pos !== 'fixed' && pos !== 'sticky') continue;
        // The sticky site header is the page's own top edge; content scrolls beneath it.
        if (e.closest('body > #root > div > header')) continue;
        const r = e.getBoundingClientRect();
        if (r.bottom > ur.top && r.top < ur.bottom && r.right > ur.left && r.left < ur.right && r.height > 0 && !u.contains(e) && !e.contains(u)) hits.push(`${e.tagName} at y=${Math.round(y)}`);
      }
    }
    window.scrollTo(0, 0);
    return hits;
  });
  check('No floating, fixed or sticky element other than the site header overlaps the urgent strip at any half-screen scroll stop', covered.length === 0, covered.slice(0, 3).join(', '));
  await page.goto('about:blank');
  await page.goto(BASE + '#urgent-help');
  await page.waitForTimeout(400);
  await settle();
  const anchorTop = await page.evaluate(() => ({ top: Math.round(document.getElementById('urgent-help').getBoundingClientRect().top), header: Math.round(document.querySelector('header').getBoundingClientRect().bottom) }));
  check('Anchor to the urgent strip lands below the header', anchorTop.top >= anchorTop.header, JSON.stringify(anchorTop));

  const ctaHeights = [];
  for (const [w, h] of [[360, 640], [768, 1024], [1024, 768], [1920, 1080]]) {
    await page.setViewportSize({ width: w, height: h });
    await go('');
    ctaHeights.push(`${w}:${await page.evaluate(() => Math.round(document.querySelector('main .mv-btn-primary').getBoundingClientRect().height))}`);
  }
  check('"Check your symptoms" stays on one line (48px tall) from 360 to 1920px', ctaHeights.every((x) => x.endsWith(':48')), ctaHeights.join(' '));

  // ---------------------------------------------------------------- Motion
  for (const v of ['', 'learn']) {
    await go(v, 1500);
    const infinite = await page.evaluate(() => document.getAnimations().filter((x) => x.effect && x.effect.getTiming().iterations === Infinity).map((x) => x.animationName || x.constructor.name));
    check(`#${v || '(home)'}: no infinite animations in the M2 surfaces`, infinite.length === 0, infinite.join(', '));
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const v of ['', 'learn', 'doppler']) {
    await go(v, 900);
    const running = await page.evaluate(() => document.getAnimations().filter((x) => x.playState === 'running').map((x) => `${x.animationName || 'anim'}:${x.effect.getTiming().duration}`));
    const smooth = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    check(`Reduced motion #${v || '(home)'}: no running animations and no smooth scrolling`, running.length === 0 && smooth === 'auto', `${running.join(', ')} scroll-behavior=${smooth}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go('');
  await page.locator('header button[aria-controls="site-menu"]').click();
  await page.waitForTimeout(50);
  const sheetAnim = await page.evaluate(() => document.getAnimations().filter((x) => x.playState === 'running').length);
  check('Reduced motion: the menu sheet opens without animation', sheetAnim === 0, sheetAnim);
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  // ---------------------------------------------------------------- Reflow
  for (const w of [320]) {
    await page.setViewportSize({ width: w, height: 640 });
    for (const v of ['', 'learn', 'journey', 'assessment', 'doppler', 'treatments', 'specialists', 'dashboard']) {
      await go(v);
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
      check(`${w}px #${v || '(home)'}: no horizontal scrolling`, o.sw <= o.iw, JSON.stringify(o));
    }
    await go('');
    await page.locator('header button[aria-controls="site-menu"]').click();
    await page.waitForTimeout(300);
    const o = await page.evaluate(() => { const d = document.getElementById('site-menu'); return { sw: d.scrollWidth, cw: d.clientWidth }; });
    check(`${w}px: menu sheet content fits without sideways scrolling`, o.sw <= o.cw, JSON.stringify(o));
    await page.keyboard.press('Escape');
  }

  // ---------------------------------------------------------------- Guide and demo request entry points
  await page.setViewportSize({ width: 1280, height: 800 });
  await go('');
  const before = externalRequests.length;
  await page.locator('header button', { hasText: 'Ask the guide' }).click();
  await page.waitForTimeout(400);
  const guideOpen = await page.evaluate(() => !!document.getElementById('assistant-dialog-title'));
  check('Header "Ask the guide" opens the educational guide', guideOpen);
  const input = page.locator('[role="dialog"] input, [role="dialog"] textarea').first();
  if (await input.count()) {
    await input.fill('What does SFJ reflux mean?');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1200);
  }
  check('Using the guide makes no external network request', externalRequests.length === before, externalRequests.slice(before).join(', '));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.locator('header button', { hasText: 'Request an appointment (demo)' }).click();
  await page.waitForTimeout(400);
  check('Header "Request an appointment (demo)" opens the demo request', await page.evaluate(() => !!document.getElementById('booking-dialog-title')));
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1280, height: 800 });
  await go('');
  const primaries = await page.evaluate(async () => {
    const worst = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      const n = [...document.querySelectorAll('.mv-btn-primary')].filter((b) => { const r = b.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.height > 0; }).length;
      if (n > 1) worst.push(`${n} at y=${Math.round(y)}`);
    }
    return worst;
  });
  check('Home: at most one primary button in view at each half-screen scroll stop (1280x800)', primaries.length === 0, primaries.join(', '));

  check('No console errors during the run', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));
  const passed = results.filter((r) => r.pass).length;
  return JSON.stringify({ capturedAt: new Date().toISOString(), passed, failed: results.length - passed, results });
}
