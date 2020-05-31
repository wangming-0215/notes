(function(window) {
  window.__FIREWORK__ = window.__FIREWORK__ || {};

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  window.__FIREWORK__.utils = {
    random
  };
})(window);
