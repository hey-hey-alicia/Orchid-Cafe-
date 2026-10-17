/* Orchid Cafe — interactions + motion (GSAP, ScrollTrigger, Lenis) */
(function () {
  // ---- Heritage drawer ----
  var drawer = document.getElementById('oc-drawer');
  var lastFocus = null;
  function openStory() { lastFocus = document.activeElement; drawer.hidden = false; document.documentElement.style.overflow = 'hidden'; if (window.__lenis) window.__lenis.stop(); var c = drawer.querySelector('aside [data-close-story]'); if (c) c.focus(); }
  function closeStory() { drawer.hidden = true; document.documentElement.style.overflow = ''; if (window.__lenis) window.__lenis.start(); if (lastFocus) lastFocus.focus(); }
  document.querySelectorAll('[data-open-story]').forEach(function (b) { b.addEventListener('click', openStory); });
  document.querySelectorAll('[data-close-story]').forEach(function (b) { b.addEventListener('click', closeStory); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && !drawer.hidden) closeStory(); });

  // ---- Boarding-pass promo ----
  var stub = document.getElementById('oc-stub'), flip = document.getElementById('oc-flip'), ticket = document.getElementById('oc-ticket'), reset = document.getElementById('oc-reset'), t;
  if (stub) stub.addEventListener('click', function () {
    stub.classList.add('is-torn'); ticket.classList.remove('oc-jitter'); reset.hidden = false;
    clearTimeout(t); t = setTimeout(function () { flip.classList.add('is-flipped'); }, 500);
  });
  if (reset) reset.addEventListener('click', function () {
    clearTimeout(t); flip.classList.remove('is-flipped'); stub.classList.remove('is-torn'); ticket.classList.add('oc-jitter'); reset.hidden = true;
  });

  // ---- Opening-hours picker ----
  var msg = document.getElementById('oc-daymsg');
  document.querySelectorAll('.oc-day').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.oc-day').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var d = b.dataset.day, open = b.dataset.open === '1';
      msg.textContent = open ? d + ': open 7:30am – 2:30pm.' : d + ': closed — see you ' + (d === 'Sun' ? 'Monday' : 'Friday') + '.';
    });
  });

  // ---- Motion ----
  function initMotion() {
    const g = window.gsap, ST = window.ScrollTrigger, L = window.Lenis;
    if (!g || !ST) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    g.registerPlugin(ST);
    const se = document.scrollingElement || document.documentElement;
    const scrollable = true;

    // Lenis smooth scroll — only when the page actually scrolls (focused / full-window view)
    if (L && scrollable) {
      const lenis = window.__lenis = new L({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      
      lenis.on('scroll', ST.update);
      g.ticker.add((t) => lenis.raf(t * 1000));
      g.ticker.lagSmoothing(0);
      const onClick = (e) => {
        const a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        const el = document.querySelector(a.getAttribute('href'));
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -8, duration: 1.4 });
      };
      document.addEventListener('click', onClick);
    }

    g.context(() => {
      const q = (s) => g.utils.toArray(s);
      const ease = 'expo.out';

      // ---- HERO: intro timeline ----
      const bowl = document.querySelector('.oc-bowlwrap');
      if (bowl) g.set(bowl, { xPercent: -50, x: 0 });
      const intro = g.timeline({ defaults: { ease } });
      intro
        .from('.oc-hero > img', { scale: 1.18, duration: 2.2, ease: 'power3.out' }, 0)
        .from('.oc-hero nav', { y: -30, autoAlpha: 0, duration: 1 }, 0.2)
        .from('.oc-hero h1', { yPercent: 40, autoAlpha: 0, duration: 1.4 }, 0.3)
        .from(bowl, { yPercent: 40, rotate: -40, autoAlpha: 0, duration: 1.8 }, 0.45)
        .from('.oc-herobottom > div > *', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.8);

      // hero parallax while scrolling away
      g.to('.oc-hero > img', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } });
      if (bowl) g.to(bowl, { yPercent: -16, rotate: 25, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } });

      // ---- QUOTE: headline rises, heritage card slides in ----
      q('#story h2').forEach((h) => g.from(h, { y: 70, autoAlpha: 0, duration: 1.2, ease, scrollTrigger: { trigger: h, start: 'top 85%' } }));
      q('.oc-quotecta').forEach((b) => g.from(b, { x: 80, rotate: 4, autoAlpha: 0, duration: 1.2, ease, scrollTrigger: { trigger: b, start: 'top 90%' } }));

      // ---- SPECIALS: heading + postcards dealt onto the table ----
      g.from('#menu h2, #menu h2 + *, #menu .oc-cta', { y: 50, autoAlpha: 0, duration: 1, ease, stagger: 0.08, scrollTrigger: { trigger: '#menu', start: 'top 80%' } });
      ST.batch('.oc-pc', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => g.from(els, { y: 90, autoAlpha: 0, duration: 1.1, ease, stagger: 0.1, overwrite: true })
      });
      q('.oc-pc img').forEach((img) => g.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

      // ---- PROMO: ticket glides in ----
      const stub = document.querySelector('.oc-stub');
      const promo = stub && stub.closest('section');
      if (promo) {
        g.timeline({ scrollTrigger: { trigger: promo, start: 'top 80%' }, defaults: { ease } })
          .from(promo.firstElementChild, { y: 60, autoAlpha: 0, duration: 1 })
          .from(promo.querySelectorAll('h2, .oc-stub'), { x: 60, autoAlpha: 0, duration: 1, stagger: 0.12 }, '-=0.6');
      }

      // ---- VISIT: cards rise, map route draws ----
      g.from('#visit > div > *', { y: 70, autoAlpha: 0, duration: 1.1, ease, stagger: 0.12, scrollTrigger: { trigger: '#visit', start: 'top 80%' } });

      // ---- FOOTER: wordmark grows up out of the field ----
      const foot = document.querySelector('footer');
      if (foot) {
        g.from(foot.firstElementChild, { y: 80, autoAlpha: 0, duration: 1.2, ease, scrollTrigger: { trigger: foot, start: 'top 90%' } });
        const word = q('footer div').find((d) => /^orchid/.test((d.textContent || '').trim()) && d.children.length <= 1);
        if (word) g.from(word, { yPercent: 45, ease: 'none', scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      }
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
    window.addEventListener('load', () => ST.refresh(), { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion); else initMotion();
})();
