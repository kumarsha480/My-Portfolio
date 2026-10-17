// Initialize Locomotive Scroll (Lenis) for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// GSAP ScrollTrigger Integration with Lenis
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// --------------------------------------------------------
// Custom Cursor
// --------------------------------------------------------
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Add hover effect to links, buttons, and images
const interactiveElements = document.querySelectorAll('a, button, .project-card, .hero-play-btn, .service-header, .service-list li');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// --------------------------------------------------------
// Theme Toggle
// --------------------------------------------------------
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;
const moonIcon = document.querySelector('.moon-icon path');

// Load saved theme or default to dark
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

themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.body.hasAttribute('data-theme') || document.documentElement.hasAttribute('data-theme');
    setTheme(isCurrentlyDark ? 'light' : 'dark');
});

// --------------------------------------------------------
// GSAP Reveal Animations
// --------------------------------------------------------
const fadeUpElements = document.querySelectorAll('.fade-up');

fadeUpElements.forEach(element => {
    gsap.fromTo(element, 
        { 
            y: 50, 
            opacity: 0 
        },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Trigger animation when element is 85% from top of viewport
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Staggered animation for project cards
ScrollTrigger.batch(".project-card", {
    onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out"}),
    onLeaveBack: batch => gsap.set(batch, {opacity: 0, y: 50}),
    start: "top 85%",
});

// Set initial state for batch elements
gsap.set(".project-card", {y: 50, opacity: 0});

// Hero video shrink and pin on scroll
const mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=150%", // Pin for 150% of viewport height while shrinking
            scrub: true,
            pin: true
        }
    });

    heroTl.to(".hero-video-wrapper", {
        width: "40vw",
        height: "45vh",
        borderRadius: "0px",
        ease: "power1.inOut"
    }, 0);

    heroTl.to(".hero-controls", {
        scale: 0.6,
        bottom: "1.5rem",
        left: "1.5rem",
        transformOrigin: "bottom left",
        ease: "power1.inOut"
    }, 0);
});

mm.add("(max-width: 768px)", () => {
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=120%",
            scrub: true,
            pin: true
        }
    });

    heroTl.to(".hero-video-wrapper", {
        width: "75vw",
        height: "42vh",
        borderRadius: "0px",
        ease: "power1.inOut"
    }, 0);

    heroTl.to(".hero-controls", {
        scale: 0.7,
        bottom: "1rem",
        left: "1rem",
        transformOrigin: "bottom left",
        ease: "power1.inOut"
    }, 0);
});

// --------------------------------------------------------
// Video Controls
// --------------------------------------------------------
const heroVideo = document.getElementById("heroVideo");
const playPauseBtn = document.getElementById("playPauseBtn");
const muteUnmuteBtn = document.getElementById("muteUnmuteBtn");

const playIcon = playPauseBtn.querySelector(".play-icon");
const pauseIcon = playPauseBtn.querySelector(".pause-icon");

const muteIcon = muteUnmuteBtn.querySelector(".mute-icon");
const unmuteIcon = muteUnmuteBtn.querySelector(".unmute-icon");

playPauseBtn.addEventListener("click", () => {
    if (heroVideo.paused) {
        heroVideo.play();
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    } else {
        heroVideo.pause();
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    }
});

muteUnmuteBtn.addEventListener("click", () => {
    if (heroVideo.muted) {
        heroVideo.muted = false;
        muteIcon.style.display = "none";
        unmuteIcon.style.display = "block";
    } else {
        heroVideo.muted = true;
        muteIcon.style.display = "block";
        unmuteIcon.style.display = "none";
    }
});

// --------------------------------------------------------
// Services Accordion (Click & Hover Interaction - FAQ Style)
// --------------------------------------------------------
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    const header = item.querySelector('.service-header');
    if (!header) return;

    // Click: toggle open / close
    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        if (isOpen) {
            item.classList.remove('active');
            item.dataset.pinned = "false";
            header.setAttribute('aria-expanded', 'false');
            item.dataset.justClosed = "true";
        } else {
            item.classList.add('active');
            item.dataset.pinned = "true";
            item.dataset.justClosed = "false";
            header.setAttribute('aria-expanded', 'true');
        }
    });

    // Hover (mouseenter): open while hovering cursor on it
    item.addEventListener('mouseenter', () => {
        if (item.dataset.justClosed === "true") return;
        if (!item.classList.contains('active')) {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
        }
    });

    // Unhover (mouseleave): close unless pinned/clicked open
    item.addEventListener('mouseleave', () => {
        item.dataset.justClosed = "false";
        if (item.dataset.pinned !== "true") {
            item.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
        }
    });

    // Keyboard accessibility: Enter or Space toggles
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
        }
    });
});

