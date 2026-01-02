// Blog detail page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Table of contents smooth scroll
    const tocLinks = document.querySelectorAll('.toc a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize comments
    loadComments();
    
    // Comment form submission
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitComment();
        });
    }
    
    // Highlight current section in TOC on scroll
    window.addEventListener('scroll', highlightCurrentSection);
});

function shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, '_blank');
}

function shareWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function loadComments() {
    const commentsList = document.getElementById('commentsList');
    
    // In a real application, you would fetch comments from a server
    // For now, we'll use sample data
    const sampleComments = [
        {
            name: 'Rajesh Kumar',
            date: 'March 16, 2024',
            comment: 'Great article! I was looking for exactly this information for my shop in Hyderabad. The cost breakdown was particularly helpful.',
            avatar: 'RK'
        },
        {
            name: 'Priya Sharma',
            date: 'March 17, 2024',
            comment: 'Very informative guide. I\'m planning to install terrace signage for my hotel in Vizag. Can you share more about the permit process?',
            avatar: 'PS'
        }
    ];
    
    sampleComments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment';
    
    div.innerHTML = `
        <div class="comment-avatar">${comment.avatar}</div>
        <div class="comment-content">
            <div class="comment-header">
                <div class="comment-author">${comment.name}</div>
                <div class="comment-date">${comment.date}</div>
            </div>
            <div class="comment-text">${comment.comment}</div>
            <button class="reply-btn">Reply</button>
        </div>
    `;
    
    return div;
}

function submitComment() {
    const form = document.getElementById('commentForm');
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const commentText = form.querySelector('textarea').value.trim();
    
    if (!name || !email || !commentText) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real application, you would send this to your server
    // For now, we'll simulate adding the comment
    const newComment = {
        name: name,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        comment: commentText,
        avatar: name.substring(0, 2).toUpperCase()
    };
    
    const commentsList = document.getElementById('commentsList');
    const commentElement = createCommentElement(newComment);
    commentsList.appendChild(commentElement);
    
    // Reset form
    form.reset();
    
    alert('Thank you for your comment! It has been submitted for review.');
}

function highlightCurrentSection() {
    const sections = document.querySelectorAll('.content-section');
    const tocLinks = document.querySelectorAll('.toc a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 150)) {
            currentSection = section.querySelector('h2').textContent;
        }
    });
    
    // Update TOC active state
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    alert('Thank you for subscribing to our newsletter!');
    emailInput.value = '';
}
