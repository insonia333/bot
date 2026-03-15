/**
 * Moom Agency — 3D Scroll-Driven Animations
 * GSAP ScrollTrigger + Lenis Smooth Scroll + 3D Transforms
 * Inspirado em Nano Banana / Antigravity
 */

(function () {
  'use strict';

  // Wait for GSAP and Lenis
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // ── Lenis Smooth Scroll ──
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ── Navbar Pill Morphing ──
  function initNavbarMorph() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    ScrollTrigger.create({
      start: 'top -100',
      onUpdate: (self) => {
        if (self.scroll() > 100) {
          nav.classList.add('navbar--pill');
        } else {
          nav.classList.remove('navbar--pill');
        }
      },
    });
  }

  // ── Hero Parallax Dispersal ──
  function initHero3D() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroContent = hero.querySelector('.hero-content');
    const canvas = hero.querySelector('canvas');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: false,
      },
    });

    if (heroContent) {
      tl.to(heroContent, {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        y: -80,
        ease: 'none',
      }, 0);
    }

    if (canvas) {
      tl.to(canvas, {
        scale: 1.3,
        opacity: 0,
        ease: 'none',
      }, 0);
    }
  }

  // ── Service Cards 3D Flip ──
  function initCards3D() {
    const grids = gsap.utils.toArray('.cards-grid, .services-grid');
    grids.forEach((grid) => {
      const cards = grid.children;
      if (!cards.length) return;

      gsap.set(grid, { perspective: 1200 });

      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        rotateY: 45,
        rotateX: 10,
        opacity: 0,
        z: -200,
        scale: 0.8,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'all',
      });
    });

    // 3D hover on individual cards
    document.querySelectorAll('.card, .service-card, .plan-card, .portfolio-item').forEach((card) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.4s ease';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Portfolio Clip-Reveal ──
  function initClipReveal() {
    gsap.utils.toArray('.portfolio-item, .gallery-item').forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        clearProps: 'clipPath',
      });
    });
  }

  // ── Process Timeline Horizontal Scroll ──
  function initHorizontalProcess() {
    const processSection = document.querySelector('.process');
    const processTrack = document.querySelector('.process-track, .process-steps');
    if (!processSection || !processTrack) return;

    const steps = processTrack.children;
    if (steps.length < 3) return;

    gsap.to(processTrack, {
      x: () => -(processTrack.scrollWidth - window.innerWidth + 100),
      ease: 'none',
      scrollTrigger: {
        trigger: processSection,
        start: 'top top',
        end: () => `+=${processTrack.scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  // ── Scroll-Driven Counters ──
  function initScrollCounters() {
    gsap.utils.toArray('[data-target]').forEach((el) => {
      const target = parseInt(el.dataset.target);
      if (isNaN(target)) return;

      gsap.fromTo(el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1,
          snap: { innerText: 1 },
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    });
  }

  // ── Text Clip-Reveal ──
  function initTextReveal() {
    gsap.utils.toArray('.section-title, .section-subtitle, h2, h3').forEach((el) => {
      if (el.closest('.hero')) return; // skip hero

      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
  }

  // ── Plans Card Float 3D ──
  function initPlansFloat() {
    const featured = document.querySelector('.plan-card--featured, .plan-card.featured');
    if (!featured) return;

    gsap.to(featured, {
      y: -10,
      rotateX: 2,
      z: 30,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // ── Contact Form Perspective Tilt ──
  function initContactTilt() {
    const contactForm = document.querySelector('.contact-form, .contact form');
    if (!contactForm) return;

    gsap.from(contactForm, {
      scrollTrigger: {
        trigger: contactForm,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      rotateX: 8,
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      transformOrigin: 'center bottom',
      clearProps: 'all',
    });
  }

  // ── Parallax Layers ──
  function initParallaxLayers() {
    gsap.utils.toArray('.section, [data-speed]').forEach((section) => {
      const speed = parseFloat(section.dataset.speed) || 0.2;
      gsap.to(section, {
        yPercent: -speed * 15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // ── Snap Scroll (key sections) ──
  function initSnapScroll() {
    const snapSections = gsap.utils.toArray('.hero, .services, .portfolio, .contact');
    if (snapSections.length < 2) return;

    ScrollTrigger.create({
      snap: {
        snapTo: snapSections.map((s) => {
          const top = s.offsetTop;
          const docHeight = document.body.scrollHeight - window.innerHeight;
          return top / docHeight;
        }),
        duration: 0.6,
        delay: 0.1,
        ease: 'power2.inOut',
      },
    });
  }

  // ── Stagger-Up Sections ──
  function initStaggerSections() {
    gsap.utils.toArray('.section').forEach((section) => {
      const children = section.querySelectorAll('.card, .service-card, .team-member, .faq-item, .blog-card');
      if (children.length < 2) return;

      gsap.from(children, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all',
      });
    });
  }

  // ── Reduced Motion Check ──
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── Init All ──
  function init() {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    initLenis();
    initNavbarMorph();
    initHero3D();
    initCards3D();
    initClipReveal();
    initTextReveal();
    initPlansFloat();
    initContactTilt();
    initParallaxLayers();
    initStaggerSections();

    // Refresh ScrollTrigger after everything loads
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
