// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
    
    // Close menu when clicking a link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}

// Chat Widget
let chatOpen = false;

function openChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.style.display = 'block';
    chatOpen = true;
}

function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    const toggleIcon = document.getElementById('chatToggleIcon');
    
    if (chatOpen) {
        chatBody.style.display = chatBody.style.display === 'none' ? 'flex' : 'none';
        toggleIcon.classList.toggle('fa-chevron-down');
        toggleIcon.classList.toggle('fa-chevron-up');
    } else {
        openChat();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            addBotMessage(getBotResponse(message));
        }, 1000);
    }
}

function addUserMessage(text) {
    const messages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="content">
            <div class="name">You</div>
            <div class="text">${text}</div>
            <div class="time">Just now</div>
        </div>
    `;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function addBotMessage(text) {
    const messages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `
        <div class="avatar">VS</div>
        <div class="content">
            <div class="name">V SIGN Assistant</div>
            <div class="text">${text}</div>
            <div class="time">Just now</div>
        </div>
    `;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "LED signage prices range from ₹850 to ₹4,000 per sqft. Would you like me to help you calculate an exact quote?";
    } else if (lowerMessage.includes('time') || lowerMessage.includes('install')) {
        return "Installation typically takes 7-9 working days. For terrace signage, it may take 30-90 days depending on structural requirements.";
    } else if (lowerMessage.includes('warranty')) {
        return "We offer 3, 5, and 10 year warranty options. Which one would you like to know more about?";
    } else if (lowerMessage.includes('visit') || lowerMessage.includes('site')) {
        return "We provide free site visits across Andhra Pradesh & Telangana. Would you like to schedule one?";
    } else if (lowerMessage.includes('hyderabad') || lowerMessage.includes('vijayawada') || lowerMessage.includes('vizag')) {
        return "Yes, we serve all major cities in AP & TS including Hyderabad, Vijayawada, and Vizag with free site visits.";
    } else {
        return "Thank you for your message! A V SIGN representative will contact you shortly. In the meantime, you can check our FAQ section or request a quote.";
    }
}

// Projects Filter
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation (for contact form)
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger)';
            isValid = false;
            
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Price Range Calculator (for homepage)
function updatePrice() {
    const width = 10; // Default values
    const height = 3;
    const area = width * height;
    const pricePerSqft = 850;
    const totalPrice = area * pricePerSqft;
    
    document.querySelector('.price-fill').style.width = '75%';
    document.querySelector('.price-label strong').textContent = `₹${totalPrice.toLocaleString()}`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update price on homepage
    updatePrice();
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'absolute';
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
});

// Lazy Load Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Newsletter Subscription
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        alert('Thank you for subscribing to our newsletter!');
        document.getElementById('newsletter-email').value = '';
    }, 500);
}
