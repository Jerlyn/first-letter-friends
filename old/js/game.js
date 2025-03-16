// Game state
const gameState = {
    animals: [
        {name: 'Alligator', image: 'alligator.png'},
        {name: 'Butterfly', image: 'butterfly.png'},
        {name: 'Cheetah', image: 'cheetah.png'},
        {name: 'Dolphin', image: 'dolphin.png'},
        {name: 'Elephant', image: 'elephant.png'},
        {name: 'Fox', image: 'fox.png'},
        {name: 'Goat', image: 'goat.png'},
        {name: 'Hamster', image: 'hamster.png'},
        {name: 'Iguana', image: 'iguana.png'},
        {name: 'Jellyfish', image: 'jellyfish.png'},
        {name: 'Kangaroo', image: 'kangaroo.png'},
        {name: 'Lion', image: 'lion.png'},
        {name: 'Monkey', image: 'monkey.png'},
        {name: 'Narwhal', image: 'narwhal.png'},
        {name: 'Owl', image: 'owl.png'},
        {name: 'Pig', image: 'pig.png'},
        {name: 'Quail', image: 'quail.png'},
        {name: 'Rhino', image: 'rhino.png'},
        {name: 'Spider', image: 'spider.png'},
        {name: 'Turtle', image: 'turtle.png'},
        {name: 'Umbrellabird', image: 'umbrellabird.png'},
        {name: 'Vulture', image: 'vulture.png'},
        {name: 'Walrus', image: 'walrus.png'},
        {name: 'Yak', image: 'yak.png'},
        {name: 'Zebra', image: 'zebra.png'}
    ],
    currentAnimal: null,
    currentIndex: 0,
    guessesRemaining: 3,
    correctAnswers: 0,
    wrongAnswers: 0,
    startTime: null,
    shuffledAnimals: [],
};

// DOM elements
const animalImage = document.getElementById('animal-image');
const wordDisplay = document.getElementById('word-display');
const feedbackText = document.getElementById('feedback-text');
const instructionsBtn = document.getElementById('instructions-btn');
const instructionsModal = document.getElementById('instructions-modal');
const closeInstructionsBtn = document.getElementById('close-instructions');
const learningModeToggle = document.getElementById('learning-mode');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const playAgainFromScoreBtn = document.getElementById('play-again-from-score-btn');

// Sound effects
const soundEnabled = true;

// Function to get a fun fact about an animal for toddlers
function getAnimalFunFact(animalName) {
    const funFacts = {
        'Alligator': 'Hint: This animal has lots of sharp teeth and lives in swamps!',
        'Butterfly': 'Hint: This colorful animal used to be a caterpillar!',
        'Cheetah': 'Hint: This animal is the fastest runner in the world!',
        'Dolphin': 'Hint: This animal is very smart and loves to swim and jump in the ocean!',
        'Elephant': 'Hint: This animal has a very long nose called a trunk!',
        'Fox': 'Hint: This animal is clever and has a bushy tail!',
        'Goat': 'Hint: This animal loves to climb and eat grass!',
        'Hamster': 'Hint: This small, furry animal likes to keep food in its cheeks!',
        'Iguana': 'Hint: This animal is like a little dragon with scaly skin!',
        'Jellyfish': 'Hint: This animal lives in the ocean and has squishy tentacles!',
        'Kangaroo': 'Hint: This animal has a pouch for carrying its babies!',
        'Lion': 'Hint: This animal is called the king of the jungle!',
        'Monkey': 'Hint: This animal loves to climb trees and eat bananas!',
        'Narwhal': 'Hint: This animal looks like a unicorn of the sea!',
        'Owl': 'Hint: This animal is awake at night and can turn its head all the way around!',
        'Pig': 'Hint: This animal says oink-oink and loves to roll in mud!',
        'Quail': 'Hint: This small bird has a cute little feather on top of its head!',
        'Rhino': 'Hint: This big animal has a horn on its nose!',
        'Spider': 'Hint: This small animal makes webs to catch bugs!',
        'Turtle': 'Hint: This animal carries its house on its back!',
        'Umbrellabird': 'Hint: This bird has feathers on its head that look like an umbrella!',
        'Vulture': 'Hint: This big bird soars high in the sky looking for food!',
        'Walrus': 'Hint: This animal has long tusks and loves to swim in cold water!',
        'Yak': 'Hint: This animal is like a big, hairy cow that lives in the mountains!',
        'Zebra': 'Hint: This animal has black and white stripes all over its body!'
    };
    
    return funFacts[animalName] || `Hint: I'm thinking of a fun animal!`;
}

