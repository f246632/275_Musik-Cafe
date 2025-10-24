// ===================================
// MUSIK-CAFÉ BERLIN - MAIN JAVASCRIPT
// Modern, Smooth, Performant
// ===================================

'use strict';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
});

// ===================================
// NAVIGATION
// ===================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = this.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active')
            ? 'rotate(45deg) translate(6px, 6px)'
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active')
            ? 'rotate(-45deg) translate(6px, -6px)'
            : 'none';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');

            // Reset hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// SMOOTH SCROLLING
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.feature-item, .menu-category, .gallery-item, .info-card, .contact-item'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ===================================
// CONTACT FORM
// ===================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showFormMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }

        // Simulate form submission (in production, this would send to a server)
        submitForm(formData);
    });

    function submitForm(data) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Success
            showFormMessage(
                'Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.',
                'success'
            );

            // Reset form
            form.reset();

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // In production, replace setTimeout with actual fetch/AJAX call:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                showFormMessage(
                    'Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.',
                    'success'
                );
                form.reset();
            })
            .catch(error => {
                showFormMessage(
                    'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
                    'error'
                );
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
            */
        }, 1500);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .scroll-to-top:hover {
            background: var(--primary-dark);
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Lazy load images (for browsers that don't support native lazy loading)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // This would be used if images had data-src instead of src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for performance
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Get offset top accounting for navbar
function getOffsetTop(element) {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    return element.offsetTop - navbarHeight;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Skip to main content link
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' && !e.shiftKey) {
        const firstInteractive = document.querySelector('a, button, input, textarea, select');
        if (document.activeElement === document.body && firstInteractive) {
            e.preventDefault();
            firstInteractive.focus();
        }
    }
});

// Trap focus in mobile menu when open
const navMenu = document.getElementById('navMenu');
if (navMenu) {
    navMenu.addEventListener('keydown', function(e) {
        if (!this.classList.contains('active')) return;

        const focusableElements = this.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        if (e.key === 'Escape') {
            this.classList.remove('active');
            document.getElementById('navToggle').focus();
        }
    });
}

// Log initialization
console.log('Musik-Café website initialized successfully');
