// Simple confetti animation
function startConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', 
                    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
                    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation ends
    setTimeout(() => {
        if (confettiContainer && confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 8000);
}
