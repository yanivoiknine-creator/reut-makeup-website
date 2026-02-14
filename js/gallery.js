/* ============================================
   Reut Klein - Gallery & Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Gallery Filters ----------
  var filterButtons = document.querySelectorAll('.gallery-filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter items
        galleryItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            // Re-trigger animation
            item.classList.remove('visible');
            void item.offsetWidth; // Force reflow
            item.classList.add('visible');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------- Lightbox ----------
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxImage) return;

  var currentImages = [];
  var currentIndex = 0;

  // Collect all gallery images
  function getVisibleImages() {
    var images = [];
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      if (item.style.display !== 'none') {
        var img = item.querySelector('img');
        if (img) {
          images.push({
            src: img.src,
            alt: img.alt
          });
        }
      }
    });
    return images;
  }

  // Open lightbox
  function openLightbox(index) {
    currentImages = getVisibleImages();
    if (currentImages.length === 0) return;

    currentIndex = index;
    lightboxImage.src = currentImages[currentIndex].src;
    lightboxImage.alt = currentImages[currentIndex].alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    lightboxClose.focus();
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Navigate
  function showPrev() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImage.src = currentImages[currentIndex].src;
    lightboxImage.alt = currentImages[currentIndex].alt;
  }

  function showNext() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImage.src = currentImages[currentIndex].src;
    lightboxImage.alt = currentImages[currentIndex].alt;
  }

  // Event: click gallery items
  document.querySelectorAll('.gallery-item').forEach(function (item, index) {
    item.addEventListener('click', function () {
      // Calculate visible index
      var visibleItems = [];
      document.querySelectorAll('.gallery-item').forEach(function (it) {
        if (it.style.display !== 'none') {
          visibleItems.push(it);
        }
      });
      var visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });

    // Keyboard support
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Event: close
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Event: prev/next
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      showPrev();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      showNext();
    });
  }

  // Event: click backdrop
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Event: keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        // In RTL, left arrow = next (visually)
        if (document.body.classList.contains('ltr')) {
          showPrev();
        } else {
          showNext();
        }
        break;
      case 'ArrowRight':
        if (document.body.classList.contains('ltr')) {
          showNext();
        } else {
          showPrev();
        }
        break;
    }
  });

  // Touch/swipe support for mobile
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (document.body.classList.contains('ltr')) {
        diff > 0 ? showNext() : showPrev();
      } else {
        diff > 0 ? showPrev() : showNext();
      }
    }
  }, { passive: true });

});