// Initialize the game
function initGame() {
    // Shuffle all animals
    const shuffled = [...gameState.animals].sort(() => Math.random() - 0.5);
    
    // Take only 10 for this game session
    gameState.shuffledAnimals = shuffled.slice(0, 10);
    gameState.currentIndex = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.startTime = Date.now();
    
    // Create keyboard
    createKeyboard();
    
    // Set up event listeners
    instructionsBtn.addEventListener('click', showInstructions);
    closeInstructionsBtn.addEventListener('click', () => {
        hideInstructions();
        // Start the game after closing instructions
        loadNextAnimal();
    });
    leaderboardBtn.addEventListener('click', showLeaderboard);
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', restartGame);
    }
    
    if (playAgainFromScoreBtn) {
        playAgainFromScoreBtn.addEventListener('click', restartGame);
    }
    
    // Always start with instructions first
    showInstructions();
    
    // Don't load the first animal until instructions are closed
    // This will be called in the closeInstructions handler
}

// Load the next animal
function loadNextAnimal() {
    // End game after 10 animals or if we've gone through all shuffled animals
    if (gameState.currentIndex >= 10 || gameState.currentIndex >= gameState.shuffledAnimals.length) {
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

// Create the keyboard
function createKeyboard() {
    const keyboardRows = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        'ZXCVBNM'
    ];
    
    const keyboardElement = document.querySelector('.keyboard');
    keyboardElement.innerHTML = '';
    
    keyboardRows.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';
        
        [...row].forEach(letter => {
            const keyElement = document.createElement('button');
            keyElement.className = 'key';
            keyElement.textContent = letter;
            keyElement.dataset.key = letter;
            keyElement.setAttribute('aria-label', letter);
            
            keyElement.addEventListener('click', () => handleKeyPress(letter));
            
            rowElement.appendChild(keyElement);
        });
        
        keyboardElement.appendChild(rowElement);
    });
}

// Handle key press
function handleKeyPress(letter) {
    if (gameState.guessesRemaining <= 0) return;
    
    const correctLetter = gameState.currentAnimal.name.charAt(0).toUpperCase();
    
    if (letter === correctLetter) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer(letter);
    }
}

// Handle correct answer
function handleCorrectAnswer() {
    gameState.correctAnswers++;
    
    // Play sound
    if (soundEnabled) {
        playSound('correct');
    }
    
    // Show the word
    displayWord();
    
    // Disable keyboard temporarily
    disableKeyboard();
    
    // Move to next animal after delay
    setTimeout(() => {
        gameState.currentIndex++;
        loadNextAnimal();
    }, 1500);
}

// Handle wrong answer
function handleWrongAnswer(letter) {
    gameState.guessesRemaining--;
    gameState.wrongAnswers++;
    
    // Play sound
    if (soundEnabled) {
        playSound('incorrect');
    }
    
    // Show feedback
    feedbackText.textContent = 'Try again';
    feedbackText.classList.remove('hidden');
    feedbackText.style.color = 'var(--incorrect-color)';
    
    // Mark the key as wrong - use new wrong class instead of absent
    const wrongKey = document.querySelector(`.key[data-key="${letter}"]`);
    if (wrongKey) {
        wrongKey.classList.add('wrong');
    }
    
    // If out of guesses, show correct answer and move on
    if (gameState.guessesRemaining <= 0) {
        displayWord();
        disableKeyboard();
        
        setTimeout(() => {
            gameState.currentIndex++;
            loadNextAnimal();
        }, 2000);
    }
}

// Display the word with the first letter highlighted
function displayWord() {
    const animalName = gameState.currentAnimal.name;
    const firstLetter = animalName.charAt(0);
    const restOfWord = animalName.slice(1).toLowerCase();
    
    // Create the display with appropriate styling - first letter underlined and green
    wordDisplay.innerHTML = `<span class="first-letter">${firstLetter}</span>${restOfWord}`;
    
    // Update key styling to show the correct letter
    const correctKey = document.querySelector(`.key[data-key="${firstLetter.toUpperCase()}"]`);
    if (correctKey) {
        correctKey.classList.add('correct');
    }
}

