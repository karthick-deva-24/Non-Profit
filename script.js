document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');

    // ── Hamburger Menu Toggle ──────────────────────────────────
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    // Create backdrop overlay
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    const openMenu = () => {
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scroll
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.contains('open') ? closeMenu() : openMenu();
        });

        // Let nav links navigate naturally — don't intercept clicks
        // closeMenu is unnecessary here since page will reload on navigation

        // Close button inside drawer
        const closeBtn = navLinks.querySelector('.nav-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);

        // Close on overlay click
        overlay.addEventListener('click', closeMenu);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }
    // ──────────────────────────────────────────────────────────
    const fadeElements = document.querySelectorAll('.fade-in');

    // Navbar Scroll Effect (Subpages are always scrolled, but logic kept for resilience)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            // Keep it scrolled if it's a subpage (optional)
            // header.classList.remove('scrolled');
        }
    });

    // Reveal Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animating
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // Form Submission (Simulated)
    const forms = document.querySelectorAll('form:not(#login-form):not(#register-form):not(#profile-form)');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
                alert('Thank you! Your request has been received.');
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 2000);
            }, 1500);
        });
    });

    // Donation selection logic (for donate.html)
    const donationBtns = document.querySelectorAll('.donation-options .btn');
    if (donationBtns.length > 0) {
        donationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                donationBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = 'var(--primary)';
                });
                btn.classList.add('active');
                btn.style.background = 'var(--primary)';
                btn.style.color = 'white';
                
                const customInput = document.querySelector('input[type="number"]');
                if (btn.innerText !== 'Other' && customInput) {
                    customInput.value = btn.innerText.replace('$', '');
                }
            });
        });
    }
});

// Preloader Logic
const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.style.display = 'none', 600);
        }, 300); // Aesthetic delay
    }
};

if (document.readyState === 'complete') {
    hidePreloader();
} else {
    window.addEventListener('load', hidePreloader);
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'complete') {
        hidePreloader();
    }

    // Fade in when navigating away
    document.querySelectorAll('a:not([href="#"]):not([href^="mailto:"]):not([href^="tel:"])').forEach(link => {
        link.addEventListener('click', function(e) {
            const isSelf = this.hostname === window.location.hostname && this.getAttribute('target') !== '_blank';
            // Only trigger preloader internally and not on buttons acting as js triggers
            if (isSelf && !this.classList.contains('nav-link')) {
                const targetUrl = this.href;
                const preloader = document.getElementById('preloader');
                
                if (preloader && targetUrl && window.location.href !== targetUrl) {
                    e.preventDefault();
                    preloader.style.display = 'flex';
                    // force reflow
                    void preloader.offsetWidth;
                    preloader.classList.remove('loaded');
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 500);
                }
            }
        });
    });
});

// --- PREMIUM UI ANIMATIONS --- //
window.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Custom Cursor (Desktop Only)
    if (window.matchMedia("(pointer: fine)").matches) {
        const dot = document.createElement('div');
        dot.className = 'custom-cursor-dot';
        const outline = document.createElement('div');
        outline.className = 'custom-cursor-outline';
        document.body.appendChild(dot);
        document.body.appendChild(outline);

        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let outlineX = mouseX, outlineY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        const animateOutline = () => {
            let dx = mouseX - outlineX;
            let dy = mouseY - outlineY;
            outlineX += dx * 0.15;
            outlineY += dy * 0.15;
            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);

        document.querySelectorAll('a, button, input, select, .btn, .nav-link').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('custom-cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('custom-cursor-hover'));
        });
    }

    // 2. Animated Number Counters
    const animateCounter = (el) => {
        const finalStr = el.getAttribute('data-target') || el.innerText;
        if(!el.getAttribute('data-target')) el.setAttribute('data-target', finalStr);
        
        const prefix = finalStr.match(/^[\$\+]/) ? finalStr.match(/^[\$\+]/)[0] : '';
        const suffix = finalStr.match(/[\%]+$/) ? finalStr.match(/[\%]+$/)[0] : '';
        const finalNum = parseInt(finalStr.replace(/[^0-9]/g, ''));
        if (isNaN(finalNum) || finalNum === 0) return;
        
        let count = 0;
        const duration = 1500;
        const step = finalNum / (duration / 16); 
        
        const updateCounter = () => {
            count += step;
            if(count >= finalNum) {
                el.innerText = `${prefix}${finalNum.toLocaleString()}${suffix}`;
            } else {
                el.innerText = `${prefix}${Math.ceil(count).toLocaleString()}${suffix}`;
                requestAnimationFrame(updateCounter);
            }
        };
        updateCounter();
    };

    const cntObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.stat-info h3, .stat-card h2, .impact-number h2').forEach(el => cntObserver.observe(el));

    // Tab Pane Mutation Observer (Triggers animations on tab activation)
    const tabPanes = document.querySelectorAll('.tab-pane');
    if (tabPanes.length > 0) {
        const tabObserver = new MutationObserver((mutations) => {
            mutations.forEach(mut => {
                if (mut.target.style.display === 'block') {
                    mut.target.querySelectorAll('.stat-info h3, .stat-card h2').forEach(animateCounter);
                    mut.target.querySelectorAll('div[style*="width:"]').forEach(fill => {
                        if (fill.style.width !== '100%') {
                            const w = fill.style.width;
                            fill.classList.add('progress-fill');
                            fill.style.width = '0';
                            setTimeout(() => fill.style.width = w, 50);
                        }
                    });
                }
            });
        });
        tabPanes.forEach(pane => tabObserver.observe(pane, { attributes: true, attributeFilter: ['style'] }));
    }

    // 3. Typographic Reveal Animation
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.classList.add('stagger-word');
        heroTitle.style.animationDelay = '0.2s';
    }

    // 4. Magnetic Physics Buttons
    document.querySelectorAll('.btn, .donate-btn').forEach(btn => {
        btn.classList.add('magnetic');
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = `translate(0px, 0px)`;
        });
    });

    // 5. Fluid Mouse Parallax for Hero
    const heroLayer = document.querySelector('.hero');
    if (heroLayer) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 50;
            const y = (window.innerHeight / 2 - e.pageY) / 50;
            heroLayer.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
        });
    }
    // 6. Hero Background Slideshow
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        // Clear static background to avoid duplicates
        heroBg.style.backgroundImage = 'none';
        
        // High quality webp images below 100kb format
        const images = [
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?fm=webp&q=40&w=1200&auto=format&fit=crop', // Child smiling
            'https://images.unsplash.com/photo-1504159506876-f8338247a14a?fm=webp&q=40&w=1200&auto=format&fit=crop', // Charity hands
            'https://images.unsplash.com/photo-1542810634-71277d95dcbb?fm=webp&q=40&w=1200&auto=format&fit=crop', // Community
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?fm=webp&q=40&w=1200&auto=format&fit=crop', // Nature / Tree planting
            'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?fm=webp&q=40&w=1200&auto=format&fit=crop'  // Volunteers outdoors
        ];
        
        images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide-bg';
            slide.style.backgroundImage = `url('${src}')`;
            if (index === 0) slide.classList.add('active');
            heroBg.appendChild(slide);
        });

        const slides = heroBg.querySelectorAll('.slide-bg');
        let currentSlide = 0;
        
        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 6000); // Change image every 6 seconds
        }
    }
});
