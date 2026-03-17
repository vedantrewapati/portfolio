/* ═══════════════════════════════════════════
   INTERESTS JS — interests.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-In
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));

    // 2. Interest Modal Logic
    const cards = document.querySelectorAll('.interest-card');
    const modal = document.getElementById('interests-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalIcon = document.getElementById('modal-icon');
    const closeModalBtn = document.getElementById('close-modal');

    const interestsData = {
        'grandfather-paradox': {
            title: 'The Grandfather Paradox',
            text: 'A fascinating logic puzzle in time travel that challenges our understanding of causality and the timeline of the universe.',
            icon: '⏰'
        },
        'black-hole-paradox': {
            title: 'Black Hole Information Paradox',
            text: 'The ultimate mystery of physics—does information truly disappear when it enters a singularity? Exploring the boundaries of quantum mechanics.',
            icon: '🌀'
        },
        'consciousness': {
            title: 'Consciousness & Awareness',
            text: "Beyond code and hardware, the mystery of the human mind remains the greatest 'black box' in science.",
            icon: '⚪'
        },
        'atomic-habits': {
            title: 'Atomic Habits',
            text: 'A practical guide to building good habits and breaking bad ones by focusing on tiny, consistent changes that lead to remarkable results.',
            icon: '📚'
        },
        'ikigai': {
            title: 'Ikigai',
            text: "Discovering your 'reason for being' through the Japanese secret to a long and happy life, balancing passion, mission, vocation, and profession.",
            icon: '❤️'
        },
        'psychology-of-money': {
            title: 'The Psychology of Money',
            text: "Understanding how our feelings and biases influence our financial decisions, teaching that doing well with money isn't necessarily about what you know.",
            icon: '💰'
        },
        'cosmos': {
            title: 'Cosmos',
            text: 'A grand exploration of the universe, science, and the human story, from the origins of everything to our collective future in the stars.',
            icon: '🪐'
        },
        'clockwise': {
            title: 'The Voyager Mindset',
            text: 'Engineering is about more than just syntax; it\'s about solving the mysteries of the human experience through technology.',
            icon: '🚀'
        },
        'subtle-art': {
            title: 'The Subtle Art of Not Giving a F*ck',
            text: 'A counterintuitive approach to living a good life by prioritizing what truly matters and accepting that not everything is "awesome".',
            icon: '🔥'
        }
    };

    const openModal = (key) => {
        const data = interestsData[key];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalText.textContent = data.text;
        modalIcon.innerHTML = data.icon;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-key');
            openModal(key);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
