// ===== Data =====
// Flashcard data will be loaded from database/API
// All fake/demo data has been removed
const flashcardsData = {
    math: [],
    chemistry: [],
    biology: []
};

// ===== State =====
let currentSubject = 'math';
let currentCardIndex = 0;
let countdownDate = new Date();
// Set countdown date to 6 months from today (can be updated by admin)
countdownDate.setMonth(countdownDate.getMonth() + 6);
if (countdownDate < new Date()) {
    countdownDate.setFullYear(countdownDate.getFullYear() + 1);
}

// ===== DOM Elements =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const progressRings = document.querySelectorAll('.progress-ring');
const flashcard = document.getElementById('flashcard');
const flashcardSubject = document.getElementById('flashcardSubject');
const prevCard = document.getElementById('prevCard');
const nextCard = document.getElementById('nextCard');
const cardCounter = document.getElementById('cardCounter');
const cardTag = document.getElementById('cardTag');
const cardTagBack = document.getElementById('cardTagBack');
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const dayTabs = document.querySelectorAll('.day-tab');
const scheduleDays = document.querySelectorAll('.schedule-day');
const progressFills = document.querySelectorAll('.progress-fill');
const studyHoursEl = document.getElementById('studyHours');
const streakDaysEl = document.getElementById('streakDays');

// ===== Theme =====
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Chế độ sáng';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Chế độ tối';
    }
}

// ===== Sidebar Navigation =====
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            overlay?.classList.remove('active');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== Mobile Sidebar =====
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

menuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
});

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// ===== Countdown =====
function updateCountdown() {
    const now = new Date();
    const diff = countdownDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== Progress Rings =====
function animateProgressRings() {
    progressRings.forEach(ring => {
        const progress = parseInt(ring.getAttribute('data-progress'));
        const circle = ring.querySelector('.progress-bar');
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;
        
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 300);
    });
}

// Animate on load
setTimeout(animateProgressRings, 500);

// ===== Progress Bars =====
function animateProgressBars() {
    progressFills.forEach((fill, index) => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, 200 + index * 100);
    });
}

// ===== Flashcards =====
function updateFlashcard() {
    const cards = flashcardsData[currentSubject];
    
    // Handle empty flashcards
    if (!cards || cards.length === 0) {
        cardTag.textContent = 'Không có flashcard';
        cardFront.textContent = 'Chưa có dữ liệu flashcard cho môn học này';
        cardBack.textContent = 'Vui lòng quay lại sau';
        cardCounter.textContent = '0 / 0';
        return;
    }
    
    const card = cards[currentCardIndex];
    flashcard.classList.remove('flipped');
    
    setTimeout(() => {
        const subjectNames = { math: 'Toán học', chemistry: 'Hóa học', biology: 'Sinh học' };
        cardTag.textContent = subjectNames[currentSubject];
        cardFront.textContent = card.front;
        cardBack.textContent = card.back;
        cardCounter.textContent = `${currentCardIndex + 1} / ${cards.length}`;
    }, 200);
}

flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

flashcardSubject.addEventListener('change', (e) => {
    currentSubject = e.target.value;
    currentCardIndex = 0;
    updateFlashcard();
});

prevCard.addEventListener('click', () => {
    const cards = flashcardsData[currentSubject];
    if (cards && cards.length > 0) {
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        updateFlashcard();
    }
});

nextCard.addEventListener('click', () => {
    const cards = flashcardsData[currentSubject];
    if (cards && cards.length > 0) {
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        updateFlashcard();
    }
});

// ===== Schedule Tabs =====
dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const day = tab.getAttribute('data-day');
        
        dayTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        scheduleDays.forEach(d => d.classList.remove('active'));
        document.querySelector(`.schedule-day[data-day="${day}"]`).classList.add('active');
    });
});

// ===== Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== Intersection Observer =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('progress-ring')) {
                animateProgressRings();
            }
            if (entry.target.classList.contains('progress-fill')) {
                animateProgressBars();
            }
            // Fake data removed - animateCounter calls commented
            // if (entry.target === studyHoursEl) {
            //     animateCounter(studyHoursEl, 128);
            // }
            // if (entry.target === streakDaysEl) {
            //     animateCounter(streakDaysEl, 15);
            // }
        }
    });
}, observerOptions);

progressRings.forEach(ring => observer.observe(ring));
if (studyHoursEl) observer.observe(studyHoursEl);
if (streakDaysEl) observer.observe(streakDaysEl);

// ===== Progress Chart CSS Variable =====
const chart = document.querySelector('.progress-chart');
if (chart) {
    chart.style.setProperty('--percent-1', '33%');
    chart.style.setProperty('--percent-2', '61%');
}

// ===== Task Checkbox Animation =====
document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const allChecked = document.querySelectorAll('.task-item input[type="checkbox"]:checked').length;
        const total = document.querySelectorAll('.task-item input[type="checkbox"]').length;
        
        if (allChecked === total) {
            // Small celebration effect could go here
        }
    });
});

// ===== Search Box Focus =====
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-box').style.borderColor = 'var(--primary-light)';
    });
    searchInput.addEventListener('blur', () => {
        document.querySelector('.search-box').style.borderColor = 'var(--border)';
    });
}

// ===== Notification Badge Animation =====
const badge = document.querySelector('.notification .badge');
if (badge) {
    setInterval(() => {
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }, 5000);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
    });
});

// ===== Keyboard Navigation for Flashcards =====
document.addEventListener('keydown', (e) => {
    if (document.getElementById('flashcards').classList.contains('active')) {
        if (e.key === 'ArrowLeft') prevCard.click();
        if (e.key === 'ArrowRight') nextCard.click();
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flashcard.click();
        }
    }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateFlashcard();
    animateProgressBars();
});
