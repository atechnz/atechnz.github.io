// Jumbo-Holdsworth Trail Race — small site behaviours (no dependencies)
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    var close = menu.querySelector('.close');
    var focusables = menu.querySelectorAll('button, a');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      menu.classList.add('open'); document.body.style.overflow = 'hidden';
      btn.setAttribute('aria-expanded', 'true');
      (close || focusables[0]).focus();
    });
    function shut() { menu.classList.remove('open'); document.body.style.overflow = ''; btn.setAttribute('aria-expanded', 'false'); }
    function shutAndReturn() { shut(); btn.focus(); }
    close && close.addEventListener('click', shutAndReturn);
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
    // Escape closes; Tab wraps within the open menu
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('open')) return;
      if (e.key === 'Escape') { shutAndReturn(); return; }
      if (e.key !== 'Tab' || !focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // Photo strip arrows + gentle auto-advance
  document.querySelectorAll('.strip').forEach(function (strip) {
    var track = strip.querySelector('.strip-track');
    if (!track) return;
    function step(dir) {
      var item = track.querySelector('img');
      var w = item ? item.getBoundingClientRect().width + 4 : track.clientWidth / 3;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    var prev = strip.querySelector('.strip-btn.prev');
    var next = strip.querySelector('.strip-btn.next');
    prev && prev.addEventListener('click', function () { step(-1); });
    next && next.addEventListener('click', function () { step(1); });

    // Auto-advance: off for reduced-motion users; pauses on hover, focus, touch, or when hidden
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var timer = null, visible = false;
    function start() { if (!timer && visible && !document.hidden) timer = setInterval(function () { step(1); }, 4500); }
    function stop() { clearInterval(timer); timer = null; }
    strip.addEventListener('mouseenter', stop);
    strip.addEventListener('mouseleave', start);
    strip.addEventListener('focusin', stop);
    strip.addEventListener('focusout', start);
    track.addEventListener('touchstart', stop, { passive: true });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(strip);
    } else { visible = true; start(); }
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
