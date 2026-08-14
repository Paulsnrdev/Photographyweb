/* ============================================
   MAIN.JS — Navigation, Hero Slider, Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  setActiveNavLink();
  initHeroSlider();
  initScrollAnimations();
  initTestimonials();
  initSkillBars();
});

/* PAGE LOADER */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => { loader.style.display = 'none'; }, 600);
  }, 900);
}

/* NAVIGATION */
function initNavigation() {
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!navbar) return;

  // Sticky scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
    });
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function setActiveNavLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* HERO SLIDER */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0, timer = null;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo((current + 1) % slides.length); }

  function start() { timer = setInterval(next, 6000); }
  function stop()  { clearInterval(timer); }

  goTo(0);
  start();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stop(); goTo(i); start(); });
  });

  // Scroll arrow
  const scrollBtn = document.querySelector('.hero-scroll');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const target = document.querySelector('.about-preview, .section, main > section');
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (document.querySelector('.lightbox.active')) return;
    if (e.key === 'ArrowRight') { stop(); next(); start(); }
    if (e.key === 'ArrowLeft')  { stop(); goTo((current - 1 + slides.length) % slides.length); start(); }
  });
}

/* SCROLL REVEAL */
function initScrollAnimations() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, opts);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });
}

/* TESTIMONIALS CAROUSEL */
function initTestimonials() {
  const track   = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.test-prev');
  const nextBtn = document.querySelector('.test-next');
  if (!track) return;

  let pos = 0;
  const cards     = track.querySelectorAll('.testimonial-card');
  const cardWidth = 398; // card min-width + gap

  function maxNeg() {
    const visible = Math.floor(track.parentElement.offsetWidth / cardWidth);
    return -Math.max(0, cards.length - visible) * cardWidth;
  }

  function move(dir) {
    pos = Math.min(0, Math.max(maxNeg(), pos + dir * -cardWidth));
    track.style.transform = `translateX(${pos}px)`;
  }

  prevBtn?.addEventListener('click', () => move(-1));
  nextBtn?.addEventListener('click', () => move(1));

  // Touch/swipe
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) move(diff > 0 ? 1 : -1);
    startX = null;
  });
}

/* SKILL BARS */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = (e.target.dataset.width || 0) + '%';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
}
