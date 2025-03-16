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
    leaderboardOrigin: 'game', // Track where user is coming from - 'game' or 'score'
    difficultyLevel: 'beginner', // Added property for adaptive difficulty
    hintsUsed: 0 // Track hint usage
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
const backButton = document.getElementById('back-button');

// Sound effects
let soundEnabled = true;

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
    gameState.hintsUsed = 0;
    
    // Load difficulty setting from localStorage
    gameState.difficultyLevel = localStorage.getItem('difficultyLevel') || 'beginner';
    
    // Create keyboard with vowels highlighted
    createKeyboard();
    
    // Set up event listeners
    instructionsBtn.addEventListener('click', showInstructions);
    closeInstructionsBtn.addEventListener('click', () => {
        hideInstructions();
        // Start the game after closing instructions
        loadNextAnimal();
    });
    
    leaderboardBtn.addEventListener('click', () => {
        gameState.leaderboardOrigin = 'game';
        showLeaderboard();
    });
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', restartGame);
    }
    
    if (playAgainFromScoreBtn) {
        playAgainFromScoreBtn.addEventListener('click', restartGame);
    }
    
    if (backButton) {
        backButton.addEventListener('click', handleBackButton);
    }
    
    // Set up learning mode toggle
    if (learningModeToggle) {
        learningModeToggle.addEventListener('change', function() {
            if (this.checked) {
                showHint();
                gameState.hintsUsed++;
            } else {
                hideHint();
            }
        });
        
        // Check if auto-hints is enabled
        const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
        if (preferences.autoHints) {
            learningModeToggle.checked = true;
        }
    }
    
    // Set up share button
    setupAnimalShareButton();
    
    // Initialize toast container if it doesn't exist
    if (!document.getElementById('toast-message')) {
        const toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Always start with instructions first
    showInstructions();
}

// Load the next animal
function loadNextAnimal() {
    // End game after 10 animals or if we've gone through all shuffled animals
    if (gameState.currentIndex >= 10 || gameState.currentIndex >= gameState.shuffledAnimals.length) {
        // Start confetti for game completion
        startConfetti();
        endGame();
        return;
    }
    
    gameState.currentAnimal = gameState.shuffledAnimals[gameState.currentIndex];
    
    // Adjust guesses based on difficulty
    if (gameState.difficultyLevel === 'beginner') {
        gameState.guessesRemaining = 3;
    } else if (gameState.difficultyLevel === 'intermediate') {
        gameState.guessesRemaining = 2;
    } else {
        gameState.guessesRemaining = 1;
    }
    
    // Update the UI
    animalImage.src = `assets/images/${gameState.currentAnimal.image}`;
    animalImage.alt = `Image of an animal starting with the letter ${gameState.currentAnimal.name.charAt(0)}`;
    animalImage.classList.remove('celebration');
    
    // Hide any previous feedback
    feedbackText.classList.add('hidden');
    
    // Reset word display and ensure it's in the correct position
    wordDisplay.textContent = '';
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Remove old hint if exists
    const oldHint = document.querySelector('.learning-hint');
    if (oldHint) oldHint.remove();
    
    // Show hint if learning mode is checked or auto-hints is enabled
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
    if ((learningModeToggle && learningModeToggle.checked) || preferences.autoHints) {
        showHint();
    }
    
    // Re-enable all keyboard keys and reset their styling
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'wrong', 'absent', 'present');
    });
    
    // Announce to screen readers
    announceToScreenReader(`New animal. What letter does a ${gameState.currentAnimal.name} start with?`);
}