// Disable keyboard
function disableKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = true;
    });
}

// Play sound
function playSound(type) {
    try {
        const audio = new Audio(`assets/audio/${type}.mp3`);
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
        console.log('Sound playback error:', error);
    }
}

// End game
function endGame() {
    const endTime = Date.now();
    const timeElapsed = Math.floor((endTime - gameState.startTime) / 1000);
    
    // Check achievements
    const newlyUnlocked = checkAchievements();
    
    // Show score screen
    showScoreScreen(gameState.correctAnswers, gameState.wrongAnswers, timeElapsed);
    
    // Display achievements
    displayAchievements(newlyUnlocked);
}

// Show instructions modal
function showInstructions() {
    instructionsModal.style.display = 'flex';
    
    // Make sure game container is hidden while instructions are showing
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.classList.remove('active');
    }
}

// Hide instructions modal
function hideInstructions() {
    instructionsModal.style.display = 'none';
    
    // Show game screen after instructions are closed
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.classList.add('active');
    }
}

// Show score screen
function showScoreScreen(correct, wrong, timeElapsed) {
    // Hide game screen
    document.getElementById('game-screen').classList.remove('active');
    
    // Show score screen
    const scoreScreen = document.getElementById('score-screen');
    scoreScreen.classList.add('active');
    
    // Update score text
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('wrong-count').textContent = wrong;
    
    // Initialize the initials field if needed
    const initialsInput = document.getElementById('initials-input');
    if (initialsInput) {
        // Get saved initials or use default
        const savedInitials = localStorage.getItem('playerInitials') || 'AAA';
        initialsInput.value = savedInitials;
    }
    
    // Set up event listener for save score button
    const saveScoreBtn = document.getElementById('save-score-btn');
    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', () => {
            // Save the initials for future use
            if (initialsInput) {
                localStorage.setItem('playerInitials', initialsInput.value.toUpperCase().substring(0, 3));
            }
            
            // Save score to leaderboard
            saveScore(timeElapsed);
            
            // Show leaderboard
            showLeaderboard();
        });
    }
    
    // Set up sharing buttons
    setupSharingButtons(correct, wrong);
}

// Set up sharing buttons
function setupSharingButtons(correct, wrong) {
    const twitterBtn = document.getElementById('share-twitter-btn');
    const facebookBtn = document.getElementById('share-facebook-btn');
    const copyBtn = document.getElementById('copy-result-btn');
    
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    
    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => {
            const text = `I scored ${correct} correct and ${wrong} wrong in First Letter Friends! Can you beat my score? #FirstLetterFriends`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = `I scored ${correct} correct and ${wrong} wrong in First Letter Friends! Try it yourself: ${shareUrl}`;
            navigator.clipboard.writeText(text).then(() => {
                alert('Result copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    }
}

// Achievement system
const achievements = [
    {
        id: 'first_correct',
        name: 'First Steps',
        icon: '🌟',
        description: 'Get your first answer correct',
        condition: (state) => state.correctAnswers >= 1
    },
    {
        id: 'perfect_game',
        name: 'Perfect Game',
        icon: '🏆',
        description: 'Complete the game with no wrong answers',
        condition: (state) => state.correctAnswers === 10 && state.wrongAnswers === 0
    },
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        icon: '⚡',
        description: 'Complete the game in under 60 seconds',
        condition: (state) => {
            const timeElapsed = Math.floor((Date.now() - state.startTime) / 1000);
            return state.correctAnswers === 10 && timeElapsed < 60;
        }
    },
    {
        id: 'persistence',
        name: 'Persistence',
        icon: '🔄',
        description: 'Keep trying after 5 wrong answers',
        condition: (state) => state.wrongAnswers >= 5 && state.correctAnswers > 0
    },
    {
        id: 'explorer',
        name: 'Explorer',
        icon: '🔍',
        description: 'Play the game 3 times',
        condition: (state) => {
            const gameCount = parseInt(localStorage.getItem('gameCount') || '0');
            return gameCount >= 3;
        }
    }
];

// Check for unlocked achievements
function checkAchievements() {
    // Get previously unlocked achievements
    const unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    
    // Track newly unlocked achievements
    const newlyUnlocked = [];
    
    // Check each achievement
    achievements.forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id) && achievement.condition(gameState)) {
            unlockedAchievements.push(achievement.id);
            newlyUnlocked.push(achievement.id);
        }
    });
    
    // Save updated unlocked achievements
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    
    // Increment game count for the 'explorer' achievement
    const gameCount = parseInt(localStorage.getItem('gameCount') || '0');
    localStorage.setItem('gameCount', (gameCount + 1).toString());
    
    return newlyUnlocked;
}

