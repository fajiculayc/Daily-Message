document.addEventListener('DOMContentLoaded', () => {
    const messageDisplay = document.getElementById('messageDisplay');
    const refreshButton = document.getElementById('refreshButton'); // Keep for now for development testing

    // STEP 1: Your Personalized Messages
    // Add as many messages as you like!
    // Make sure each message is inside double quotes "" and separated by a comma.
    const messages = [
        "You are the most amazing person I've ever met. Every day with you is a gift.",
        "Just a reminder of how much I love you. More than words can say.",
        "You inspire me every single day. Keep being you!",
        "Thinking of you and smiling. You brighten my world.",
        "No matter what, I'm always here for you. ❤️",
        "Your strength and kindness amaze me. Never forget that.",
        "You make even the ordinary moments extraordinary.",
        "Every adventure with you is my favorite adventure.",
        "Wishing you a day as beautiful as you are.",
        "You're not just my girlfriend, you're my best friend.",
        "My love for you grows stronger with each passing day.",
        "May your day be filled with joy and all good things, my love.",
        "You have a way of making everything better.",
        "I'm so incredibly grateful to have you in my life.",
        "Just wanted to send you some love and positive vibes today!",
        // Add more messages here! Make sure to end the last message with a comma if adding more after it.
        // Example: "You're the sunshine on a cloudy day."
    ];

    // Function to get today's date in a simple format (YYYY-MM-DD)
    function getTodayDate() {
        const today = new Date();
        // Adjust for Philippine Time Zone (UTC+8) if desired, otherwise it uses client's local time.
        // For a simple app, client's local time is usually sufficient and simpler.
        // If you want absolute consistency with your timezone, you'd fetch an external time API
        // or calculate offset, but for this context, local is fine.
        return today.toISOString().slice(0, 10); // "YYYY-MM-DD" format
    }

    // Function to display a message
    function displayMessage(message) {
        messageDisplay.textContent = message;
    }

    // Function to select and display a message (modified for daily, non-changing message per day)
    function selectAndDisplayMessage() {
        const todayDate = getTodayDate();
        let lastShownDate = localStorage.getItem('lastShownDate');
        let storedMessageIndex = parseInt(localStorage.getItem('lastMessageIndex')); // Converts string to integer

        let messageToDisplay;
        let newMessageIndex;

        // Check if it's a new day or if there's no message stored yet
        if (lastShownDate !== todayDate) {
            // It's a new day, so pick a new random message
            // Ensure the new message is different from the last if there are multiple messages
            do {
                newMessageIndex = Math.floor(Math.random() * messages.length);
            } while (messages.length > 1 && newMessageIndex === storedMessageIndex);
            // The condition `messages.length > 1` prevents an infinite loop if only one message exists.

            messageToDisplay = messages[newMessageIndex];

            // Store the new message index and today's date in localStorage
            localStorage.setItem('lastShownDate', todayDate);
            localStorage.setItem('lastMessageIndex', newMessageIndex);
        } else {
            // It's the same day, so display the message that was already determined for this day
            // We verify that storedMessageIndex is a valid number and corresponds to an existing message
            if (storedMessageIndex !== null && !isNaN(storedMessageIndex) && messages[storedMessageIndex]) {
                messageToDisplay = messages[storedMessageIndex];
            } else {
                // Fallback: This case should ideally not happen if localStorage works correctly,
                // but it handles scenarios where stored data might be missing or invalid.
                console.warn("Fallback: No valid stored message for today. Picking a new random one.");
                newMessageIndex = Math.floor(Math.random() * messages.length);
                messageToDisplay = messages[newMessageIndex];
                localStorage.setItem('lastMessageIndex', newMessageIndex); // Store this new fallback message
            }
        }

        displayMessage(messageToDisplay);
    }

    // STEP 2: Initial Load - Display the message when the page loads
    selectAndDisplayMessage();

    // STEP 3: (FOR DEVELOPMENT ONLY) Event Listener for the Refresh Button
    // This button will now *simulate* going to a new day for testing purposes.
    // In the final version, this button and its corresponding HTML will be removed.
    if (refreshButton) { // Ensure button exists before adding listener
        refreshButton.addEventListener('click', () => {
            // By removing 'lastShownDate', the next call to selectAndDisplayMessage()
            // will treat it as a new day and pick a new message.
            localStorage.removeItem('lastShownDate');
            localStorage.removeItem('lastMessageIndex'); // Also clear index to ensure new random pick
            
            // Immediately call to show the "new day's" message for testing.
            // In a real scenario without the button, she would just open the app tomorrow.
            selectAndDisplayMessage(); 
            
            console.log("Simulating a new day. A new message has been selected. Refresh the page to re-verify for the 'new' day.");
            // Note: For true "next day" simulation, you'd typically close and reopen the app/page,
            // but this button allows quick testing without changing system date or reopening browser.
        });
    }
});
