const trigger = document.querySelector('.products-trigger');
const menu = document.querySelector('.dropdown-menu');

trigger.addEventListener('mouseenter', () => menu.classList.add('is-open'));

const closeMenu = (e) => {
    if (!trigger.contains(e.relatedTarget) && !menu.contains(e.relatedTarget)) {
        menu.classList.remove('is-open');
    }
};

trigger.addEventListener('mouseleave', closeMenu);
menu.addEventListener('mouseleave', closeMenu);