(() => {
  const phone = document.querySelector('.showcase-phone');
  const buttons = Array.from(document.querySelectorAll('[data-preview-theme]'));
  if (!phone || !buttons.length) return;
  const names = { basic: 'Aurora', sunset: 'Rosa', mint: 'Menta', pixel: 'PixelMaster' };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modelStep = document.body.classList.contains('model-step');
  const unified = document.body.classList.contains('onboarding');
  const screen = phone.querySelector('.phone-screen');
  if (screen && !screen.querySelector('.pixel-template')) {
    const originalAvatar = screen.querySelector('img');
    const template = document.createElement('div');
    template.className = 'pixel-template';
    template.innerHTML = '<img class="pixel-avatar" alt="Avatar de PixelMaster" /><h1>PixelMaster <span class="material-icons-round" aria-label="Verificado">verified</span></h1><p>Design | Code | Minimalist</p><div class="pixel-links"><div><i class="fab fa-youtube" aria-hidden="true"></i>Latest Video</div><div><i class="fas fa-globe" aria-hidden="true"></i>My Portfolio</div><div><i class="fab fa-twitter" aria-hidden="true"></i>Twitter Threads</div></div><div class="pixel-demo-slot"></div><div class="pixel-socials" aria-label="Instagram, TikTok e e-mail"><i class="fab fa-instagram" aria-hidden="true"></i><i class="fab fa-tiktok" aria-hidden="true"></i><i class="far fa-envelope" aria-hidden="true"></i></div><span class="pixel-brand">SMARTBIO</span>';
    if (originalAvatar) template.querySelector('img').src = originalAvatar.src;
    screen.appendChild(template);
    phone.querySelector('.absolute.top-0')?.classList.add('phone-status');
  }
  let pending;
  let animation;
  function markSelected(value) {
    buttons.forEach(button => {
      const selected = button.dataset.previewTheme === value;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  function apply(value) {
    phone.dataset.theme = value;
    const demo = phone.querySelector('.block-demo');
    if (demo) (value === 'pixel' ? phone.querySelector('.pixel-demo-slot') : screen).appendChild(demo);
    phone.setAttribute('aria-label', 'Prévia do tema ' + names[value]);
    phone.classList.remove('is-loading');
    phone.setAttribute('aria-busy', 'false');
  }
  let initial = phone.dataset.theme || 'basic';
  if (!modelStep) {
    try {
      const saved = localStorage.getItem('smartbio.model');
      if (Object.hasOwn(names, saved)) initial = saved;
    } catch {}
    apply(initial);
  }
  markSelected(initial);
  function selectTheme(value) {
    if (!Object.hasOwn(names, value)) return;
    markSelected(value);
    document.dispatchEvent(new CustomEvent('showcase-theme-change', { detail: value }));
    if (modelStep && !unified) {
      document.dispatchEvent(new CustomEvent('showcase-theme-select', { detail: value }));
      return;
    }
    window.clearTimeout(pending);
    if (animation) animation.cancel();
    if (value === phone.dataset.theme) { apply(value); return; }
    if (reducedMotion) { apply(value); return; }
    phone.classList.add('is-loading');
    phone.setAttribute('aria-busy', 'true');
    pending = window.setTimeout(() => {
      apply(value);
      animation = phone.querySelector('.phone-screen').animate(
        [{ opacity: .35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 300, easing: 'ease-out' }
      );
    }, 550);
  }
  let autoTimer;
  let manuallySelected = false;
  const group = buttons[0].parentElement;
  const desktop = window.matchMedia('(min-width: 1024px)');
  function scheduleNext() {
    if (document.body.classList.contains('model-step') || reducedMotion || manuallySelected) return;
    window.clearTimeout(autoTimer);
    autoTimer = window.setTimeout(() => {
      if (!document.hidden && desktop.matches && !group.matches(':hover, :focus-within')) {
        const current = buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true');
        selectTheme(buttons[(current + 1) % buttons.length].dataset.previewTheme);
      }
      scheduleNext();
    }, 4500);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    document.dispatchEvent(new Event('showcase-manual-interaction'));
    manuallySelected = true;
    window.clearTimeout(autoTimer);
    selectTheme(button.dataset.previewTheme);
  }));
  document.addEventListener('showcase-manual-interaction', () => {
    manuallySelected = true;
    window.clearTimeout(autoTimer);
  });
  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(autoTimer);
    if (!document.hidden) scheduleNext();
  });
  window.addEventListener('pagehide', () => window.clearTimeout(autoTimer));
  window.addEventListener('pageshow', scheduleNext);
  scheduleNext();
  document.addEventListener('showcase-select-theme', event => selectTheme(event.detail));
  document.addEventListener('onboarding-step-change', () => {
    window.clearTimeout(autoTimer);
    scheduleNext();
  });
  if (modelStep && !unified) {
    document.getElementById('model-form').addEventListener('change', event => {
      if (event.target.name === 'model') markSelected(event.target.value);
    });
  }
})();
