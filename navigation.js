/**
 * Portfolio Navigation & Carousel Functionality
 * Handles mobile menu toggle, smooth scrolling, carousel navigation, and form validation
 * Author: Aganze Yannick
 * Last Updated: 2026
 */

// ============================================
// 1. MOBILE MENU TOGGLE FUNCTIONALITY
// ============================================

/**
 * Toggles the mobile navigation menu open/closed
 * Adds animation class to hamburger and nav menu
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// 2. NAVIGATION HIGHLIGHT (ACTIVE STATE)
// ============================================

/**
 * Updates the active navigation link based on current page
 * Compares the current URL with nav links to highlight active page
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ============================================
// 3. CAROUSEL/SLIDER FUNCTIONALITY
// ============================================

/**
 * Carousel object to manage image slider functionality
 * Handles navigation, keyboard controls, and slide counter
 */
const carousel = {
    // Carousel state variables
    currentSlide: 0,
    slides: [],
    totalSlides: 0,
    autoPlayInterval: null,

    /**
     * Initializes the carousel
     * Sets up event listeners for carousel controls
     */
    init() {
        // Get all carousel slides
        this.slides = document.querySelectorAll('.carousel-slide');
        if (this.slides.length === 0) return; // Exit if no carousel on page

        this.totalSlides = this.slides.length;

        // Initialize carousel display
        this.showSlide(0);
        this.updateCounter();

        // Get control buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Add click event listeners to buttons
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Optional: Auto-play carousel every 5 seconds
        // Uncomment the line below to enable auto-play
        // this.startAutoPlay();
    },

    /**
     * Displays a specific slide
     * @param {number} n - The slide index to display
     */
    showSlide(n) {
        // Wrap around carousel (infinite loop)
        if (n >= this.totalSlides) {
            this.currentSlide = 0;
        } else if (n < 0) {
            this.currentSlide = this.totalSlides - 1;
        } else {
            this.currentSlide = n;
        }

        // Hide all slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Show current slide with fade animation
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].style.display = 'block';
            this.slides[this.currentSlide].style.animation = 'fadeIn 0.5s ease-in-out';
        }
    },

    /**
     * Shows the next slide
     */
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
        this.updateCounter();
        this.resetAutoPlay();
    },

    /**
     * Shows the previous slide
     */
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
        this.updateCounter();
        this.resetAutoPlay();
    },

    /**
     * Updates the carousel counter display
     * Shows current slide number / total slides
     */
    updateCounter() {
        const currentDisplay = document.getElementById('currentSlide');
        if (currentDisplay) {
            currentDisplay.textContent = this.currentSlide + 1;
        }

        const totalDisplay = document.getElementById('totalSlides');
        if (totalDisplay) {
            totalDisplay.textContent = this.totalSlides;
        }
    },

    /**
     * Handles keyboard navigation for carousel
     * Left arrow: previous slide
     * Right arrow: next slide
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyPress(e) {
        if (this.totalSlides === 0) return; // No carousel on page

        if (e.key === 'ArrowLeft') {
            this.prevSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        }
    },

    /**
     * Starts auto-play carousel
     * Automatically advances to next slide every 5 seconds
     */
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    },

    /**
     * Stops the auto-play timer
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    },

    /**
     * Resets auto-play timer when user manually navigates
     */
    resetAutoPlay() {
        this.stopAutoPlay();
        // Uncomment below to resume auto-play after manual interaction
        // this.startAutoPlay();
    }
};

// ============================================
// 4. CONTACT FORM VALIDATION & SUBMISSION
// ============================================

/**
 * Form validation object
 * Handles form input validation and submission
 */
