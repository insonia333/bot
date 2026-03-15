// ============================================
// MOOM AGENCY — GSAP ScrollTrigger Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // === Fade In Up — All Sections ===
  gsap.utils.toArray('.section').forEach(section => {
    const elements = section.querySelectorAll('.section-label, .section-title, .section-desc');
    gsap.from(elements, {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  // === Hero Parallax ===
  gsap.to('.hero-content', {
    y: 100,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // === Service Cards Stagger ===
  gsap.from('.service-card', {
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%'
    }
  });

  // === Portfolio Items ===
  gsap.from('.portfolio-item', {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.portfolio-grid',
      start: 'top 80%'
    }
  });

  // === Process Steps ===
  gsap.from('.process-step', {
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.process-timeline',
      start: 'top 80%'
    }
  });

  // === Tech Items ===
  gsap.from('.tech-item', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.tech-grid',
      start: 'top 85%'
    }
  });

  // === Case Numbers Counter ===
  gsap.utils.toArray('.case-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-target')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        });
      },
      once: true
    });
  });

  // === Testimonial Cards ===
  gsap.from('.testimonial-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials-carousel',
      start: 'top 80%'
    }
  });

  // === Pricing Cards ===
  gsap.from('.pricing-card', {
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 80%'
    }
  });

  // === FAQ Items ===
  gsap.from('.faq-item', {
    x: -30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.faq-list',
      start: 'top 80%'
    }
  });

  // === Blog Cards ===
  gsap.from('.blog-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.blog-grid',
      start: 'top 80%'
    }
  });

  // === CTA Section ===
  gsap.from('.cta-section', {
    scale: 0.95,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 85%'
    }
  });

  // === Contact Form ===
  gsap.from('.contact-form .form-group', {
    x: -40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 80%'
    }
  });

  gsap.from('.contact-info-item', {
    x: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 80%'
    }
  });

  // === Footer ===
  gsap.from('.footer-grid > *', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%'
    }
  });
});
