// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY");
})();

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateContactForm()) {
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Send email
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                to_name: 'V SIGN Team',
                from_name: data.name,
                from_email: data.email,
                phone: data.phone,
                city: data.city,
                service: data.service,
                message: data.message
            })
            .then(function(response) {
                alert('Thank you! Your message has been sent. We will contact you within 24 hours.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            })
            .catch(function(error) {
                alert('Sorry, there was an error sending your message. Please call us directly at +91 98480 12345');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Schedule Site Visit Form
    const visitForm = document.getElementById('visit-form');
    if (visitForm) {
        visitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(visitForm);
            const data = Object.fromEntries(formData);
            
            // Create WhatsApp message
            const message = encodeURIComponent(
                `Site Visit Request:\n\n` +
                `Name: ${data.name}\n` +
                `Phone: ${data.phone}\n` +
                `Email: ${data.email}\n` +
                `City: ${data.city}\n` +
                `Address: ${data.address}\n` +
                `Preferred Date: ${data.date}\n` +
                `Preferred Time: ${data.time}\n` +
                `Project Type: ${data.project}`
            );
            
            window.open(`https://wa.me/919848012345?text=${message}`, '_blank');
            alert('Opening WhatsApp to schedule your site visit.');
        });
    }
});

// Form Validation
function validateContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        } else if (input.type === 'tel') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(input.value.replace(/\D/g, ''))) {
                showError(input, 'Please enter a valid 10-digit phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showError(input, message) {
    // Remove existing error
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = 'var(--danger)';
    error.style.fontSize = '0.85rem';
    error.style.marginTop = '5px';
    
    input.parentElement.appendChild(error);
    input.style.borderColor = 'var(--danger)';
    
    // Remove error on input
    input.addEventListener('input', function() {
        error.remove();
        this.style.borderColor = '';
    }, { once: true });
}

// Google Maps Integration
function initMap() {
    if (typeof google === 'undefined') {
        console.error('Google Maps API not loaded');
        return;
    }
    
    const hyderabad = { lat: 17.3850, lng: 78.4867 };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: hyderabad,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {"saturation": -100},
                    {"lightness": 45}
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {"color": "#0B3D91"},
                    {"visibility": "on"}
                ]
            }
        ]
    });
    
    const marker = new google.maps.Marker({
        position: hyderabad,
        map: map,
        title: 'V SIGN Office',
        icon: {
            url: 'assets/icons/marker.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    const infowindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0; color: #0B3D91;">V SIGN Office</h3>
                <p style="margin: 0 0 5px 0;">Plot No. 123, Hitech City</p>
                <p style="margin: 0 0 5px 0;">Hyderabad, Telangana 500081</p>
                <a href="tel:+919848012345" style="color: #0B3D91;">+91 98480 12345</a>
            </div>
        `
    });
    
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

// Load Google Maps API
function loadGoogleMaps() {
    if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
}

// Load maps when contact page is visited
if (window.location.pathname.includes('contact.html')) {
    loadGoogleMaps();
}
