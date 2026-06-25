const floatingLogo = document.querySelector('.logo')
const mainSection = document.querySelector('main')
const nav = document.querySelector('nav')
const navLogo = document.querySelector('.nav-logo')
const collectionLinks = document.querySelectorAll('.collections a')
const navCategories = document.querySelector('.navigational-categories')
const navSects = document.querySelectorAll('.nav-sect')
const blurryBg = document.querySelector('.blurry-bg')

let menuTimeout

let initialLogoRect = null;
let targetLogoRect = null;
let isScrolled = false;

function calculateRects() {
    floatingLogo.style.width = '';
    floatingLogo.style.height = '';
    floatingLogo.style.left = '';
    floatingLogo.style.top = '';
    floatingLogo.style.bottom = '';
    
    initialLogoRect = floatingLogo.getBoundingClientRect();
    targetLogoRect = navLogo.getBoundingClientRect();
    
    updateScroll();
}

function updateNavStyle() {
    let scrollY = window.scrollY;
    let isMenuOpen = navCategories.classList.contains('open');

    if (scrollY > 1000 || isMenuOpen) {
        nav.style.background = 'white';
        nav.querySelectorAll('.collections a, .settings-and-info *').forEach(link => link.style.color = 'black');
        nav.querySelectorAll('.collections a::after').forEach(line => line.style.background = 'black');
        navLogo.querySelector('svg').style.fill = 'black';
    } else {
        nav.style.background = 'none';
        nav.querySelectorAll('.collections a, .settings-and-info *').forEach(link => link.style.color = 'white');
        nav.querySelectorAll('.collections a::after').forEach(line => line.style.background = 'white');
        navLogo.querySelector('svg').style.fill = 'white';
    }
}

function updateScroll() {
    let scrollY = window.scrollY;

    if (scrollY > 1000) {
        floatingLogo.style.opacity = '0';
        floatingLogo.style.pointerEvents = 'none';
    } else {
        floatingLogo.style.opacity = '1';
        floatingLogo.style.pointerEvents = 'auto';
        
        if (initialLogoRect && targetLogoRect) {
            let progress = Math.max(0, Math.min(scrollY / 1000, 1));

            let easeProgress = progress * progress;
            
            let currentWidth = initialLogoRect.width + (targetLogoRect.width - initialLogoRect.width) * easeProgress;
            let currentHeight = initialLogoRect.height + (targetLogoRect.height - initialLogoRect.height) * easeProgress;
            let currentLeft = initialLogoRect.left + (targetLogoRect.left - initialLogoRect.left) * easeProgress;
            let currentTop = initialLogoRect.top + (targetLogoRect.top - initialLogoRect.top) * easeProgress;
            
            floatingLogo.style.width = `${currentWidth}px`;
            floatingLogo.style.height = `${currentHeight}px`;
            floatingLogo.style.left = `${currentLeft}px`;
            floatingLogo.style.top = `${currentTop}px`;
            floatingLogo.style.bottom = 'auto';
        }
    }

    if (scrollY > 1000) {
        if (!isScrolled) {
            navLogo.style.transition = 'none';
            navLogo.classList.add('scrolled');
            void navLogo.offsetWidth; // Force reflow to apply the transition instantly
            navLogo.style.transition = '';
            isScrolled = true;
        }
    } else {
        if (isScrolled) {
            navLogo.style.transition = 'none';
            navLogo.classList.remove('scrolled');
            void navLogo.offsetWidth; // Force reflow
            navLogo.style.transition = '';
            isScrolled = false;
        }
    }

    // Викликаємо оновлення стилів при кожному скролі
    updateNavStyle();
}

window.addEventListener('load', calculateRects);
window.addEventListener('resize', calculateRects);
window.addEventListener('scroll', updateScroll);

calculateRects();

collectionLinks.forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
        clearTimeout(menuTimeout)
        navSects.forEach(sect => sect.classList.remove('active'))
        collectionLinks.forEach(l => l.classList.remove('active-link'))
        
        if (navSects[index]) {
            navSects[index].classList.add('active')
        }
        link.classList.add('active-link')
        
        navCategories.classList.add('open')
        nav.classList.add('nav-open')
        blurryBg.classList.add('active')

        // Оновлюємо стилі при відкритті меню
        updateNavStyle();
    })
})

blurryBg.addEventListener('mouseenter', closeMenu)
document.addEventListener('mouseleave', closeMenu)

function closeMenu() {
    navCategories.classList.remove('open')
    nav.classList.remove('nav-open')
    blurryBg.classList.remove('active')
    
    // Оновлюємо стилі при закритті меню
    updateNavStyle();
    
    menuTimeout = setTimeout(() => {
        navSects.forEach(sect => sect.classList.remove('active'))
        collectionLinks.forEach(l => l.classList.remove('active-link'))
    }, 400)
}

// Scrollbar Drag Logic
const scrollbar = document.querySelector('.scrollbar');
const scrollThumb = document.querySelector('.scroll-thumb');

let isDragging = false;
let startY;
let startScrollY;

scrollThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollY = window.scrollY;
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    document.body.style.cursor = 'grabbing'
    scrollThumb.style.cursor = 'grabbing'
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Calculate how far the mouse has moved
    const deltaY = e.clientY - startY;
    
    // Calculate the total scrollable area of the document
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate the total trackable area of the scrollbar
    const trackHeight = scrollbar.clientHeight - scrollThumb.clientHeight;
    
    // Calculate ratio
    const scrollRatio = scrollableHeight / trackHeight;
    
    // Update window scroll
    window.scrollTo(0, startScrollY + (deltaY * scrollRatio));
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = ''; // Restore text selection
    document.body.style.cursor = 'default'
    scrollThumb.style.cursor = 'grab'
});

// Sticker Pop Animation
const stickers = document.querySelectorAll('.showcase-roll .stickers img');
stickers.forEach(sticker => {
    sticker.addEventListener('mousedown', () => {
        sticker.classList.add('popped');
    });
    
    // Remove popped state on mouseup or when mouse leaves the sticker
    sticker.addEventListener('mouseup', () => {
        sticker.classList.remove('popped');
    });
    
    sticker.addEventListener('mouseleave', () => {
        sticker.classList.remove('popped');
    });
});