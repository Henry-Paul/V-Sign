// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    const elements = document.querySelectorAll('.service-card, .feature-card, .project-card, .city-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
    
    // Counter animation for stats
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Typewriter effect for hero title
    const typewriterText = "Premium LED & 3D Signage";
    const typewriterElement = document.querySelector('.typewriter');
    
    if (typewriterElement) {
        let i = 0;
        const speed = 100; // ms per character
        
        function typeWriter() {
            if (i < typewriterText.length) {
                typewriterElement.textContent += typewriterText.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start typewriter when hero is in view
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                heroObserver.unobserve(entries[0].target);
            }
        });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }
    
    // Sticky navigation
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.display = 'none';
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Add styles for back to top button
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(11, 61, 145, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .back-to-top:hover {
            background: var(--primary-dark);
            transform: translateY(-3px);
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Image gallery lightbox
function initImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close"><i class="fas fa-times"></i></button>
        <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
        <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
        <img class="lightbox-image" src="" alt="">
    `;
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', function() {
            currentIndex = index;
            openLightbox(image.src);
        });
    });
    
    function openLightbox(src) {
        lightbox.querySelector('.lightbox-image').src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Add lightbox styles
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .lightbox.active {
            display: flex;
        }
        
        .lightbox-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
        
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .lightbox-prev {
            left: 20px;
        }
        
        .lightbox-next {
            right: 20px;
        }
    `;
    document.head.appendChild(lightboxStyles);
}

// Initialize gallery on pages that need it
if (document.querySelector('.gallery-image')) {
    initImageGallery();
}
