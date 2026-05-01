const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.big-text, .fact, .label, .point, .para, .heading, .box, .product').forEach(text => {
    observer.observe(text);
});