// Create the keyboard with vowels highlighted
function createKeyboard() {
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
    
    // Add celebration animation to animal image
    animalImage.classList.add('celebration');
    
    // Show the word
    displayWord();
    
    // Show success feedback
    feedbackText.textContent = 'Great job!';
    feedbackText.classList.remove('hidden');
    feedbackText.style.color = 'var(--success-color)';
    
    // Disable keyboard temporarily
    disableKeyboard();
    
    // Announce to screen readers
    announceToScreenReader(`Excellent! ${gameState.currentAnimal.name} starts with the letter ${gameState.currentAnimal.name.charAt(0)}. ${getAnimalFunFact(gameState.currentAnimal.name).replace('Hint: ', '')}`);
    
    // Move to next animal after delay
    setTimeout(() => {
        gameState.currentIndex++;
        loadNextAnimal();
    }, 2000);
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
    feedbackText.style.color = 'var(--error-color)';
    
    // Mark the key as wrong
    const wrongKey = document.querySelector(`.key[data-key="${letter}"]`);
    if (wrongKey) {
        wrongKey.classList.add('wrong');
    }
    
    // Announce to screen readers
    announceToScreenReader(`Incorrect. ${gameState.guessesRemaining} tries left.`);
    
    // If out of guesses, show correct answer and move on
    if (gameState.guessesRemaining <= 0) {
        displayWord();
        disableKeyboard();
        
        // Announce to screen readers
        announceToScreenReader(`Out of tries. The answer is ${gameState.currentAnimal.name}, which starts with ${gameState.currentAnimal.name.charAt(0)}`);
        
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

// Function to update progress indicator
function updateProgressIndicator() {
    const progressIndicator = document.getElementById('progress-indicator');
    if (progressIndicator) {
        progressIndicator.textContent = `Animal ${gameState.currentIndex + 1} of 10`;
    }
}

// Show hint for current animal
function showHint() {
    // Remove existing hint
    hideHint();
    
    // Check if we have current animal
    if (!gameState.currentAnimal) return;
    
    // Get hint for current animal
    const hint = getAnimalFunFact(gameState.currentAnimal.name);
    
    // Create hint element
    const hintElement = document.createElement('div');
    hintElement.className = 'learning-hint';
    hintElement.textContent = hint;
    
    // Get the width of the progress indicator
    const progressIndicator = document.getElementById('progress-indicator');
    if (progressIndicator) {
        const width = Math.max(progressIndicator.offsetWidth, 220);
        hintElement.style.minWidth = width + 'px';
    }
    
    // Add after learning mode toggle container
    const toggleContainer = document.querySelector('.learning-toggle-container');
    if (toggleContainer) {
        toggleContainer.insertAdjacentElement('afterend', hintElement);
    }
    
    // Announce to screen readers
    announceToScreenReader(hint);
}

// Hide any visible hints
function hideHint() {
    const hint = document.querySelector('.learning-hint');
    if (hint) hint.remove();
}

// Play sound
function playSound(type) {
    if (!soundEnabled) return;
    
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
    
    // Announce to screen readers
    announceToScreenReader(`Game over! You had ${gameState.correctAnswers} correct and ${gameState.wrongAnswers} wrong.`);
    
    // Auto-adjust difficulty for next game
    if (gameState.correctAnswers >= 9) {
        // Increase difficulty if doing very well
        if (gameState.difficultyLevel === 'beginner') {
            gameState.difficultyLevel = 'intermediate';
            localStorage.setItem('difficultyLevel', 'intermediate');
            showToast('Great job! Difficulty increased to Intermediate');
        } else if (gameState.difficultyLevel === 'intermediate') {
            gameState.difficultyLevel = 'advanced';
            localStorage.setItem('difficultyLevel', 'advanced');
            showToast('Impressive! Difficulty increased to Advanced');
        }
    } else if (gameState.correctAnswers <= 3) {
        // Decrease difficulty if struggling
        if (gameState.difficultyLevel === 'advanced') {
            gameState.difficultyLevel = 'intermediate';
            localStorage.setItem('difficultyLevel', 'intermediate');
            showToast('Difficulty adjusted to Intermediate');
        } else if (gameState.difficultyLevel === 'intermediate') {
            gameState.difficultyLevel = 'beginner';
            localStorage.setItem('difficultyLevel', 'beginner');
            showToast('Difficulty adjusted to Beginner');
        }
    }
}

// Show instructions modal
function showInstructions() {
    instructionsModal.style.display = 'flex';
    
    // Make sure game container is hidden while instructions are showing
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.classList.remove('active');
    }
    
    // Close when clicking outside the modal content
    instructionsModal.addEventListener('click', function(event) {
        if (event.target === instructionsModal) {
            hideInstructions();
            // Start the game after closing instructions
            loadNextAnimal();
        }
    });
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
            
            // Set origin before showing leaderboard
            gameState.leaderboardOrigin = 'score';
            
            // Show leaderboard
            showLeaderboard();
            
            // Show confirmation
            showToast('Score saved!');
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
    
    if (!twitterBtn || !facebookBtn || !copyBtn) return;
    
    const shareText = `I scored ${correct} correct and ${wrong} wrong in First Letter Friends! Can you beat my score?`;
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    
    twitterBtn.className = 'share-btn twitter-btn';
    facebookBtn.className = 'share-btn facebook-btn';
    copyBtn.className = 'share-btn copy-btn';
    
    twitterBtn.innerHTML = `<span class="icon">🐦</span> Twitter`;
    facebookBtn.innerHTML = `<span class="icon">📘</span> Facebook`;
    copyBtn.innerHTML = `<span class="icon">📋</span> Copy`;
    
    twitterBtn.onclick = function() {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        showToast('Opened Twitter sharing');
    };
    
    facebookBtn.onclick = function() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        showToast('Opened Facebook sharing');
    };
    
    copyBtn.onclick = function() {
        const text = `${shareText} Try it yourself: ${shareUrl}`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Result copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
            showToast('Unable to copy text');
        });
    };
}

