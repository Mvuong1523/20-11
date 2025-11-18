// Music synchronization across pages
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

// Function to start music
function startMusic() {
    if (!bgMusic) return;
    
    bgMusic.volume = 0.3;
    
    // Get saved time from sessionStorage
    const savedTime = parseFloat(sessionStorage.getItem('musicTime') || 0);
    const wasPlaying = sessionStorage.getItem('musicPlaying') === 'true';
    
    if (savedTime > 0) {
        bgMusic.currentTime = savedTime;
    }
    
    // Auto play if it was playing before
    if (wasPlaying || !sessionStorage.getItem('musicPlaying')) {
        bgMusic.play().then(() => {
            isPlaying = true;
            if (musicBtn) musicBtn.classList.add('playing');
            sessionStorage.setItem('musicPlaying', 'true');
        }).catch(err => {
            console.log('Auto-play prevented:', err);
        });
    }
}

// Save music state periodically
if (bgMusic) {
    setInterval(() => {
        if (!bgMusic.paused) {
            sessionStorage.setItem('musicTime', bgMusic.currentTime);
            sessionStorage.setItem('musicPlaying', 'true');
        }
    }, 500);
}

// Music control button
if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            isPlaying = false;
            sessionStorage.setItem('musicPlaying', 'false');
        } else {
            bgMusic.play();
            musicBtn.classList.add('playing');
            isPlaying = true;
            sessionStorage.setItem('musicPlaying', 'true');
        }
    });
}

// Start music on page load
startMusic();

// Fallback: Try to start on first click
let musicStarted = false;
document.addEventListener('click', () => {
    if (!musicStarted && bgMusic && bgMusic.paused) {
        startMusic();
        musicStarted = true;
    }
}, { once: true });

// Save state before leaving page
window.addEventListener('beforeunload', () => {
    if (bgMusic && !bgMusic.paused) {
        sessionStorage.setItem('musicTime', bgMusic.currentTime);
        sessionStorage.setItem('musicPlaying', 'true');
    }
});
