// Custom Modal System
function showCustomModal(options) {
    const {
        icon = '🎉',
        title = 'Thông báo',
        message = '',
        score = null,
        buttons = [{ text: 'OK', callback: null }]
    } = options;

    // Remove existing modal
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    // Icon
    const iconEl = document.createElement('div');
    iconEl.className = 'modal-icon';
    iconEl.textContent = icon;
    content.appendChild(iconEl);
    
    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'modal-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);
    
    // Message
    const messageEl = document.createElement('div');
    messageEl.className = 'modal-message';
    messageEl.innerHTML = message;
    content.appendChild(messageEl);
    
    // Score (if provided)
    if (score !== null) {
        const scoreEl = document.createElement('div');
        scoreEl.className = 'modal-score';
        scoreEl.textContent = `⭐ Điểm: ${score} ⭐`;
        content.appendChild(scoreEl);
    }
    
    // Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';
    
    buttons.forEach((btn, index) => {
        const button = document.createElement('button');
        button.className = `modal-button ${index > 0 ? 'secondary' : ''}`;
        button.textContent = btn.text;
        button.onclick = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            if (btn.callback) btn.callback();
        };
        buttonsContainer.appendChild(button);
    });
    
    content.appendChild(buttonsContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Create confetti
    if (icon === '🎉' || icon === '🏆') {
        createConfetti(content);
    }
}

function createConfetti(container) {
    const colors = ['#ff6b6b', '#ee5a6f', '#c44569', '#667eea', '#764ba2', '#ffd700'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'modal-confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Override default alert
window.customAlert = function(message, callback) {
    showCustomModal({
        icon: '💝',
        title: 'Thông báo',
        message: message,
        buttons: [{ text: 'Đóng', callback: callback }]
    });
};
