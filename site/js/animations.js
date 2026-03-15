/**
 * Moom Agency — GSAP Animations
 * ScrollTrigger + Custom Cursor + Loading Screen
 */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Loading Screen
  const loader = document.getElementById('loader');
  if (loader) {
    const tl = gsap.timeline();
    tl.to('.loader-progress', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
      .to(loader, { opacity: 0, duration: 0.5, onComplete: () => {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
        initAnimations();
      }});
  } else {
    initAnimations();
  }
});

function initAnimations() {
  // Navbar hide/show on scroll
  const nav = document.querySelector('.navbar');
  if (nav) {
    let lastScroll = 0;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const scroll = self.scroll();
        nav.classList.toggle('navbar--hidden', scroll > lastScroll && scroll > 100);
        nav.classList.toggle('navbar--solid', scroll > 50);
        lastScroll = scroll;
      }
    });
  }

  // Fade-in sections
  gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Stagger cards
  gsap.utils.toArray('.cards-grid').forEach(grid => {
    gsap.from(grid.children, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Counter animation
  gsap.utils.toArray('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power2.out'
        });
      },
      once: true
    });
  });

  // Parallax hero
  const hero = document.querySelector('.hero');
  if (hero) {
    gsap.to('.hero-content', {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -100,
      opacity: 0
    });
  }

  // Timeline process steps
  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 85%'
      },
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('faq-item--open');
      document.querySelectorAll('.faq-item--open').forEach(el => el.classList.remove('faq-item--open'));
      if (!isOpen) item.classList.add('faq-item--open');
    });
  });

  // Testimonial carousel
  initCarousel();

  // Custom cursor
  initCustomCursor();

  // Mobile menu
  initMobileMenu();
}

function initCarousel() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  const slides = track.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-dot');
  let current = 0;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  setInterval(() => {
    goTo((current + 1) % slides.length);
  }, 5000);
}

function initCustomCursor() {
  if (window.innerWidth < 768 || 'ontouchstart' in window) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';
  document.body.appendChild(follower);

  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
  });

  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--active');
      follower.classList.add('cursor--active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--active');
      follower.classList.remove('cursor--active');
    });
  });
}

function initMobileMenu() {
  // Mobile menu is handled by main.js (.hamburger)
  // This function is kept as a no-op to avoid breaking the init chain
}
