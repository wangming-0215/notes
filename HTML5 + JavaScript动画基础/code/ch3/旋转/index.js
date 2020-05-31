(function() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const mouse = { x: 0, y: 0 };

  const Arrow = window.__APP__.Arrow;
  const arrow = new Arrow();

  arrow.x = width / 2;
  arrow.y = height / 2;

  function drawFrame() {
    window.requestAnimationFrame(drawFrame);
    context.clearRect(0, 0, width, height);
    const dx = mouse.x - arrow.x;
    const dy = mouse.y - arrow.y;

    arrow.rotation = Math.atan2(dy, dx);
    arrow.draw(context);
  }

  window.requestAnimationFrame(drawFrame);

  window.addEventListener('mousemove', function(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  });
})();
