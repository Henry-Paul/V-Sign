// Testimonials Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize filters
    initFilters();
    
    // Initialize city tabs
    initCityTabs();
    
    // Initialize testimonial form
    initTestimonialForm();
    
    // Initialize video players
    initVideoPlayers();
});

function initFilters() {
    const industryTags = document.querySelectorAll('[data-industry]');
    const cityTags = document.querySelectorAll('[data-city]');
    const serviceTags = document.querySelectorAll('[data-service]');
    
    // Industry filter
    industryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all industry tags
            industryTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Filter testimonials
            const industry = this.getAttribute('data-industry');
            filterTestimonials('industry', industry);
        });
    });
    
    // City filter
    cityTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all city tags
            cityTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Filter testimonials
            const city = this.getAttribute('data-city');
            filterTestimonials('city', city);
        });
    });
    
    // Service filter
    serviceTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all service tags
            serviceTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Filter testimonials
            const service = this.getAttribute('data-service');
            filterTestimonials('service', service);
        });
    });
}

function filterTestimonials(filterType, filterValue) {
    const testimonials = document.querySelectorAll('.testimonial-card, .featured-testimonial, .city-testimonial');
    const industrySections = document.querySelectorAll('.industry-section');
    
    let visibleCount = 0;
    
    testimonials.forEach(testimonial => {
        const testimonialIndustry = testimonial.getAttribute('data-industry') || testimonial.closest('[data-industry]')?.getAttribute('data-industry');
        const testimonialCity = testimonial.getAttribute('data-city') || 'all';
        const testimonialService = testimonial.getAttribute('data-service') || 'all';
        
        let showTestimonial = true;
        
        // Check industry filter
        const industryTag = document.querySelector('[data-industry].active');
        const selectedIndustry = industryTag ? industryTag.getAttribute('data-industry') : 'all';
        
        if (selectedIndustry !== 'all' && testimonialIndustry !== selectedIndustry) {
            showTestimonial = false;
        }
        
        // Check city filter
        const cityTag = document.querySelector('[data-city].active');
        const selectedCity = cityTag ? cityTag.getAttribute('data-city') : 'all';
        
        if (selectedCity !== 'all' && testimonialCity !== selectedCity) {
            showTestimonial = false;
        }
        
        // Check service filter
        const serviceTag = document.querySelector('[data-service].active');
        const selectedService = serviceTag ? serviceTag.getAttribute('data-service') : 'all';
        
        if (selectedService !== 'all' && testimonialService !== selectedService) {
            showTestimonial = false;
        }
        
        // Show/hide testimonial
        if (showTestimonial) {
            testimonial.style.display = 'block';
            visibleCount++;
            
            // Add animation
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                testimonial.style.transition = 'all 0.5s ease';
                testimonial.style.opacity = '1';
                testimonial.style.transform = 'translateY(0)';
            }, 10);
        } else {
            testimonial.style.display = 'none';
        }
    });
    
    // Show/hide industry sections based on filters
    industrySections.forEach(section => {
        const sectionIndustry = section.getAttribute('data-industry');
        const industryTag = document.querySelector('[data-industry].active');
        const selectedIndustry = industryTag ? industryTag.getAttribute('data-industry') : 'all';
        
        if (selectedIndustry === 'all' || sectionIndustry === selectedIndustry) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Show message if no testimonials found
    showNoResultsMessage(visibleCount === 0);
}

function showNoResultsMessage(show) {
    let message = document.getElementById('noResultsMessage');
    
    if (show) {
        if (!message) {
            message = document.createElement('div');
            message.id = 'noResultsMessage';
            message.className = 'no-results';
            message.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No testimonials found</h3>
                    <p>Try different filter combinations or reset filters to see all testimonials.</p>
                    <button class="btn-secondary" onclick="resetFilters()">
                        <i class="fas fa-redo"></i> Reset All Filters
                    </button>
                </div>
            `;
            
            const testimonialsSection = document.querySelector('.industry-testimonials');
            if (testimonialsSection) {
                testimonialsSection.appendChild(message);
            }
        }
    } else {
        if (message) {
            message.remove();
        }
    }
}

function resetFilters() {
    // Reset all filter tags to active state for 'all'
    const industryTags = document.querySelectorAll('[data-industry]');
    const cityTags = document.querySelectorAll('[data-city]');
    const serviceTags = document.querySelectorAll('[data-service]');
    
    industryTags.forEach(tag => {
        tag.classList.remove('active');
        if (tag.getAttribute('data-industry') === 'all') {
            tag.classList.add('active');
        }
    });
    
    cityTags.forEach(tag => {
        tag.classList.remove('active');
        if (tag.getAttribute('data-city') === 'all') {
            tag.classList.add('active');
        }
    });
    
    serviceTags.forEach(tag => {
        tag.classList.remove('active');
        if (tag.getAttribute('data-service') === 'all') {
            tag.classList.add('active');
        }
    });
    
    // Reset city tab to Hyderabad
    const cityTabs = document.querySelectorAll('.city-tab');
    const cityContents = document.querySelectorAll('.city-content');
    
    cityTabs.forEach(tab => tab.classList.remove('active'));
    cityContents.forEach(content => content.classList.remove('active'));
    
    const hyderabadTab = document.querySelector('[data-city="hyderabad"]');
    const hyderabadContent = document.getElementById('hyderabad');
    
    if (hyderabadTab && hyderabadContent) {
        hyderabadTab.classList.add('active');
        hyderabadContent.classList.add('active');
    }
    
    // Show all testimonials
    filterTestimonials('all', 'all');
}

function initCityTabs() {
    const cityTabs = document.querySelectorAll('.city-tab');
    const cityContents = document.querySelectorAll('.city-content');
    
    cityTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get target city
            const targetCity = this.getAttribute('data-city');
            
            // Remove active class from all tabs
            cityTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all city contents
            cityContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show target city content
            const targetContent = document.getElementById(targetCity);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Update city filter
                const cityTag = document.querySelector(`[data-city="${targetCity}"]`);
                if (cityTag) {
                    const allCityTags = document.querySelectorAll('[data-city]');
                    allCityTags.forEach(tag => tag.classList.remove('active'));
                    cityTag.classList.add('active');
                    
                    // Filter testimonials
                    filterTestimonials('city', targetCity);
                }
            }
        });
    });
}

function initTestimonialForm() {
    const form = document.getElementById('testimonialForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const testimonialData = {
            name: form.querySelector('input[type="text"]').value,
            business: form.querySelectorAll('input[type="text"]')[1].value,
            role: form.querySelectorAll('input[type="text"]')[2].value,
            city: form.querySelector('select').value,
            projectType: form.querySelectorAll('select')[1].value,
            rating: form.querySelector('input[name="rating"]:checked')?.value,
            testimonial: form.querySelector('textarea').value,
            photos: form.querySelector('input[type="file"]').files
        };
        
        // Validate
        if (!testimonialData.rating) {
            alert('Please select a rating');
            return;
        }
        
        // In a real application, you would send this to your server
        // For now, we'll simulate submission
        simulateTestimonialSubmission(testimonialData);
    });
}

function simulateTestimonialSubmission(data) {
    // Show loading state
    const submitBtn = document.querySelector('#testimonialForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        alert('Thank you for sharing your experience! Your testimonial has been submitted for review. You will receive a 5% discount coupon via email within 24 hours.');
        
        // Reset form
        document.getElementById('testimonialForm').reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

function initVideoPlayers() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoCard = this.closest('.video-card');
            const videoTitle = videoCard.querySelector('h4').textContent;
            
            // In a real application, this would open a video modal or player
            // For now, we'll show an alert
            alert(`Playing video: ${videoTitle}\n\nIn the actual implementation, this would open a video player modal.`);
        });
    });
}

function submitTestimonial() {
    // Scroll to testimonial form
    const formSection = document.querySelector('.submit-testimonial');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize filter on page load
filterTestimonials('all', 'all');
