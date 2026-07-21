document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypingEffect();
    initParticleBackground();
    initLogoLoops();
    initSkillFilters();
    initProjectFilters();
    initProjectCarouselControls();
    initSkillAnimations();
    initContactForm();
});

/* -------------------------------------------------------------
 * MOBILE NAVIGATION & SCROLL ACTIVE LINK
 * ------------------------------------------------------------- */
function initNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Shrink header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    });
}

/* -------------------------------------------------------------
 * TYPING EFFECT (HERO SUBTITLE)
 * ------------------------------------------------------------- */
function initTypingEffect() {
    const typingSpan = document.getElementById('typing-text');
    const roles = ["Full-Stack Developer", "AI/ML Enthusiast", "DSA Instructor"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at the end of the word
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    if (typingSpan) {
        setTimeout(type, 1000);
    }
}

/* -------------------------------------------------------------
 * FLOATING LINES BACKGROUND (HTML5 CANVAS)
 * ------------------------------------------------------------- */
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const config = {
        linesGradient: ['#8245f5', '#606dbf', '#6a6a6a'],
        animationSpeed: 1,
        bendRadius: 8,
        bendStrength: -2,
        mouseDamping: 0.05,
        parallaxStrength: 0.2
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let lines = [];

    const pointer = {
        targetX: null,
        targetY: null,
        x: null,
        y: null
    };

    window.addEventListener('mousemove', (event) => {
        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;
        if (pointer.x === null || pointer.y === null) {
            pointer.x = pointer.targetX;
            pointer.y = pointer.targetY;
        }
    });

    window.addEventListener('mouseout', () => {
        pointer.targetX = null;
        pointer.targetY = null;
    });

    function hexToRgb(hex) {
        const normalized = hex.replace('#', '');
        const value = parseInt(normalized, 16);
        return {
            r: (value >> 16) & 255,
            g: (value >> 8) & 255,
            b: value & 255
        };
    }

    function mixColor(colorA, colorB, amount) {
        const a = hexToRgb(colorA);
        const b = hexToRgb(colorB);
        const t = Math.max(0, Math.min(1, amount));

        return `rgb(${Math.round(a.r + (b.r - a.r) * t)}, ${Math.round(a.g + (b.g - a.g) * t)}, ${Math.round(a.b + (b.b - a.b) * t)})`;
    }

    function buildLines() {
        const lineCount = Math.max(16, Math.floor(height / 42));
        const spacing = height / (lineCount - 1);

        lines = Array.from({ length: lineCount }, (_, index) => {
            const colorStop = index / Math.max(1, lineCount - 1);
            const gradientIndex = colorStop * (config.linesGradient.length - 1);
            const colorA = config.linesGradient[Math.floor(gradientIndex)];
            const colorB = config.linesGradient[Math.min(config.linesGradient.length - 1, Math.ceil(gradientIndex))];

            return {
                y: spacing * index,
                phase: Math.random() * Math.PI * 2,
                wave: 18 + Math.random() * 24,
                drift: 0.42 + Math.random() * 0.55,
                width: 0.55 + Math.random() * 0.8,
                alpha: 0.18 + Math.random() * 0.22,
                color: mixColor(colorA, colorB, gradientIndex % 1)
            };
        });
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildLines();
    }

    function updatePointer() {
        if (pointer.targetX === null || pointer.targetY === null) {
            pointer.x = null;
            pointer.y = null;
            return;
        }

        pointer.x += (pointer.targetX - pointer.x) * config.mouseDamping;
        pointer.y += (pointer.targetY - pointer.y) * config.mouseDamping;
    }

    function getPointOnLine(line, x, elapsed) {
        const normalizedX = x / Math.max(1, width);
        const scrollParallax = window.scrollY * config.parallaxStrength * 0.08;
        const waveOffset = Math.sin((normalizedX * 7.5) + line.phase + elapsed * line.drift) * line.wave;
        const secondaryWave = Math.sin((normalizedX * 14) - elapsed * 0.35 + line.phase) * 5;
        let y = line.y + waveOffset + secondaryWave - scrollParallax;

        if (pointer.x !== null && pointer.y !== null) {
            const dx = pointer.x - x;
            const dy = pointer.y - y;
            const distance = Math.hypot(dx, dy);
            const radius = config.bendRadius * 22;

            if (distance < radius && distance > 0.001) {
                const influence = Math.pow(1 - distance / radius, 2);
                y += (dy / distance) * influence * config.bendStrength * 26;
            }
        }

        return { x, y };
    }

    function drawLine(line, elapsed) {
        const start = getPointOnLine(line, -40, elapsed);
        const step = 54;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        for (let x = step - 40; x <= width + 80; x += step) {
            const current = getPointOnLine(line, x, elapsed);
            const previous = getPointOnLine(line, x - step, elapsed);
            const controlX = previous.x + step * 0.5;
            const controlY = (previous.y + current.y) * 0.5;
            ctx.quadraticCurveTo(controlX, controlY, current.x, current.y);
        }

        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.alpha;
        ctx.lineWidth = line.width;
        ctx.shadowBlur = 16;
        ctx.shadowColor = line.color;
        ctx.stroke();
    }

    function animate(timestamp) {
        const elapsed = (timestamp / 1000) * config.animationSpeed;
        updatePointer();

        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        lines.forEach(line => drawLine(line, elapsed));
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';

        animationFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationFrameId = requestAnimationFrame(animate);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        } else if (!document.hidden && !animationFrameId) {
            animationFrameId = requestAnimationFrame(animate);
        }
    });
}
/* -------------------------------------------------------------
 * LOGO LOOP COMPONENT
 * ------------------------------------------------------------- */
