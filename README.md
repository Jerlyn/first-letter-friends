# First Letter Friends

A fun educational game for toddlers to learn animal names and their starting letters.

## Project Overview

First Letter Friends is a mobile-first, responsive web application designed to help toddlers associate animals with the letters they start with. The game displays an image of an animal and asks the player to select the correct first letter from an on-screen keyboard.

## Features

- 25 different animals with corresponding images
- Learning mode with letter hints
- 3 attempts per animal
- Randomized selection of 10 animals per game
- Achievement badges for accomplishments
- Leaderboard to track high scores
- Social sharing functionality
- Comprehensive accessibility options

## Project Structure

```
first-letter-friends/
├── index.html
├── assets/
│   ├── images/
│   │   ├── alligator.png
│   │   ├── butterfly.png
│   │   └── [all 25 animal images]
│   ├── audio/
│   │   ├── correct.mp3
│   │   ├── incorrect.mp3
│   │   └── success.mp3
├── css/
│   ├── styles.css
│   └── normalize.css
└── js/
    ├── game.js
    ├── leaderboard.js
    └── accessibility.js
```

## Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/Jerlyn/first-letter-friends.git
   cd first-letter-friends
   ```

2. Prepare your animal images
   - Create or acquire 25 animal images for the game
   - Name them according to the animal (e.g., alligator.png, butterfly.png)
   - Place them in the assets/images/ directory

3. Prepare audio files (optional)
   - Create or acquire sound effects for correct and incorrect answers
   - Place them in the assets/audio/ directory

4. Open the game
   - Open index.html in your browser to play locally
   - Alternatively, deploy to GitHub Pages or your preferred hosting service

## Gameplay

1. The game displays an animal image
2. The player selects the letter they think the animal's name starts with
3. If correct, the game displays the animal name and moves to the next animal
4. If incorrect, the player gets up to 3 attempts per animal
5. After 10 animals, the game ends and shows the player's score
6. The player can save their score to the leaderboard

## Accessibility Features

- Font size adjustment
- High contrast mode
- Sound effects toggle
- Reduced motion option
- Keyboard navigation support
- Screen reader compatibility

## Development Notes

- The game is built with vanilla JavaScript, HTML, and CSS
- LocalStorage is used for saving scores and preferences
- All game logic is separated into modular JavaScript files
- Mobile-first responsive design

## License

This project is created by Jerlyn © 2025

## Acknowledgments

- Animal images should be properly credited
- Sound effects should be properly licensed