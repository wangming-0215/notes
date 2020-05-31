(function(window) {
  window.__FIREWORK__ = window.__FIREWORK__ || {};

  const utils = window.__FIREWORK__.utils;

  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.coordinates = Array.from({ length: 5 }).map(() => ({ x, y }));
      this.radians = utils.random(0, Math.PI * 2);
      this.speed = utils.random(1, 10);
      this.friction = 0.95;
      this.gravity = 1;
      this.hue = utils.random(hue - 20, hue + 20);
      this.brightness = utils.random(50, 80);
      this.alpha = 1;
      this.decay = utils.random(0.015, 0.03);
      this.destroy = false;
    }

    /**
     * 画粒子特效
     *
     * @param {CanvasRenderingContext2D} ctx context
     */
    draw(ctx) {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1].x,
        this.coordinates[this.coordinates.length - 1].y
      );
      ctx.lineTo(this.x, this.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    update() {
      this.coordinates.pop();
      this.coordinates.unshift({ x: this.x, y: this.y });
      this.speed *= this.friction;
      this.x += Math.cos(this.radians) * this.speed;
      this.y += Math.sin(this.radians) * this.speed + this.gravity;
      this.alpha -= this.decay;
      if (this.alpha <= this.decay) {
        this.destroy = true;
      }
    }
  }

  window.__FIREWORK__.Particle = Particle;
})(window);
