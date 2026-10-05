(function () {
  'use strict';
  var home = document.querySelector('.rose-home');
  if (!home) return;
  var links = Array.from(home.querySelectorAll('.section-nav a'));
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
    home.querySelectorAll('.home-section').forEach(function (section) { observer.observe(section); });
  }
})();
