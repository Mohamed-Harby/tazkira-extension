// Create and show duaa box
function showDuaaBox(duaa, settings) {
    // Remove any existing boxes
    const existingBox = document.querySelector('.tazkira-box');
    if (existingBox) {
        existingBox.remove();
    }

    // Create box elements
    const box = document.createElement('div');
    box.className = 'tazkira-box';
    if (settings.darkMode) {
        box.classList.add('dark-mode');
    }

    const closeBtn = document.createElement('span');
    closeBtn.className = 'tazkira-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => hideBox(box);

    const arabicText = document.createElement('div');
    arabicText.className = 'tazkira-arabic';
    arabicText.textContent = duaa.arabic;

    const reference = document.createElement('div');
    reference.className = 'tazkira-reference';
    reference.textContent = duaa.reference;

    // Assemble box
    box.appendChild(closeBtn);
    box.appendChild(arabicText);
    box.appendChild(reference);

    // Add to page
    document.body.appendChild(box);

    // Auto-hide after duration
    setTimeout(() => {
        if (box && document.body.contains(box)) {
            hideBox(box);
        }
    }, settings.duration);
}

// Hide box with animation
function hideBox(box) {
    box.classList.add('hide');
    setTimeout(() => {
        if (box && document.body.contains(box)) {
            box.remove();
        }
    }, 300); // Match animation duration
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SHOW_DUAA') {
        showDuaaBox(message.duaa, message.settings);
    }
});
