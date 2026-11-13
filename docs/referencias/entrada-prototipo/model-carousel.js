(() => {
  const viewport = document.getElementById('model-viewport');
  const track = document.getElementById('model-track');
  if (!viewport || !track) return;
  const previous = document.getElementById('models-previous');
  const next = document.getElementById('models-next');
  const cards = Array.from(track.querySelectorAll('.theme-option'));
  const status = document.getElementById('model-carousel-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update() {
    if (!viewport.clientWidth) return;
    previous.hidden = viewport.scrollLeft < 4;
    next.hidden = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 4;
  }
  function move(direction) {
    const distance = cards[0].getBoundingClientRect().width + 12;
    viewport.scrollBy({ left: direction * distance, behavior: reduced ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  function reveal(card) {
    const box = viewport.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    let delta = 0;
    if (rect.right > box.right) delta = rect.right - box.right + 3;
    else if (rect.left < box.left) delta = rect.left - box.left - 3;
    if (delta) viewport.scrollBy({ left: delta, behavior: reduced ? 'instant' : 'smooth' });
  }
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.theme-option');
    if (card) reveal(card);
  });
  track.addEventListener('change', event => {
    const card = event.target.closest('.theme-option');
    if (card) { reveal(card); status.textContent = event.target.getAttribute('aria-label') + ' selecionado.'; }
  });
  document.addEventListener('onboarding-step-change', event => {
    if (event.detail !== 4) return;
    requestAnimationFrame(() => {
      const selected = track.querySelector('input:checked')?.closest('.theme-option');
      if (selected) reveal(selected);
      update();
    });
  });
  viewport.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(viewport);
  update();
})();
