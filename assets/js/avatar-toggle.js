// Avatar toggle functionality
(function() {
  function initAvatarToggle() {
    const avatarContainer = document.querySelector('.author__avatar--clickable');
    
    if (!avatarContainer) {
      console.log('Avatar container not found');
      return;
    }
    
    const cartoonImg = avatarContainer.querySelector('.author__avatar-img');
    const realImg = avatarContainer.querySelector('.author__avatar-hover');
    
    if (!cartoonImg) {
      console.log('Cartoon image not found');
      return;
    }
    
    if (!realImg) {
      console.log('Real image not found');
      return;
    }
    
    console.log('Avatar toggle initialized', {
      cartoonSrc: cartoonImg.src,
      realSrc: realImg.src
    });
    
    // Initialize: show cartoon, hide real
    if (!avatarContainer.classList.contains('avatar-show-cartoon')) {
      avatarContainer.classList.add('avatar-show-cartoon');
    }
    
    // Toggle on click
    avatarContainer.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (avatarContainer.classList.contains('avatar-show-cartoon')) {
        // Switch to real
        console.log('Switching to real photo');
        avatarContainer.classList.remove('avatar-show-cartoon');
        avatarContainer.classList.add('avatar-show-real');
      } else {
        // Switch back to cartoon
        console.log('Switching to cartoon');
        avatarContainer.classList.remove('avatar-show-real');
        avatarContainer.classList.add('avatar-show-cartoon');
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAvatarToggle);
  } else {
    initAvatarToggle();
  }
})();

