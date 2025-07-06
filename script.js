document.addEventListener('DOMContentLoaded', () => {
    // --- STEP 1: Get References to HTML Elements ---
    const appContainer = document.querySelector('.app-container');
    const screenTitle = document.getElementById('screenTitle');
    const backButton = document.getElementById('backButton');

    // Screens
    const dailyMessageScreen = document.getElementById('dailyMessageScreen');
    const categorySelectionScreen = document.getElementById('categorySelectionScreen');
    const categoryMessageScreen = document.getElementById('categoryMessageScreen');
    const historyScreen = document.getElementById('historyScreen');

    // Daily Message Elements
    const dailyMessageDisplay = document.getElementById('dailyMessageDisplay');
    const dailyRefreshButton = document.getElementById('dailyRefreshButton'); // For dev testing
    const goToCategoriesButton = document.getElementById('goToCategoriesButton');

    // Category Selection Elements
    const categoryButtons = document.querySelectorAll('.category-button'); // All buttons with this class
    const viewHistoryButton = document.getElementById('viewHistoryButton');

    // Category Message Elements (for the envelope animation)
    const envelopeContainer = document.querySelector('.envelope-container');
    const envelope = document.querySelector('.envelope');
    const categoryMessageDisplay = document.getElementById('categoryMessageDisplay');
    const openLetterButton = document.getElementById('openLetterButton');
    const nextCategoryMessageButton = document.getElementById('nextCategoryMessageButton');

    // History Elements
    const messageHistoryList = document.getElementById('messageHistoryList');
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    // --- Global Variables for State Management ---
    let currentCategory = null; // Stores the currently selected category (e.g., 'love', 'motivation')
    let currentMessageForCategoryScreen = null; // Stores the message currently displayed in the envelope
    const MESSAGE_HISTORY_KEY = 'messageHistory'; // Key for localStorage for history

    // --- Utility Functions ---

    function getTodayDate() {
        const today = new Date();
        return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
    }

    // --- Screen Management Functions ---

    function showScreen(screenToShow, title) {
        // Hide all screens
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden'); // Ensure it's display:none for true hiding
        });

        // Show the target screen
        screenToShow.classList.remove('hidden');
        // A small delay before adding 'active' to ensure CSS transition works from 'hidden' state
        setTimeout(() => {
            screenToShow.classList.add('active');
        }, 10); // Small timeout

        // Update header
        screenTitle.textContent = title;
        // Show back button only if not on the daily message screen
        if (screenToShow !== dailyMessageScreen) {
            backButton.classList.remove('hidden');
        } else {
            backButton.classList.add('hidden');
        }
    }

    // --- Message Selection & Display Logic ---

    function selectAndDisplayDailyMessage() {
        const todayDate = getTodayDate();
        let lastShownDate = localStorage.getItem('lastShownDate');
        let storedMessageIndex = parseInt(localStorage.getItem('lastMessageIndex'));

        let messageToDisplay;
        let newMessageIndex;

        if (lastShownDate !== todayDate) {
            // New day: pick a new random message for the 'daily' category
            do {
                newMessageIndex = Math.floor(Math.random() * messageCategories.daily.length);
            } while (messageCategories.daily.length > 1 && newMessageIndex === storedMessageIndex);

            messageToDisplay = messageCategories.daily[newMessageIndex];
            localStorage.setItem('lastShownDate', todayDate);
            localStorage.setItem('lastMessageIndex', newMessageIndex);
            
            // Add daily message to history
            addMessageToHistory(messageToDisplay, 'Daily Message');

        } else {
            // Same day: display the previously stored daily message
            if (storedMessageIndex !== null && !isNaN(storedMessageIndex) && messageCategories.daily[storedMessageIndex]) {
                messageToDisplay = messageCategories.daily[storedMessageIndex];
            } else {
                // Fallback for missing stored data on same day
                newMessageIndex = Math.floor(Math.random() * messageCategories.daily.length);
                messageToDisplay = messageCategories.daily[newMessageIndex];
                localStorage.setItem('lastMessageIndex', newMessageIndex);
                addMessageToHistory(messageToDisplay, 'Daily Message'); // Add if it's a fallback
            }
        }
        dailyMessageDisplay.textContent = messageToDisplay;
    }

    function selectAndPrepareCategoryMessage(category) {
        currentCategory = category; // Set the global current category
        const messages = messageCategories[category];
        if (!messages || messages.length === 0) {
            categoryMessageDisplay.textContent = "No messages available for this category yet!";
            currentMessageForCategoryScreen = null; // Clear current message
            return;
        }

        const randomIndex = Math.floor(Math.random() * messages.length);
        currentMessageForCategoryScreen = messages[randomIndex]; // Store message for display
        
        // Reset envelope state for next message
        envelope.classList.remove('open');
        categoryMessageDisplay.textContent = "Tap 'Open Letter' to reveal your message...";
        openLetterButton.classList.remove('hidden');
        nextCategoryMessageButton.classList.add('hidden'); // Hide "Next Message" until opened
    }

    function openEnvelope() {
        if (!currentMessageForCategoryScreen) {
            // Should not happen if a category was selected correctly
            categoryMessageDisplay.textContent = "Please select a category first!";
            return;
        }
        envelope.classList.add('open'); // Trigger CSS animation
        setTimeout(() => {
            categoryMessageDisplay.textContent = currentMessageForCategoryScreen;
            openLetterButton.classList.add('hidden'); // Hide open button
            nextCategoryMessageButton.classList.remove('hidden'); // Show next message button
            // Add message to history AFTER it's revealed
            addMessageToHistory(currentMessageForCategoryScreen, currentCategory);
        }, 800); // Allow time for envelope animation to start (match CSS transition duration)
    }

    // --- Message History Logic ---

    function getMessageHistory() {
        const historyString = localStorage.getItem(MESSAGE_HISTORY_KEY);
        return historyString ? JSON.parse(historyString) : [];
    }

    function saveMessageHistory(history) {
        localStorage.setItem(MESSAGE_HISTORY_KEY, JSON.stringify(history));
    }

    function addMessageToHistory(message, category) {
        const history = getMessageHistory();
        const timestamp = new Date().toLocaleString('en-PH', { // Format for Philippine time zone
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', hour12: true,
            timeZone: 'Asia/Manila'
        });
        history.unshift({ // Add to the beginning of the array for reverse chronological order
            message: message,
            category: category,
            timestamp: timestamp
        });
        // Keep history manageable, e.g., last 50 messages
        if (history.length > 50) {
            history.pop(); // Remove oldest message if history gets too long
        }
        saveMessageHistory(history);
    }

    function displayMessageHistory() {
        const history = getMessageHistory();
        messageHistoryList.innerHTML = ''; // Clear existing list items

        if (history.length === 0) {
            messageHistoryList.innerHTML = '<li>No messages viewed yet!</li>';
            return;
        }

        history.forEach(item => {
            const listItem = document.createElement('li');
            const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1); // Capitalize
            listItem.innerHTML = `
                <strong>${categoryName} - ${item.timestamp}</strong>
                <span>${item.message}</span>
            `;
            messageHistoryList.appendChild(listItem);
        });
    }

    function clearMessageHistory() {
        if (confirm("Are you sure you want to clear all message history? This cannot be undone.")) {
            localStorage.removeItem(MESSAGE_HISTORY_KEY);
            displayMessageHistory(); // Refresh history display
        }
    }


    // --- STEP 2: Event Listeners ---

    // Initial load: Display daily message
    selectAndDisplayDailyMessage();

    // Daily Message Screen Buttons
    dailyRefreshButton.addEventListener('click', () => {
        // For development, simulate a new day by clearing date & index
        localStorage.removeItem('lastShownDate');
        localStorage.removeItem('lastMessageIndex'); 
        selectAndDisplayDailyMessage();
        console.log("Simulating a new day. New daily message selected.");
    });

    goToCategoriesButton.addEventListener('click', () => {
        showScreen(categorySelectionScreen, 'Explore Messages');
    });

    // Category Selection Screen Buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const category = event.target.dataset.category; // Get category from data-category attribute
            selectAndPrepareCategoryMessage(category);
            // Capitalize category name for screen title
            const title = category.charAt(0).toUpperCase() + category.slice(1) + ' Message';
            showScreen(categoryMessageScreen, title);
        });
    });

    viewHistoryButton.addEventListener('click', () => {
        displayMessageHistory(); // Populate history list before showing
        showScreen(historyScreen, 'Message History');
    });

    // Category Message Screen Buttons
    openLetterButton.addEventListener('click', openEnvelope);

    nextCategoryMessageButton.addEventListener('click', () => {
        // Ensure there's a current category before asking for a next message
        if (currentCategory) {
            selectAndPrepareCategoryCategoryMessage(currentCategory); // Prepare a new message for the *same* category
        } else {
            console.error("No category selected for 'Next Message' button.");
        }
        openLetterButton.classList.remove('hidden'); // Show open button for the new message
        nextCategoryMessageButton.classList.add('hidden'); // Hide next button until opened
    });

    // History Screen Buttons
    clearHistoryButton.addEventListener('click', clearMessageHistory);

    // Back Button (Global)
    backButton.addEventListener('click', () => {
        // Simple navigation logic:
        // From category message screen or history, go back to category selection.
        // From category selection, go back to daily message.
        if (categoryMessageScreen.classList.contains('active') || historyScreen.classList.contains('active')) {
            showScreen(categorySelectionScreen, 'Explore Messages');
        } else if (categorySelectionScreen.classList.contains('active')) {
            showScreen(dailyMessageScreen, 'Daily Message');
        }
    });

    // --- Helper function for 'Next Message' button (re-selects from current category) ---
    function selectAndPrepareCategoryCategoryMessage(category) {
        const messages = messageCategories[category];
        if (!messages || messages.length === 0) {
            categoryMessageDisplay.textContent = "No messages available for this category yet!";
            currentMessageForCategoryScreen = null;
            return;
        }

        // Avoid showing the exact same message twice in a row for category messages
        let newRandomIndex;
        let lastMessageContent = currentMessageForCategoryScreen;
        do {
            newRandomIndex = Math.floor(Math.random() * messages.length);
        } while (messages.length > 1 && messages[newRandomIndex] === lastMessageContent);

        currentMessageForCategoryScreen = messages[newRandomIndex];
        
        // Reset envelope state for new message
        envelope.classList.remove('open');
        categoryMessageDisplay.textContent = "Tap 'Open Letter' to reveal your message...";
    }

});
