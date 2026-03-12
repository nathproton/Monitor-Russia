/**
 * nav.js — Proximity-based scale effect for nav links.
 * The closer the cursor to the centre of a tab, the larger it grows.
 */

(function () {
  const MAX_SCALE  = 1.46;   // max growth factor at cursor = centre
  const RADIUS     = 110;    // effect radius in px (distance from centre)
  const EASE_POWER = 0.75;   // < 1 → wider soft zone; > 1 → tighter peak

  const links = Array.from(document.querySelectorAll('.nav-link'));

  // Cache bounding rects once; recalculate on resize
  let rects = [];

  function cacheRects () {
    rects = links.map(l => l.getBoundingClientRect());
  }

  cacheRects();
  window.addEventListener('resize', cacheRects);

  document.addEventListener('mousemove', function (e) {
    const mx = e.clientX;
    const my = e.clientY;

    links.forEach(function (link, i) {
      const r  = rects[i];
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;

      const dx   = mx - cx;
      const dy   = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let scale;
      if (dist < RADIUS) {
        const t = 1 - dist / RADIUS;                          // 0 → 1
        scale   = 1 + (MAX_SCALE - 1) * Math.pow(t, EASE_POWER);
      } else {
        scale = 1;
      }

      link.style.transform = 'scale(' + scale.toFixed(4) + ')';
    });
  });

  // Reset when cursor leaves the navbar entirely
  document.querySelector('.navbar').addEventListener('mouseleave', function () {
    links.forEach(function (link) {
      link.style.transform = 'scale(1)';
    });
  });
})();