function initLogoLoops() {
    const loops = document.querySelectorAll('[data-logo-loop]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    loops.forEach(loop => {
        const track = loop.querySelector('.logoloop__track');
        const list = loop.querySelector('.logoloop__list');
        if (!track || !list) return;

        const speed = Number(loop.dataset.speed || 18000);
        const hoverSpeed = loop.dataset.hoverSpeed === undefined ? 0 : Number(loop.dataset.hoverSpeed);
        const direction = loop.dataset.direction || 'left';
        const directionMultiplier = direction === 'right' || direction === 'down' ? -1 : 1;
        const targetVelocity = Math.abs(speed) * directionMultiplier * (speed < 0 ? -1 : 1);
        const smoothTau = 0.9;
        const minCopies = 2;
        const copyHeadroom = 2;

        let sequenceWidth = 0;
        let offset = 0;
        let velocity = 0;
        let isHovered = false;
        let rafId = null;
        let lastTimestamp = null;

        function syncCopies() {
            track.querySelectorAll('.logoloop__list[data-clone="true"]').forEach(clone => clone.remove());
            sequenceWidth = Math.ceil(list.getBoundingClientRect().width);
            if (!sequenceWidth) return;

            const copiesNeeded = Math.max(minCopies, Math.ceil(loop.clientWidth / sequenceWidth) + copyHeadroom);
            for (let index = 1; index < copiesNeeded; index += 1) {
                const clone = list.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.dataset.clone = 'true';
                clone.querySelectorAll('a, button').forEach(item => item.setAttribute('tabindex', '-1'));
                track.appendChild(clone);
            }

            offset = ((offset % sequenceWidth) + sequenceWidth) % sequenceWidth;
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }

        function animate(timestamp) {
            if (reduceMotion.matches) return;
            if (lastTimestamp === null) lastTimestamp = timestamp;

            const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            const currentTarget = isHovered ? hoverSpeed : targetVelocity;
            const easingFactor = 1 - Math.exp(-deltaTime / smoothTau);
            velocity += (currentTarget - velocity) * easingFactor;

            if (sequenceWidth > 0) {
                offset += velocity * deltaTime;
                offset = ((offset % sequenceWidth) + sequenceWidth) % sequenceWidth;
                track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            }

            rafId = requestAnimationFrame(animate);
        }

        function nudge(directionValue) {
            if (sequenceWidth <= 0) return;

            const distance = Math.min(Math.max(loop.clientWidth * 0.45, 240), 420);
            const directionSign = directionValue === 'prev' ? -1 : 1;

            velocity = 0;
            offset += distance * directionSign;
            offset = ((offset % sequenceWidth) + sequenceWidth) % sequenceWidth;
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
        function start() {
            if (rafId || reduceMotion.matches) return;
            lastTimestamp = null;
            rafId = requestAnimationFrame(animate);
        }

        function stop() {
            if (!rafId) return;
            cancelAnimationFrame(rafId);
            rafId = null;
            lastTimestamp = null;
        }

        const hoverTarget = loop.closest('.project-carousel-shell') || loop;

        hoverTarget.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        hoverTarget.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        loop.addEventListener('logoLoop:refresh', syncCopies);

        loop.addEventListener('logoLoop:nudge', event => {
            nudge(event.detail?.direction);
        });

        const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(syncCopies) : null;
        if (resizeObserver) {
            resizeObserver.observe(loop);
            resizeObserver.observe(list);
        } else {
            window.addEventListener('resize', syncCopies);
        }

        reduceMotion.addEventListener('change', event => {
            if (event.matches) {
                stop();
                track.style.transform = 'translate3d(0, 0, 0)';
            } else {
                start();
            }
        });

        syncCopies();
        start();
    });
}
function initProjectCarouselControls() {
    const controls = document.querySelectorAll('[data-loop-control][data-loop-target]');

    controls.forEach(control => {
        const target = document.getElementById(control.dataset.loopTarget);
        if (!target) return;

        control.addEventListener('click', () => {
            target.dispatchEvent(new CustomEvent('logoLoop:nudge', {
                detail: {
                    direction: control.dataset.loopControl
                }
            }));
        });
    });
}
/* -------------------------------------------------------------
 * SKILLS MATRIX FILTERING
 * ------------------------------------------------------------- */
