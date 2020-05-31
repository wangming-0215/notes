(function(window) {
  window.__FIREWORK__ = window.__FIREWORK__ || {};

  const utils = window.__FIREWORK__.utils;
  const Particle = window.__FIREWORK__.Particle;

  class Firework {
    constructor(start, target, hue) {
      this.x = start.x;
      this.y = start.y;
      this.sx = start.x;
      this.sy = start.y;
      this.tx = target.x;
      this.ty = target.y;
      this.speed = utils.random(2, 5);
      // this.av = 1.05;
      this.easing = utils.random(0.05, 0.15);
      this.vx = 0;
      this.vy = 0;
      this.hue = hue;
      this.brightness = utils.random(50, 70);
      this.coordinates = Array.from({ length: 5 }).map(() => ({
        x: this.x,
        y: this.y
      }));
      this.boom = false;
      this.targetRadius = 1;
      this.particles = [];
    }

    /**
     * draw
     *
     * @param {CanvasRenderingContext2D} ctx canvas context
     */
    draw(ctx) {
      ctx.save();
      ctx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
      ctx.beginPath();
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1].x,
        this.coordinates[this.coordinates.length - 1].y
      );
      ctx.lineTo(this.x, this.y);
      ctx.closePath();
      ctx.stroke();
      // 画目标点
      // ctx.beginPath();
      // ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2, true);
      // ctx.closePath();
      // ctx.stroke();
      ctx.restore();
    }

    fire() {
      this.coordinates.pop();
      this.coordinates.unshift({ x: this.x, y: this.y });

      if (this.targetRadius < 6) {
        this.targetRadius += 0.1;
      } else {
        this.targetRadius = 1;
      }

      // const radians = Math.atan2(this.ty - this.sy, this.tx - this.sx);
      // this.speed *= this.av;
      // const vx = Math.cos(radians) * this.speed;
      // const vy = Math.sin(radians) * this.speed;
      const distanceTraveled = this.calculateDistance(
        this.sx,
        this.sy,
        this.x + this.vx,
        this.y + this.vy
      );

      const distanceToTarget = this.calculateDistance(
        this.sx,
        this.sy,
        this.tx,
        this.ty
      );

      if (distanceToTarget - distanceTraveled < 20) {
        this.boom = true;
      } else {
        this.x += (this.tx - this.x) * this.easing;
        this.y += (this.ty - this.y) * this.easing;
      }
    }

    createParticle(x, y) {
      const particleCount = 30;
      while (particleCount--) {
        this.particles.push(new Particle(x, y));
      }
    }

    calculateDistance(sx, sy, tx, ty) {
      const dx = tx - sx;
      const dy = ty - sy;
      return Math.sqrt(dx ** 2 + dy ** 2);
    }
  }

  window.__FIREWORK__.Firework = Firework;
})(window);
