(() => {
  const panels = Array.from(document.querySelectorAll('[data-step]'));
  const main = document.getElementById('onboarding-main');
  const phone = document.querySelector('.showcase-phone');
  const cards = document.querySelector('.showcase-cards');
  const heading = document.querySelector('.showcase-heading');
  const description = document.querySelector('.showcase-description');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const copy = [
    ['Seu próximo capítulo,', 'começa com um link.', 'Escolha um nome para reunir suas ideias, seus contatos e tudo o que você faz.'],
    ['Um espaço com', 'a sua identidade.', 'Conte um pouco sobre você. Vamos preparar uma página que combine com seu perfil.'],
    ['Suas conexões,', 'em um só lugar.', 'Reúna suas plataformas favoritas e ajude seu público a encontrar você.'],
    ['Sua página começa', 'a ganhar forma.', 'Escolha um modelo para apresentar seu perfil, seus links e sua identidade.']
  ];
  let step = 1;
  let transitioning = false;
  function animate(element, frames, duration = 280) {
    if (reduced) return Promise.resolve();
    return element.animate(frames, { duration, easing: 'ease-out' }).finished.catch(() => {});
  }
  async function showStep(next, push = true) {
    if (transitioning || next === step || next < 1 || next > 4) return;
    transitioning = true;
    try {
      const old = panels[step - 1];
      const backwards = next < step;
      const changesModelLayout = (step === 4) !== (next === 4);
      await Promise.all([
        animate(old, [{ opacity: 1 }, { opacity: 0, transform: backwards ? 'translateY(8px)' : 'translateY(-8px)' }], 160),
        animate(heading, [{ opacity: 1 }, { opacity: 0 }], 160),
        animate(description, [{ opacity: 1 }, { opacity: 0 }], 160)
      ]);
      const phoneBefore = phone.getBoundingClientRect();
      old.hidden = true;
      step = next;
      const panel = panels[step - 1];
      panel.hidden = false;
      document.body.classList.toggle('model-step', step === 4);
      document.body.classList.toggle('showcase-expanded', step === 4);
      cards.inert = step === 4;
      cards.setAttribute('aria-hidden', String(step === 4));
      const [title, accent, subtitle] = copy[step - 1];
      heading.replaceChildren(document.createTextNode(title), document.createElement('br'));
      const span = document.createElement('span'); span.textContent = accent; heading.appendChild(span);
      description.textContent = subtitle;
      const phoneAfter = phone.getBoundingClientRect();
      const content = document.querySelector('.showcase-content');
      // Compensate for the header's new height while the phone resizes.
      const contentMotion = reduced || !changesModelLayout ? Promise.resolve() :
        content.animate([
          { transform: `translate(${phoneBefore.left - phoneAfter.left}px, ${phoneBefore.top - phoneAfter.top}px)` },
          { transform: 'translate(0, 0)' }
        ], { duration: 900, easing: 'cubic-bezier(.45, 0, .55, 1)' }).finished.catch(() => {});
      document.dispatchEvent(new CustomEvent('onboarding-step-change', { detail: step }));
      if (step === 4) {
        const selected = document.querySelector('input[name="model"]:checked');
        document.dispatchEvent(new CustomEvent('showcase-select-theme', { detail: selected.value }));
      }
      document.title = 'SmartBio — ' + panel.querySelector('h1').textContent;
      main.scrollTop = 0;
      if (push) history.pushState({ onboardingStep: step }, '', '#etapa-' + step);
      const titleElement = panel.querySelector('h1');
      titleElement.setAttribute('tabindex', '-1'); titleElement.focus({ preventScroll: true });
      await Promise.all([
        animate(panel, [{ opacity: 0, transform: backwards ? 'translateY(-12px)' : 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }]),
        animate(heading, [{ opacity: 0, transform: backwards ? 'translateX(18px)' : 'translateX(-18px)' }, { opacity: 1, transform: 'translateX(0)' }], 450),
        animate(description, [{ opacity: 0 }, { opacity: 1 }], 450),
        contentMotion
      ]);
    } finally { transitioning = false; }
  }
  function save(key, value, status) {
    try { localStorage.setItem(key, value); return true; }
    catch { status.style.color = '#dc2626'; status.textContent = 'Não foi possível salvar neste navegador. Permita o armazenamento local e tente novamente.'; return false; }
  }
  const username = document.getElementById('username');
  const usernameStatus = document.getElementById('username-status');
  function validateUsername(required = false) {
    const valid = /^[a-z0-9_-]{3,30}$/.test(username.value);
    username.setAttribute('aria-invalid', String(!valid && (required || !!username.value)));
    usernameStatus.textContent = valid ? 'Formato válido. Seu link está pronto para ser confirmado.' : username.value || required ? 'Use de 3 a 30 caracteres: letras minúsculas, números, hífen ou sublinhado.' : '';
    usernameStatus.style.color = valid ? '#15803d' : '#dc2626';
    return valid;
  }
  username.addEventListener('input', () => { validateUsername(); document.getElementById('save-status').textContent = ''; });
  document.getElementById('username-form').addEventListener('submit', event => {
    event.preventDefault(); if (transitioning) return;
    if (!validateUsername(true)) { username.focus(); return; }
    if (save('smartbio.username', username.value, document.getElementById('save-status'))) showStep(2);
  });
  const profileForm = document.getElementById('profile-form');
  profileForm.addEventListener('submit', event => {
    event.preventDefault(); if (transitioning) return;
    const selected = profileForm.querySelector('input:checked');
    if (!selected) { profileForm.reportValidity(); return; }
    if (save('smartbio.profileType', selected.value, document.getElementById('step-2-status'))) showStep(3);
  });
  const platformForm = document.getElementById('platforms-form');
  const platforms = Array.from(platformForm.querySelectorAll('input[name="platforms"]'));
  const platformValues = () => platforms.filter(option => option.checked).map(option => option.value);
  function updatePlatforms() {
    const count = platformValues().length;
    document.getElementById('selection-count').textContent = count + ' de 5 selecionadas. Esta etapa é opcional.';
    platforms.forEach(option => { option.disabled = count >= 5 && !option.checked; });
  }
  platformForm.addEventListener('change', updatePlatforms);
  platformForm.addEventListener('submit', event => {
    event.preventDefault(); if (transitioning) return;
    const selected = platformValues();
    const status = document.getElementById('step-3-status');
    if (selected.length > 5) { status.textContent = 'Selecione no máximo cinco plataformas.'; return; }
    if (save('smartbio.platforms', JSON.stringify(selected), status)) showStep(4);
  });
  const modelForm = document.getElementById('model-form');
  const models = Array.from(modelForm.querySelectorAll('input[name="model"]'));
  modelForm.addEventListener('change', event => {
    document.dispatchEvent(new Event('showcase-manual-interaction'));
    document.getElementById('step-4-status').textContent = '';
    document.dispatchEvent(new CustomEvent('showcase-select-theme', { detail: event.target.value }));
  });
  document.addEventListener('showcase-theme-change', event => {
    // Automatic demonstrations do not alter the user's chosen model.
    if (step !== 4) return;
    models.forEach(option => { option.checked = option.value === event.detail; });
  });
  modelForm.addEventListener('submit', event => {
    event.preventDefault();
    const selected = models.find(option => option.checked);
    if (!selected) { modelForm.reportValidity(); return; }
    const status = document.getElementById('step-4-status');
    if (save('smartbio.model', selected.value, status)) {
      status.style.color = '#15803d'; status.textContent = 'Configuração concluída! Suas escolhas foram salvas neste navegador.';
    }
  });
  document.querySelectorAll('[data-step-back]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showStep(Number(link.dataset.stepBack));
  }));
  try {
    username.value = localStorage.getItem('smartbio.username') || '';
    const profile = localStorage.getItem('smartbio.profileType');
    profileForm.querySelectorAll('input').forEach(option => { option.checked = option.value === profile; });
    const stored = JSON.parse(localStorage.getItem('smartbio.platforms') || '[]');
    if (Array.isArray(stored)) {
      const allowed = [...new Set(stored.filter(value => platforms.some(option => option.value === value)))].slice(0, 5);
      platforms.forEach(option => { option.checked = allowed.includes(option.value); });
    }
    const model = models.find(option => option.value === localStorage.getItem('smartbio.model'));
    if (model) model.checked = true;
  } catch {}
  validateUsername(); updatePlatforms();
  // A fresh visit starts at step 1; subsequent history entries stay within this document.
  history.replaceState({ onboardingStep: 1 }, '', '#etapa-1');
  window.addEventListener('popstate', event => {
    const next = event.state?.onboardingStep;
    if (Number.isInteger(next)) showStep(next, false);
  });
})();
