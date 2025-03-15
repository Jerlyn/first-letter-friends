// Add this to your game.js file

// Function to show progress
function updateProgressIndicator() {
    let progressIndicator = document.getElementById('progress-indicator');
    if (!progressIndicator) {
        progressIndicator = document.createElement('div');
        progressIndicator.id = 'progress-indicator';
        progressIndicator.className = 'progress-indicator';
        
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.insertBefore(progressIndicator, gameArea.firstChild);
        }
    }
    
    // Update progress text
    progressIndicator.textContent = `Animal ${gameState.currentIndex + 1} of 10`;
}

// Share animal fun fact
function shareAnimalFact() {
    if (!gameState.currentAnimal) return;
    
    const animalName = gameState.currentAnimal.name;
    const funFact = getAnimalFunFact(animalName).replace('Hint: ', ''); // Remove the "Hint: " prefix
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    
    const shareText = `I learned about the ${animalName.toLowerCase()} in First Letter Friends! ${funFact} Try it yourself: ${shareUrl}`;
    
    // Show sharing options
    showSharingDialog(shareText);
}

// Share achievement
function shareAchievement(achievement) {
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    const shareText = `I just earned the "${achievement.name}" achievement in First Letter Friends! ${achievement.description}. Try it yourself: ${shareUrl}`;
    
    // Show sharing options
    showSharingDialog(shareText);
}

// Generic sharing dialog
function showSharingDialog(text) {
    // Create a modal for sharing options if it doesn't exist
    let sharingModal = document.getElementById('sharing-modal');
    if (!sharingModal) {
        sharingModal = document.createElement('div');
        sharingModal.id = 'sharing-modal';
        sharingModal.className = 'modal';
        
        sharingModal.innerHTML = `
            <div class="modal-content sharing-content">
                <h3>Share</h3>
                <p id="share-text"></p>
                <div class="share-buttons">
                    <button id="modal-twitter-btn" class="share-btn"><span class="icon">🐦</span> Twitter</button>
                    <button id="modal-facebook-btn" class="share-btn"><span class="icon">📘</span> Facebook</button>
                    <button id="modal-copy-btn" class="share-btn"><span class="icon">📋</span> Copy</button>
                </div>
                <button id="close-sharing" class="secondary-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(sharingModal);
        
        // Add event listeners
        document.getElementById('close-sharing').addEventListener('click', () => {
            sharingModal.style.display = 'none';
        });
    }
    
    // Update the text
    document.getElementById('share-text').textContent = text;
    
    // Set up sharing buttons
    document.getElementById('modal-twitter-btn').addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        sharingModal.style.display = 'none';
    });
    
    document.getElementById('modal-facebook-btn').addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=https://jerlyn.github.io/first-letter-friends/`, '_blank');
        sharingModal.style.display = 'none';
    });
    
    document.getElementById('modal-copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
            sharingModal.style.display = 'none';
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
    
    // Display the modal
    sharingModal.style.display = 'flex';
}

// Modify keyboard creation to color-code vowels
function createKeyboardWithVowels() {
    const keyboardRows = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        'ZXCVBNM'
    ];
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    
    const keyboardElement = document.querySelector('.keyboard');
    keyboardElement.innerHTML = '';
    
    keyboardRows.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';
        
        [...row].forEach(letter => {
            const keyElement = document.createElement('button');
            keyElement.className = 'key';
            
            // Add vowel class for vowels
            if (vowels.includes(letter)) {
                keyElement.classList.add('vowel');
            }
            
            keyElement.textContent = letter;
            keyElement.dataset.key = letter;
            keyElement.setAttribute('aria-label', letter);
            
            keyElement.addEventListener('click', () => handleKeyPress(letter));
            
            rowElement.appendChild(keyElement);
        });
        
        keyboardElement.appendChild(rowElement);
    });
}

