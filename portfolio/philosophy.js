/* ═══════════════════════════════════════════
   PHILOSOPHY JS — philosophy.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
});
