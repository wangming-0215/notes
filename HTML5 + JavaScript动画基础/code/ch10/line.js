function Line(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
  this.x = 0;
  this.y = 0;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.lineWidth = 1;
}

/** @param {CanvasRenderingContext2D} ctx */
Line.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.scale(this.scaleX, this.scaleY);
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

Line.prototype.getBounds = function() {
  if (this.rotation === 0) {
    const minX = Math.min(this.x1, this.x2);
    const minY = Math.min(this.y1, this.y2);
    const maxX = Math.max(this.x1, this.x2);
    const maxY = Math.max(this.y1, this.y2);

    return {
      x: this.x + minX,
      y: this.y + minY,
      width: maxX - minX,
      height: maxY - minY
    };
  } else {
    const sin = Math.sin(this.rotation);
    const cos = Math.cos(this.rotation);
    const x1r = cos * this.x1 + sin * this.y1;
    const x2r = cos * this.x2 + sin * this.y2;
    const y1r = cos * this.y1 + sin * this.x1;
    const y2r = cos * this.y2 + sin * this.x2;

    return {
      x: this.x + Math.min(x1r, x2r),
      y: this.y + Math.min(y1r, y2r),
      width: Math.max(x1r, x2r) - Math.min(x1r, x2r),
      height: Math.max(y1r, y2r) - Math.min(y1r, y2r)
    };
  }
};
