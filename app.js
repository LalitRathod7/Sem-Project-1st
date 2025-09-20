// Mock data
const mockData = {
    bloodInventory: [
        { type: 'A+', units: 50, status: 'Available' },
        { type: 'A-', units: 20, status: 'Low' },
        { type: 'B+', units: 30, status: 'Available' },
        { type: 'B-', units: 15, status: 'Low' },
        { type: 'AB+', units: 10, status: 'Critical' },
        { type: 'AB-', units: 5, status: 'Critical' },
        { type: 'O+', units: 60, status: 'Available' },
        { type: 'O-', units: 25, status: 'Available' }
    ],
    requests: [
        { hospital: 'City Hospital', bloodType: 'O-', units: 5, urgency: 'Critical' },
        { hospital: 'General Hospital', bloodType: 'A+', units: 10, urgency: 'High' },
        { hospital: 'Regional Clinic', bloodType: 'B-', units: 3, urgency: 'Medium' }
    ],
    notifications: [
        { message: 'Critical: O- blood needed at City Hospital', type: 'urgent' },
        { message: 'High: A+ blood request from General Hospital', type: 'high' },
        { message: 'Medium: B- blood request from Regional Clinic', type: 'medium' }
    ],
    donorHistory: [
        { date: '2023-10-01', bloodType: 'O+', units: 1, location: 'City Blood Bank' },
        { date: '2023-07-15', bloodType: 'O+', units: 1, location: 'General Hospital' }
    ]
};

// Utility functions
function getRole() {
    return localStorage.getItem('role');
}

function setRole(role) {
    localStorage.setItem('role', role);
}

function logout() {
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}

function redirectToDashboard(role) {
    if (role === 'donor') {
        window.location.href = 'donor-dashboard.html';
    } else if (role === 'hospital') {
        window.location.href = 'hospital-dashboard.html';
    } else if (role === 'bloodbank') {
        window.location.href = 'blood-bank-dashboard.html';
    }
}

