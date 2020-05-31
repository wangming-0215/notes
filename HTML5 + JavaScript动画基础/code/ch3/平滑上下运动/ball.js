(function(window) {
  window.__APP__ = window.__APP__ || {};

  function Ball(radius = 40, color = '#ff0000') {
    this.radius = radius;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.lineWidth = 1;
  }

  Ball.prototype.draw = function(context) {
    context.save();
    context.translate(this.x, this.y);
    context.lineWidth = this.lineWidth;
    context.fillStyle = this.color;
    context.beginPath();
    // x, y, radius, start_angle, end_angle, anti-clockwise
    context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  };

  window.__APP__.Ball = Ball;
})(window);
