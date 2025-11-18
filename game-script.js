// ============ PARTICLE SYSTEM ============
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 1;
        this.color = ['#00fffc', '#fc00ff', '#fffc00', '#ff0080'][Math.floor(Math.random() * 4)];
        this.life = 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                const force = (100 - dist) / 100;
                this.vx -= (dx / dist) * force * 0.5;
                this.vy -= (dy / dist) * force * 0.5;
            }
        }
        
        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

const mouse = { x: null, y: null };

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animateParticles() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 252, ${1 - dist / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============ NAVIGATION ============
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startJourney() {
    showScreen('gameSelection');
}

function startGame(gameType) {
    if (gameType === 'word') {
        showScreen('wordGame');
        initWordGame();
    }
}

// ============ PUZZLE GAME ============
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

let puzzleState = [];
let puzzleTimer = 0;
let puzzleMoves = 0;
let puzzleInterval;
let currentPuzzleImage;

function initPuzzle() {
    currentPuzzleImage = images[Math.floor(Math.random() * images.length)];
    puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    puzzleMoves = 0;
    puzzleTimer = 0;
    
    document.getElementById('puzzleMoves').textContent = puzzleMoves;
    document.getElementById('puzzleTimer').textContent = puzzleTimer;
    
    clearInterval(puzzleInterval);
    puzzleInterval = setInterval(() => {
        puzzleTimer++;
        document.getElementById('puzzleTimer').textContent = puzzleTimer;
    }, 1000);
    
    shufflePuzzle();
}

function shufflePuzzle() {
    // Fisher-Yates shuffle
    for (let i = puzzleState.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzleState[i], puzzleState[j]] = [puzzleState[j], puzzleState[i]];
    }
    
    // Ensure solvable puzzle
    if (!isSolvable(puzzleState)) {
        [puzzleState[0], puzzleState[1]] = [puzzleState[1], puzzleState[0]];
    }
    
    renderPuzzle();
}

function isSolvable(arr) {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] && arr[j] && arr[i] > arr[j]) {
                inversions++;
            }
        }
    }
    return inversions % 2 === 0;
}

function renderPuzzle() {
    const container = document.getElementById('puzzleContainer');
    container.innerHTML = '';
    
    puzzleState.forEach((piece, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        
        if (piece === 8) {
            div.classList.add('empty');
        } else {
            const row = Math.floor(piece / 3);
            const col = piece % 3;
            div.style.backgroundImage = `url(${currentPuzzleImage})`;
            div.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
        }
        
        div.onclick = () => movePuzzlePiece(index);
        container.appendChild(div);
    });
}

function movePuzzlePiece(index) {
    const emptyIndex = puzzleState.indexOf(8);
    const validMoves = [
        emptyIndex - 1, emptyIndex + 1,
        emptyIndex - 3, emptyIndex + 3
    ];
    
    // Check if move is valid
    if (validMoves.includes(index)) {
        // Check horizontal boundary
        if ((emptyIndex % 3 === 0 && index === emptyIndex - 1) ||
            (emptyIndex % 3 === 2 && index === emptyIndex + 1)) {
            return;
        }
        
        [puzzleState[emptyIndex], puzzleState[index]] = [puzzleState[index], puzzleState[emptyIndex]];
        puzzleMoves++;
        document.getElementById('puzzleMoves').textContent = puzzleMoves;
        renderPuzzle();
        
        if (checkPuzzleWin()) {
            clearInterval(puzzleInterval);
            setTimeout(() => {
                alert(`🎉 Hoàn thành! Thời gian: ${puzzleTimer}s, Nước đi: ${puzzleMoves}`);
                showScreen('finalScreen');
            }, 300);
        }
    }
}

function checkPuzzleWin() {
    return puzzleState.every((val, idx) => val === idx);
}

// ============ MEMORY GAME ============
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryScore = 0;
let canFlip = true;

