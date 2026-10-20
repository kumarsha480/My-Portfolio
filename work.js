// --------------------------------------------------------
// Custom Cursor
// --------------------------------------------------------
const cursor = document.querySelector('.cursor');

if (cursor) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    const setupCursorHovers = () => {
        const interactiveElements = document.querySelectorAll('a, button, .work-slide, .slider-arrow-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    };
    setupCursorHovers();
}

// --------------------------------------------------------
// Theme Toggle with LocalStorage Sync
// --------------------------------------------------------
const themeToggleBtn = document.getElementById('themeToggle');
const moonIcon = document.querySelector('.moon-icon path');

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio-theme', 'dark');
        if (moonIcon) moonIcon.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'light');
        if (moonIcon) moonIcon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
    }
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
setTheme(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isCurrentlyDark = document.body.hasAttribute('data-theme') || document.documentElement.hasAttribute('data-theme');
        setTheme(isCurrentlyDark ? 'light' : 'dark');
    });
}

// --------------------------------------------------------
// Project Showcase 3-Card Carousel
// --------------------------------------------------------
const slides = document.querySelectorAll('.work-slide');
const totalSlides = slides.length;
const titleElement = document.getElementById('activeProjectTitle');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');

let currentIndex = 0;

function updateSlides(animate = true) {
    slides.forEach((slide, i) => {
        let diff = (i - currentIndex) % totalSlides;
        if (diff < -Math.floor(totalSlides / 2)) diff += totalSlides;
        if (diff > Math.floor(totalSlides / 2)) diff -= totalSlides;

        const isCurrent = diff === 0;
        const isPrev = diff === -1;
        const isNext = diff === 1;

        slide.classList.remove('is-active', 'is-prev', 'is-next');
        
        let targetX = 0;
        let targetScale = 0.85;
        let targetOpacity = 0;
        let zIndex = 1;

        if (isCurrent) {
            slide.classList.add('is-active');
            targetX = 0;
            targetScale = 1;
            targetOpacity = 1;
            zIndex = 10;
        } else if (isNext) {
            slide.classList.add('is-next');
            targetX = 104; // Visible on screen at the right
            targetScale = 0.85;
            targetOpacity = 0.72;
            zIndex = 5;
        } else if (isPrev) {
            slide.classList.add('is-prev');
            targetX = -104; // Visible on screen at the left
            targetScale = 0.85;
            targetOpacity = 0.72;
            zIndex = 5;
        } else {
            targetX = diff > 0 ? 210 : -210;
            targetScale = 0.7;
            targetOpacity = 0;
            zIndex = 1;
        }

        if (animate) {
            gsap.to(slide, {
                xPercent: targetX,
                scale: targetScale,
                opacity: targetOpacity,
                duration: 0.65,
                ease: "power3.out",
                overwrite: "auto",
                onStart: () => {
                    slide.style.zIndex = zIndex;
                    slide.style.pointerEvents = (isCurrent || isPrev || isNext) ? 'auto' : 'none';
                }
            });
        } else {
            gsap.set(slide, {
                xPercent: targetX,
                scale: targetScale,
                opacity: targetOpacity,
                zIndex: zIndex
            });
            slide.style.pointerEvents = (isCurrent || isPrev || isNext) ? 'auto' : 'none';
        }
    });

    // Update Top Title with smooth cross-fade animation (no vertical jumping)
    const activeSlide = slides[currentIndex];
    const newTitle = activeSlide.dataset.title;

    if (titleElement && titleElement.textContent !== newTitle) {
        if (animate) {
            gsap.to(titleElement, {
                opacity: 0,
                duration: 0.15,
                ease: "power1.inOut",
                onComplete: () => {
                    titleElement.textContent = newTitle;
                    gsap.to(titleElement, {
                        opacity: 1,
                        duration: 0.25,
                        ease: "power1.inOut"
                    });
                }
            });
        } else {
            titleElement.textContent = newTitle;
        }
    }
}

function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlides(true);
}

function nextSlide() {
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    goToSlide(currentIndex - 1);
}

// Click directly on peek cards to navigate
slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
        if (index !== currentIndex) {
            goToSlide(index);
        }
    });
});

// Arrow buttons
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

// Keyboard arrow navigation
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Touch swipe and mouse drag navigation
let startX = 0;
let isDragging = false;

window.addEventListener('mousedown', (e) => {
    if (e.target.closest('.navbar, .slider-arrow-btn')) return;
    startX = e.clientX;
    isDragging = true;
});

window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    if (diffX < -40) nextSlide();
    else if (diffX > 40) prevSlide();
});

window.addEventListener('touchstart', (e) => {
    if (e.target.closest('.navbar, .slider-arrow-btn')) return;
    startX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - startX;
    if (diffX < -40) nextSlide();
    else if (diffX > 40) prevSlide();
}, { passive: true });

// Wheel navigation (strictly horizontal, zero vertical page movement)
let wheelCooldown = false;
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelCooldown) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 15) {
        wheelCooldown = true;
        if (delta > 0) nextSlide();
        else prevSlide();
        setTimeout(() => { wheelCooldown = false; }, 380);
    }
}, { passive: false });

// Initial positioning on page load
updateSlides(false);

// Remove Netlify HUD / "Powered by Netlify" Badge
const removeNetlifyBadge = () => {
    const badge = document.getElementById('nl-hud-frame') || document.querySelector('iframe[title*="Netlify"], iframe[id^="nl-hud"]');
    if (badge) {
        badge.remove();
    }
};
removeNetlifyBadge();
const hudObserver = new MutationObserver(removeNetlifyBadge);
hudObserver.observe(document.documentElement, { childList: true, subtree: true });
