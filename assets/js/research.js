(() => {
  'use strict';
  const dialog = document.getElementById('researchVideoDialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const video = document.getElementById('researchVideo');
  const title = document.getElementById('researchVideoTitle');
  const description = document.getElementById('researchVideoDescription');
  const download = document.getElementById('researchVideoFile');
  const error = document.getElementById('researchVideoError');
  const tabs = [...dialog.querySelectorAll('[data-film]')];
  const films = new Map([...document.querySelectorAll('.research-film')].map(card => [card.dataset.film, card]));
  let opener;

  function openFilm(id) {
    const card = films.get(id);
    if (!card) return;

    video.pause();
    error.hidden = true;
    title.textContent = card.querySelector('h4').textContent.trim();
    description.replaceChildren(card.querySelector('.research-film-summary').cloneNode(true));
    const file = card.querySelector('[data-video]').getAttribute('href');
    video.src = file;
    video.poster = card.querySelector('img').getAttribute('src');
    video.setAttribute('aria-label', title.textContent);
    download.href = file;
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.film === id)));

    if (!dialog.open) {
      opener = document.activeElement;
      dialog.showModal();
      document.body.classList.add('research-video-open');
    }
    // A rejected play promise leaves the native play control available.
    const playback = video.play();
    if (playback) playback.catch(() => {});
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-video]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!films.has(link.dataset.video)) return;
    event.preventDefault();
    openFilm(link.dataset.video);
  });

  tabs.forEach(tab => tab.addEventListener('click', () => openFilm(tab.dataset.film)));
  dialog.querySelector('.research-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.body.classList.remove('research-video-open');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  });
  video.addEventListener('error', () => { error.hidden = false; });
})();
