# Orchid Cafe website

Static site: serve this folder with any web server (e.g. `npx serve .` or `python3 -m http.server`) and open index.html.
Libraries load from CDN: GSAP 3.12.5 + ScrollTrigger, Three.js r128, Lenis 1.1.13.
Fonts (Google Fonts): Caprasimo (wordmark), Anton (display), Instrument Sans (body), JetBrains Mono (labels).

## Sections
1. Hero: WebGL photo switcher with a liquid reveal: the new photo sweeps in sideways behind a wobbly, rippled edge (fragment shader in `initHeroGL`) (cursor left/right on desktop, tap/auto on touch). Photos in `heroImgs` + matching `.thumb` buttons.
2. Mission quote (moved up)
3. Asymmetric menu: six `.dish` tiles (d1-d6), positions in CSS. "See the full menu" opens the `#sheet` dialog with every item and price.
4. Reviews: pinned grid-paper stage; neo-brutalist review cards in `#track` travel upward on alternate sides and end on the `#gift` flip card (dip, spring-flip, confetti drawn on `#confetti`).
5. Visit: address, live open/closed status (Sydney time), copy buttons.
6. Footer.
