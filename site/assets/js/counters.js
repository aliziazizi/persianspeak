/* ==========================================================================
   counters.js — انیمیشن شمارش اعداد بخش آمار
   عدد نهایی از قبل در HTML نوشته شده؛ این اسکریپت فقط هنگام دیده‌شدن
   آن را از صفر بالا می‌آورد. بدون جاوااسکریپت هم عدد درست دیده می‌شود.
   ========================================================================== */

(function (NTF) {
  'use strict';

  NTF.ready(function () {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    // احترام به تنظیم «انیمیشن کمتر» — عدد نهایی همان‌جا می‌ماند
    if (NTF.reducedMotion() || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = parseInt(el.dataset.count, 10);
      var duration = 1500;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        // easeOutCubic — سریع شروع می‌شود و نرم می‌ایستد
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = NTF.toFa(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(frame);
      }

      el.textContent = NTF.toFa(0);
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.4 });

    nodes.forEach(function (el) { io.observe(el); });
  });
})(window.NTF);
