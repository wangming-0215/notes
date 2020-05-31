(function(window) {
  window.__APP__ = window.__APP__ || {};

  function Ball(radius = 40, color = '#ff0000') {
    this.radius = radius;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.lineWidth = 2;
  }

  Ball.prototype.draw = function(context) {
    context.save();
    context.translate(this.x, this.y);
    context.lineWidth = this.lineWidth;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(0, 0, this.radius, Math.PI * 2, 0, true);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  };

  window.__APP__.Ball = Ball;
})(window);