// --------------------------------------------------------
// Approach Section Pop Collage ("Show me" / "Close")
// --------------------------------------------------------
const approachSection = document.getElementById('approachSection');
const approachToggleBtn = document.getElementById('approachToggleBtn');
const approachPopsContainer = document.getElementById('approachPopsContainer');
const approachPopVideo = document.getElementById('approachPopVideo');
const popVideoPlayBtn = document.getElementById('popVideoPlayBtn');
const popVideoScrubBar = document.getElementById('popVideoScrubBar');

if (approachToggleBtn && approachSection && approachPopsContainer) {
    const btnText = approachToggleBtn.querySelector('.btn-text');
    const popItems = approachPopsContainer.querySelectorAll('.approach-pop-item');
    let isPopsOpen = false;

    function openPops() {
        isPopsOpen = true;
        approachSection.classList.add('is-pops-open');
        approachToggleBtn.classList.add('is-active');
        approachToggleBtn.setAttribute('aria-expanded', 'true');
        approachPopsContainer.setAttribute('aria-hidden', 'false');
        if (btnText) btnText.textContent = 'Close';

        // Play the embedded pop video
        if (approachPopVideo) {
            approachPopVideo.currentTime = 0;
            approachPopVideo.play().catch(err => {
                console.log('Pop video autoplay prevented', err);
            });
        }

        // Smoothly frame the entire approach section in viewport
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(approachSection, { offset: -25, duration: 0.7 });
        }

        // GSAP Pop Animation for desktop/tablet
        if (window.innerWidth > 768) {
            gsap.killTweensOf(popItems);
            gsap.fromTo(popItems, 
                {
                    scale: 0.15,
                    opacity: 0,
                    y: (i) => (i % 2 === 0 ? 60 : -60),
                    rotate: (i) => (i % 2 === 0 ? -18 : 18)
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    rotate: (i, el) => parseFloat(el.dataset.rotate || 0),
                    duration: 0.75,
                    stagger: {
                        amount: 0.35,
                        from: "random"
                    },
                    ease: "back.out(1.8)",
                    onComplete: () => {
                        ScrollTrigger.refresh();
                    }
                }
            );
        } else {
            // Mobile stagger fade
            gsap.killTweensOf(popItems);
            gsap.fromTo(popItems,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                    stagger: 0.06,
                    ease: "power2.out",
                    onComplete: () => {
                        ScrollTrigger.refresh();
                    }
                }
            );
        }

        ScrollTrigger.refresh();
    }

    function closePops() {
        if (!isPopsOpen) return;
        isPopsOpen = false;

        if (window.innerWidth > 768) {
            gsap.killTweensOf(popItems);
            gsap.to(popItems, {
                scale: 0.2,
                opacity: 0,
                y: 30,
                duration: 0.35,
                stagger: 0.02,
                ease: "power2.in",
                onComplete: () => {
                    finalizeClose();
                }
            });
        } else {
            gsap.killTweensOf(popItems);
            gsap.to(popItems, {
                opacity: 0,
                y: 15,
                duration: 0.25,
                ease: "power2.in",
                onComplete: () => {
                    finalizeClose();
                }
            });
        }
    }

    function finalizeClose() {
        approachSection.classList.remove('is-pops-open');
        approachToggleBtn.classList.remove('is-active');
        approachToggleBtn.setAttribute('aria-expanded', 'false');
        approachPopsContainer.setAttribute('aria-hidden', 'true');
        if (btnText) btnText.textContent = 'Show me';

        if (approachPopVideo) {
            approachPopVideo.pause();
        }

        ScrollTrigger.refresh();
    }

    // Toggle button click
    approachToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPopsOpen) {
            closePops();
        } else {
            openPops();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isPopsOpen) {
            closePops();
        }
    });

    // Pop Video Controls
    if (approachPopVideo && popVideoPlayBtn) {
        const pauseIcon = popVideoPlayBtn.querySelector('.pause-icon');
        const playIcon = popVideoPlayBtn.querySelector('.play-icon');

        popVideoPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (approachPopVideo.paused) {
                approachPopVideo.play();
                if (pauseIcon) pauseIcon.style.display = 'block';
                if (playIcon) playIcon.style.display = 'none';
            } else {
                approachPopVideo.pause();
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (playIcon) playIcon.style.display = 'block';
            }
        });

        approachPopVideo.addEventListener('timeupdate', () => {
            if (popVideoScrubBar && approachPopVideo.duration) {
                const percent = (approachPopVideo.currentTime / approachPopVideo.duration) * 100;
                popVideoScrubBar.style.width = percent + '%';
            }
        });
    }

    // Bind custom cursor hover to pops & buttons
    popItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hover');
        });
        item.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hover');
        });
    });
    approachToggleBtn.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hover');
    });
    approachToggleBtn.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hover');
    });
    if (popVideoPlayBtn) {
        popVideoPlayBtn.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hover');
        });
        popVideoPlayBtn.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hover');
        });
    }
}



