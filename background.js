
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
    const randomDuaa = duaas[Math.floor(Math.random() * duaas.length)];
    const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);

    try {
        // Get only active tabs
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tabs.length > 0) {
            const activeTab = tabs[0];
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
                    duration: settings.duration * 1000, // Convert to milliseconds
                    darkMode: settings.darkMode
                }
            });
            console.log('Sent duaa to active tab:', activeTab.id);
        } else {
            console.log('No active tabs found');
        }
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
const duaas = [
    {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        reference: "البقرة: ٢٠١"
    },
    {
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
        reference: "طه: ٢٥-٢٦"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
        reference: "صحيح مسلم"
    },
    {
        arabic: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ سُبْحـانَ اللهِ العَظيـم",
        reference: "صحيح البخاري"
    },
    {
        arabic: "اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَعَافِنِي وَارْزُقْنِي",
        reference: "صحيح مسلم"
    },
    {
        arabic: "رَبِّ زِدْنِي عِلْمًا",
        reference: "طه: ١١٤"
    },
    {
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        reference: "التوبة: ١٢٩"
    },
    {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
        reference: "آل عمران: ٨"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        reference: "صحيح البخاري"
    },
    {
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاء",
        reference: "إبراهيم: ٤٠"
    },
    {
        arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي",
        reference: "صحيح مسلم"
    },
    {
        arabic: "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ",
        reference: "المؤمنون: ٩٧-٩٨"
    }
    ,
    {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
        reference: "صحيح ابن ماجه"
    },
    {
        arabic: "اللَّهُمَّ اغْفِرْ لِي خَطِيئَةً وَعَمْدًا، وَخَطَإَ السَّهْوِ وَالنِّسْيَانِ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي",
        reference: "صحيح ابن ماجه"
    },
    {
        arabic: "اللَّهُمَّ اجْعَلْ لِي مِنْ أَمْرِي فَرَجاً وَمَخْرَجاً، وَاجْعَلْ لِي مِنْ خَشْيَتِكَ وِقَايَةً، وَفَرَجاً وَمَخْرَجاً مِنْ عَذَابِكَ",
        reference: "صحيح مسلم"
    },
    {
        arabic: "اللَّهُمَّ لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا سُقْمًا إِلَّا شَفَيْتَهُ",
        reference: "صحيح ابن ماجه"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ يَكْفِيَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تُخْرِجَنِي مِنْ الظُّلْمِ إِلَى النُّورِ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تَجْعَلَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي فَرَجاً وَمَخْرَجاً",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تُخْرِجَنِي مِنْ دَلَالِ الْخَيْرِ إِلَى دَلَالِ الشَّرِّ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تَجْعَلَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي فَرَجاً وَمَخْرَجاً مِنْ عَذَابِكَ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تَجْعَلَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي فَرَجاً وَمَخْرَجاً",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تُخْرِجَنِي مِنْ الظُّلْمِ إِلَى النُّورِ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تَجْعَلَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي فَرَجاً وَمَخْرَجاً مِنْ عَذَابِكَ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تُخْرِجَنِي مِنْ دَلَالِ الْخَيْرِ إِلَى دَلَالِ الشَّرِّ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ اجْعَلْ لِي مِنْ أَمْرِي فَرَجاً وَمَخْرَجاً، وَاجْعَلْ لِي مِنْ خَشْيَتِكَ وِقَايَةً، وَفَرَجاً وَمَخْرَجاً مِنْ عَذَابِكَ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا سُقْمًا إِلَّا شَفَيْتَهُ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تَجْعَلَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي فَرَجاً وَمَخْرَجاً",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تُخْرِجَنِي مِنْ الظُّلْمِ إِلَى النُّورِ",
        reference: "مسند أحمد"
    },
    {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِالنُّورِ الَّذِي كُنْتَ تَكَلَّمَ بِهِ فِي الْقُرْآنِ، أَنْ تَجْعَلَ لِي مِنْ أَمْرِ دُنْيَايَ وَدِينِي فَرَجاً وَمَخْرَجاً مِنْ عَذَابِكَ",
        reference: "مسند أحمد"
    },
];
