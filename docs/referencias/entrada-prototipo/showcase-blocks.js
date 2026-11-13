(() => {
  const phone = document.querySelector('.showcase-phone');
  const screen = phone?.querySelector('.phone-screen');
  const buttons = Array.from(document.querySelectorAll('[data-preview-block]'));
  if (!screen || !buttons.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 1024px)');
  const modelStep = document.body.classList.contains('model-step');
  const group = buttons[0].parentElement;
  const demo = document.createElement('div');
  demo.className = 'block-demo';
  demo.hidden = true;
  screen.appendChild(demo);
  const announcement = document.createElement('span');
  announcement.className = 'sr-only';
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  group.appendChild(announcement);
  const names = { text: 'Texto', link: 'Link', image: 'Imagem', calendar: 'Calendário' };
  const examples = {
    text: '<div class="demo-text"><span class="demo-eyebrow">UM POUCO SOBRE NÓS</span><h2>Ideias que conectam.</h2><p class="demo-typing"></p></div>',
    link: '<div class="demo-link"><span class="material-icons-round" aria-hidden="true">language</span><span>Conheça nosso trabalho</span><span class="material-icons-round" aria-hidden="true">north_east</span></div><p class="demo-caption">Seu próximo destino, a um clique.</p>',
    image: '<div class="demo-image"><svg viewBox="0 0 260 130" role="img" aria-label="Ilustração de montanhas ao pôr do sol"><defs><linearGradient id="demo-sky" x2="0" y2="1"><stop stop-color="#dcc9f8"/><stop offset="1" stop-color="#ffdec9"/></linearGradient></defs><rect width="260" height="130" fill="url(#demo-sky)"/><circle cx="191" cy="40" r="20" fill="#fff2d3"/><path d="M0 112 75 36 153 130H0" fill="#8b83b4"/><path d="m68 130 86-75 106 75" fill="#b7a5cd"/><path d="m147 130 64-46 49 33v13" fill="#7b8f9d"/></svg><span>Um olhar para novas possibilidades.</span></div>',
    calendar: '<div class="demo-calendar"><div class="demo-date"><strong>24</strong><span>NOV</span></div><div><h2>Vamos conversar?</h2><p>Reunião de 30 minutos</p></div><span class="material-icons-round" aria-hidden="true">event_available</span></div><div class="demo-time"><span class="material-icons-round" aria-hidden="true">schedule</span>Escolha o melhor horário para você</div>'
  };
  let typingTimer;
  let autoTimer;
  let reveal;
  let current = -1;
  let manuallySelected = false;
  function selectBlock(value, manual = false) {
    window.clearTimeout(typingTimer);
    if (reveal) reveal.cancel();
    current = buttons.findIndex(button => button.dataset.previewBlock === value);
    buttons.forEach(button => {
      const selected = button.dataset.previewBlock === value;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const target = phone.dataset.theme === 'pixel' ? phone.querySelector('.pixel-demo-slot') : screen;
    (target || screen).appendChild(demo);
    phone.classList.add('has-block-demo');
    demo.hidden = false;
    demo.dataset.block = value;
    demo.innerHTML = examples[value];
    demo.setAttribute('aria-label', 'Demonstração do bloco ' + names[value]);
    if (manual) announcement.textContent = 'Bloco ' + names[value] + ' exibido na prévia do celular.';
    if (!reducedMotion) {
      reveal = demo.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: 'ease-out' });
    }
    if (value === 'text') {
      const text = 'Transformamos boas ideias em experiências digitais. Conheça nossos projetos e faça parte dessa história.';
      const target = demo.querySelector('.demo-typing');
      if (reducedMotion) target.textContent = text;
      else {
        let index = 0;
        function type() {
          target.textContent = text.slice(0, ++index);
          if (index < text.length) typingTimer = window.setTimeout(type, 22);
        }
        type();
      }
    }
  }
  function schedule(delay = 6500) {
    window.clearTimeout(autoTimer);
    if (reducedMotion || document.body.classList.contains('model-step') || manuallySelected) return;
    autoTimer = window.setTimeout(() => {
      if (!document.hidden && desktop.matches && !group.matches(':hover, :focus-within') && !phone.classList.contains('is-loading')) {
        selectBlock(buttons[(current + 1) % buttons.length].dataset.previewBlock);
      }
      schedule();
    }, delay);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    document.dispatchEvent(new Event('showcase-manual-interaction'));
    selectBlock(button.dataset.previewBlock, true);
  }));
  document.addEventListener('showcase-manual-interaction', () => {
    manuallySelected = true;
    window.clearTimeout(autoTimer);
  });
  document.addEventListener('onboarding-step-change', event => {
    window.clearTimeout(autoTimer);
    if (event.detail === 4) {
      window.clearTimeout(typingTimer);
      if (reveal) reveal.cancel();
      phone.classList.remove('has-block-demo');
      demo.hidden = true;
      buttons.forEach(button => { button.classList.remove('selected'); button.setAttribute('aria-pressed', 'false'); });
    } else schedule();
  });
  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(autoTimer);
    if (!document.hidden) schedule();
  });
  window.addEventListener('pagehide', () => { window.clearTimeout(autoTimer); window.clearTimeout(typingTimer); });
  window.addEventListener('pageshow', () => schedule());
  schedule(1800);
})();
