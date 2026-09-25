document.querySelectorAll('.author__avatar-toggle').forEach(function (button) {
  button.addEventListener('click', function () {
    var flipped = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(flipped));
  });
});
