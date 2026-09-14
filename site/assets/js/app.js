/* ==========================================================================
   app.js — ابزارهای مشترک و ناوبری
   این فایل باید پیش از بقیه اسکریپت‌ها بارگذاری شود.
   ========================================================================== */

window.NTF = window.NTF || {};

(function (NTF) {
  'use strict';

  /** تبدیل ارقام لاتین به فارسی، همراه با جداکننده هزارگان «٬» */
  NTF.toFa = function (value, grouped) {
    var s = String(value);
    if (grouped) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
    return s.replace(/\d/g, function (d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  };

  /** آیا کاربر انیمیشن کمتر خواسته است */
  NTF.reducedMotion = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /** اجرای تابع پس از آماده شدن DOM */
  NTF.ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  /* ------------------------------------------------ منوی موبایل */
  NTF.ready(function () {
    var burger = document.querySelector('[data-burger]');
    var menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    function setOpen(open) {
      menu.dataset.open = open ? 'true' : 'false';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    burger.addEventListener('click', function () {
      setOpen(menu.dataset.open !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  });

  /* ------------------------------------------------ تب‌های دسته‌بندی */
  NTF.ready(function () {
    var lists = document.querySelectorAll('[role="tablist"]');
    lists.forEach(function (list) {
      list.addEventListener('click', function (e) {
        var tab = e.target.closest('[role="tab"]');
        if (!tab) return;
        list.querySelectorAll('[role="tab"]').forEach(function (t) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
      });
    });
  });
})(window.NTF);
