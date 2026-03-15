/**
 * Moom Agency — Orbital Particles (Canvas 2D)
 * Partículas orbitais interativas no hero — sem dependência de Three.js
 */

class OrbitalParticles {
  constructor(container) {
    if (window.innerWidth < 768) return;

    this.canvas = container.querySelector('canvas') || document.createElement('canvas');
    if (!this.canvas.parentElement) container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: null, y: null };
    this.particles = [];
    this.time = 0;

    this.resize();
    this.createParticles();
    this.addEvents();
    this.animate();
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;';
    this.cx = this.w / 2;
    this.cy = this.h / 2;
  }

  createParticles() {
    const count = 300;
    const colors = [
      { r: 108, g: 92, b: 231 },   // accent purple #6c5ce7
      { r: 0, g: 206, b: 201 },     // accent teal #00cec9
      { r: 255, g: 255, b: 255 }    // white
    ];

    for (let i = 0; i < count; i++) {
      const radius = 50 + Math.random() * 300;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.0003 + Math.random() * 0.001;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 0.5 + Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.5;
      const yOffset = (Math.random() - 0.5) * this.h * 0.6;

      this.particles.push({
        radius, angle, speed, color, size, opacity, yOffset,
        x: 0, y: 0,
        orbitTilt: (Math.random() - 0.5) * 0.5
      });
    }
  }

  addEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.canvas.style.display = 'none';
        return;
      }
      this.canvas.style.display = 'block';
      this.resize();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (window.innerWidth < 768) return;

    this.time++;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Draw connections first (behind particles)
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 80)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of this.particles) {
      p.angle += p.speed;
      p.x = this.cx + Math.cos(p.angle) * p.radius;
      p.y = this.cy + Math.sin(p.angle + p.orbitTilt) * (p.radius * 0.4) + p.yOffset;

      // Mouse repulsion
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= dx * 0.03;
          p.y -= dy * 0.03;
        }
      }

      // Glow effect
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`);
      gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity + 0.2})`;
      ctx.fill();
    }
  }
}

window.OrbitalParticles = OrbitalParticles;
