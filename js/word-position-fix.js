// Update this function to place the word directly under the image
function displayWord() {
    const animalName = gameState.currentAnimal.name;
    const firstLetter = animalName.charAt(0);
    const restOfWord = animalName.slice(1).toLowerCase();
    
    // Create the display with appropriate styling - first letter underlined and green
    wordDisplay.innerHTML = `<span class="first-letter">${firstLetter}</span>${restOfWord}`;
    
    // Move the word display to be after the animal container
    const animalContainer = document.querySelector('.animal-container');
    if (animalContainer && wordDisplay) {
        // Remove word display from its current position
        if (wordDisplay.parentNode) {
            wordDisplay.parentNode.removeChild(wordDisplay);
        }
        
        // Insert directly after animal container
        animalContainer.insertAdjacentElement('afterend', wordDisplay);
        
        // If there's a hint, move it after the word display
        const hint = document.querySelector('.learning-hint');
        if (hint) {
            // Remove hint from its current position
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
            
            // Insert after word display
            wordDisplay.insertAdjacentElement('afterend', hint);
        }
    }
    
    // Update key styling to show the correct letter
    const correctKey = document.querySelector(`.key[data-key="${firstLetter.toUpperCase()}"]`);
    if (correctKey) {
        correctKey.classList.add('correct');
    }
}

// Update loadNextAnimal to handle word display positioning correctly
function enhancedLoadNextAnimalWithWordPosition() {
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
    
    // Reset word display and put it back in its original position if it was moved
    wordDisplay.textContent = '';
    const gameArea = document.querySelector('.game-area');
    const keyboard = document.querySelector('.keyboard');
    if (gameArea && keyboard && wordDisplay) {
        // Remove word display from current position if needed
        if (wordDisplay.parentNode) {
            wordDisplay.parentNode.removeChild(wordDisplay);
        }
        
        // Re-add it before the keyboard
        gameArea.insertBefore(wordDisplay, keyboard);
    }
    
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
        
        // Insert hint AFTER the animal container (and after the word if it exists)
        const wordElement = document.querySelector('.word-display');
        if (wordElement && wordElement.textContent.trim() !== '') {
            wordElement.insertAdjacentElement('afterend', hintElement);
        } else {
            animalContainer.insertAdjacentElement('afterend', hintElement);
        }
    }
    
    // Re-enable all keyboard keys and reset their styling
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'wrong', 'absent', 'present');
    });
}

// Update initialization to use the new enhanced function
function initWordPositionFix() {
    // Override the displayWord function
    window.originalDisplayWord = displayWord;
    window.originalEnhancedLoadNextAnimal = enhancedLoadNextAnimal;
    
    // Replace with enhanced versions
    displayWord = displayWord; // This looks redundant but we need to replace the original
    enhancedLoadNextAnimal = enhancedLoadNextAnimalWithWordPosition;
}

// Call this after the other initializations
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to make sure the other scripts have loaded
    setTimeout(initWordPositionFix, 200);
});