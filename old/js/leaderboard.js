// Leaderboard functionality

// Save score to leaderboard
function saveScore(timeElapsed) {
    // Get initials from score screen
    const initialsInput = document.getElementById('initials-input');
    const initials = initialsInput ? initialsInput.value.toUpperCase().substring(0, 3) : 'AAA';
    
    // Create score object
    const score = {
        initials: initials,
        time: timeElapsed,
        hints: 3 - gameState.guessesRemaining,
        date: new Date().toLocaleDateString(),
        correct: gameState.correctAnswers,
        wrong: gameState.wrongAnswers
    };
    
    // Get existing scores
    let scores = JSON.parse(localStorage.getItem('firstLetterFriendsScores') || '[]');
    
    // Add new score
    scores.push(score);
    
    // Sort by correct answers (highest first), then by time (lowest first)
    scores.sort((a, b) => {
        if (b.correct !== a.correct) return b.correct - a.correct;
        return a.time - b.time;
    });
    
    // Keep only top 10
    scores = scores.slice(0, 10);
    
    // Save back to local storage
    localStorage.setItem('firstLetterFriendsScores', JSON.stringify(scores));
}

// Display leaderboard
function displayLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard-table');
    if (!leaderboardElement) return;
    
    // Get scores from local storage
    const scores = JSON.parse(localStorage.getItem('firstLetterFriendsScores') || '[]');
    
    // Create table header
    leaderboardElement.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Initials</th>
            <th>Time</th>
            <th>Hints</th>
            <th>Date</th>
        </tr>
    `;
    
    // Add each score to the table
    scores.forEach((score, index) => {
        leaderboardElement.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${score.initials}</td>
                <td>${score.time}s</td>
                <td>${score.hints}/3</td>
                <td>${score.date}</td>
            </tr>
        `;
    });
    
    // If no scores, show a message
    if (scores.length === 0) {
        leaderboardElement.innerHTML += `
            <tr>
                <td colspan="5">No scores yet. Be the first!</td>
            </tr>
        `;
    }
}

// Clear all leaderboard data (useful for testing or resetting the game)
function clearLeaderboard() {
    localStorage.removeItem('firstLetterFriendsScores');
    displayLeaderboard();
}

// Export a single score to JSON
function exportScore(score) {
    return JSON.stringify(score);
}

// Import a score from JSON
function importScore(jsonScore) {
    try {
        const score = JSON.parse(jsonScore);
        if (score && score.initials && score.time !== undefined) {
            // Get existing scores
            let scores = JSON.parse(localStorage.getItem('firstLetterFriendsScores') || '[]');
            
            // Add imported score
            scores.push(score);
            
            // Sort and trim
            scores.sort((a, b) => {
                if (b.correct !== a.correct) return b.correct - a.correct;
                return a.time - b.time;
            });
            scores = scores.slice(0, 10);
            
            // Save back to local storage
            localStorage.setItem('firstLetterFriendsScores', JSON.stringify(scores));
            
            // Refresh display
            displayLeaderboard();
            
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error importing score:', e);
        return false;
    }
}