document.addEventListener('DOMContentLoaded', function () {
    const el = document.querySelector('.year');
    if (el) el.textContent = `© ${new Date().getFullYear()} CiiLOCK Engineering Pty Ltd.`;
});

