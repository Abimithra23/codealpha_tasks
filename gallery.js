(() => {
  const gallery  = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const btnClose = document.getElementById('lb-close');
  const btnPrev  = document.getElementById('lb-prev');
  const btnNext  = document.getElementById('lb-next');

  let visibleCards = [];
  let currentIndex = 0;

  // ── Filter logic ──
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });

      updateVisible();
    });
  });

  function updateVisible() {
    visibleCards = [...document.querySelectorAll('.card:not(.hidden)')];
  }

  updateVisible();

  // ── Open lightbox ──
  gallery.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card || card.classList.contains('hidden')) return;

    updateVisible();
    currentIndex = visibleCards.indexOf(card);
    showImage(currentIndex);
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  });

  function showImage(index) {
    const card   = visibleCards[index];
    const img    = card.querySelector('img');
    const label  = card.querySelector('.overlay span').textContent;

    // Animate swap
    lbImg.style.animation = 'none';
    lbImg.offsetHeight; // reflow
    lbImg.style.animation = '';

    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = label;
  }

  // ── Navigation ──
  btnNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % visibleCards.length;
    showImage(currentIndex);
  });

  btnPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    showImage(currentIndex);
  });

  // ── Close ──
  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  btnClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── Keyboard support ──
  document.addEventListener('keydown', e => {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'ArrowRight') btnNext.click();
    if (e.key === 'ArrowLeft')  btnPrev.click();
    if (e.key === 'Escape')     closeLightbox();
  });
})();
