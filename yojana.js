/* ═══════════════════════════════════════════
   YOJANA 360 JS — yojana.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-ins
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If the section being scrolled into view has stats, trigger counter
                if (entry.target.classList.contains('yojana-header')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));

    // 2. Animate Stats Counters
    function animateCounters() {
        const stats = document.querySelectorAll('.stat-num');
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-val');
            const speed = 100; // Lower is faster
            
            const updateCount = () => {
                const count = +stat.innerText;
                const inc = target / speed;

                if (count < target) {
                    stat.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    }
});

// 3. Image Modal Logic
function openModal(imgSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    modal.style.display = "block";
    modalImg.src = imgSrc;
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}
