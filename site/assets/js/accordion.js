/* ==========================================================================
   accordion.js — سوالات متداول و ستون‌های فوتر در موبایل
   ارتفاع با grid-template-rows انیمیت می‌شود تا نیازی به اندازه ثابت نباشد.
   ========================================================================== */

(function (NTF) {
  'use strict';

  function bind(toggle) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      // در یک گروه، فقط یکی باز بماند
      var group = toggle.closest('[data-accordion]');
      if (group && !open) {
        group.querySelectorAll('[aria-expanded="true"]').forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          var op = document.getElementById(other.getAttribute('aria-controls'));
          if (op) op.dataset.open = 'false';
        });
      }
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.dataset.open = open ? 'false' : 'true';
    });
  }

  NTF.ready(function () {
    document.querySelectorAll('[data-acc-toggle]').forEach(bind);

    /* ستون‌های فوتر: زیر ۶۸۰ پیکسل آکاردئون، بالاتر همیشه باز */
    var footerToggles = document.querySelectorAll('[data-fcol-toggle]');
    if (!footerToggles.length) return;

    var mq = window.matchMedia('(max-width: 680px)');

    function apply() {
      footerToggles.forEach(function (t) {
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        if (mq.matches) {
          if (!t.dataset.touched) {
            t.setAttribute('aria-expanded', 'false');
            panel.dataset.open = 'false';
          }
        } else {
          t.setAttribute('aria-expanded', 'true');
          panel.dataset.open = 'true';
        }
      });
    }

    footerToggles.forEach(function (t) {
      t.addEventListener('click', function () {
        if (!mq.matches) return;
        t.dataset.touched = '1';
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        var open = t.getAttribute('aria-expanded') === 'true';
        t.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.dataset.open = open ? 'false' : 'true';
      });
    });

    mq.addEventListener('change', function () {
      footerToggles.forEach(function (t) { delete t.dataset.touched; });
      apply();
    });
    apply();
  });
})(window.NTF);
