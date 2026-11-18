(function () {
  var root = document.documentElement;

  /* ---------- Мобильное меню ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  function closeNav() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Открыть меню'); }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });

  /* ---------- Тень шапки ---------- */
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); parallax(); }

  /* ---------- Параллакс фото ---------- */
  var pEls = document.querySelectorAll('.parallax');
  function parallax() {
    if (root.classList.contains('no-motion') || window.innerWidth < 860) { pEls.forEach(function (el) { el.style.transform = ''; }); return; }
    pEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var off = (r.top + r.height / 2 - window.innerHeight / 2) * -0.06;
      el.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Появление блоков ---------- */
  var groups = {};
  document.querySelectorAll('.reveal').forEach(function (el) {
    var p = el.parentElement; var key = p ? (p.__rid || (p.__rid = Math.random())) : 0;
    groups[key] = (groups[key] || 0) + 1;
    el.style.setProperty('--d', Math.min(groups[key] - 1, 5) * 0.08 + 's');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Заявка → WhatsApp ---------- */
  var form = document.getElementById('lead-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = form.phone.value.trim();
    var err = document.getElementById('f-err');
    if (!phone) { err.hidden = false; form.phone.focus(); return; }
    err.hidden = true;
    var type = (form.querySelector('input[name=type]:checked') || {}).value || '';
    var text = 'Здравствуйте, Маржан! ' +
      (form.name.value.trim() ? 'Меня зовут ' + form.name.value.trim() + '. ' : '') +
      'Тип дела: ' + type + '. ' +
      (form.msg.value.trim() ? 'Ситуация: ' + form.msg.value.trim() + '. ' : '') +
      'Мой телефон: ' + phone + '.';
    window.open('https://wa.me/77007710399?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
