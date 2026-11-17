(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Стиль: тема, шрифт, анимации ---------- */
  function setTheme(t) {
    root.setAttribute('data-theme', t); store.set('md-theme', t);
    document.querySelectorAll('[data-set-theme]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.setTheme === t); });
  }
  function setFont(f) {
    root.setAttribute('data-font', f); store.set('md-font', f);
    document.querySelectorAll('[data-set-font]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.setFont === f); });
  }
  var motion = document.getElementById('lab-motion');
  function setMotion(on) {
    root.classList.toggle('no-motion', !on); store.set('md-motion', on ? '1' : '0');
    if (motion) motion.checked = on;
  }
  var params = new URLSearchParams(location.search);
  setTheme(params.get('theme') || store.get('md-theme') || 'caramel');
  setFont(params.get('font') || store.get('md-font') || 'cormorant');
  setMotion(store.get('md-motion') !== '0');

  document.querySelectorAll('[data-set-theme]').forEach(function (b) { b.addEventListener('click', function () { setTheme(b.dataset.setTheme); }); });
  document.querySelectorAll('[data-set-font]').forEach(function (b) { b.addEventListener('click', function () { setFont(b.dataset.setFont); }); });
  if (motion) motion.addEventListener('change', function () { setMotion(motion.checked); });

  var labToggle = document.querySelector('.lab__toggle');
  var labPanel = document.getElementById('lab-panel');
  if (labToggle) labToggle.addEventListener('click', function () {
    var open = labPanel.hasAttribute('hidden');
    if (open) labPanel.removeAttribute('hidden'); else labPanel.setAttribute('hidden', '');
    labToggle.setAttribute('aria-expanded', open);
  });

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

  /* ---------- Счётчик ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var to = +el.dataset.count;
    var ob = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; ob.disconnect();
      if (root.classList.contains('no-motion')) return;
      var t0 = null;
      function step(t) { if (!t0) t0 = t; var k = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
    ob.observe(el);
  });

  /* ---------- Слайдер первого экрана ---------- */
  var slides = document.querySelectorAll('[data-slider] .slide');
  var num = document.querySelector('[data-num]');
  var i = 0, timer;
  function go(n) {
    slides[i].classList.remove('is-active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    num.textContent = i + 1;
  }
  function auto() { clearInterval(timer); timer = setInterval(function () { if (!root.classList.contains('no-motion')) go(i + 1); }, 7000); }
  document.querySelector('[data-next]').addEventListener('click', function () { go(i + 1); auto(); });
  document.querySelector('[data-prev]').addEventListener('click', function () { go(i - 1); auto(); });
  auto();

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
