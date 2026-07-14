// 1. Celestial Starfield Background
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let starsArray = [];
const numStars = 120;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.baseOpacity = Math.random() * 0.6 + 0.2;
        this.opacity = this.baseOpacity;
        this.speed = Math.random() * 0.02 + 0.005;
        this.factor = Math.random() > 0.5 ? 1 : -1;
    }
    
    update() {
        this.opacity += this.speed * this.factor;
        if (this.opacity >= 1 || this.opacity <= 0.1) {
            this.factor *= -1;
        }
    }
    
    draw() {
        ctx.fillStyle = `rgba(243, 239, 228, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initStars() {
    starsArray = [];
    for (let i = 0; i < numStars; i++) {
        starsArray.push(new Star());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starsArray.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateStars();


// 2. Scroll Interaction / Panels Reveal System
const panels = document.querySelectorAll('.panel');
const dots = document.querySelectorAll('.tracker-dot');

const observerOptions = {
    root: null,
    threshold: 0.4, // Triggers active status when section is 40% visible
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            panels.forEach(p => p.classList.remove('active'));
            entry.target.classList.add('active');
            
            // Sync up tracking system dots
            const index = entry.target.id.split('-')[1];
            dots.forEach(dot => {
                if (dot.getAttribute('data-dot') === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

panels.forEach(panel => observer.observe(panel));

// Handle the manual Entry Button jump
document.getElementById('begin-btn').addEventListener('click', () => {
    document.getElementById('panel-1').scrollIntoView({ behavior: 'smooth' });
});


// 3. Interactive Component: Hold to Melt Wax Seal
const sealStamp = document.getElementById('seal-stamp');
const sealProgress = document.getElementById('seal-progress');
const sealWidget = document.getElementById('seal-widget');
const sealReveal = document.getElementById('seal-reveal');

let sealTimer;
let progress = 0;
const targetProgress = 289; // Matches the stroke-dasharray value

function startSeal() {
    sealTimer = setInterval(() => {
        if (progress < targetProgress) {
            progress += 8; // Adjust velocity of progress fill
            if (progress > targetProgress) progress = targetProgress;
            sealProgress.style.strokeDashoffset = targetProgress - progress;
        } else {
            clearInterval(sealTimer);
            completeSealAction();
        }
    }, 25);
}

function stopSeal() {
    clearInterval(sealTimer);
    if (progress < targetProgress) {
        // Drop progress cleanly if let go prematurely
        let shrinkTimer = setInterval(() => {
            if (progress > 0) {
                progress -= 15;
                if (progress < 0) progress = 0;
                sealProgress.style.strokeDashoffset = targetProgress - progress;
            } else {
                clearInterval(shrinkTimer);
            }
        }, 20);
    }
}

function completeSealAction() {
    sealWidget.style.opacity = '0';
    setTimeout(() => {
        sealWidget.classList.add('hidden');
        sealReveal.classList.remove('hidden');
        sealReveal.style.animation = 'fadeIn 1s ease forwards';
    }, 400);
}

// Support both standard mouse clicks and mobile touches
sealStamp.addEventListener('mousedown', startSeal);
sealStamp.addEventListener('mouseup', stopSeal);
sealStamp.addEventListener('mouseleave', stopSeal);

sealStamp.addEventListener('touchstart', (e) => { e.preventDefault(); startSeal(); });
sealStamp.addEventListener('touchend', stopSeal);


// 4. Interactive Component: Flip Locket Open
const locket = document.getElementById('locket-clickable');
locket.addEventListener('click', () => {
    locket.classList.toggle('open');
});


// 5. Her Promise Reply System
const submitBtn = document.getElementById('submit-promise');
const herInput = document.getElementById('her-input');
const replySection = document.getElementById('reply-section');
const closingNote = document.getElementById('closing-note');
const submittedText = document.getElementById('submitted-promise-text');

submitBtn.addEventListener('click', () => {
    const val = herInput.value.trim();
    if (val.length > 0) {
        submittedText.textContent = `“${val}”`;
        replySection.classList.add('hidden');
        closingNote.classList.remove('hidden');
        
        // Auto-scroll context gently to target view area cleanly
        setTimeout(() => {
            closingNote.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    } else {
        herInput.placeholder = "Please write something soft first... ❤";
    }
});