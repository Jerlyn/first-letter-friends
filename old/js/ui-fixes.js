// Add back button to leaderboard screen and handle navigation

document.addEventListener('DOMContentLoaded', function() {
    // Add back button to leaderboard screen
    addBackButtonToLeaderboard();
    
    // Fix learning mode checkbox display
    fixLearningModeCheckbox();
});

function addBackButtonToLeaderboard() {
    // Get the leaderboard screen
    const leaderboardScreen = document.getElementById('leaderboard-screen');
    if (!leaderboardScreen) return;
    
    // Get the play again button (to place our back button next to it)
    const playAgainBtn = document.getElementById('play-again-btn');
    if (!playAgainBtn) return;
    
    // Create a container for the buttons if it doesn't exist
    let buttonContainer = leaderboardScreen.querySelector('.button-container');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        // Replace the play again button with the container
        playAgainBtn.parentNode.replaceChild(buttonContainer, playAgainBtn);
        
        // Add the play again button to the container
        buttonContainer.appendChild(playAgainBtn);
    }
    
    // Check if back button already exists
    if (!leaderboardScreen.querySelector('.back-btn')) {
        // Create the back button
        const backButton = document.createElement('button');
        backButton.className = 'back-btn';
        backButton.textContent = 'Back to Score';
        backButton.id = 'back-to-score-btn';
        
        // Add the back button to the container before the play again button
        buttonContainer.insertBefore(backButton, playAgainBtn);
        
        // Add event listener to go back to score screen
        backButton.addEventListener('click', function() {
            // Hide leaderboard screen
            leaderboardScreen.classList.remove('active');
            
            // Show score screen
            const scoreScreen = document.getElementById('score-screen');
            if (scoreScreen) {
                scoreScreen.classList.add('active');
            }
        });
    }
}

function fixLearningModeCheckbox() {
    // Get the learning mode checkbox
    const learningModeToggle = document.getElementById('learning-mode');
    if (!learningModeToggle) return;
    
    // Check if it's already using the standard HTML checkbox
    if (learningModeToggle.type === 'checkbox') {
        // Make sure it has the proper styles without extra JavaScript processing
        const parentLabel = learningModeToggle.closest('label');
        if (parentLabel) {
            // It's already in a label, just ensure correct styling
            parentLabel.innerHTML = `
                <input type="checkbox" id="learning-mode">
                Learning Mode
            `;
        } else {
            // It's not in a label, wrap it properly
            const wrapper = learningModeToggle.parentNode;
            wrapper.innerHTML = `
                <label for="learning-mode">
                    <input type="checkbox" id="learning-mode">
                    Learning Mode
                </label>
            `;
        }
        
        // Make sure event listeners are set up correctly
        document.getElementById('learning-mode').addEventListener('change', function() {
            // Trigger the original change event manually if needed
            if (typeof learningModeToggle.onchange === 'function') {
                learningModeToggle.onchange();
            }
        });
    }
}