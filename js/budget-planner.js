class BudgetPlanner {
    constructor() {
        this.config = {
            baseRates: {
                'terrace': 1200,
                'shop': 850,
                '3d-letters': 1500,
                'hospital': 850,
                'wayfinding': 800
            },
            materialMultipliers: {
                'acp': 1.0,
                'stainless': 1.8,
                'acrylic': 1.4,
                'brass': 2.2,
                'flex': 0.8
            },
            ledMultipliers: {
                'standard': 1.0,
                'premium': 1.5,
                'rgb': 2.0
            },
            cityMultipliers: {
                'hyderabad': 1.0,
                'vijayawada': 1.1,
                'vizag': 1.15,
                'guntur': 1.05
            },
            locationMultipliers: {
                'rooftop': 1.3,
                'facade': 1.1,
                'ground': 1.0
            },
            warrantyMultipliers: {
                '3': 1.0,
                '5': 1.2,
                '10': 1.5
            }
        };
        
        this.currentStep = 1;
        this.formData = {
            productType: 'terrace',
            width: 10,
            height: 3,
            quantity: 1,
            city: 'hyderabad',
            location: 'rooftop',
            material: 'acp',
            ledType: 'standard',
            warranty: '3',
            includesSiteVisit: true,
            includesElectrical: false,
            includesAMC: false
        };
        
        this.initialize();
    }
    
    initialize() {
        this.bindEvents();
        this.updatePrice();
        this.updateProgress();
    }
    
    bindEvents() {
        // Product selection
        document.querySelectorAll('.product-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.product-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
                this.formData.productType = e.currentTarget.dataset.value;
                this.updatePrice();
            });
        });
        
        // Dimension sliders
        const widthSlider = document.getElementById('width-slider');
        const heightSlider = document.getElementById('height-slider');
        
        if (widthSlider && heightSlider) {
            widthSlider.addEventListener('input', (e) => {
                this.formData.width = parseInt(e.target.value);
                document.getElementById('width-value').textContent = `${this.formData.width} ft`;
                this.updatePrice();
            });
            
            heightSlider.addEventListener('input', (e) => {
                this.formData.height = parseInt(e.target.value);
                document.getElementById('height-value').textContent = `${this.formData.height} ft`;
                this.updatePrice();
            });
        }
        
        // Quantity input
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', (e) => {
                this.formData.quantity = parseInt(e.target.value) || 1;
                this.updatePrice();
            });
        }
        
        // Material selection
        document.querySelectorAll('.material-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.material-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
                this.formData.material = e.currentTarget.dataset.value;
                this.updatePrice();
            });
        });
        
        // LED type selection
        document.querySelectorAll('.led-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.led-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
                this.formData.ledType = e.currentTarget.dataset.value;
                this.updatePrice();
            });
        });
        
        // Warranty selection
        document.querySelectorAll('.warranty-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.warranty-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
                this.formData.warranty = e.currentTarget.dataset.value;
                this.updatePrice();
            });
        });
        
        // City selection
        const citySelect = document.getElementById('city-select');
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                this.formData.city = e.target.value;
                this.updatePrice();
            });
        }
        
        // Location selection
        const locationSelect = document.getElementById('location-select');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.formData.location = e.target.value;
                this.updatePrice();
            });
        }
        
        // Checkboxes
        document.querySelectorAll('.service-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const service = e.target.dataset.service;
                this.formData[service] = e.target.checked;
                this.updatePrice();
            });
        });
        
        // Navigation buttons
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', () => this.prevStep());
        });
        
        // Form submission
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => this.submitQuote(e));
        }
        
        // Download PDF
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadPDF());
        }
        
        // Share WhatsApp
        const whatsappBtn = document.getElementById('share-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => this.shareWhatsApp());
        }
    }
    
    calculatePrice() {
        const area = this.formData.width * this.formData.height;
        const quantity = this.formData.quantity;
        
        const baseRate = this.config.baseRates[this.formData.productType] || 850;
        const materialMultiplier = this.config.materialMultipliers[this.formData.material] || 1;
        const ledMultiplier = this.config.ledMultipliers[this.formData.ledType] || 1;
        const cityMultiplier = this.config.cityMultipliers[this.formData.city] || 1;
        const locationMultiplier = this.config.locationMultipliers[this.formData.location] || 1;
        const warrantyMultiplier = this.config.warrantyMultipliers[this.formData.warranty] || 1;
        
        // Calculate costs
        const materialCost = area * baseRate * materialMultiplier * quantity;
        const fabrication = materialCost * 0.3; // 30% of material cost
        const electronics = area * 200 * ledMultiplier * quantity;
        const installation = area * 150 * locationMultiplier * quantity;
        
        let amc = 0;
        if (this.formData.includesAMC) {
            amc = (materialCost + fabrication + electronics) * 0.15; // 15% annual
        }
        
        // Apply city multiplier for transportation
        const subtotal = (materialCost + fabrication + electronics + installation + amc) * cityMultiplier;
        const gst = subtotal * 0.18; // 18% GST
        
        // Apply warranty multiplier
        const total = (subtotal + gst) * warrantyMultiplier;
        
        return {
            materialCost: Math.round(materialCost),
            fabrication: Math.round(fabrication),
            electronics: Math.round(electronics),
            installation: Math.round(installation),
            amc: Math.round(amc),
            gst: Math.round(gst),
            subtotal: Math.round(subtotal),
            total: Math.round(total)
        };
    }
    
    updatePrice() {
        const prices = this.calculatePrice();
        
        // Update price display
        document.querySelectorAll('[data-price="material"]').forEach(el => {
            el.textContent = `₹${prices.materialCost.toLocaleString()}`;
        });
        
        document.querySelectorAll('[data-price="fabrication"]').forEach(el => {
            el.textContent = `₹${prices.fabrication.toLocaleString()}`;
        });
        
        document.querySelectorAll('[data-price="electronics"]').forEach(el => {
            el.textContent = `₹${prices.electronics.toLocaleString()}`;
        });
        
        document.querySelectorAll('[data-price="installation"]').forEach(el => {
            el.textContent = `₹${prices.installation.toLocaleString()}`;
        });
        
        if (this.formData.includesAMC) {
            document.querySelectorAll('[data-price="amc"]').forEach(el => {
                el.textContent = `₹${prices.amc.toLocaleString()}/year`;
                el.parentElement.style.display = 'block';
            });
        } else {
            document.querySelectorAll('[data-price="amc"]').forEach(el => {
                el.parentElement.style.display = 'none';
            });
        }
        
        document.querySelectorAll('[data-price="gst"]').forEach(el => {
            el.textContent = `₹${prices.gst.toLocaleString()}`;
        });
        
        document.querySelectorAll('[data-price="total"]').forEach(el => {
            el.textContent = `₹${prices.total.toLocaleString()}`;
        });
        
        // Update summary
        this.updateSummary();
    }
    
    updateSummary() {
        document.getElementById('summary-product').textContent = 
            this.getProductName(this.formData.productType);
        document.getElementById('summary-size').textContent = 
            `${this.formData.width} × ${this.formData.height} ft`;
        document.getElementById('summary-material').textContent = 
            this.getMaterialName(this.formData.material);
        document.getElementById('summary-warranty').textContent = 
            `${this.formData.warranty} Years`;
        document.getElementById('summary-city').textContent = 
            this.getCityName(this.formData.city);
    }
    
    getProductName(type) {
        const names = {
            'terrace': 'Terrace Signage',
            'shop': 'Shop Board',
            '3d-letters': '3D Letters',
            'hospital': 'Hospital Signage',
            'wayfinding': 'Wayfinding System'
        };
        return names[type] || 'Custom Signage';
    }
    
    getMaterialName(material) {
        const names = {
            'acp': 'ACP Board',
            'stainless': 'Stainless Steel',
            'acrylic': 'Acrylic LED',
            'brass': 'Brass',
            'flex': 'Flex Board'
        };
        return names[material] || 'Standard Material';
    }
    
    getCityName(city) {
        const names = {
            'hyderabad': 'Hyderabad',
            'vijayawada': 'Vijayawada',
            'vizag': 'Visakhapatnam',
            'guntur': 'Guntur'
        };
        return names[city] || 'Your City';
    }
    
    nextStep() {
        if (this.currentStep < 4) {
            // Hide current step
            document.querySelector(`.step-${this.currentStep}`).classList.remove('active');
            document.querySelector(`.step-${this.currentStep}`).classList.add('completed');
            
            // Show next step
            this.currentStep++;
            document.querySelector(`.step-${this.currentStep}`).classList.add('active');
            
            // Update progress bar
            this.updateProgress();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            // Hide current step
            document.querySelector(`.step-${this.currentStep}`).classList.remove('active');
            
            // Show previous step
            this.currentStep--;
            document.querySelector(`.step-${this.currentStep}`).classList.add('active');
            document.querySelector(`.step-${this.currentStep}`).classList.remove('completed');
            
            // Update progress bar
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progress = ((this.currentStep - 1) / 3) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        
        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index + 1 < this.currentStep) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else if (index + 1 === this.currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
    }
    
    submitQuote(e) {
        e.preventDefault();
        
        if (!validateForm('quote-form')) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(e.target);
        const customerData = Object.fromEntries(formData);
        
        // Combine with quote data
        const quoteData = {
            ...this.formData,
            ...customerData,
            price: this.calculatePrice().total,
            timestamp: new Date().toISOString(),
            quoteId: 'VS' + Date.now()
        };
        
        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            to_name: 'V SIGN Team',
            from_name: customerData.name,
            from_email: customerData.email,
            phone: customerData.phone,
            quote_id: quoteData.quoteId,
            product: this.getProductName(quoteData.productType),
            size: `${quoteData.width} × ${quoteData.height} ft`,
            material: this.getMaterialName(quoteData.material),
            total_price: `₹${quoteData.price.toLocaleString()}`,
            message: customerData.message || 'No additional message'
        })
        .then(() => {
            alert('Quote request submitted successfully! We will contact you within 24 hours.');
            e.target.reset();
            this.currentStep = 1;
            this.updateProgress();
            
            // Reset to first step
            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active', 'completed');
            });
            document.querySelector('.step-1').classList.add('active');
        })
        .catch((error) => {
            console.error('Email send failed:', error);
            alert('There was an error submitting your quote. Please call us directly at +91 98480 12345');
        });
    }
    
    downloadPDF() {
        const prices = this.calculatePrice();
        
        // Create PDF content
        const content = `
            V SIGN - QUOTE SUMMARY
            =======================
            
            Quote ID: VS${Date.now()}
            Date: ${new Date().toLocaleDateString()}
            
            Project Details:
            ----------------
            Product: ${this.getProductName(this.formData.productType)}
            Size: ${this.formData.width} × ${this.formData.height} ft
            Quantity: ${this.formData.quantity}
            Material: ${this.getMaterialName(this.formData.material)}
            LED Type: ${this.formData.ledType.toUpperCase()}
            Warranty: ${this.formData.warranty} Years
            Installation: ${this.formData.location}
            City: ${this.getCityName(this.formData.city)}
            
            Price Breakdown:
            ----------------
            Material Cost: ₹${prices.materialCost.toLocaleString()}
            Fabrication: ₹${prices.fabrication.toLocaleString()}
            Electronics (LED): ₹${prices.electronics.toLocaleString()}
            Installation: ₹${prices.installation.toLocaleString()}
            ${this.formData.includesAMC ? `AMC (Annual): ₹${prices.amc.toLocaleString()}` : ''}
            GST (18%): ₹${prices.gst.toLocaleString()}
            
            TOTAL: ₹${prices.total.toLocaleString()}
            
            Terms & Conditions:
            -------------------
            1. Prices are inclusive of GST
            2. Installation timeline: 7-9 working days
            3. Free site visit included
            4. ${this.formData.warranty}-year warranty on LED components
            5. ${this.formData.includesAMC ? 'Annual Maintenance Contract included' : 'AMC available as add-on'}
            
            Contact:
            --------
            V SIGN
            Phone: +91 98480 12345
            Email: quote@vsign.com
            Website: www.vsign.com
        `;
        
        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `V-SIGN-Quote-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('Quote downloaded successfully!');
    }
    
    shareWhatsApp() {
        const prices = this.calculatePrice();
        const message = encodeURIComponent(
            `V SIGN Quote Summary:\n\n` +
            `Product: ${this.getProductName(this.formData.productType)}\n` +
            `Size: ${this.formData.width} × ${this.formData.height} ft\n` +
            `Material: ${this.getMaterialName(this.formData.material)}\n` +
            `Warranty: ${this.formData.warranty} Years\n` +
            `Total: ₹${prices.total.toLocaleString()}\n\n` +
            `View full details: ${window.location.href}`
        );
        
        window.open(`https://wa.me/?text=${message}`, '_blank');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.budget-planner')) {
        window.budgetPlanner = new BudgetPlanner();
    }
});
