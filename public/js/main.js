// js/main.js - Complete Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything after DOM loads
    initPortfolio();
});

function initPortfolio() {
    console.log('Portfolio initializing...');
    
    // Initialize core functionality
    setupNavigation();
    setupMobileMenu();
    setupScrollEffects();
    setupContactForm();
    createParticles();
    
    // Setup animations
    setupScrollAnimations();
    setupSkillBars();
    
    // Start initial animations immediately
    startInitialAnimations();
    
    // Setup scroll indicator hide on scroll
    console.log('About to setup scroll indicator');
    setupScrollIndicator();
    
    // Start typing animations
    console.log('About to setup typing animations');
    setupTypingAnimations();
}

// Navigation functionality
function setupNavigation() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                closeMobileMenu();
            }
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Scroll effects
function setupScrollEffects() {
    let ticking = false;
    
    function updateOnScroll() {
        const scrollY = window.scrollY;
        
        // Update navbar
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Update active nav links
        updateActiveNavigation();
        
        // Parallax effect for floating shapes
        document.querySelectorAll('.floating-shape').forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.1}deg)`;
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// Update active navigation
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = 'home';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validate form
            if (!validateForm(data)) return;
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Try to submit to backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    e.target.reset();
                } else {
                    throw new Error('Server error');
                }
                
            } catch (error) {
                console.log('Backend not available, using mailto fallback');
                
                // Fallback to mailto
                const mailtoLink = `mailto:cjpbuzaid@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
                    `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
                )}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                showNotification('Opening email client...', 'info');
                
                // Reset form after a short delay
                setTimeout(() => {
                    e.target.reset();
                }, 1000);
                
            } finally {
                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const { name, email, subject, message } = data;
    
    if (!name || name.trim().length < 2) {
        showNotification('Please enter your name (at least 2 characters)', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!subject || subject.trim().length < 5) {
        showNotification('Please enter a subject (at least 5 characters)', 'error');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showNotification('Please enter a message (at least 10 characters)', 'error');
        return false;
    }
    
    return true;
}

// Create particle system
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    const particleCount = window.innerWidth > 768 ? 30 : 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
        
        container.appendChild(particle);
    }
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate stats if present
                if (entry.target.classList.contains('stats-showcase')) {
                    animateStats(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Setup skill bars
function setupSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        if (width) {
                            bar.style.width = width;
                        }
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });
}

// Animate statistics
function animateStats(container) {
    const statItems = container.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
        setTimeout(() => {
            const numberEl = item.querySelector('.stat-number');
            const finalValue = numberEl.textContent;
            
            if (finalValue.includes('.')) {
                // Decimal values (GPA)
                animateNumber(numberEl, 0, parseFloat(finalValue), 1500, 1);
            } else if (finalValue.includes('x')) {
                // Multiplier values
                const num = parseInt(finalValue);
                animateNumber(numberEl, 0, num, 1000, 0);
                setTimeout(() => {
                    numberEl.textContent = num + 'x';
                }, 1000);
            } else if (finalValue.includes('+')) {
                // Plus values
                const num = parseInt(finalValue);
                animateNumber(numberEl, 0, num, 1200, 0);
                setTimeout(() => {
                    numberEl.textContent = num + '+';
                }, 1200);
            } else {
                // Regular numbers
                const num = parseInt(finalValue) || 0;
                animateNumber(numberEl, 0, num, 1000, 0);
            }
        }, index * 200);
    });
}

// Number animation helper
function animateNumber(element, start, end, duration, decimals = 0) {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = start + (end - start) * easeOut;
        element.textContent = current.toFixed(decimals);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end.toFixed(decimals);
        }
    };
    
    requestAnimationFrame(animate);
}

// Start initial animations after preloader
function startInitialAnimations() {
    // Typing animation for hero
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = typingElement.getAttribute('data-words').split(',');
        typeWriter(typingElement, words);
    }
    
    // Add visible class to already visible sections
    document.querySelectorAll('.fade-in').forEach(el => {
        if (isElementInViewport(el)) {
            el.classList.add('visible');
        }
    });
}

// Setup skill bars
function setupSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle skill bars
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        if (width) {
                            bar.style.width = width;
                        }
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });
}

// Typing animation
function typeWriter(element, words, wordIndex = 0, charIndex = 0) {
    if (!element || !words.length) return;
    
    const currentWord = words[wordIndex].trim();
    const speed = 100;
    const pauseTime = 2000;
    
    if (charIndex < currentWord.length) {
        element.textContent = currentWord.substring(0, charIndex + 1);
        setTimeout(() => typeWriter(element, words, wordIndex, charIndex + 1), speed);
    } else {
        setTimeout(() => {
            eraseText(element, words, wordIndex, currentWord.length);
        }, pauseTime);
    }
}

function eraseText(element, words, wordIndex, charIndex) {
    const currentWord = words[wordIndex].trim();
    const eraseSpeed = 50;
    
    if (charIndex > 0) {
        element.textContent = currentWord.substring(0, charIndex - 1);
        setTimeout(() => eraseText(element, words, wordIndex, charIndex - 1), eraseSpeed);
    } else {
        const nextWordIndex = (wordIndex + 1) % words.length;
        setTimeout(() => typeWriter(element, words, nextWordIndex, 0), 500);
    }
}

// Utility functions
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    
    notification.innerHTML = `${icons[type] || icons.info} ${message}`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Setup scroll indicator to hide on scroll
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    console.log('Setting up scroll indicator:', scrollIndicator);
    if (!scrollIndicator) return;
    
    let hasScrolled = false;
    
    window.addEventListener('scroll', () => {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            console.log('Hiding scroll indicator');
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => {
                scrollIndicator.style.display = 'none';
            }, 300);
        }
    });
}

// Setup typing animations
function setupTypingAnimations() {
    console.log('Setting up typing animations');
    // Type out "Computer Science Student" on load
    typeHeroTitle();
    
    // Type out programming languages in the terminal
    setTimeout(() => {
        typeProgrammingLanguages();
    }, 2000);
}

// Type hero title
function typeHeroTitle() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const words = ['Computer Science Student', 'Full-Stack Developer', 'AI Enthusiast', 'Problem Solver'];
    let wordIndex = 0;
    let isTyping = false;
    
    function typeWord() {
        if (isTyping) return;
        isTyping = true;
        
        const currentWord = words[wordIndex];
        let charIndex = 0;
        typingElement.textContent = '';
        
        function addChar() {
            if (charIndex < currentWord.length) {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(addChar, 100);
            } else {
                setTimeout(deleteWord, 2500);
            }
        }
        
        function deleteWord() {
            if (typingElement.textContent.length > 0) {
                typingElement.textContent = typingElement.textContent.substring(0, typingElement.textContent.length - 1);
                setTimeout(deleteWord, 50);
            } else {
                isTyping = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeWord, 500);
            }
        }
        
        addChar();
    }
    
    setTimeout(typeWord, 200);
}

// Type programming languages in terminal
function typeProgrammingLanguages() {
    const outputDiv = document.getElementById('language-output');
    const typingCommand = document.getElementById('typing-languages');
    
    console.log('Type programming languages - outputDiv:', outputDiv, 'typingCommand:', typingCommand);
    
    if (!outputDiv || !typingCommand) return;
    
    const languages = [
        { name: 'Python', project: 'Buzzy AI - Personal AI Assistant' },
        { name: 'JavaScript', project: 'Planno - AI Daily Planner' },
        { name: 'HTML', project: 'Portfolio Website' },
        { name: 'CSS', project: 'Responsive Web Design' },
        { name: 'C++', project: 'Advanced Computing Algorithms' },
        { name: 'Java', project: 'Data Structures & OOP' }
    ];
    
    // First, type the command
    const commandText = 'cat languages.txt';
    let charIndex = 0;
    typingCommand.textContent = '';
    
    function typeCommand() {
        if (charIndex < commandText.length) {
            typingCommand.textContent += commandText.charAt(charIndex);
            charIndex++;
            setTimeout(typeCommand, 80);
        } else {
            // After command is typed, show languages
            setTimeout(showLanguages, 400);
        }
    }
    
    function showLanguages() {
        let langIndex = 0;
        
        function typeNextLanguage() {
            if (langIndex >= languages.length) return;
            
            const langLine = document.createElement('div');
            langLine.className = 'language-item';
            
            const icon = getLanguageIcon(languages[langIndex].name);
            const languageName = languages[langIndex].name;
            const projectName = languages[langIndex].project;
            
            outputDiv.appendChild(langLine);
            
            // Type out the language name
            let charIndex = 0;
            const fullText = `${languageName} → ${projectName}`;
            langLine.textContent = icon + ' ';
            
            function typeChar() {
                if (charIndex < fullText.length) {
                    langLine.textContent += fullText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 30);
                } else {
                    langIndex++;
                    setTimeout(typeNextLanguage, 200);
                }
            }
            
            typeChar();
        }
        
        typeNextLanguage();
    }
    
    typeCommand();
}

// Get icon for language
function getLanguageIcon(language) {
    const icons = {
        'Python': '🐍',
        'JavaScript': '⚡',
        'HTML': '🌐',
        'CSS': '🎨',
        'C++': '⚙️',
        'Java': '☕'
    };
    return icons[language] || '📝';
}

// Handle window resize
window.addEventListener('resize', () => {
    // Recreate particles on resize
    createParticles();
});

console.log('Portfolio JavaScript loaded successfully');