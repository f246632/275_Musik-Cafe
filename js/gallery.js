// ===================================
// GALLERY FUNCTIONALITY
// Lightbox modal with keyboard navigation
// ===================================

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const galleryItems = document.querySelectorAll('[data-gallery-item]');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    if (!modal || !modalImg || galleryItems.length === 0) {
        console.warn('Gallery elements not found');
        return;
    }

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));

    // Open modal on gallery item click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openModal(index);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(index);
            }
        });
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Navigation buttons
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPreviousImage();
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPreviousImage();
            }
        }
    }

    // Functions
    function openModal(index) {
        currentIndex = index;
        showImage(currentIndex);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to the gallery item that was clicked
        if (galleryItems[currentIndex]) {
            galleryItems[currentIndex].focus();
        }
    }

    function showImage(index) {
        if (index < 0 || index >= images.length) return;

        currentIndex = index;
        modalImg.src = images[index].src;
        modalImg.alt = images[index].alt;

        // Add loading state
        modalImg.style.opacity = '0';

        modalImg.onload = function() {
            modalImg.style.opacity = '1';
        };

        // Update navigation button states
        updateNavigationButtons();

        // Preload adjacent images for better UX
        preloadImage(index - 1);
        preloadImage(index + 1);
    }

    function showPreviousImage() {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        showImage(newIndex);
    }

    function showNextImage() {
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        showImage(newIndex);
    }

    function updateNavigationButtons() {
        // Update ARIA labels
        prevBtn.setAttribute('aria-label', `Previous image (${currentIndex + 1} of ${images.length})`);
        nextBtn.setAttribute('aria-label', `Next image (${currentIndex + 1} of ${images.length})`);

        // Visual feedback for first/last image (optional)
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === images.length - 1 ? '0.5' : '1';
    }

    function preloadImage(index) {
        if (index < 0 || index >= images.length) return;

        const img = new Image();
        img.src = images[index].src;
    }

    // Add additional styles for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        #modalImage {
            transition: opacity 0.3s ease;
        }

        .gallery-item {
            outline-offset: 3px;
        }

        .gallery-item:focus {
            outline: 3px solid var(--primary-color);
        }

        .modal-nav:focus {
            outline: 3px solid var(--secondary-color);
            outline-offset: 3px;
        }

        .modal-close:focus {
            outline: 3px solid var(--secondary-color);
        }

        /* Image counter */
        .modal::after {
            content: attr(data-counter);
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 1rem;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Update counter
    function updateCounter() {
        modal.setAttribute('data-counter', `${currentIndex + 1} / ${images.length}`);
    }

    // Initial counter update
    updateCounter();

    // Update counter when image changes
    const originalShowImage = showImage;
    showImage = function(index) {
        originalShowImage(index);
        updateCounter();
    };

    console.log(`Gallery initialized with ${images.length} images`);
}

// Lazy loading for gallery images (progressive enhancement)
if ('IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    galleryObserver.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('[data-gallery-item]').forEach(item => {
        galleryObserver.observe(item);
    });
}

// Export for potential use in other scripts
window.GalleryAPI = {
    openImage: function(index) {
        const event = new CustomEvent('gallery:open', { detail: { index } });
        document.dispatchEvent(event);
    },
    closeGallery: function() {
        const event = new CustomEvent('gallery:close');
        document.dispatchEvent(event);
    }
};