const formValidator = {
    /**
     * Initializes form validation
     * Attaches event listeners to form elements
     */
    init() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return; // Exit if no form on page

        // Prevent default form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndSubmit(contactForm);
        });

        // Add real-time validation on input
        const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            input.addEventListener('focus', () => {
                this.clearError(input);
            });
        });
    },

    /**
     * Validates a single form field
     * @param {HTMLElement} field - The input or textarea element to validate
     * @returns {boolean} - True if field is valid, false otherwise
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorElement = document.getElementById(fieldId + 'Error');

        // Name validation
        if (fieldId === 'name') {
            if (value.length < 2) {
                this.showError(field, errorElement, 'Please enter a valid name (at least 2 characters)');
                return false;
            }
        }

        // Email validation
        if (fieldId === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
        }

        // Message validation
        if (fieldId === 'message') {
            if (value.length < 10) {
                this.showError(field, errorElement, 'Message must be at least 10 characters long');
                return false;
            }
        }

        // Clear error if validation passes
        this.clearError(field, errorElement);
        return true;
    },

    /**
     * Validates the entire form before submission
     * @param {HTMLElement} form - The form element
     * @returns {boolean} - True if entire form is valid
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    /**
     * Shows validation error message
     * @param {HTMLElement} field - The form field
     * @param {HTMLElement} errorElement - The error message element
     * @param {string} message - The error message to display
     */
    showError(field, errorElement, message) {
        if (field) {
            field.classList.add('error');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    },

    /**
     * Clears validation error for a field
     * @param {HTMLElement} field - The form field
     * @param {HTMLElement} errorElement - The error message element (optional)
     */
    clearError(field, errorElement) {
        if (field) {
            field.classList.remove('error');
        }
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    },

    /**
     * Validates and submits the contact form
     * Shows success message if validation passes
     * @param {HTMLElement} form - The form element
     */
    validateAndSubmit(form) {
        // Clear previous success message
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'none';
        }

        // Validate entire form
        if (this.validateForm(form)) {
            // In a real application, you would send the form data to a server here
            // Example: await fetch('/api/contact', { method: 'POST', body: formData });
            
            console.log('Form submitted successfully!');
            console.log('Form data:', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            });

            // Show success message
            if (successMessage) {
                successMessage.style.display = 'block';
                successMessage.style.animation = 'slideInUp 0.5s ease-out';
            }

            // Reset form after successful submission
            setTimeout(() => {
                form.reset();
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            }, 3000);
        }
    }
};

// ============================================
// 5. SMOOTH SCROLLING
// ============================================

/**
 * Enables smooth scrolling for anchor links
 * All internal links with hash (#) will scroll smoothly
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// 6. GALLERY HOVER EFFECTS
// ============================================

/**
 * Initializes hover effects on gallery items
 * Adds animation and scaling on hover
 */
function initGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        // Add hover animation
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.cursor = 'pointer';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 7. INITIALIZE ALL FEATURES ON PAGE LOAD
// ============================================

/**
 * Main initialization function
 * Runs all initialization functions when the DOM is fully loaded
 */
function initializePageFeatures() {
    // Initialize mobile menu
    initMobileMenu();

    // Update active navigation link
    updateActiveNavLink();

    // Initialize carousel if on gallery page
    carousel.init();

    // Initialize form validation if on contact page
    formValidator.init();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize gallery hover effects
    initGalleryHoverEffects();

    console.log('✓ All page features initialized successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageFeatures);
} else {
    // DOM is already loaded
    initializePageFeatures();
}

// ============================================
// 8. ADDITIONAL UTILITY FUNCTIONS
// ============================================

/**
 * Adds animation class to an element
 * @param {HTMLElement} element - The element to animate
 * @param {string} animationName - The CSS animation name
 * @param {number} duration - Duration in milliseconds (optional)
 */
function animateElement(element, animationName, duration = 1000) {
    element.style.animation = `${animationName} ${duration}ms ease-out`;
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

/**
 * Detects if device is mobile
 * @returns {boolean} - True if device is mobile/tablet
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Adds smooth scroll behavior to page
 * Can be toggled with CSS or called manually
 */
function enableSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// ============================================
// END OF NAVIGATION.JS
// ============================================