function initMemoryGame() {
    // 3x3 = 9 cards, cần 4 cặp + 1 card đơn, hoặc làm 4 cặp thôi (8 cards) + 1 card bonus
    const selectedImages = [...images].sort(() => Math.random() - 0.5).slice(0, 4);
    memoryCards = [...selectedImages, ...selectedImages]
        .sort(() => Math.random() - 0.5)
        .map((img, idx) => ({ id: idx, image: img, matched: false }));
    
    // Thêm 1 card bonus (joker)
    memoryCards.push({ id: 8, image: selectedImages[0], matched: false, isBonus: true });
    
    matchedPairs = 0;
    memoryScore = 0;
    flippedCards = [];
    canFlip = true;
    
    document.getElementById('memoryScore').textContent = memoryScore;
    document.getElementById('memoryPairs').textContent = matchedPairs;
    
    renderMemoryGame();
}

function renderMemoryGame() {
    const container = document.getElementById('memoryContainer');
    container.innerHTML = '';
    
    memoryCards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = card.isBonus ? '⭐' : '?';
        
        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.backgroundImage = `url(${card.image})`;
        
        cardDiv.appendChild(front);
        cardDiv.appendChild(back);
        cardDiv.onclick = () => flipMemoryCard(index);
        
        if (card.matched) {
            cardDiv.classList.add('matched');
        }
        
        container.appendChild(cardDiv);
    });
}

function flipMemoryCard(index) {
    if (!canFlip || flippedCards.length >= 2) return;
    if (flippedCards.includes(index)) return;
    if (memoryCards[index].matched) return;
    
    const cardDiv = document.querySelector(`[data-index="${index}"]`);
    cardDiv.classList.add('flipped');
    flippedCards.push(index);
    
    if (flippedCards.length === 2) {
        canFlip = false;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [idx1, idx2] = flippedCards;
    const card1 = memoryCards[idx1];
    const card2 = memoryCards[idx2];
    
    setTimeout(() => {
        if (card1.image === card2.image) {
            card1.matched = true;
            card2.matched = true;
            matchedPairs++;
            
            // Bonus nếu match với card bonus
            if (card1.isBonus || card2.isBonus) {
                memoryScore += 200;
            } else {
                memoryScore += 100;
            }
            
            document.getElementById('memoryScore').textContent = memoryScore;
            document.getElementById('memoryPairs').textContent = matchedPairs;
            
            // 4 cặp + 1 bonus = 5 matches để thắng
            if (matchedPairs === 5) {
                setTimeout(() => {
                    alert(`🎉 Hoàn thành! Điểm: ${memoryScore}`);
                    showScreen('finalScreen');
                }, 500);
            }
        } else {
            const cardDiv1 = document.querySelector(`[data-index="${idx1}"]`);
            const cardDiv2 = document.querySelector(`[data-index="${idx2}"]`);
            cardDiv1.classList.remove('flipped');
            cardDiv2.classList.remove('flipped');
            memoryScore = Math.max(0, memoryScore - 10);
            document.getElementById('memoryScore').textContent = memoryScore;
        }
        
        flippedCards = [];
        canFlip = true;
    }, 1000);
}

function resetMemoryGame() {
    initMemoryGame();
}

// ============ WORD GAME ============
const words = [
    { word: 'TRI THUC', hint: 'Điều thầy cô truyền đạt cho học trò' },
    { word: 'GIAO VIEN', hint: 'Người truyền đạt tri thức' },
    { word: 'HOC SINH', hint: 'Người học từ thầy cô' }
];

let currentWord = '';
let guessedLetters = [];
let wordErrors = 0;
let wordScore = 0;
let currentWordIndex = 0;

function initWordGame() {
    currentWordIndex = 0;
    wordScore = 0;
    loadWord();
    createKeyboard();
}

function loadWord() {
    const wordData = words[currentWordIndex];
    currentWord = wordData.word.toUpperCase();
    guessedLetters = [];
    wordErrors = 0;
    
    document.getElementById('wordHint').textContent = `💡 ${wordData.hint}`;
    document.getElementById('wordScore').textContent = wordScore;
    document.getElementById('wordErrors').textContent = wordErrors;
    document.getElementById('wordProgress').textContent = currentWordIndex + 1;
    
    updateWordDisplay();
    drawHangman();
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    const letters = 'ABCDEFGHIKLMNOPQRSTUVXY';
    
    letters.split('').forEach(letter => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = letter;
        key.onclick = () => guessLetter(letter, key);
        keyboard.appendChild(key);
    });
}

