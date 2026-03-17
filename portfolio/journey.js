/* ═══════════════════════════════════════════
   JOURNEY PAGE SCRIPTS
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const timelineLine = document.getElementById('timeline-line');
    const milestones = document.querySelectorAll('.milestone-item');
    
    // Intersection Observer for milestones fading in
    const milestoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // We keep observing if we want it to react multiple times, 
                // but usually for timelines, a single fade-in is cleaner.
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    milestones.forEach(m => milestoneObserver.observe(m));

    /* ═══════════════ MOMENTUM SCROLL ENGINE ═══════════════ */
    const scrollContainer = document.getElementById('scroll-container');
    const jecSection = document.getElementById('jec-station');
    
    let currentY = 0;
    let targetY = 0;
    let ease = 0.075;
    let velocity = 0;
    let lastY = 0;

    // Set page height
    function setHeight() {
        const height = scrollContainer.scrollHeight || scrollContainer.getBoundingClientRect().height;
        document.body.style.height = `${height}px`;
    }
    
    // Call after initial images/fonts might have loaded
    window.addEventListener('load', setHeight);
    setHeight();
    window.addEventListener('resize', setHeight);

    // Wheel event to update targetY
    window.addEventListener('wheel', (e) => {
        // Gravitational Pull check
        const jecRect = jecSection.getBoundingClientRect();
        const isInGravityField = jecRect.top < window.innerHeight && jecRect.bottom > 0;
        
        // If in gravity field, scroll feels heavier (smaller increments)
        const gravityFactor = isInGravityField ? 0.3 : 1.0;
        targetY += e.deltaY * gravityFactor;
        
        // Clamp targetY
        const maxScroll = scrollContainer.getBoundingClientRect().height - window.innerHeight;
        targetY = Math.max(0, Math.min(targetY, maxScroll));
    });

    // Mobile Touch Support
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        
        const jecRect = jecSection.getBoundingClientRect();
        const isInGravityField = jecRect.top < window.innerHeight && jecRect.bottom > 0;
        const gravityFactor = isInGravityField ? 0.3 : 1.0;

        targetY += deltaY * 1.5 * gravityFactor; // Slightly faster for touch
        touchStartY = touchY;

        const maxScroll = scrollContainer.getBoundingClientRect().height - window.innerHeight;
        targetY = Math.max(0, Math.min(targetY, maxScroll));
    }, { passive: true });

    function scrollUpdate() {
        // Lerp
        const diff = targetY - currentY;
        currentY += diff * ease;
        
        // Velocity for Wormhole Blur
        velocity = Math.abs(currentY - lastY);
        lastY = currentY;

        // Apply transform
        scrollContainer.style.transform = `translateY(-${currentY}px)`;

        // Wormhole Blur visual
        if (velocity > 15) {
            scrollContainer.classList.add('wormhole-blur');
            // Increase blur intensity based on velocity
            const blurVal = Math.min((velocity - 15) * 0.15, 4);
            scrollContainer.style.filter = `blur(${blurVal}px)`;
        } else {
            scrollContainer.classList.remove('wormhole-blur');
            scrollContainer.style.filter = 'none';
        }

        // Keep timeline line drawing synced with virtual scroll
        updateTimelineLine(currentY);

        requestAnimationFrame(scrollUpdate);
    }

    // Modified updateTimelineLine to accept virtual scroll Y
    function updateTimelineLine(vScrollY) {
        const wrapper = document.querySelector('.timeline-wrapper');
        const wrapperTopInContent = wrapper.offsetTop; // Position relative to scrollContainer
        const wrapperHeight = wrapper.offsetHeight;
        const windowHeight = window.innerHeight;
        
        const scrollTarget = windowHeight * 0.7; 
        const relativeActivePos = scrollTarget - (wrapperTopInContent - vScrollY);
        
        let fillPercent = (relativeActivePos / wrapperHeight) * 100;
        fillPercent = Math.min(Math.max(fillPercent, 0), 100);
        
        timelineLine.style.height = `${fillPercent}%`;
        
        milestones.forEach(item => {
            const marker = item.querySelector('.milestone-marker');
            const itemTop = item.offsetTop + wrapperTopInContent;
            
            if (itemTop - vScrollY < scrollTarget) {
                marker.style.background = 'var(--accent-navy)';
                marker.style.borderColor = 'var(--accent-navy)';
            } else {
                marker.style.background = 'var(--bg-primary)';
                marker.style.borderColor = 'var(--accent-navy)';
            }
        });
    }

    requestAnimationFrame(scrollUpdate);
});
