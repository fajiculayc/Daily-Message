document.addEventListener('DOMContentLoaded', () => {
    const messageDisplay = document.getElementById('messageDisplay');
    const refreshButton = document.getElementById('refreshButton'); // Keep for now as requested

    // STEP 1: Your Personalized Messages
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
        // Add more messages here!
    ];

    // Function to get today's date in a simple format (YYYY-MM-DD)
    function getTodayDate() {
        const today = new Date();
        return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
    }

    // Function to display a message
    function displayMessage(message) {
        messageDisplay.textContent = message;
    }

    // Function to select and display a message (modified for daily message)
    function selectAndDisplayMessage() {
        const todayDate = getTodayDate();
        let lastShownDate = localStorage.getItem('lastShownDate');
        let storedMessageIndex = parseInt(localStorage.getItem('lastMessageIndex'));

        let messageToDisplay;
        let newMessageIndex;

        // Check if it's a new day
        if (lastShownDate !== todayDate) {
            // It's a new day, pick a new random message
            // Ensure the new message is different from the last if there are multiple messages
            do {
                newMessageIndex = Math.floor(Math.random() * messages.length);
            } while (messages.length > 1 && newMessageIndex === storedMessageIndex);

            messageToDisplay = messages[newMessageIndex];

            // Store the new message index and today's date
            localStorage.setItem('lastShownDate', todayDate);
            localStorage.setItem('lastMessageIndex', newMessageIndex);
        } else {
            // It's the same day, display the previously stored message
            // Use the stored index, with a fallback to random if something went wrong
            if (storedMessageIndex !== null && !isNaN(storedMessageIndex) && messages[storedMessageIndex]) {
                messageToDisplay = messages[storedMessageIndex];
            } else {
                // Fallback: if no valid stored message, pick a random one
                newMessageIndex = Math.floor(Math.random() * messages.length);
                messageToDisplay = messages[newMessageIndex];
                localStorage.setItem('lastMessageIndex', newMessageIndex); // Store this fallback message
            }
        }

        displayMessage(messageToDisplay);
    }

    // STEP 2: Initial Load - Display the message when the page loads
    selectAndDisplayMessage();

    // STEP 3: (FOR DEVELOPMENT ONLY) Event Listener for the Refresh Button
    // This button will now *simulate* going to a new day for testing purposes.
    // We will change its behavior to advance the "lastShownDate"
    refreshButton.addEventListener('click', () => {
        // For development, we can simulate a new day by clearing the lastShownDate
        // In the final version, this button will be removed.
        localStorage.removeItem('lastShownDate');
        selectAndDisplayMessage();
        console.log("Simulating a new day. A new message will appear on refresh.");
    });
});