function guessLetter(letter, keyElement) {
    if (guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    keyElement.classList.add('used');
    
    if (currentWord.includes(letter)) {
        keyElement.classList.add('correct');
        wordScore += 10;
        document.getElementById('wordScore').textContent = wordScore;
        updateWordDisplay();
        
        if (checkWordWin()) {
            setTimeout(() => {
                showCustomModal({
                    icon: '🎉',
                    title: 'Xuất sắc!',
                    message: 'Bạn đã đoán đúng từ!<br>Tiếp tục phát huy nhé!',
                    score: wordScore,
                    buttons: [{ text: 'Từ tiếp theo →', callback: nextWord }]
                });
            }, 300);
        }
    } else {
        keyElement.classList.add('wrong');
        wordErrors++;
        document.getElementById('wordErrors').textContent = wordErrors;
        drawHangman();
        
        if (wordErrors >= 6) {
            setTimeout(() => {
                showCustomModal({
                    icon: '💪',
                    title: 'Cố gắng lên!',
                    message: `Từ đúng là: <strong>${currentWord}</strong><br>Đừng nản chí, thử từ tiếp theo nhé!`,
                    buttons: [{ text: 'Từ tiếp theo →', callback: nextWord }]
                });
            }, 300);
        }
    }
}

function updateWordDisplay() {
    const display = currentWord.split('').map(letter => {
        if (letter === ' ') return ' ';
        return guessedLetters.includes(letter) ? letter : '_';
    }).join(' ');
    
    document.getElementById('wordDisplay').textContent = display;
}

function checkWordWin() {
    return currentWord.split('').every(letter => 
        letter === ' ' || guessedLetters.includes(letter)
    );
}

function nextWord() {
    currentWordIndex++;
    
    if (currentWordIndex >= words.length) {
        setTimeout(() => {
            showCustomModal({
                icon: '🏆',
                title: 'Chúc mừng!',
                message: 'Bạn đã hoàn thành tất cả các từ!<br>Thật tuyệt vời!',
                score: wordScore,
                buttons: [
                    { text: '🎊 Xem lời chúc', callback: () => showScreen('finalScreen') },
                    { text: '🔄 Chơi lại', callback: initWordGame },
                    { text: '🏠 Về trang chủ', callback: () => window.location.href = 'index.html' }
                ]
            });
        }, 500);
    } else {
        loadWord();
        createKeyboard();
    }
}

function drawHangman() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#00fffc';
    ctx.lineWidth = 3;
    
    // Base
    if (wordErrors >= 1) {
        ctx.beginPath();
        ctx.moveTo(20, 230);
        ctx.lineTo(180, 230);
        ctx.stroke();
    }
    
    // Pole
    if (wordErrors >= 2) {
        ctx.beginPath();
        ctx.moveTo(50, 230);
        ctx.lineTo(50, 20);
        ctx.stroke();
    }
    
    // Top
    if (wordErrors >= 3) {
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(130, 20);
        ctx.stroke();
    }
    
    // Rope
    if (wordErrors >= 4) {
        ctx.beginPath();
        ctx.moveTo(130, 20);
        ctx.lineTo(130, 50);
        ctx.stroke();
    }
    
    // Head
    if (wordErrors >= 5) {
        ctx.beginPath();
        ctx.arc(130, 70, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Body
    if (wordErrors >= 6) {
        ctx.beginPath();
        ctx.moveTo(130, 90);
        ctx.lineTo(130, 150);
        ctx.stroke();
    }
}

// ============ GALLERY ============
function initGallery() {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '';
    
    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${index * 0.1}s`;
        
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = `Memory ${index + 1}`;
        
        item.appendChild(imgElement);
        item.onclick = () => {
            // Create fullscreen view
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                cursor: pointer;
            `;
            
            const fullImg = document.createElement('img');
            fullImg.src = img;
            fullImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 0 50px rgba(0,255,252,0.5);
            `;
            
            overlay.appendChild(fullImg);
            overlay.onclick = () => overlay.remove();
            document.body.appendChild(overlay);
        };
        
        container.appendChild(item);
    });
}
