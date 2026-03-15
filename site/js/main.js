// ============================================
// MOOM AGENCY — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // === Loading Screen ===
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingFill = document.querySelector('.loading-bar-fill');
  let progress = 0;

  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
    }
    loadingFill.style.width = progress + '%';
  }, 150);

  document.body.style.overflow = 'hidden';

  // === Custom Cursor ===
  const cursor = document.querySelector('.cursor');
  if (cursor && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .glass-card, .portfolio-item, .faq-question');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // === Mobile Menu ===
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // === FAQ Accordion ===
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // === Smooth Scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === Navbar Background on Scroll ===
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
  });

  // === Three.js Particles ===
  const heroCanvas = document.querySelector('.hero-canvas');
  if (heroCanvas && window.OrbitalParticles) {
    new OrbitalParticles(heroCanvas);
  }

  // === Contact Form ===
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Trim whitespace from inputs
      const name = (data.name || '').toString().trim();
      const email = (data.email || '').toString().trim();
      const service = (data.service || '').toString().trim();
      const message = (data.message || '').toString().trim();

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailInput = contactForm.querySelector('#email');
      // Remove previous error
      const existingError = contactForm.querySelector('.form-error');
      if (existingError) existingError.remove();

      if (!emailRegex.test(email)) {
        const errorMsg = document.createElement('span');
        errorMsg.className = 'form-error';
        errorMsg.style.cssText = 'color:#e74c3c;font-size:0.85rem;margin-top:0.25rem;';
        errorMsg.textContent = 'Por favor, insira um email válido.';
        emailInput.parentNode.appendChild(errorMsg);
        emailInput.focus();
        return;
      }

      const phone = '5511999999999';
      const whatsappMessage = `Olá! Sou ${name}.\nEmail: ${email}\nServiço: ${service}\nMensagem: ${message}`;
      const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappURL, '_blank');
    });
  }
});
