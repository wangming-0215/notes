(function() {
  const Ball = window.__APP__.Ball;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  let angle = 0;

  const ball = new Ball();
  ball.x = width / 2;
  ball.y = height / 2;

  function drawFrame() {
    window.requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0, width, height);

    ball.y = height / 2 + Math.sin(angle) * 400;
    angle += 0.1;
    ball.draw(ctx);
  }

  window.requestAnimationFrame(drawFrame);
})();
