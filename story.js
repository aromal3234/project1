// Story modal functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load story content
  fetch('story.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      initStoryModal();
    })
    .catch(error => console.error('Error loading story:', error));
});

function initStoryModal() {
  // support any button with the `.story-trigger` class (header + footer)
  const storyButtons = Array.from(document.querySelectorAll('.story-trigger'));
  const storyModal = document.getElementById('storyModal');
  const storyClose = document.getElementById('storyClose');
  
  if (storyButtons.length > 0 && storyModal && storyClose) {
    // Open modal from any story trigger (header OR footer)
    storyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        storyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        checkStoryVisibility();
      });
    });

    // Close modal
    storyClose.addEventListener('click', () => {
      storyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });

    // Close on outside click
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        storyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });

    // Handle HEIC images in story
    const storyImages = storyModal.querySelectorAll('img[src$=".heic"]');
    storyImages.forEach(img => {
      fetch(img.src)
        .then(res => res.blob())
        .then(blob => heic2any({
          blob,
          toType: "image/jpeg",
          quality: 0.8
        }))
        .then(conversionResult => {
          img.src = URL.createObjectURL(conversionResult);
        })
        .catch(error => console.error('Error converting HEIC image:', error));
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.3
    });

    // Observe all story moments
    document.querySelectorAll('.story-moment').forEach(moment => {
      observer.observe(moment);
    });
  }
}

function checkStoryVisibility() {
  const storyMoments = document.querySelectorAll('.story-moment');
  storyMoments.forEach(moment => {
    const rect = moment.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      moment.classList.add('visible');
    }
  });
}