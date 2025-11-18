// Intro Screen
const introScreen = document.getElementById('introScreen');
const startButton = document.getElementById('startButton');
const mainContent = document.getElementById('mainContent');
const particles = document.getElementById('particles');

// Tạo particles cho intro
for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 4 + 's';
    particle.style.animationDuration = (3 + Math.random() * 2) + 's';
    particles.appendChild(particle);
}

// Start button click
startButton.addEventListener('click', () => {
    introScreen.classList.add('hide');
    setTimeout(() => {
        introScreen.style.display = 'none';
        startMainAnimation();
    }, 1000);
});

// Main animations
function startMainAnimation() {
    // Typing effect
    const message = `Con chúc mẹ luôn tràn đầy sức khỏe, hạnh phúc và niềm vui.

Cảm ơn mẹ đã dành cả thanh xuân để trồng người, dạy dỗ và nuôi dưỡng biết bao thế hệ học trò.

Mẹ là người thầy tuyệt vời nhất, là nguồn cảm hứng vô tận của con!

Con yêu mẹ rất nhiều! 💐✨`;
    
    const typingText = document.getElementById('typingText');
    let index = 0;
    
    function typeWriter() {
        if (index < message.length) {
            typingText.textContent += message.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        } else {
            typingText.style.borderRight = 'none';
        }
    }
    
    setTimeout(typeWriter, 500);
    
    // Start other animations
    startFlowers();
    startConfetti();
    startStars();
}

// Hoa rơi
const flowersContainer = document.getElementById('flowersContainer');
const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🏵️', '🌼'];

function createFallingFlower() {
    const flower = document.createElement('div');
    flower.className = 'falling-flower';
    flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
    flower.style.left = Math.random() * 100 + '%';
    const duration = 5 + Math.random() * 5;
    flower.style.animationDuration = duration + 's';
    flower.style.animationDelay = Math.random() * 2 + 's';
    flowersContainer.appendChild(flower);
    setTimeout(() => flower.remove(), (duration + 2) * 1000);
}

function startFlowers() {
    setInterval(createFallingFlower, 300);
    for (let i = 0; i < 15; i++) {
        setTimeout(createFallingFlower, i * 200);
    }
}

// Confetti
const confettiContainer = document.getElementById('confettiContainer');
const confettiColors = ['#ff0080', '#ff8c00', '#40e0d0', '#9d4edd', '#06ffa5', '#ffbe0b'];

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
    confettiContainer.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
}

function startConfetti() {
    setInterval(createConfetti, 200);
}

// Stars
const starsContainer = document.getElementById('starsContainer');

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = '⭐';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    starsContainer.appendChild(star);
}

function startStars() {
    for (let i = 0; i < 20; i++) {
        createStar();
    }
}

// Click effect
document.addEventListener('click', (e) => {
    if (e.target.closest('.start-button') || e.target.closest('.gift-box')) return;
    
    const effects = ['🌸', '💖', '✨', '⭐', '💫'];
    for (let i = 0; i < 5; i++) {
        const effect = document.createElement('div');
        effect.textContent = effects[Math.floor(Math.random() * effects.length)];
        effect.style.position = 'fixed';
        effect.style.left = e.clientX + (Math.random() - 0.5) * 50 + 'px';
        effect.style.top = e.clientY + (Math.random() - 0.5) * 50 + 'px';
        effect.style.fontSize = '30px';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1000';
        effect.style.animation = 'floatUp 2s ease-out forwards';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 2000);
    }
});

// Gift box click
const giftBox = document.getElementById('giftBox');
giftBox.addEventListener('click', () => {
    // Explosion effect
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.textContent = ['🎉', '🎊', '✨', '💖', '🌟'][Math.floor(Math.random() * 5)];
        particle.style.position = 'fixed';
        particle.style.left = giftBox.offsetLeft + giftBox.offsetWidth / 2 + 'px';
        particle.style.top = giftBox.offsetTop + giftBox.offsetHeight / 2 + 'px';
        particle.style.fontSize = '25px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.animation = `explode 1.5s ease-out forwards`;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }
    
    giftBox.style.animation = 'none';
    setTimeout(() => {
        giftBox.style.animation = '';
    }, 100);
});

// Music control
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🎵';
        musicBtn.classList.remove('playing');
    } else {
        bgMusic.play();
        musicBtn.textContent = '🎶';
        musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-150px) scale(2);
        }
    }
    
    @keyframes explode {
        0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) rotate(720deg) scale(0);
        }
    }
`;
document.head.appendChild(style);
