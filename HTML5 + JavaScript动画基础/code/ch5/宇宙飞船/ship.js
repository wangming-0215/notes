function Ship() {
  this.x = 0;
  this.y = 0;
  this.width = 25;
  this.height = 20;
  this.rotation = 0;
  this.showFlame = false;
}

/**@param {CanvasRenderingContext2D} ctx */
Ship.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-10, 10);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-10, -10);
  ctx.lineTo(10, 0);
  ctx.stroke();
  if (this.showFlame) {
    ctx.beginPath();
    ctx.moveTo(-7.5, -5);
    ctx.lineTo(-15, 0);
    ctx.lineTo(-7.5, 5);
    ctx.stroke();
  }
  ctx.restore();
};
