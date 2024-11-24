// Default settings
const DEFAULT_SETTINGS = {
    interval: 300,
    duration: 10,
    darkMode: false
};

console.log('Background script starting...');

// Show random duaa box
async function showDuaaBox() {
    console.log('Preparing to show duaa...');
    
    try {
        // Get only active tabs first to fail fast if none exist
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs.length) {
            console.log('No active tabs found');
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
        console.log('Sent duaa to active tab:', activeTab.id);
    } catch (error) {
        console.error('Error showing duaa:', error);
    }
}

// Create repeating alarm with current interval
async function setupAlarm() {
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    const intervalMinutes = settings.interval / 60; // Convert seconds to minutes

    console.log('Setting up alarm for duaa reminders...');
    chrome.alarms.create('duaaReminder', {
        delayInMinutes: intervalMinutes,
        periodInMinutes: intervalMinutes
    });
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed/updated:', details);
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading settings:', chrome.runtime.lastError);
            return;
        }
        showDuaaBox();  // Show first box immediately
        setupAlarm();   // Setup the repeating reminders
    });
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'duaaReminder') {
        console.log('Duaa reminder alarm triggered');
        showDuaaBox();
    }
});

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_SETTINGS') {
        console.log('Updating settings:', message.settings);
        setupAlarm(); // Recreate alarm with new interval
    }
});

// Log that script has finished loading
console.log('Background script loaded successfully!');

// Collection of duaas
let duaas = [];

// Load duaas with caching
async function loadDuaas() {
    try {
        // Try to get from cache first
        const cache = await chrome.storage.local.get('duaasCache');
        if (cache.duaasCache) {
            duaas = cache.duaasCache;
            console.log('Duaas loaded from cache:', duaas.length);
            return;
        }

        // If not in cache, fetch from file
        const response = await fetch(chrome.runtime.getURL('duaas.json'));
        const data = await response.json();
        duaas = data.duaas;
        
        // Cache the duaas
        await chrome.storage.local.set({ 'duaasCache': duaas });
        console.log('Duaas loaded and cached:', duaas.length);
    } catch (error) {
        console.error('Error loading duaas:', error);
    }
}

// Load duaas when extension starts
loadDuaas();