/* ============================================
   GALLERY.JS — Masonry Filter + Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* GALLERY FILTER */
function initGalleryFilter() {
  const tabs  = document.querySelectorAll('.filter-tab, .cat-btn');
  const items = document.querySelectorAll('.masonry-item, .featured-item[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.category;

      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hidden', !show);

        // Slight stagger via inline style
        if (show) {
          item.style.animation = 'none';
          requestAnimationFrame(() => {
            item.style.animation = '';
          });
        }
      });
    });
  });
}

/* LIGHTBOX */
let lbImages = [];
let lbIndex  = 0;

function initLightbox() {
  const lb       = document.querySelector('.lightbox');
  if (!lb) return;

  const imgEl    = document.getElementById('lightbox-img');
  const captionEl = lb.querySelector('.lightbox-caption');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn  = lb.querySelector('.lightbox-prev');
  const nextBtn  = lb.querySelector('.lightbox-next');
  const counter  = lb.querySelector('.lightbox-counter');

  function collectImages() {
    lbImages = [];
    document.querySelectorAll('.masonry-item:not(.hidden), .featured-item:not(.hidden)').forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        lbImages.push({
          src: img.src,
          caption: item.dataset.title || img.alt || '',
          el: item
        });
      }
    });
  }

  function openLightbox(idx) {
    collectImages();
    lbIndex = Math.max(0, Math.min(idx, lbImages.length - 1));
    render();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const data = lbImages[lbIndex];
    if (!data) return;

    // Fade transition
    if (imgEl) {
      imgEl.style.opacity = '0';
      imgEl.src = data.src;
      imgEl.onload = () => { imgEl.style.opacity = '1'; };
      imgEl.style.transition = 'opacity 0.3s ease';
    }
    if (captionEl) captionEl.textContent = data.caption;
    if (counter)   counter.textContent   = `${lbIndex + 1} / ${lbImages.length}`;
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; render(); }
  function next() { lbIndex = (lbIndex + 1) % lbImages.length; render(); }

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch swipe inside lightbox
  let touchX = null;
  lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchX = null;
  });

  // Attach click to all gallery items
  document.querySelectorAll('.masonry-item, .featured-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      collectImages();
      const idx = lbImages.findIndex(d => d.el === item);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });
}
