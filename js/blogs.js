// Blogs page functionality

let currentPage = 1;
const postsPerPage = 4;
let allPosts = [];
let filteredPosts = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize posts
    initPosts();
    
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category
            const category = this.getAttribute('data-category');
            
            // Filter posts
            filterPosts(category);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('blogSearch');
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchBlogs();
        }
    });
});

function initPosts() {
    // Get all blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        allPosts.push({
            element: card,
            category: card.getAttribute('data-category'),
            title: card.querySelector('h3').textContent.toLowerCase(),
            excerpt: card.querySelector('.excerpt').textContent.toLowerCase(),
            author: card.querySelector('.meta-left span:first-child').textContent.toLowerCase()
        });
    });
    
    filteredPosts = [...allPosts];
}

function filterPosts(category) {
    const postsGrid = document.getElementById('postsGrid');
    
    if (category === 'all') {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post => post.category === category);
    }
    
    // Clear grid
    postsGrid.innerHTML = '';
    
    // Display filtered posts
    filteredPosts.forEach((post, index) => {
        if (index < postsPerPage) {
            postsGrid.appendChild(post.element);
        }
    });
    
    // Reset page
    currentPage = 1;
    
    // Show/hide load more button
    const loadMoreBtn = document.querySelector('.load-more');
    if (filteredPosts.length > postsPerPage) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function loadMorePosts() {
    const postsGrid = document.getElementById('postsGrid');
    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    // Add more posts
    for (let i = startIndex; i < endIndex && i < filteredPosts.length; i++) {
        postsGrid.appendChild(filteredPosts[i].element);
    }
    
    currentPage++;
    
    // Hide load more button if all posts loaded
    const loadMoreBtn = document.querySelector('.load-more');
    if (endIndex >= filteredPosts.length) {
        loadMoreBtn.style.display = 'none';
    }
}

function searchBlogs() {
    const searchInput = document.getElementById('blogSearch');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        // Reset to current category
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterPosts(activeCategory);
        return;
    }
    
    // Filter posts by search query
    filteredPosts = allPosts.filter(post => 
        post.title.includes(query) || 
        post.excerpt.includes(query) || 
        post.author.includes(query)
    );
    
    // Update grid
    const postsGrid = document.getElementById('postsGrid');
    postsGrid.innerHTML = '';
    
    filteredPosts.forEach((post, index) => {
        if (index < postsPerPage) {
            postsGrid.appendChild(post.element);
        }
    });
    
    // Update category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show/hide load more
    const loadMoreBtn = document.querySelector('.load-more');
    if (filteredPosts.length > postsPerPage) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    // Reset page
    currentPage = 1;
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // In a real application, you would send this to your server
    // For now, we'll simulate a successful subscription
    alert('Thank you for subscribing to our newsletter! You will receive our latest updates soon.');
    emailInput.value = '';
}
