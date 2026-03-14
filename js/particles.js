/* ===== PARTICLE BACKGROUND ===== */
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let W, H;
  let mouseX = -9999, mouseY = -9999;

  const CONFIG = {
    count: 70,
    color: 'rgba(108, 99, 255, 0.6)',
    radius: { min: 1, max: 3 },
    speed: { min: 0.1, max: 0.4 },
    connectDistance: 130,
    mouseRadius: 150,
  };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: randBetween(-CONFIG.speed.max, CONFIG.speed.max),
      vy: randBetween(-CONFIG.speed.max, CONFIG.speed.max),
      r: randBetween(CONFIG.radius.min, CONFIG.radius.max),
      alpha: randBetween(0.3, 0.8),
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) particles.push(createParticle());
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 99, 255, ${p.alpha})`;
    ctx.fill();
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDistance) {
          const alpha = (1 - dist / CONFIG.connectDistance) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 2) { p.vx *= 0.95; p.vy *= 0.95; }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(drawParticle);
    update();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  resize();
  init();
  loop();

  // Cleanup when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();
