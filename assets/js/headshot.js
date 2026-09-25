document.querySelectorAll('.author__avatar-toggle').forEach(function (button) {
  var image = button.querySelector('img');
  var mainSrc = image.getAttribute('src');
  var alternateSrc = button.dataset.alternateSrc;
  var busy = false;
  var preload = new Image();
  preload.src = alternateSrc;

  button.addEventListener('click', async function () {
    if (busy) return;
    busy = true;
    var flipped = button.getAttribute('aria-pressed') !== 'true';
    var nextSrc = flipped ? alternateSrc : mainSrc;
    var animate = typeof image.animate === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      // Keep the current photo visible if the alternate image fails to load.
      if (flipped && typeof preload.decode === 'function') await preload.decode();
      if (animate) {
        await image.animate([
          { transform: 'perspective(800px) rotateY(0deg)' },
          { transform: 'perspective(800px) rotateY(90deg)' }
        ], { duration: 180, easing: 'ease-in' }).finished;
      }
      image.src = nextSrc;
      button.setAttribute('aria-pressed', String(flipped));
      button.setAttribute('aria-label', flipped ? 'Show main headshot' : 'Show alternate headshot');
      if (animate) {
        await image.animate([
          { transform: 'perspective(800px) rotateY(-90deg)' },
          { transform: 'perspective(800px) rotateY(0deg)' }
        ], { duration: 180, easing: 'ease-out' }).finished;
      }
    } catch (error) {
      // Leave the button usable after an image-load or animation interruption.
    } finally {
      busy = false;
    }
  });
});
