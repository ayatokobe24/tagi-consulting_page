(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = document.querySelector('.l-header__toggle');
  var nav = document.getElementById('global-nav');
  var toggleLabel = toggle ? toggle.querySelector('.u-visually-hidden') : null;
  var desktopQuery = window.matchMedia('(min-width: 1024px)');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (toggleLabel) toggleLabel.textContent = open ? 'メニューを閉じる' : 'メニューを開く';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !header.contains(event.target)) setMenu(false);
    });

    desktopQuery.addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var fixedCta = document.querySelector('.c-fixed-cta');
  var hero = document.getElementById('top');
  var contact = document.getElementById('contact');
  if (fixedCta && hero && contact && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var contactVisible = false;
    var update = function () {
      var show = !heroVisible && !contactVisible;
      fixedCta.classList.toggle('is-visible', show);
      fixedCta.setAttribute('aria-hidden', String(!show));
      fixedCta.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      });
      update();
    }).observe(hero);
    new IntersectionObserver(function (entries) {
      contactVisible = entries[0].isIntersecting;
      update();
    }).observe(contact);
  }

  document.querySelectorAll('[data-copy-target]').forEach(function (button) {
    var target = document.getElementById(button.getAttribute('data-copy-target'));
    var status = button.parentElement.querySelector('[role="status"]');
    if (!target) return;

    button.addEventListener('click', function () {
      var text = target.textContent.trim();
      var done = function (ok) {
        if (status) status.textContent = ok ? 'メールアドレスをコピーしました' : 'コピーできませんでした。アドレスを選択してコピーしてください';
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        return;
      }

      var range = document.createRange();
      range.selectNodeContents(target);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      selection.removeAllRanges();
      done(ok);
    });
  });
})();
