/* ═══════════════════════════════════════════
   VEDANT REWAPATI PORTFOLIO — script.js
═══════════════════════════════════════════ */

/* 1. Navbar scroll state */
const navbar = document.getElementById('navbar');
// Optimization: Passive Scroll Listener for Ultra-Smooth Nav
let scrollInProgress = false;
window.addEventListener('scroll', () => {
  if (!scrollInProgress) {
    window.requestAnimationFrame(() => {
      const nav = document.getElementById('navbar');
      if (window.scrollY > 50) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
      scrollInProgress = false;
    });
    scrollInProgress = true;
  }
}, { passive: true });

/* 2. Scroll Fade-In observer */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Hero fades in immediately
document.querySelector('#hero .fade-in')?.classList.add('visible');

fadeEls.forEach(el => {
  if (!el.closest('#hero')) {
    observer.observe(el);
  }
});

/* 3. Smooth nav link click (account for fixed header) */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* 4. Subtle cursor-parallax on hero orbs (desktop only) */
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 12;
    orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
}, { passive: true });

/* 5. Paradox Toggle (Theme Switcher) with Celestial Transitions */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const footerQuote = document.getElementById('footer-quote');
const blackHoleOverlay = document.getElementById('black-hole-overlay');
const whiteHoleOverlay = document.getElementById('white-hole-overlay');

const quotes = {
  light: 'Cogito, ergo sum',
  dark: 'In the dark, the mind is the only light.'
};


const setTheme = (theme, skipAnimation = false) => {
  if (skipAnimation) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.backgroundColor = ''; // Clear override on load
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'ph ph-moon-stars' : 'ph ph-sun';
    if (footerQuote) footerQuote.textContent = quotes[theme];
    return;
  }

  const isDark = theme === 'dark';
  const overlay = isDark ? blackHoleOverlay : whiteHoleOverlay;
  const animationClass = isDark ? 'animate-black-hole' : 'animate-white-hole';

  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto'; 
  overlay.classList.add(animationClass);
  document.body.classList.add('transitioning');

  setTimeout(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.backgroundColor = ''; // Clear override during toggle
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.className = isDark ? 'ph ph-moon-stars' : 'ph ph-sun';
    if (footerQuote) footerQuote.textContent = quotes[theme];
    if (window.onThemeChange) window.onThemeChange(theme);
  }, 400); // Turbocharged from 1000ms

  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.classList.remove(animationClass, 'fade-out');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      document.body.classList.remove('transitioning');
    }, 400); // Shorter fade-out cleanup
  }, 600); // Faster cleanup trigger
};

// Initial Theme Application
const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialTheme = getInitialTheme();
setTheme(initialTheme, true);

// Navigation Guard: re-check theme on browser back/pageshow
window.addEventListener('pageshow', (event) => {
  const theme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', theme);
  if (themeIcon) themeIcon.className = theme === 'dark' ? 'ph ph-moon-stars' : 'ph ph-sun';
});

themeToggle?.addEventListener('click', () => {
  if (document.body.classList.contains('transitioning')) return;
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

/* 5.1 Universal Anchor Persistence & Sync */
window.returnToOrbit = function() {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const overlay = theme === 'dark' ? document.getElementById('black-hole-overlay') : document.getElementById('white-hole-overlay');
  const animationClass = theme === 'dark' ? 'animate-black-hole' : 'animate-white-hole';

  if (overlay) {
    document.body.classList.add('transitioning');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    overlay.classList.add(animationClass);
    document.body.classList.add('wormhole-stretch');

    setTimeout(() => {
      // Use history.back() to avoid a perceived full page refresh if possible
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    }, 1200);

    // Final Guard: Force clickability back after 2s
    setTimeout(() => {
      overlay.style.pointerEvents = 'none';
      document.body.classList.remove('transitioning');
    }, 2000);
  } else {
    window.location.href = 'index.html';
  }
};

/* 5.2 Magnetic Paradox Cursor Logic (60FPS rAF) */
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (cursorDot && cursorOutline) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
  } else {
    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let outlineX = -100, outlineY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      // Smooth interpolation
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;

      requestAnimationFrame(animate);
    };
    animate();

    const updateHoverStates = () => {
      document.querySelectorAll('a, button, .clickable, .project-card, .about-card, .edu-card, .milestone-item, .stat-card, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    };
    updateHoverStates();

    const observer = new MutationObserver(updateHoverStates);
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

/* 6. Interactive Constellation (Stardust) Engine */
const canvas = document.getElementById('stardust-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let mouse = { x: null, y: null, radius: 150 };

// Setup Canvas size
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Star Object
class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.baseOpacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = theme === 'dark';
        
        // Brighter and larger in Dark Mode
        const opacity = isDark ? (this.baseOpacity + 0.3) : (this.baseOpacity * 0.8);
        const size = isDark ? (this.size * 1.2) : this.size;
        
        // Binary Stars: Navy and Black in Light Mode
        const navy = 'rgb(0, 31, 63)';
        const black = 'rgb(0, 0, 0)';
        const white = 'rgb(255, 255, 255)';
        
        if (isDark) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#FFFFFF';
        } else {
            // Alternating colors for binary effect
            ctx.fillStyle = this.baseOpacity > 0.45 ? `rgba(0, 31, 63, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
    }

    drawFlash() {
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize stars with dynamic count
const initStars = () => {
    stars = [];
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const count = theme === 'dark' ? 200 : 80; // More frequent in dark mode
    for (let i = 0; i < count; i++) {
        stars.push(new Star());
    }
};

window.onThemeChange = () => {
    initStars();
};

if (!window.starsInitialized) {
    initStars();
    window.starsInitialized = true;
}

// Track mouse on window (canvas is pointer-events: none)
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = currentTheme === 'dark';

    // Collision check for Binary Stars
    if (!isDark) {
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const s1 = stars[i];
                const s2 = stars[j];
                const dx = s1.x - s2.x;
                const dy = s1.y - s2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < (s1.size + s2.size) * 1.5) {
                    // Collision! Crisp White flash
                    s1.drawFlash();
                    // Slight bounce
                    s1.vx *= -1.1;
                    s2.vx *= -1.1;
                }
            }
        }
    }

    stars.forEach(star => {
        star.update();
        star.draw();

        // Draw line to mouse
        if (mouse.x !== null) {
            const dx = star.x - mouse.x;
            const dy = star.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const opacity = 0.15 * (1 - distance / mouse.radius);
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2563EB';
                ctx.strokeStyle = accentColor.includes('rgb') ? accentColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba') : `rgba(0, 31, 63, ${opacity})`; 
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
};

/* 7. Wunder-Trigger: Stellar Birth Fade-out */
const loader = document.getElementById('big-bang-loader');
if (loader) {
    window.addEventListener('load', () => {
        // Wait 1.8s for the "Big Bang" expansion to hit its peak
        setTimeout(() => {
            loader.style.opacity = '0';
            
            // Cleanly remove from DOM/Interaction after fade
            loader.addEventListener('transitionend', () => {
                loader.style.display = 'none';
            }, { once: true });
            
            // Fallback for safety
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 1800);
    });
}


animate();
