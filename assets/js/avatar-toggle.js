// Avatar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const avatarContainer = document.querySelector('.author__avatar--clickable');
  
  if (avatarContainer) {
    const cartoonImg = avatarContainer.querySelector('.author__avatar-img');
    const realImg = avatarContainer.querySelector('.author__avatar-hover');
    
    if (cartoonImg && realImg) {
      // Initialize: show cartoon, hide real
      avatarContainer.classList.add('avatar-show-cartoon');
      
      // Toggle on click
      avatarContainer.addEventListener('click', function() {
        if (avatarContainer.classList.contains('avatar-show-cartoon')) {
          // Switch to real
          avatarContainer.classList.remove('avatar-show-cartoon');
          avatarContainer.classList.add('avatar-show-real');
        } else {
          // Switch back to cartoon
          avatarContainer.classList.remove('avatar-show-real');
          avatarContainer.classList.add('avatar-show-cartoon');
        }
      });
    }
  }
});

