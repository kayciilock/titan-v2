document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.dropdown-menu ul li');
    const previewDivs = document.querySelectorAll('.preview > div');

    listItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            
            const target = item.getAttribute('data-preview');

            previewDivs.forEach(div => div.classList.remove('active'));

            const activeImage = document.querySelector(`.preview .${target}`);
            if (activeImage) {
                activeImage.classList.add('active');
            }
        });
    });
});