/* ============================================================
   THE DAILY GRIND CAFÉ — JavaScript
   Animations, interactions, and UI logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== Custom Cursor ===== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (window.matchMedia('(hover: hover)').matches && cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .menu-item, .gallery-item, .special-card, .team-card, input, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ===== Navbar Scroll ===== */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
        backToTop.classList.toggle('visible', window.scrollY > 600);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===== Active Nav Link ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerNav = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(s => observerNav.observe(s));

    /* ===== Mobile Menu ===== */
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksEl.classList.toggle('open');
    });

    // Close on link click
    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksEl.classList.remove('open');
        });
    });

    /* ===== Scroll Reveal ===== */
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    /* ===== Counter Animation ===== */
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const start = performance.now();

                function updateCounter(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const current = target * ease;
                    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                    if (progress < 1) requestAnimationFrame(updateCounter);
                }
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ===== Menu Tabs ===== */
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.category;
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            menuCategories.forEach(c => {
                if (cat === 'all' || c.dataset.cat === cat) {
                    c.classList.remove('hidden');
                } else {
                    c.classList.add('hidden');
                }
            });
        });
    });

    /* ===== Reviews Carousel ===== */
    const track = document.getElementById('reviewsTrack');
    const cards = track.querySelectorAll('.review-card');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    let currentSlide = 0;
    let autoPlay;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(n) {
        currentSlide = ((n % cards.length) + cards.length) % cards.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoPlay(); });

    function resetAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
    resetAutoPlay();

    /* ===== Contact Form ===== */
    document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.textContent = 'Message Sent! ✓';
        btn.style.background = '#047857';
        setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.style.background = '';
            e.target.reset();
        }, 3000);
    });

    /* ===== Steam / Particle Canvas ===== */
    const canvas = document.getElementById('steamCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = h + Math.random() * 100;
                this.size = Math.random() * 3 + 1;
                this.speedY = -(Math.random() * 0.5 + 0.2);
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.15 + 0.05;
                this.life = 0;
                this.maxLife = Math.random() * 300 + 200;
            }
            update() {
                this.x += this.speedX + Math.sin(this.life * 0.01) * 0.2;
                this.y += this.speedY;
                this.life++;
                const lifeRatio = this.life / this.maxLife;
                this.currentOpacity = this.opacity * (1 - lifeRatio);
                if (this.life >= this.maxLife) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(194, 120, 60, ${this.currentOpacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const count = Math.min(60, Math.floor(w / 20));
        for (let i = 0; i < count; i++) {
            const p = new Particle();
            p.y = Math.random() * h;
            p.life = Math.random() * p.maxLife;
            particles.push(p);
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
