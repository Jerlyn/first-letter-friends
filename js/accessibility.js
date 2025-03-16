// Accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
    setupAccessibility();
});

// Set up accessibility features
function setupAccessibility() {
    // Set up accessibility button
    const accessibilityBtn = document.getElementById('accessibility-btn');
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', showAccessibilityOptions);
    }
    
    // Apply saved accessibility preferences
    applyAccessibilityPreferences();
    
    // Set up keyboard navigation
    setupKeyboardNavigation();
    
    // Add screen reader announcer if not present
    if (!document.getElementById('screen-reader-announcer')) {
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('sr-only');
        document.body.appendChild(announcer);
    }
}

// Show accessibility options modal
function showAccessibilityOptions() {
    // Create and show modal if it doesn't exist
    let modal = document.getElementById('accessibility-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'accessibility-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Accessibility Options</h2>
                
                <div class="option-group">
                    <label for="font-size">Text Size:</label>
                    <select id="font-size">
                        <option value="normal">Normal</option>
                        <option value="large">Large</option>
                        <option value="x-large">Extra Large</option>
                    </select>
                </div>
                
                <div class="option-group">
                    <label for="high-contrast">High Contrast:</label>
                    <input type="checkbox" id="high-contrast">
                </div>
                
                <div class="option-group">
                    <label for="sound-effects">Sound Effects:</label>
                    <input type="checkbox" id="sound-effects" checked>
                </div>
                
                <div class="option-group">
                    <label for="reduced-motion">Reduced Motion:</label>
                    <input type="checkbox" id="reduced-motion">
                </div>
                
                <div class="option-group">
                    <label for="auto-hints">Always Show Hints:</label>
                    <input type="checkbox" id="auto-hints">
                </div>
                
                <div class="button-container-accessibility">
                    <button id="save-accessibility" class="primary-btn">Save Preferences</button>
                    <button id="close-accessibility" class="secondary-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set up event listeners
        document.getElementById('save-accessibility').addEventListener('click', saveAccessibilityPreferences);
        document.getElementById('close-accessibility').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Load current preferences
        loadAccessibilityPreferences();
    }
    
    modal.style.display = 'flex';
    
    // Close when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Load accessibility preferences from localStorage
function loadAccessibilityPreferences() {
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
    
    // Apply to form
    if (preferences.fontSize) {
        const fontSizeSelect = document.getElementById('font-size');
        if (fontSizeSelect) {
            fontSizeSelect.value = preferences.fontSize;
        }
    }
    
    if (preferences.highContrast !== undefined) {
        const highContrastCheckbox = document.getElementById('high-contrast');
        if (highContrastCheckbox) {
            highContrastCheckbox.checked = preferences.highContrast;
        }
    }
    
    if (preferences.soundEffects !== undefined) {
        const soundEffectsCheckbox = document.getElementById('sound-effects');
        if (soundEffectsCheckbox) {
            soundEffectsCheckbox.checked = preferences.soundEffects;
        }
    }
    
    if (preferences.reducedMotion !== undefined) {
        const reducedMotionCheckbox = document.getElementById('reduced-motion');
        if (reducedMotionCheckbox) {
            reducedMotionCheckbox.checked = preferences.reducedMotion;
        }
    }
    
    if (preferences.autoHints !== undefined) {
        const autoHintsCheckbox = document.getElementById('auto-hints');
        if (autoHintsCheckbox) {
            autoHintsCheckbox.checked = preferences.autoHints;
        }
    }
}

// Save accessibility preferences to localStorage
function saveAccessibilityPreferences() {
    const fontSizeSelect = document.getElementById('font-size');
    const highContrastCheckbox = document.getElementById('high-contrast');
    const soundEffectsCheckbox = document.getElementById('sound-effects');
    const reducedMotionCheckbox = document.getElementById('reduced-motion');
    const autoHintsCheckbox = document.getElementById('auto-hints');
    
    const preferences = {
        fontSize: fontSizeSelect ? fontSizeSelect.value : 'normal',
        highContrast: highContrastCheckbox ? highContrastCheckbox.checked : false,
        soundEffects: soundEffectsCheckbox ? soundEffectsCheckbox.checked : true,
        reducedMotion: reducedMotionCheckbox ? reducedMotionCheckbox.checked : false,
        autoHints: autoHintsCheckbox ? autoHintsCheckbox.checked : false
    };
    
    // Save to local storage
    localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
    
    // Apply changes
    applyAccessibilityPreferences();
    
    // Close modal
    const modal = document.getElementById('accessibility-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Show confirmation
    showToast('Accessibility preferences saved');
}

// Apply accessibility preferences to the game
function applyAccessibilityPreferences() {
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences') || '{}');
    
    // Apply font size
    if (preferences.fontSize) {
        document.documentElement.setAttribute('data-font-size', preferences.fontSize);
        
        // Update CSS variables
        if (preferences.fontSize === 'large') {
            document.documentElement.style.setProperty('--font-scale', '1.2');
        } else if (preferences.fontSize === 'x-large') {
            document.documentElement.style.setProperty('--font-scale', '1.4');
        } else {
            document.documentElement.style.setProperty('--font-scale', '1');
        }
    }
    
    // Apply high contrast
    if (preferences.highContrast) {
        document.documentElement.classList.add('high-contrast');
    } else {
        document.documentElement.classList.remove('high-contrast');
    }
    
    // Set sound preference for game
    if (preferences.soundEffects !== undefined) {
        window.soundEnabled = preferences.soundEffects;
    }
    
    // Apply reduced motion
    if (preferences.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    } else {
        document.documentElement.classList.remove('reduced-motion');
    }
    
    // Apply auto hints - ensure we update the checkbox state
    // but without showing hints if checkbox was manually unchecked
    if (preferences.autoHints && window.learningModeToggle) {
        if (!window.learningModeToggle.checked) {
            // Only set checkbox if it's not already checked
            window.learningModeToggle.checked = true;
            
            // Show hint since we're enabling it
            if (typeof showHint === 'function') {
                showHint();
            }
        }
    } else if (!preferences.autoHints && window.learningModeToggle && window.learningModeToggle.checked) {
        // If auto-hints is disabled but checkbox is checked, 
        // leave it checked (user preference)
        // Do nothing here, respect user's manual choice
    }
}

// Setup keyboard navigation for better accessibility
function setupKeyboardNavigation() {
    // Add focus styles to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select');
    
    interactiveElements.forEach(element => {
        // Ensure proper focus states for keyboard navigation
        element.addEventListener('focus', () => {
            element.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('keyboard-focus');
        });
        
        // Add hover class on focus for consistent styling
        element.addEventListener('focus', () => {
            if (element.classList.contains('key') || 
                element.classList.contains('share-btn') || 
                element.classList.contains('achievement-badge')) {
                element.classList.add('hover');
            }
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('hover');
        });
    });
    
    // Enable keyboard activation of letters
    document.addEventListener('keydown', (event) => {
        const key = event.key.toUpperCase();
        
        // Handle Escape key for modals
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
            return;
        }
        
        // Check if it's a letter key
        if (/^[A-Z]$/.test(key)) {
            // Find and click the corresponding key button
            const keyButton = document.querySelector(`.key[data-key="${key}"]`);
            if (keyButton && !keyButton.disabled) {
                keyButton.click();
                keyButton.focus(); // Set focus for visual feedback
            }
        }
    });
}

// Add screen reader announcements
function announceToScreenReader(message) {
    // Get the live region
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

// Show toast message (if not defined elsewhere)
if (typeof showToast !== 'function') {
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
}