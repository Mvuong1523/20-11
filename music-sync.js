// Music synchronization across pages
(function() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    
    if (!bgMusic) return;
    
    let isPlaying = false;
    
    // Function to start music
    function startMusic() {
        bgMusic.volume = 0.3;
        
        // Get saved time from sessionStorage
        const savedTime = parseFloat(sessionStorage.getItem('musicTime') || 0);
        const musicState = sessionStorage.getItem('musicPlaying');
        
        // Set current time if saved
        if (savedTime > 0) {
            bgMusic.currentTime = savedTime;
        }
        
        // Auto play if it was playing before OR if this is first visit
        const shouldPlay = musicState === null || musicState === 'true';
        
        if (shouldPlay) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if (musicBtn) musicBtn.classList.add('playing');
                sessionStorage.setItem('musicPlaying', 'true');
            }).catch(err => {
                console.log('Auto-play prevented, will try on interaction');
            });
        }
    }
    
    // Save music state periodically (every 500ms)
    setInterval(() => {
        if (!bgMusic.paused) {
            sessionStorage.setItem('musicTime', bgMusic.currentTime.toString());
            sessionStorage.setItem('musicPlaying', 'true');
        }
    }, 500);
    
    // Music control button
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!bgMusic.paused) {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
                sessionStorage.setItem('musicPlaying', 'false');
            } else {
                bgMusic.play().then(() => {
                    musicBtn.classList.add('playing');
                    sessionStorage.setItem('musicPlaying', 'true');
                });
            }
        });
    }
    
    // Start music when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startMusic);
    } else {
        startMusic();
    }
    
    // Fallback: Try to start on first user interaction
    let interactionAttempted = false;
    const tryStartOnInteraction = () => {
        if (!interactionAttempted && bgMusic.paused && sessionStorage.getItem('musicPlaying') !== 'false') {
            startMusic();
            interactionAttempted = true;
        }
    };
    
    document.addEventListener('click', tryStartOnInteraction, { once: true });
    document.addEventListener('touchstart', tryStartOnInteraction, { once: true });
    
    // Save state before leaving page
    window.addEventListener('beforeunload', () => {
        if (!bgMusic.paused) {
            sessionStorage.setItem('musicTime', bgMusic.currentTime.toString());
            sessionStorage.setItem('musicPlaying', 'true');
        }
    });
    
    // Also save on visibility change (when switching tabs)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !bgMusic.paused) {
            sessionStorage.setItem('musicTime', bgMusic.currentTime.toString());
            sessionStorage.setItem('musicPlaying', 'true');
        }
    });
})();