// Handle back button click based on origin
function handleBackButton() {
    // Hide leaderboard screen
    document.getElementById('leaderboard-screen').classList.remove('active');
    
    if (gameState.leaderboardOrigin === 'score') {
        // Show score screen if coming from score
        document.getElementById('score-screen').classList.add('active');
    } else {
        // Show game screen if coming from game
        document.getElementById('game-screen').classList.add('active');
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
    },
    {
        id: 'independent',
        name: 'Independent',
        icon: '🦸',
        description: 'Complete game with no hints',
        condition: (state) => state.correctAnswers >= 8 && state.hintsUsed === 0
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
            
            // Announce new achievement
            announceToScreenReader(`New achievement unlocked: ${achievement.name}. ${achievement.description}`);
            
            // Show toast notification
            showToast(`Achievement Unlocked: ${achievement.name}!`);
        }
    });
    
    // Save updated unlocked achievements
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    
    // Increment game count for the 'explorer' achievement
    const gameCount = parseInt(localStorage.getItem('gameCount') || '0');
    localStorage.setItem('gameCount', (gameCount + 1).toString());
    
    return newlyUnlocked;
}

// Display achievements with share buttons
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

// Show leaderboard
function showLeaderboard() {
    // Hide other screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show leaderboard screen
    document.getElementById('leaderboard-screen').classList.add('active');
    
    // Update back button text based on origin
    const backBtn = document.getElementById('back-button');
    if (backBtn) {
        backBtn.textContent = gameState.leaderboardOrigin === 'score' ? 'Back to Score' : 'Back to Game';
    }
    
    // Display leaderboard
    displayLeaderboard();
}

// Restart game
function restartGame() {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show game screen
    document.getElementById('game-screen').classList.add('active');
    
    // Initialize game
    initGame();
    
    // Show toast with difficulty level
    showToast(`Playing on ${gameState.difficultyLevel.charAt(0).toUpperCase() + gameState.difficultyLevel.slice(1)} difficulty`);
}