// Display achievements on the score screen
function displayAchievements(newlyUnlocked) {
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
        `;
        
        achievementContainer.appendChild(badgeElement);
    });
}

// Learning mode toggle handler
if (learningModeToggle) {
    learningModeToggle.addEventListener('change', () => {
        // If turning on learning mode, show hint for current animal
        if (learningModeToggle.checked && gameState.currentAnimal) {
            // Get a fun fact instead of directly revealing the first letter
            const funFact = getAnimalFunFact(gameState.currentAnimal.name);
            
            // Remove old hint if exists
            const oldHint = document.querySelector('.learning-hint');
            if (oldHint) oldHint.remove();
            
            // Create and add new hint
            const hintElement = document.createElement('div');
            hintElement.className = 'learning-hint';
            hintElement.textContent = funFact;
            
            // Get the animal container and add the hint after it
            const animalContainer = document.querySelector('.animal-container');
            animalContainer.insertAdjacentElement('afterend', hintElement);
        } else {
            // If turning off, remove hint
            const oldHint = document.querySelector('.learning-hint');
            if (oldHint) oldHint.remove();
        }
    });
}

// Show leaderboard
function showLeaderboard() {
    // Hide other screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show leaderboard screen
    document.getElementById('leaderboard-screen').classList.add('active');
    
    // Display leaderboard
    displayLeaderboard();
}

// Restart game
function restartGame() {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Initialize game
    initGame();
}

// Function to save score - defined in leaderboard.js but needed for reference
function saveScore(timeElapsed) {
    // This function is implemented in leaderboard.js
    // It saves the player's score to localStorage
}

// Function to display leaderboard - defined in leaderboard.js but needed for reference
function displayLeaderboard() {
    // This function is implemented in leaderboard.js
    // It renders the leaderboard from localStorage data
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);

/**
 * Add these functions to your game.js file
 * Place them near the initGame function
 */

// Animal hints database
const animalHints = {
    'Alligator': 'Hint: This animal has lots of sharp teeth and lives in swamps!',
    'Butterfly': 'Hint: This colorful animal used to be a caterpillar!',
    'Cheetah': 'Hint: This animal is the fastest runner in the world!',
    'Dolphin': 'Hint: This animal is very smart and loves to swim and jump in the ocean!',
    'Elephant': 'Hint: This animal has a very long nose called a trunk!',
    'Fox': 'Hint: This animal is clever and has a bushy tail!',
    'Goat': 'Hint: This animal loves to climb and eat grass!',
    'Hamster': 'Hint: This small, furry animal likes to keep food in its cheeks!',
    'Iguana': 'Hint: This animal is like a little dragon with scaly skin!',
    'Jellyfish': 'Hint: This animal lives in the ocean and has squishy tentacles!',
    'Kangaroo': 'Hint: This animal has a pouch for carrying its babies!',
    'Lion': 'Hint: This animal is called the king of the jungle!',
    'Monkey': 'Hint: This animal loves to climb trees and eat bananas!',
    'Narwhal': 'Hint: This animal looks like a unicorn of the sea!',
    'Owl': 'Hint: This animal is awake at night and can turn its head all the way around!',
    'Pig': 'Hint: This animal says oink-oink and loves to roll in mud!',
    'Quail': 'Hint: This small bird has a cute little feather on top of its head!',
    'Rhino': 'Hint: This big animal has a horn on its nose!',
    'Spider': 'Hint: This small animal makes webs to catch bugs!',
    'Turtle': 'Hint: This animal carries its house on its back!',
    'Umbrellabird': 'Hint: This bird has feathers on its head that look like an umbrella!',
    'Vulture': 'Hint: This big bird soars high in the sky looking for food!',
    'Walrus': 'Hint: This animal has long tusks and loves to swim in cold water!',
    'Yak': 'Hint: This animal is like a big, hairy cow that lives in the mountains!',
    'Zebra': 'Hint: This animal has black and white stripes all over its body!'
};

// Initialize the learning mode
function initLearningMode() {
    // Remove any existing learning mode toggle to avoid duplicates
    const existingToggles = document.querySelectorAll('.learning-mode-toggle');
    existingToggles.forEach(toggle => toggle.remove());
    
    // Create a new learning mode toggle
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'learning-mode-toggle';
    toggleContainer.innerHTML = `
        <label>
            <input type="checkbox" id="learning-mode-checkbox">
            Learning Mode
        </label>
    `;
    
    // Add to game area before the question
    const gameArea = document.querySelector('.game-area');
    const question = document.querySelector('.question');
    if (gameArea && question) {
        gameArea.insertBefore(toggleContainer, question);
    }
    
    // Set up the event listener
    const checkbox = document.getElementById('learning-mode-checkbox');
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                showHint();
            } else {
                hideHint();
            }
        });
    }
}

// Show hint for current animal
function showHint() {
    // Remove existing hint
    hideHint();
    
    // Check if we have current animal
    if (!gameState.currentAnimal) return;
    
    // Get hint for current animal
    const hint = animalHints[gameState.currentAnimal.name] || 'Hint: This is a fun animal!';
    
    // Create hint element
    const hintElement = document.createElement('div');
    hintElement.className = 'learning-hint';
    hintElement.textContent = hint;
    
    // Add after animal container
    const animalContainer = document.querySelector('.animal-container');
    if (animalContainer) {
        animalContainer.insertAdjacentElement('afterend', hintElement);
    }
}

// Hide any visible hints
function hideHint() {
    const hint = document.querySelector('.learning-hint');
    if (hint) hint.remove();
}

// Modify loadNextAnimal to handle hints
const originalLoadNextAnimal = loadNextAnimal;
loadNextAnimal = function() {
    // Call original function
    originalLoadNextAnimal.apply(this, arguments);
    
    // Check if learning mode is enabled, and if so, show hint
    setTimeout(() => {
        const checkbox = document.getElementById('learning-mode-checkbox');
        if (checkbox && checkbox.checked) {
            showHint();
        }
    }, 100);
};

// Add this to your initGame function
function enhanceInitGame() {
    const originalInitGame = initGame;
    
    // Replace with enhanced version
    initGame = function() {
        // Call original
        originalInitGame.apply(this, arguments);
        
        // Add our enhancements
        initLearningMode();
        addLeaderboardBackButton();
    };
}

// Add back button to leaderboard
function addLeaderboardBackButton() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Get the leaderboard screen
        const leaderboardScreen = document.getElementById('leaderboard-screen');
        if (!leaderboardScreen) return;
        
        // Get the play again button
        const playAgainBtn = leaderboardScreen.querySelector('#play-again-btn');
        if (!playAgainBtn) return;
        
        // Check if we already added the back button
        if (leaderboardScreen.querySelector('#back-to-score-btn')) return;
        
        // Create button container if it doesn't exist
        let buttonContainer = leaderboardScreen.querySelector('.button-container');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            
            // Move the play again button into the container
            const playAgainParent = playAgainBtn.parentNode;
            playAgainParent.insertBefore(buttonContainer, playAgainBtn);
            buttonContainer.appendChild(playAgainBtn);
        }
        
        // Create back button
        const backButton = document.createElement('button');
        backButton.id = 'back-to-score-btn';
        backButton.className = 'back-btn';
        backButton.textContent = 'Back to Score';
        
        // Add back button to the container before the play again button
        buttonContainer.insertBefore(backButton, playAgainBtn);
        
        // Add event listener
        backButton.addEventListener('click', function() {
            // Hide leaderboard screen
            leaderboardScreen.classList.remove('active');
            
            // Show score screen
            const scoreScreen = document.getElementById('score-screen');
            if (scoreScreen) {
                scoreScreen.classList.add('active');
            }
        });
    }, 300);
}

// Call to enhance the init game function
enhanceInitGame();