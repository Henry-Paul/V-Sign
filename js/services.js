// Services page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Service navigation smooth scroll
    const serviceNavLinks = document.querySelectorAll('.service-nav-link');
    const serviceSections = document.querySelectorAll('.service-detail');
    
    serviceNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            serviceNavLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId + '-detail');
            
            if (targetSection) {
                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Material options interaction
    const materialOptions = document.querySelectorAll('.material-option');
    const materialDetails = document.querySelectorAll('.material-details');
    
    materialOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            materialOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get material type
            const material = this.getAttribute('data-material');
            
            // Hide all material details
            materialDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show selected material details
            const selectedDetail = document.getElementById(material + '-details');
            if (selectedDetail) {
                selectedDetail.style.display = 'block';
            }
        });
    });
    
    // Package comparison
    const packageCards = document.querySelectorAll('.package');
    
    packageCards.forEach(package => {
        package.addEventListener('mouseenter', function() {
            packageCards.forEach(p => {
                if (p !== this) {
                    p.style.transform = 'scale(0.98)';
                    p.style.opacity = '0.9';
                }
            });
        });
        
        package.addEventListener('mouseleave', function() {
            packageCards.forEach(p => {
                p.style.transform = 'scale(1)';
                p.style.opacity = '1';
            });
        });
    });
    
    // Update active nav based on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        serviceSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id').replace('-detail', '');
            }
        });
        
        serviceNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});
