document.querySelectorAll('.entry').forEach((trigger) => {
    trigger.addEventListener('click', () => {

        const currentlyOpen = document.querySelector('.entry.open');
        if (currentlyOpen && currentlyOpen !== trigger) {
            currentlyOpen.classList.remove('open');
        }

        trigger.classList.toggle('open');
    });
});