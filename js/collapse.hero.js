document.querySelectorAll('.entry').forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const parentEntry = trigger.closest('.entry');
        parentEntry.classList.toggle('open');
    });
});