// Add share button for current animal
function addAnimalShareButton() {
    // Remove old share button if it exists
    const oldShareBtn = document.querySelector('.animal-share-btn');
    if (oldShareBtn) {
        oldShareBtn.remove();
    }
    
    // Create new share button
    const shareBtn = document.createElement('button');
    shareBtn.className = 'animal-share-btn';
    shareBtn.innerHTML = '<span class="icon">📤</span>';
    shareBtn.setAttribute('aria-label', 'Share this animal fact');
    shareBtn.title = 'Share this animal fact';
    
    // Add event listener
    shareBtn.addEventListener('click', shareAnimalFact);
    
    // Add to animal container
    const animalContainer = document.querySelector('.animal-container');
    if (animalContainer) {
        animalContainer.appendChild(shareBtn);
    }
}

// Modify displayAchievements to add share buttons
function displayAchievementsWithSharing(newlyUnlocked) {
    const achievementContainer = document.getElementById('achievement-container');
    if (!achievementContainer) return;
    
    achievementContainer.innerHTML = '';
    
    // Get all unlocked achievements
    const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    
    // Create elements for all achievements
    achievements.forEach(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const isNew = newlyUnlocked.includes(achievement.id);
        
        const badgeElement = document.createElement('div');
        badgeElement.className = `achievement-badge ${isUnlocked ? '' : 'locked'} ${isNew ? 'new' : ''}`;
        badgeElement.title = achievement.description;
        
        badgeElement.innerHTML = `
            <div class="icon">${achievement.icon}</div>
            <div class="name">${achievement.name}</div>
            ${isUnlocked ? '<button class="achievement-share-btn" aria-label="Share achievement">📤</button>' : ''}
        `;
        
        // Add share event listener if unlocked
        if (isUnlocked) {
            const shareBtn = badgeElement.querySelector('.achievement-share-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    shareAchievement(achievement);
                });
            }
        }
        
        achievementContainer.appendChild(badgeElement);
    });
}

// Update loadNextAnimal to include progress indicator and animal share button
function enhancedLoadNextAnimal() {
    // End game after 10 animals or if we've gone through all shuffled animals
    if (gameState.currentIndex >= 10 || gameState.currentIndex >= gameState.shuffledAnimals.length) {
        // Start confetti for game completion
        startConfetti();
        endGame();
        return;
    }
    
    gameState.currentAnimal = gameState.shuffledAnimals[gameState.currentIndex];
    gameState.guessesRemaining = 3;
    
    // Update the UI
    animalImage.src = `assets/images/${gameState.currentAnimal.image}`;
    animalImage.alt = `Image of an animal starting with the letter ${gameState.currentAnimal.name.charAt(0)}`;
    
    // Hide any previous feedback
    feedbackText.classList.add('hidden');
    
    // Reset word display
    wordDisplay.textContent = '';
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Add share button for current animal
    addAnimalShareButton();
    
    // Remove old hint if exists
    const oldHint = document.querySelector('.learning-hint');
    if (oldHint) oldHint.remove();
    
    // Show hint if in learning mode
    if (learningModeToggle && learningModeToggle.checked) {
        // Get a fun fact instead of directly revealing the first letter
        const funFact = getAnimalFunFact(gameState.currentAnimal.name);
        
        // Create new hint element
        const hintElement = document.createElement('div');
        hintElement.className = 'learning-hint';
        hintElement.textContent = funFact;
        
        // Get the animal container
        const animalContainer = document.querySelector('.animal-container');
        
        // Insert hint AFTER the animal container (not before)
        animalContainer.insertAdjacentElement('afterend', hintElement);
    }
    
    // Re-enable all keyboard keys and reset their styling
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'wrong', 'absent', 'present');
    });
}

// Function to initialize enhanced features
function initEnhancedFeatures() {
    // Override original functions with enhanced versions
    window.originalCreateKeyboard = createKeyboard;
    window.originalDisplayAchievements = displayAchievements;
    window.originalLoadNextAnimal = loadNextAnimal;
    
    // Replace with enhanced versions
    createKeyboard = createKeyboardWithVowels;
    displayAchievements = displayAchievementsWithSharing;
    loadNextAnimal = enhancedLoadNextAnimal;
    
    // Initialize game again to apply changes
    createKeyboardWithVowels();
    updateProgressIndicator();
    addAnimalShareButton();
}

// Call this function after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to make sure the original game.js has loaded
    setTimeout(initEnhancedFeatures, 100);
});