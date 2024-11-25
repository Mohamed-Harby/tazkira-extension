// Default settings
const DEFAULT_SETTINGS = {
    interval: 300,
    duration: 10,
    darkMode: false
};

// Show random duaa box
async function showDuaaBox() {
    try {
        // Get only active tabs first to fail fast if none exist
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs.length) {
            return;
        }

        const activeTab = tabs[0];
        
        // Get settings and prepare duaa in parallel
        const [settings, randomDuaa] = await Promise.all([
            chrome.storage.sync.get(DEFAULT_SETTINGS),
            Promise.resolve(duaas[Math.floor(Math.random() * duaas.length)])
        ]);

        // Inject the content script if not already injected
        await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ['content.js']
        });

        // Send message to the active tab
        await chrome.tabs.sendMessage(activeTab.id, {
            type: 'SHOW_DUAA',
            duaa: randomDuaa,
            settings: {
                duration: settings.duration * 1000,
                darkMode: settings.darkMode
            }
        });
    } catch (error) {
        // Handle any errors
    }
}

// Create repeating alarm with current interval
async function setupAlarm() {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    const intervalMinutes = settings.interval / 60; // Convert seconds to minutes

    chrome.alarms.create('duaaReminder', {
        delayInMinutes: intervalMinutes,
        periodInMinutes: intervalMinutes
    });
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        if (chrome.runtime.lastError) {
            return;
        }
        showDuaaBox();  // Show first box immediately
        setupAlarm();   // Setup the repeating reminders
    });
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'duaaReminder') {
        showDuaaBox();
    }
});

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_SETTINGS') {
        setupAlarm(); // Recreate alarm with new interval
    }
});

// Collection of duaas
let duaas = [];

// Load duaas with caching
async function loadDuaas() {
    try {
        // Try to get from cache first
        const cache = await chrome.storage.local.get('duaasCache');
        if (cache.duaasCache) {
            duaas = cache.duaasCache;
            return;
        }

        // If not in cache, fetch from file
        const response = await fetch(chrome.runtime.getURL('duaas.json'));
        const data = await response.json();
        duaas = data.duaas;
        
        // Cache the duaas
        await chrome.storage.local.set({ 'duaasCache': duaas });
    } catch (error) {
        // Handle any errors
    }
}

// Load duaas when extension starts
loadDuaas();