function initSkillFilters() {
    const filterChips = document.querySelectorAll('.skills-filters .filter-chip');
    const skillCards = document.querySelectorAll('#skills-container .skill-card');
    const skillColumns = document.querySelectorAll('#skills-container .skills-category-column');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Toggle chips active class
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-filter');

            skillColumns.forEach(column => {
                const category = column.getAttribute('data-category');
                column.classList.toggle('dimmed', filterValue !== 'all' && category !== filterValue);
            });

            skillCards.forEach(card => {
                card.classList.remove('dimmed');
            });
        });
    });
}

/* -------------------------------------------------------------
 * PROJECTS GALLERY FILTERING
 * ------------------------------------------------------------- */
function initProjectFilters() {
    const projectChips = document.querySelectorAll('.projects-filters .project-chip');
    const projectsContainer = document.getElementById('projects-container');
    const projectCards = document.querySelectorAll('#projects-container .logoloop__list:not([data-clone]) .project-card');

    projectChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Toggle active chip
            projectChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-proj-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-proj-cat');
                const shouldShow = filterValue === 'all' || category === filterValue;
                const item = card.closest('.project-logoloop__item');

                card.classList.toggle('hide', !shouldShow);
                item?.classList.toggle('hide', !shouldShow);

                if (shouldShow) {
                    // Add entry animation trigger class
                    card.style.animation = 'scaleIn 0.4s ease forwards';
                }
            });

            projectsContainer?.dispatchEvent(new CustomEvent('logoLoop:refresh'));
        });
    });
}
/* -------------------------------------------------------------
 * INTERACTION OBSERVER FOR SKILLS PROGRESS BARS
 * ------------------------------------------------------------- */
function initSkillAnimations() {
    const skillsContainer = document.getElementById('skills-container');
    const progressBars = document.querySelectorAll('.skill-progress');

    if (!skillsContainer) return;

    progressBars.forEach(bar => {
        const skillCard = bar.closest('.skill-card');
        const skillHeader = skillCard?.querySelector('.skill-header');
        const targetWidth = bar.style.width || '0%';

        if (skillHeader && !skillHeader.querySelector('.skill-level')) {
            const level = document.createElement('span');
            level.className = 'skill-level';
            level.textContent = targetWidth;
            skillHeader.appendChild(level);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each progress bar to its style width
                progressBars.forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                        bar.style.width = targetWidth;
                    }, 100);
                });
                // Unobserve once animation triggers
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(skillsContainer);
}

/* -------------------------------------------------------------
 * CONTACT FORM SUBMIT & TOAST FEEDBACK
 * ------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const recipientEmail = 'murthy.kunche@sasi.ac.in';
    const formEndpoint = `https://formsubmit.co/ajax/${recipientEmail}`;

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) return;

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch(formEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _subject: `Portfolio message from ${name}`,
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            if (!response.ok) {
                throw new Error('Message could not be sent.');
            }

            showToast(`Thanks, ${name}! Your message has been sent.`);
            form.reset();
        } catch (error) {
            showToast('Sorry, the message could not be sent. Please try again or email me directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    function showToast(messageText) {
        if (!toast) return;
        toastMessage.textContent = messageText;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }
}