document.addEventListener('DOMContentLoaded', () => {
    // --- Get References to HTML Elements ---
    const dailyMessageElement = document.getElementById('dailyMessageDisplay');
    const dateDisplayElement = document.getElementById('dateDisplay');
    const moodMessageDisplayElement = document.getElementById('moodMessageDisplay'); // New element for mood messages
    const moodButtons = document.querySelectorAll('.mood-button'); // All mood buttons

    // --- Utility Functions ---
    function getTodayDate() {
        const today = new Date();
        return today.toISOString().slice(0, 10); // "YYYY-MM-DD" format
    }

    function selectAndDisplayDailyMessage() {
        const todayDate = getTodayDate();
        let lastShownDate = localStorage.getItem('lastShownDate_Daily'); // Specific key for daily message date
        let storedMessageIndex = parseInt(localStorage.getItem('lastMessageIndex_Daily')); // Specific key for daily message index

        let messageToDisplay;
        let newMessageIndex;

        if (lastShownDate !== todayDate) {
            do {
                newMessageIndex = Math.floor(Math.random() * dailyMessages.length);
            } while (dailyMessages.length > 1 && newMessageIndex === storedMessageIndex);

            messageToDisplay = dailyMessages[newMessageIndex];
            localStorage.setItem('lastShownDate_Daily', todayDate);
            localStorage.setItem('lastMessageIndex_Daily', newMessageIndex);
        } else {
            if (storedMessageIndex !== null && !isNaN(storedMessageIndex) && dailyMessages[storedMessageIndex]) {
                messageToDisplay = dailyMessages[storedMessageIndex];
            } else {
                console.warn("Fallback: No valid stored daily message. Picking a new random one.");
                newMessageIndex = Math.floor(Math.random() * dailyMessages.length);
                messageToDisplay = dailyMessages[newMessageIndex];
                localStorage.setItem('lastMessageIndex_Daily', newMessageIndex);
            }
        }
        dailyMessageElement.textContent = messageToDisplay;
    }

    // NEW: Function to select and display a mood-specific message
    function selectAndDisplayMoodMessage(moodCategory) {
        const todayDate = getTodayDate();
        // Use a unique localStorage key for each mood category
        const lastShownDateKey = `lastShownDate_${moodCategory}`;
        const lastMessageIndexKey = `lastMessageIndex_${moodCategory}`;

        let lastShownDate = localStorage.getItem(lastShownDateKey);
        let storedMessageIndex = parseInt(localStorage.getItem(lastMessageIndexKey));

        const messagesForMood = moodMessages[moodCategory];
        if (!messagesForMood || messagesForMood.length === 0) {
            moodMessageDisplayElement.textContent = `No messages available for "${moodCategory}" mood yet!`;
            return;
        }

        let messageToDisplay;
        let newMessageIndex;

        if (lastShownDate !== todayDate) {
            // New day for this mood category: pick a new random message
            do {
                newMessageIndex = Math.floor(Math.random() * messagesForMood.length);
            } while (messagesForMood.length > 1 && newMessageIndex === storedMessageIndex);

            messageToDisplay = messagesForMood[newMessageIndex];
            localStorage.setItem(lastShownDateKey, todayDate);
            localStorage.setItem(lastMessageIndexKey, newMessageIndex);
        } else {
            // Same day for this mood category: display the previously stored message
            if (storedMessageIndex !== null && !isNaN(storedMessageIndex) && messagesForMood[storedMessageIndex]) {
                messageToDisplay = messagesForMood[storedMessageIndex];
            } else {
                // Fallback if stored data is missing/corrupted for this mood on the same day
                console.warn(`Fallback: No valid stored message for mood "${moodCategory}". Picking a new random one.`);
                newMessageIndex = Math.floor(Math.random() * messagesForMood.length);
                messageToDisplay = messagesForMood[newMessageIndex];
                localStorage.setItem(lastMessageIndexKey, newMessageIndex);
            }
        }
        moodMessageDisplayElement.textContent = messageToDisplay;
    }

    function displayCurrentDate() {
        if (dateDisplayElement) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplayElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    // --- Initial Load ---
    selectAndDisplayDailyMessage(); // Display the daily message
    displayCurrentDate(); // Display the current date
    // Initialize mood message area with default text
    moodMessageDisplayElement.textContent = "Click a button above for a special message!";

    // --- Event Listeners ---
    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mood = event.target.dataset.mood; // Get the mood category from data-mood attribute
            selectAndDisplayMoodMessage(mood); // Display the mood-specific message
        });
    });
});
