// Floating Navigation Panel JavaScript
// Handles Back, Home, Enter/Proceed button click events, and toggle switches for quick actions

document.addEventListener('DOMContentLoaded', function () {
    // Navigation buttons
    const backBtn = document.getElementById('back-btn');
    const homeBtn = document.getElementById('home-btn');
    const enterBtn = document.getElementById('enter-btn');

    // Toggle switches
    const notificationsCheckbox = document.getElementById('notifications-checkbox');
    const emergencyCheckbox = document.getElementById('emergency-checkbox');

    // Back button: navigate to previous page or return
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, navigate to home as fallback
                window.location.href = 'index.html';
            }
        });
    }
    // Return button/icon functionality (alias for back)
    const returnBtn = document.getElementById('return-btn');
    if (returnBtn) {
        returnBtn.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Home button: navigate to main dashboard
    if (homeBtn) {
        homeBtn.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

    // Enter/Proceed button: navigate to next page or confirm action
    if (enterBtn) {
        enterBtn.addEventListener('click', function () {
            if (window.history.forward) {
                // Attempt to go forward in history
                window.history.forward();
            } else {
                // If no forward history, perhaps confirm action (e.g., submit form if present)
                const form = document.querySelector('form');
                if (form) {
                    form.submit();
                } else {
                    alert('No next page or action to proceed with.');
                }
            }
        });
    }

    // Quick Action toggle: enable/disable quick action mode (using localStorage for persistence)
    const quickActionCheckbox = document.getElementById('quick-action-checkbox');
    if (quickActionCheckbox) {
        // Load initial state from localStorage
        const quickActionEnabled = localStorage.getItem('quickActionEnabled') === 'true';
        quickActionCheckbox.checked = quickActionEnabled;

        quickActionCheckbox.addEventListener('change', function () {
            const enabled = this.checked;
            localStorage.setItem('quickActionEnabled', enabled);
            if (enabled) {
                console.log('Quick Action enabled.');
                alert('Quick Action mode activated! You can now perform quick actions.');
            } else {
                console.log('Quick Action disabled.');
                alert('Quick Action mode deactivated.');
            }
        });
    }
});
