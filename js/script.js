// ============================================
// TYPING EFFECT
// ============================================

const typingEffect = () => {
    const typingElement = document.querySelector('.typing-effect');
    const phrases = [
        'AI/ML & Full-Stack Developer',
        'Python & FastAPI Developer',
        'RAG & LLM Enthusiast',
        'Final-Year B.Tech CSE Student',
        'Problem Solver'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (!isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
                return;
            }
        }

        setTimeout(type, isDeleting ? 50 : 100);
    };

    type();
};

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const setupMobileMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
};

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const setupScrollToTop = () => {
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ============================================
// SCROLL ANIMATIONS - INTERSECTION OBSERVER
// ============================================

const setupScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skill-progress')) {
                    entry.target.style.animation = 'none';
                    setTimeout(() => {
                        entry.target.style.animation = '';
                    }, 10);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe fade-in elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .slide-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
};

// ============================================
// FORM VALIDATION AND SUBMISSION
// ============================================

const setupContactForm = () => {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages
        formMessage.className = '';
        formMessage.textContent = '';

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        // Validation
        let hasError = false;

        if (!name) {
            showError('name', 'Name is required');
            hasError = true;
        } else {
            clearError('name');
        }

        if (!email || !isValidEmail(email)) {
            showError('email', 'Valid email is required');
            hasError = true;
        } else {
            clearError('email');
        }

        if (!subject) {
            showError('subject', 'Please select a subject');
            hasError = true;
        } else {
            clearError('subject');
        }

        if (!message) {
            showError('message', 'Message is required');
            hasError = true;
        } else {
            clearError('message');
        }

        if (hasError) return;

        // Disable submit button and show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

        try {
            // This is a static site, so the message is handed to the visitor's email app
            const subjectSelect = document.getElementById('subject');
            const subjectLabel = subjectSelect.options[subjectSelect.selectedIndex].text;
            const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                phone ? `Phone: ${phone}` : null,
                '',
                message
            ].filter(line => line !== null).join('\n');

            window.location.href = 'mailto:joyaljeeya@gmail.com'
                + `?subject=${encodeURIComponent('Portfolio enquiry - ' + subjectLabel)}`
                + `&body=${encodeURIComponent(body)}`;

            formMessage.className = 'form-message success';
            formMessage.textContent = 'Opening your email app with the message filled in. If nothing happens, email joyaljeeya@gmail.com directly.';

            // Auto-hide message after 5 seconds
            setTimeout(() => {
                formMessage.className = '';
                formMessage.textContent = '';
            }, 5000);
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Something went wrong. Please email joyaljeeya@gmail.com directly.';
        } finally {
            // Restore submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const showError = (fieldId, errorMsg) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.style.borderColor = '#ef4444';
        field.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    }
    
    if (errorElement) {
        errorElement.textContent = errorMsg;
    }
};

const clearError = (fieldId) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
};

// ============================================
// SKILL PROGRESS ANIMATION
// ============================================

const setupSkillAnimations = () => {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.animation = 'none';
                        setTimeout(() => {
                            bar.style.animation = '';
                        }, 10);
                    }, index * 100);
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });
};

// ============================================
// SMOOTH SCROLL OFFSET FOR FIXED NAVBAR
// ============================================

const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (!target) return;

            const offsetTop = target.offsetTop - 80; // 80px offset for navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
};

// ============================================
// NAVBAR BACKGROUND ON SCROLL
// ============================================

const setupNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.99)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
};

// ============================================
// PARALLAX EFFECT
// ============================================

const setupParallax = () => {
    const heroGraphics = document.querySelector('.hero-graphics');
    if (!heroGraphics) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroGraphics.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    });
};

// ============================================
// COUNTER ANIMATION
// ============================================

const animateCounter = (element, target, suffix = '', duration = 1600) => {
    let current = 0;
    const increment = target / (duration / 16);
    const decimals = (String(target).split('.')[1] || '').length;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toFixed(decimals) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = current.toFixed(decimals) + suffix;
        }
    }, 16);
};

// ============================================
// STATS COUNTER
// ============================================

const setupStatsCounter = () => {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.dataset.counted) {
                    const statItems = entry.target.querySelectorAll('.stat-item h4');
                    statItems.forEach((item, index) => {
                        const number = parseFloat(item.dataset.value || item.textContent);
                        const suffix = item.dataset.suffix !== undefined ? item.dataset.suffix : '+';
                        if (!isNaN(number)) {
                            setTimeout(() => {
                                animateCounter(item, number, suffix);
                            }, index * 200);
                        }
                    });
                    entry.target.dataset.counted = 'true';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        observer.observe(aboutContent);
    }
};

// ============================================
// INITIALIZE ALL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    typingEffect();
    setupMobileMenu();
    setupScrollToTop();
    setupScrollAnimations();
    setupContactForm();
    setupSkillAnimations();
    setupSmoothScroll();
    setupNavbarScroll();
    setupParallax();
    setupStatsCounter();

    // Add active class to nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
});

// ============================================
// UPDATE ACTIVE NAV LINK ON SCROLL
// ============================================

const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
};

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

const setupLazyLoading = () => {
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

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// ============================================
// ACCESSIBILITY: FOCUS VISIBLE
// ============================================

const setupAccessibility = () => {
    document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #6366f1';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
};

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', setupAccessibility);

// ============================================
// PRELOAD ANIMATIONS
// ============================================

window.addEventListener('load', () => {
    setupLazyLoading();
    
    // Add a slight delay before showing content for better perception
    document.body.style.opacity = '1';
});

// Ensure body starts with opacity 1
document.body.style.opacity = '1';

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for resize events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Skip to main content on pressing 's'
    if (e.key === 's' || e.key === 'S') {
        const hero = document.getElementById('hero');
        if (hero) {
            hero.focus();
        }
    }
});

// ============================================
// PERFORMANCE: REDUCE MOTION
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('[style*="animation"]').forEach(el => {
        el.style.animation = 'none';
    });
}
