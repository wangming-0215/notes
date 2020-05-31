(function(window) {
  window.__FIREWORK__ = window.__FIREWORK__ || {};

  const utils = window.__FIREWORK__.utils;

  class Star {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.alpha = 1;
      this.decay = utils.random(0.015, 0.03);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, utils.random(0.5, 1), 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    update() {
      if (this.alpha <= this.decay) {
        this.alpha += this.decay;
      } else if (this.alpha >= 1) {
        this.alpha -= this.decay;
      }
    }
  }

  window.__FIREWORK__.Star = Star;
})(window);
