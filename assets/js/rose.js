(function () {
  'use strict';
  var toggle = document.querySelector('#theme-toggle a');
  if (toggle) toggle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle.click(); }
  });
  var home = document.querySelector('.rose-home');
  if (!home) return;
  var topics = home.querySelector('.research-topics');
  var cards = Array.from(home.querySelectorAll('.research-card'));
  if (topics && cards.length) {
    topics.hidden = false;
    cards.forEach(function (card, index) { card.open = index === 0; });
    topics.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-topic]');
      if (!button) return;
      var topic = button.dataset.topic;
      topics.querySelectorAll('button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      var count = 0;
      cards.forEach(function (card) {
        var matches = topic === 'all' || card.dataset.topics.split(' ').includes(topic);
        card.hidden = !matches;
        if (matches) count++;
        if (topic !== 'all' && matches) card.open = true;
      });
      home.querySelector('.filter-status').textContent = count + ' research groups · ' + button.textContent;
    });
  }
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