function populateTable(tableId, data, columns) {
    const tableBody = document.getElementById(tableId);
    if (!tableBody) return;
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        columns.forEach(col => {
            const cell = document.createElement('td');
            if (col === 'urgency') {
                cell.className = item[col].toLowerCase();
            }
            cell.textContent = item[col];
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

function populateNotifications() {
    const panel = document.getElementById('notification-panel');
    if (!panel) return;
    panel.innerHTML = '';
    mockData.notifications.forEach(notif => {
        const div = document.createElement('div');
        div.className = `notification ${notif.type}`;
        div.textContent = notif.message;
        panel.appendChild(div);
    });
}

function populateInventory() {
    populateTable('inventory-table', mockData.bloodInventory, ['type', 'units', 'status']);
}

function populateRequests() {
    populateTable('requests-table', mockData.requests, ['hospital', 'bloodType', 'units', 'urgency']);
}

function populateHistory() {
    populateTable('history-table', mockData.donorHistory, ['date', 'bloodType', 'units', 'location']);
}

// Authentication Modal Functions
let currentAuthMode = 'login';

function toggleAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else {
        modal.classList.add('active');
        showLoginForm();
    }
}

function showLoginForm() {
    currentAuthMode = 'login';
    document.getElementById('login-toggle').classList.add('active');
    document.getElementById('signup-toggle').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('auth-modal-title').textContent = 'Welcome Back';
}

function showSignupForm() {
    currentAuthMode = 'signup';
    document.getElementById('signup-toggle').classList.add('active');
    document.getElementById('login-toggle').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('auth-modal-title').textContent = 'Join Our Community';
}

function showForgotPassword() {
    alert('Forgot password functionality would be implemented here. For demo purposes, please use: demo/demo123');
}

function selectRole(role) {
    // Pre-select role in the modal
    const roleSelect = document.getElementById('login-role');
    if (roleSelect) {
        roleSelect.value = role;
    }
    toggleAuthModal();
}

function scrollToEmergency() {
    document.getElementById('emergency-section').scrollIntoView({
        behavior: 'smooth'
    });
}

function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

function checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById('password-strength');
    if (!strengthIndicator) return;

    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.values(checks).forEach(check => {
        if (check) strength++;
    });

    strengthIndicator.className = 'password-strength';
    if (strength < 3) {
        strengthIndicator.classList.add('weak');
    } else if (strength < 4) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }

    return strength >= 3; // Return true if password is acceptable
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input && error) {
        input.style.borderColor = '#d32f2f';
        error.textContent = message;
    }
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input && error) {
        input.style.borderColor = '#ddd';
        error.textContent = '';
    }
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('input, select');

    errorMessages.forEach(error => {
        error.textContent = '';
    });

    inputs.forEach(input => {
        input.style.borderColor = '#ddd';
    });
}

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            // Simple validation
            if (!username || !password) {
                document.getElementById('login-message').textContent = 'Please fill in all fields.';
                document.getElementById('login-message').style.color = 'red';
                return;
            }

            // Mock login success
            setRole(role);
            redirectToDashboard(role);
        });
    }

    // Check if logged in
    const role = getRole();
    if (role && window.location.pathname.includes('login.html')) {
        redirectToDashboard(role);
    }

    // Populate data based on page
    if (window.location.pathname.includes('donor-dashboard.html')) {
        populateNotifications();
        populateHistory();
    } else if (window.location.pathname.includes('blood-bank-dashboard.html')) {
        populateInventory();
        populateRequests();
        populateNotifications();
    } else if (window.location.pathname.includes('hospital-dashboard.html')) {
        populateNotifications();
    } else if (window.location.pathname.includes('blood-search.html')) {
        // Set back link based on role
        const backLink = document.getElementById('back-link');
        if (backLink) {
            if (role === 'donor') {
                backLink.href = 'donor-dashboard.html';
            } else if (role === 'hospital') {
                backLink.href = 'hospital-dashboard.html';
            } else if (role === 'bloodbank') {
                backLink.href = 'blood-bank-dashboard.html';
            }
        }
    }

    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const bloodType = document.getElementById('search-blood-type').value;
            const location = document.getElementById('location-search').value;
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = '<h3>Search Results:</h3>';
            const filtered = bloodType === 'Any' ? mockData.bloodInventory : mockData.bloodInventory.filter(b => b.type === bloodType);
            filtered.forEach(blood => {
                resultsDiv.innerHTML += `<p>${blood.type}: ${blood.units} units available${location ? ' in ' + location : ''}</p>`;
            });
        });
    }

    // Request form
    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Blood request submitted! (Mock)');
        });
    }

    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profile updated! (Mock)');
        });
    }

    // Modal Login Form Handler
    const modalLoginForm = document.getElementById('login-form');
    if (modalLoginForm) {
        modalLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearAllErrors();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;
            const rememberMe = document.getElementById('remember-me').checked;

            let isValid = true;

            // Validation
            if (!username || username.length < 3) {
                showError('login-username', 'login-username-error', 'Username must be at least 3 characters');
                isValid = false;
            }

            if (!password) {
                showError('login-password', 'login-password-error', 'Password is required');
                isValid = false;
            }

            if (!role) {
                showError('login-role', 'login-role-error', 'Please select a role');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading
            showLoading();

            // Simulate API call
            setTimeout(() => {
                hideLoading();

                // Mock authentication - accept demo/demo123 for any role
                if (username === 'demo' && password === 'demo123') {
                    document.getElementById('login-message').textContent = 'Login successful!';
                    document.getElementById('login-message').style.color = 'green';

                    // Store remember me preference
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }

                    setRole(role);
                    setTimeout(() => {
                        toggleAuthModal();
                        redirectToDashboard(role);
                    }, 1000);
                } else {
                    document.getElementById('login-message').textContent = 'Invalid credentials. Try: demo/demo123';
                    document.getElementById('login-message').style.color = 'red';
                }
            }, 1500);
        });
    }

    // Modal Signup Form Handler
    const modalSignupForm = document.getElementById('signup-form');
    if (modalSignupForm) {
        modalSignupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearAllErrors();

            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const role = document.getElementById('signup-role').value;
            const termsAgree = document.getElementById('terms-agree').checked;

            let isValid = true;

            // Validation
            if (!username || username.length < 3) {
                showError('signup-username', 'signup-username-error', 'Username must be at least 3 characters');
                isValid = false;
            }

            if (!email || !validateEmail(email)) {
                showError('signup-email', 'signup-email-error', 'Please enter a valid email address');
                isValid = false;
            }

            if (!password || password.length < 6) {
                showError('signup-password', 'signup-password-error', 'Password must be at least 6 characters');
                isValid = false;
            } else if (!checkPasswordStrength(password)) {
                showError('signup-password', 'signup-password-error', 'Password is too weak');
                isValid = false;
            }

            if (password !== confirmPassword) {
                showError('signup-confirm-password', 'signup-confirm-password-error', 'Passwords do not match');
                isValid = false;
            }

            if (!role) {
                showError('signup-role', 'signup-role-error', 'Please select a role');
                isValid = false;
            }

            if (!termsAgree) {
                showError('terms-agree', 'signup-role-error', 'You must agree to the terms of service');
                isValid = false;
            }

            if (!isValid) return;

            // Show loading
            showLoading();

            // Simulate API call
            setTimeout(() => {
                hideLoading();

                // Mock successful registration
                document.getElementById('signup-message').textContent = 'Account created successfully! You can now login.';
                document.getElementById('signup-message').style.color = 'green';

                // Switch to login form after successful signup
                setTimeout(() => {
                    showLoginForm();
                    // Pre-fill login form with new credentials
                    document.getElementById('login-username').value = username;
                    document.getElementById('login-password').value = password;
                    document.getElementById('login-role').value = role;
                    document.getElementById('signup-message').textContent = '';
                }, 2000);

            }, 1500);
        });
    }

    // Password strength indicator
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }

    // Real-time validation
    const inputs = document.querySelectorAll('#login-form input, #signup-form input, #login-form select, #signup-form select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const errorId = this.id + '-error';
            const errorElement = document.getElementById(errorId);

            if (this.hasAttribute('required') && !this.value) {
                showError(this.id, errorId, 'This field is required');
            } else if (this.type === 'email' && this.value && !validateEmail(this.value)) {
                showError(this.id, errorId, 'Please enter a valid email address');
            } else if (this.id === 'signup-confirm-password' && this.value !== document.getElementById('signup-password').value) {
                showError(this.id, errorId, 'Passwords do not match');
            } else {
                clearError(this.id, errorId);
            }
        });

        input.addEventListener('input', function() {
            if (this.id === 'signup-confirm-password') {
                const errorId = this.id + '-error';
                if (this.value === document.getElementById('signup-password').value) {
                    clearError(this.id, errorId);
                }
            }
        });
    });

    // Close modal when clicking outside
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleAuthModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
            toggleAuthModal();
        }
    });
});

// Emergency Alert Functions
function showEmergencyDetails() {
    // Show detailed emergency information
    const details = `
        🚨 CRITICAL BLOOD SHORTAGE ALERT

        Blood Type: O- (Universal Donor)
        Location: City Hospital
        Units Needed: 5 units urgently
        Urgency Level: CRITICAL

        Every donation can save up to 3 lives.
        Your help is needed NOW!

        Contact: City Hospital Blood Bank
        Phone: (555) 123-4567
        Address: 123 Medical Center Dr.

        Please donate immediately if you are O- or O+ blood type.
    `;

    alert(details);
}

function showAuthModal() {
    // Show the authentication modal for immediate donor registration/login
    toggleAuthModal();
    // Pre-select donor role
    const roleSelect = document.getElementById('login-role');
    if (roleSelect) {
        roleSelect.value = 'donor';
    }
    // Switch to signup form for new donors
    showSignupForm();
}
