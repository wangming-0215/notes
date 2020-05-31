(function(window) {
  window.__FIREWORK__ = window.__FIREWORK__ || {};

  const utils = window.__FIREWORK__.utils;
  const Firework = window.__FIREWORK__.Firework;
  const Particle = window.__FIREWORK__.Particle;
  const Star = window.__FIREWORK__.Star;

  const canvas = document.getElementById('canvas');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const ctx = canvas.getContext('2d');

  const fireworks = [];
  const timerTotal = 20;
  let timerTick = 0;
  const particles = [];
  let hue = 120;
  const padding = 300;
  const stars = [];
  const starCount = utils.random(100, 200);

  for (let i = 0; i < starCount; i++) {
    const position = {
      x: utils.random(0, width),
      y: utils.random(0, height)
    };
    stars.push(new Star(position.x, position.y));
  }

  function createParticle(x, y) {
    let particleCount = utils.random(80, 100) | 0;
    while (particleCount--) {
      particles.push(new Particle(x, y, hue));
    }
  }

  function loop() {
    window.requestAnimationFrame(loop);
    ctx.globalCompsiteOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompsiteOperation = 'lighter';

    hue += 0.5;

    const start = { x: utils.random(padding, width - padding), y: height };
    const target = {
      x: start.x,
      y: utils.random(50, height / 2)
    };

    for (let i = fireworks.length - 1; i > 0; i--) {
      fireworks[i].draw(ctx);
      fireworks[i].fire();
      if (fireworks[i].boom) {
        createParticle(fireworks[i].tx, fireworks[i].ty);
        fireworks.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i > 0; i--) {
      particles[i].draw(ctx);
      particles[i].update();
      if (particles[i].destroy) {
        particles.splice(i, 1);
      }
    }

    for (let i = stars.length - 1; i > 0; i--) {
      stars[i].draw(ctx);
      stars[i].update();
    }

    if (timerTick >= timerTotal) {
      fireworks.push(new Firework(start, target, hue));
      timerTick = 0;
    } else {
      timerTick++;
    }
  }

  window.onload = loop;
})(window);
