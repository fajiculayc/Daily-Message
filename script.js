document.addEventListener('DOMContentLoaded', () => {
    // --- Get References to HTML Elements ---
    const dailyMessageElement = document.getElementById('dailyMessageDisplay');
    const dateDisplayElement = document.getElementById('dateDisplay');
    const moodMessageDisplayElement = document.getElementById('moodMessageDisplay');
    const moodButtons = document.querySelectorAll('.mood-button');

    // --- Message Lists (loaded from messages.json) ---
    let dailyMessages = [];
    let moodMessages = {};
    let specialDatesMessages = {};


    // --- Utility Functions ---
    function getTodayDate() {
        const today = new Date();
        return today.toISOString().slice(0, 10); // "YYYY-MM-DD" format
    }

    // Function to get the day of the year (1-366)
    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    function selectAndDisplayDailyMessage() {
        const today = new Date(); // Get full date object
        const todayDate = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const todayMonthDay = todayDate.slice(5); // "MM-DD"

        let messageToDisplay;

        // 1. Check for Special Dates First
        if (specialDatesMessages[todayMonthDay]) {
            messageToDisplay = specialDatesMessages[todayMonthDay];
        } else {
            // 2. If no special date, use deterministic daily message
            // Get a consistent index based on the day of the year
            const dayOfYear = getDayOfYear(today);
            const messageIndex = (dayOfYear - 1) % dailyMessages.length; // -1 because array is 0-indexed

            messageToDisplay = dailyMessages[messageIndex];
            
            // Note: localStorage for daily message is removed here as it's now deterministic
            // If you still want to ensure a NEW deterministic message each day
            // (e.g., if you update the list of messages mid-year), you could
            // re-introduce a 'lastShownDate_Daily' check to update the index.
            // But for simple "same message for everyone on this day", this is sufficient.
        }
        dailyMessageElement.textContent = messageToDisplay;
    }

    function selectAndDisplayMoodMessage(moodCategory) {
        const todayDate = getTodayDate();
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
            do {
                newMessageIndex = Math.floor(Math.random() * messagesForMood.length);
            } while (messagesForMood.length > 1 && newMessageIndex === storedMessageIndex);

            messageToDisplay = messagesForMood[newMessageIndex];
            localStorage.setItem(lastShownDateKey, todayDate);
            localStorage.setItem(lastMessageIndexKey, newMessageIndex);
        } else {
            if (storedMessageIndex !== null && !isNaN(storedMessageIndex) && messagesForMood[storedMessageIndex]) {
                messageToDisplay = messagesForMood[storedMessageIndex];
            } else {
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
    displayCurrentDate();

    fetch('messages.json')
        .then(response => response.json())
        .then(data => {
            dailyMessages = data.dailyMessages;
            moodMessages = data.moodMessages;
            specialDatesMessages = data.specialDatesMessages;

            selectAndDisplayDailyMessage();
            moodMessageDisplayElement.textContent = "Click a button above for a special message!";

            // --- Event Listeners ---
            moodButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const mood = event.target.dataset.mood;
                    selectAndDisplayMoodMessage(mood);
                });
            });
        })
        .catch(error => {
            console.error('Failed to load messages.json:', error);
            dailyMessageElement.textContent = "Couldn't load today's message. Please try again later.";
        });
});
