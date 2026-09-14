/* ==========================================================================
   sliders.js — اسلایدرهای افقی (کاروسل محصولات و نظرات مشتریان)
   بر پایه scroll-snap بومی مرورگر؛ با RTL سازگار است و بدون
   جاوااسکریپت هم با کشیدن انگشت کار می‌کند.
   ========================================================================== */

(function (NTF) {
  'use strict';

  function createSlider(root) {
    var rail = root.querySelector('[data-rail]');
    if (!rail) return;

    var prevBtn = root.querySelector('[data-dir="prev"]');
    var nextBtn = root.querySelector('[data-dir="next"]');
    var dotsBox = root.querySelector('[data-dots]');
    var slides = Array.prototype.slice.call(rail.children);
    if (!slides.length) return;

    // در RTL حرکت رو به جلو، scrollLeft را کم می‌کند
    var forward = getComputedStyle(rail).direction === 'rtl' ? -1 : 1;

    function step() {
      var first = slides[0];
      var gap = parseFloat(getComputedStyle(rail).columnGap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function maxScroll() {
      return Math.max(rail.scrollWidth - rail.clientWidth, 1);
    }

    function position() {
      return Math.abs(rail.scrollLeft); // بدون وابستگی به علامت در RTL
    }

    /** تعداد اسلایدهای هم‌زمان قابل دیدن */
    function perView() {
      return Math.max(1, Math.round(rail.clientWidth / step()));
    }

    function pageCount() {
      return Math.max(1, slides.length - perView() + 1);
    }

    function move(dir) {
      rail.scrollBy({ left: forward * dir * step(), behavior: 'smooth' });
    }

    /* ---------------- دات‌ها ---------------- */
    var dots = [];
    function buildDots() {
      if (!dotsBox) return;
      dotsBox.innerHTML = '';
      dots = [];
      var n = pageCount();
      if (n < 2) return;
      for (var i = 0; i < n; i++) {
        (function (index) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', 'رفتن به اسلاید ' + NTF.toFa(index + 1));
          b.addEventListener('click', function () {
            rail.scrollTo({ left: forward * index * step(), behavior: 'smooth' });
          });
          dotsBox.appendChild(b);
          dots.push(b);
        })(i);
      }
    }

    function sync() {
      var pos = position();
      var max = maxScroll();

      if (prevBtn) prevBtn.disabled = pos <= 2;
      if (nextBtn) nextBtn.disabled = pos >= max - 2;

      if (dots.length) {
        var index = Math.round(pos / step());
        if (index > dots.length - 1) index = dots.length - 1;
        dots.forEach(function (d, i) {
          d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { move(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { move(1); });

    rail.addEventListener('scroll', function () {
      window.requestAnimationFrame(sync);
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); sync(); }, 160);
    });

    buildDots();
    sync();
  }

  NTF.ready(function () {
    document.querySelectorAll('[data-slider]').forEach(createSlider);
  });
})(window.NTF);
