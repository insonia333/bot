/**
 * Moom Agency — Three.js Orbital Particles
 * Partículas orbitais interativas no hero
 */

class OrbitalParticles {
  constructor(container) {
    this.container = container;
    this.mouse = { x: 0, y: 0 };
    this.particles = null;
    this.clock = new THREE.Clock();

    if (window.innerWidth < 768) return;

    this.init();
    this.createParticles();
    this.addEvents();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.pointerEvents = 'none';
  }

  createParticles() {
    const count = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const orbits = new Float32Array(count);

    const accentPurple = new THREE.Color(0x6c5ce7);
    const accentTeal = new THREE.Color(0x00cec9);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      const color = colorChoice < 0.4 ? accentPurple : colorChoice < 0.7 ? accentTeal : white;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.5 + Math.random() * 2;
      speeds[i] = 0.2 + Math.random() * 0.8;
      orbits[i] = radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.speeds = speeds;
    this.orbits = orbits;
    this.originalPositions = new Float32Array(positions);

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  addEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.renderer.domElement.style.display = 'none';
        return;
      }
      this.renderer.domElement.style.display = 'block';
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (window.innerWidth < 768) return;

    const time = this.clock.getElapsedTime();
    const positions = this.particles.geometry.attributes.position.array;

    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      const speed = this.speeds[i];
      const orbit = this.orbits[i];
      const offset = i * 0.1;

      positions[i3] = this.originalPositions[i3] * Math.cos(time * speed * 0.3 + offset)
                     - this.originalPositions[i3 + 2] * Math.sin(time * speed * 0.3 + offset);
      positions[i3 + 2] = this.originalPositions[i3] * Math.sin(time * speed * 0.3 + offset)
                         + this.originalPositions[i3 + 2] * Math.cos(time * speed * 0.3 + offset);
      positions[i3 + 1] = this.originalPositions[i3 + 1] + Math.sin(time * speed * 0.5 + offset) * 2;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    this.particles.rotation.y += 0.001;
    this.particles.rotation.x = this.mouse.y * 0.3;
    this.particles.rotation.y += this.mouse.x * 0.001;

    this.renderer.render(this.scene, this.camera);
  }
}

window.OrbitalParticles = OrbitalParticles;