// Updated sharing dialog function to properly display URL
function showSharingDialog(text) {
    // Create a modal for sharing options if it doesn't exist
    let sharingModal = document.getElementById('sharing-modal');
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    
    if (!sharingModal) {
        sharingModal = document.createElement('div');
        sharingModal.id = 'sharing-modal';
        sharingModal.className = 'modal';
        
        sharingModal.innerHTML = `
            <div class="modal-content sharing-content">
                <h2>Share</h2>
                <p id="share-text"></p>
                <div class="share-buttons">
                    <button id="modal-twitter-btn" class="share-btn twitter-btn"><span class="icon">🐦</span> Twitter</button>
                    <button id="modal-facebook-btn" class="share-btn facebook-btn"><span class="icon">📘</span> Facebook</button>
                    <button id="modal-copy-btn" class="share-btn copy-btn"><span class="icon">📋</span> Copy</button>
                </div>
                <button id="close-sharing" class="primary-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(sharingModal);
    }
    
    // Format the text with URL on a separate line for better display
    const formattedText = text.includes(shareUrl) ? 
        text.replace(shareUrl, '') + `<span class="url">${shareUrl}</span>` : 
        text;
    
    // Update the text with HTML formatting
    document.getElementById('share-text').innerHTML = formattedText;
    
    // Set up sharing buttons
    document.getElementById('modal-twitter-btn').onclick = function() {
        const fullText = text.includes(shareUrl) ? text : text + " " + shareUrl;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`, '_blank');
        showToast('Opened Twitter sharing');
        sharingModal.style.display = 'none';
    };
    
    document.getElementById('modal-facebook-btn').onclick = function() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        showToast('Opened Facebook sharing');
        sharingModal.style.display = 'none';
    };
    
    document.getElementById('modal-copy-btn').onclick = function() {
        const fullText = text.includes(shareUrl) ? text : text + " " + shareUrl;
        navigator.clipboard.writeText(fullText).then(() => {
            showToast('Copied to clipboard!');
            sharingModal.style.display = 'none';
        }).catch(err => {
            console.error('Could not copy text: ', err);
            showToast('Unable to copy text');
        });
    };
    
    // Add close button handler
    document.getElementById('close-sharing').onclick = function() {
        sharingModal.style.display = 'none';
    };
    
    // Display the modal
    sharingModal.style.display = 'flex';
    
    // Close when clicking outside the modal content
    sharingModal.addEventListener('click', function(event) {
        if (event.target === sharingModal) {
            sharingModal.style.display = 'none';
        }
    });
}

// Share animal fun fact with proper URL formatting
function shareAnimalFact() {
    if (!gameState.currentAnimal) return;
    
    const animalName = gameState.currentAnimal.name;
    const funFact = getAnimalFunFact(animalName).replace('Hint: ', ''); // Remove the "Hint: " prefix
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    
    const shareText = `I learned about the ${animalName.toLowerCase()} in First Letter Friends! This animal ${funFact.toLowerCase().substring(funFact.indexOf(' ') + 1)} Try it yourself:`;
    
    // Show sharing options
    showSharingDialog(shareText + " " + shareUrl);
}

// Share achievement with proper URL formatting
function shareAchievement(achievement) {
    const shareUrl = "https://jerlyn.github.io/first-letter-friends/";
    const shareText = `I just earned the "${achievement.name}" achievement in First Letter Friends! ${achievement.description}. Try it yourself:`;
    
    // Show sharing options
    showSharingDialog(shareText + " " + shareUrl);
}

// Set up event listeners for the animal share button
function setupAnimalShareButton() {
    const shareBtn = document.querySelector('.animal-share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareAnimalFact);
    }
}

// Simple confetti animation
function startConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', 
                    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
                    
    // Check for reduced motion preference
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
    const reducedMotion = preferences.reducedMotion || false;
    
    // Create fewer confetti pieces if reduced motion is enabled
    const confettiCount = reducedMotion ? 50 : 150;
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        
        if (!reducedMotion) {
            confetti.style.animationDelay = Math.random() * 5 + 's';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        } else {
            confetti.style.animationDelay = Math.random() * 1 + 's';
            confetti.style.animationDuration = Math.random() * 1 + 1 + 's';
        }
        
        confettiContainer.appendChild(confetti);
    }
    
    // Play celebration sound
    if (soundEnabled) {
        playSound('success');
    }
    
    // Remove confetti after animation ends
    setTimeout(() => {
        if (confettiContainer && confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, reducedMotion ? 3000 : 8000);
}

// Add screen reader announcements
function announceToScreenReader(message) {
    // Create or get the live region
    let announcer = document.getElementById('screen-reader-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('sr-only'); // Visually hidden
        document.body.appendChild(announcer);
    }
    
    // Set the message
    announcer.textContent = message;
    
    // Clear after a short delay
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
}

// Show toast message
function showToast(message, duration = 3000) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);