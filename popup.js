// Default settings
const DEFAULT_SETTINGS = {
    interval: 10,
    duration: 6,
    darkMode: false
};

// Load saved settings
function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        document.getElementById('interval').value = settings.interval;
        document.getElementById('duration').value = settings.duration;
        document.getElementById('theme-toggle').checked = settings.darkMode;
        updateTheme(settings.darkMode);
        updateBoxColors();
    });
}

// Save settings
function saveSettings() {
    const settings = {
        interval: parseInt(document.getElementById('interval').value),
        duration: parseInt(document.getElementById('duration').value),
        darkMode: document.getElementById('theme-toggle').checked
    };

    chrome.storage.sync.set(settings, () => {
        // showSaveMessage();
        updateTheme(settings.darkMode);
        updateBoxColors();
        // Notify background script to update alarm
        chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings });
    });
}

// Show save message
function showSaveMessage() {
    const message = document.querySelector('.save-message');
    message.classList.add('show');
    setTimeout(() => message.classList.remove('show'), 2000);
}

// Update theme
function updateTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
}

// Update settings
function updateSettings() {
    const settings = {
        interval: document.getElementById('interval').value,
        duration: document.getElementById('duration').value,
        darkMode: document.getElementById('theme-toggle').checked
    };

    chrome.storage.sync.set(settings, function () {
        console.log('Settings updated:', settings);
    });
}

// Update box colors
function updateBoxColors() {
    const settings = {
        interval: document.getElementById('interval').value,
        duration: document.getElementById('duration').value,
        darkMode: document.getElementById('theme-toggle').checked
    };
    chrome.storage.sync.set({ darkMode: settings.darkMode }, () => {
        console.log('Dark mode setting updated:', settings.darkMode);
    });
    const box = document.querySelector('.tazkira-box'); // Target the currently displayed box
    if (box) { // Ensure the box exists
        if (settings.darkMode) {
            box.classList.add('dark-mode');
        } else {
            box.classList.remove('dark-mode');
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateSettings();
            updateBoxColors();
        });
    });
    // Initial color update
    updateBoxColors();
});

// Save settings when inputs change
document.getElementById('interval').addEventListener('change', saveSettings);
document.getElementById('duration').addEventListener('change', saveSettings);
document.getElementById('theme-toggle').addEventListener('change', saveSettings);
