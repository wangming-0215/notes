function Ball(radius = 40, color = '#ff0000') {
  this.x = 0;
  this.y = 0;
  this.radius = radius;
  this.color = color;
  this.vx = 0;
  this.vy = 0;
  this.vr = 0;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.lineWidth = 1;
  this.mass = 1; // 质量
}

/**@param {CanvasRenderingContext2D} ctx */
Ball.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.scale(this.scaleX, this.scaleY);
  ctx.lineWidth = this.lineWidth;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
