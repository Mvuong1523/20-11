// ========== IMAGES ==========
const images = [
    'picture/z6278102027456_92a7d017ed54415f87af07e9cdcd7bd8.jpg',
    'picture/z6278102030773_ca4c0359dec018fd7e8ae91cbe6e7c3f.jpg',
    'picture/z6278102067579_24d91c0abba6dfa928410bfd72cad3ec.jpg',
    'picture/z6391175879700_259c2cccdb6be948fa6f232fb20f45a2.jpg',
    'picture/z6391175885243_6bc4dae21ec40187d30d00b4275aaf36.jpg',
    'picture/z6391175952292_e784bd6fc04b120f747e16d15c547af9.jpg',
    'picture/z6391175964793_15b5dde454e0f5c026d71bbdb79aa99f.jpg',
    'picture/z6391365544797_fbf06d3c0fa1a1ce1dd1ad8306022b09.jpg',
    'picture/z7205277778285_5001ecdf91c281b6544f0c90a6a10128.jpg'
];

// ========== OPENING ANIMATION ==========
const introButton = document.getElementById('introButton');
const openingScreen = document.getElementById('openingScreen');
const cardScreen = document.getElementById('cardScreen');

introButton.addEventListener('click', () => {
    openingScreen.classList.add('hide');
    setTimeout(() => {
        openingScreen.style.display = 'none';
        cardScreen.classList.add('active');
        startFireworks();
        startFloatingHearts();
    }, 1000);
});

// ========== PHOTO SLIDER ==========
const photoSlider = document.getElementById('photoSlider');

function initPhotoSlider() {
    // Duplicate images for infinite scroll
    const allImages = [...images, ...images];
    
    allImages.forEach((img, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = `Memory ${index + 1}`;
        
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        overlay.textContent = `Kỷ niệm ${(index % images.length) + 1}`;
        
        photoItem.appendChild(imgElement);
        photoItem.appendChild(overlay);
        photoSlider.appendChild(photoItem);
    });
}

initPhotoSlider();

// ========== FLOATING HEARTS ==========
const floatingHearts = document.getElementById('floatingHearts');
const heartEmojis = ['❤️', '💖', '💝', '💗', '💓', '💕'];

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (4 + Math.random() * 3) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    floatingHearts.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

function startFloatingHearts() {
    setInterval(createFloatingHeart, 500);
    for (let i = 0; i < 10; i++) {
        setTimeout(createFloatingHeart, i * 200);
    }
}

// ========== FIREWORKS ==========
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fireworksCanvas.getContext('2d');
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

class Firework {
    constructor() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height;
        this.targetY = Math.random() * fireworksCanvas.height * 0.5;
        this.speed = 5;
        this.particles = [];
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    }
    
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach((p, index) => {
                p.update();
                if (p.alpha <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }
    
    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }
    
    draw() {
        if (!this.exploded) {
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fwCtx.fillStyle = this.color;
            fwCtx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1;
    }
    
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
    
    draw() {
        fwCtx.save();
        fwCtx.globalAlpha = this.alpha;
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        fwCtx.fillStyle = this.color;
        fwCtx.fill();
        fwCtx.restore();
    }
}

let fireworks = [];

function animateFireworks() {
    fwCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    fwCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        
        if (fw.exploded && fw.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animateFireworks);
}

function startFireworks() {
    animateFireworks();
    
    setInterval(() => {
        if (Math.random() < 0.5) {
            fireworks.push(new Firework());
        }
    }, 800);
}

// ========== PARTICLE BACKGROUND ==========
const particleCanvas = document.getElementById('particleCanvas');
const pCtx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class BackgroundParticle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
    }
    
    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = this.color;
        pCtx.fill();
    }
}

const bgParticles = [];
for (let i = 0; i < 100; i++) {
    bgParticles.push(new BackgroundParticle());
}

function animateBgParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    bgParticles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Draw connections
    for (let i = 0; i < bgParticles.length; i++) {
        for (let j = i + 1; j < bgParticles.length; j++) {
            const dx = bgParticles[i].x - bgParticles[j].x;
            const dy = bgParticles[i].y - bgParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                pCtx.beginPath();
                pCtx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                pCtx.lineWidth = 0.5;
                pCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
                pCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
                pCtx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateBgParticles);
}

animateBgParticles();

// ========== RESIZE HANDLER ==========
window.addEventListener('resize', () => {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

// ========== CLICK EFFECTS ==========
document.addEventListener('click', (e) => {
    if (e.target.closest('.book') || e.target.closest('.play-games-btn')) return;
    
    // Create burst effect
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.borderRadius = '50%';
        particle.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.animation = 'burstParticle 1s ease-out forwards';
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
});

// Add burst animation
const style = document.createElement('style');
style.textContent = `
    @keyframes burstParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// ========== MOUSE TRACKING FOR GLOW EFFECT ==========
const messageContainer = document.querySelector('.message-container');

if (messageContainer) {
    messageContainer.addEventListener('mousemove', (e) => {
        const rect = messageContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        messageContainer.style.setProperty('--mouse-x', x + '%');
        messageContainer.style.setProperty('--mouse-y', y + '%');
    });
}

// ========== ENHANCED PHOTO EFFECTS ==========
document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        item.style.transform = `scale(1.15) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// ========== PARALLAX EFFECT ON SCROLL ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.flower-decoration');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== RAINBOW TRAIL ON MOUSE MOVE ==========
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 50) return;
    lastTrailTime = now;
    
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '10px';
    trail.style.height = '10px';
    trail.style.borderRadius = '50%';
    trail.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.animation = 'trailFade 1s ease-out forwards';
    
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 1000);
});

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(trailStyle);

// ========== TEXT SHIMMER EFFECT ==========
const messageLines = document.querySelectorAll('.message-line');
messageLines.forEach((line, index) => {
    line.addEventListener('mouseenter', () => {
        line.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a6f, #c44569, #ff6b6b)';
        line.style.backgroundSize = '200% auto';
        line.style.webkitBackgroundClip = 'text';
        line.style.webkitTextFillColor = 'transparent';
        line.style.backgroundClip = 'text';
        line.style.animation = 'shimmer 2s linear infinite';
    });
    
    line.addEventListener('mouseleave', () => {
        line.style.background = '';
        line.style.webkitBackgroundClip = '';
        line.style.webkitTextFillColor = '';
        line.style.backgroundClip = '';
        line.style.animation = '';
    });
});

const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        to { background-position: 200% center; }
    }
`;
document.head.appendChild(shimmerStyle);

// ========== FLOATING SPARKLES ==========
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.fontSize = (Math.random() * 20 + 10) + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1';
    sparkle.style.animation = `sparkleFloat ${3 + Math.random() * 3}s ease-in-out`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 6000);
}

setInterval(createSparkle, 1000);

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: scale(1);
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);
