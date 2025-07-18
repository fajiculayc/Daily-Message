document.addEventListener('DOMContentLoaded', () => {
    // --- Get References to HTML Elements ---
    const dailyMessageElement = document.getElementById('dailyMessageDisplay');
    const dateDisplayElement = document.getElementById('dateDisplay');
    const moodMessageDisplayElement = document.getElementById('moodMessageDisplay');
    const moodButtons = document.querySelectorAll('.mood-button');

    // --- Message Lists ---
    const dailyMessages = [
        "You are the most amazing person I've ever met. Every day with you is a gift.",
        "Just a reminder that you're the best thing that's ever happened to me.",
        "I hope your day is as amazing as you are.",
        "Thinking of you and smiling. That's my new favorite hobby.",
        "You're not just my love, you're my best friend.",
        "Every day with you is a new adventure.",
        "I fall for you a little more every single day.",
        "You have this incredible way of making my heart happy.",
        "I'm so grateful for every moment we get to spend together.",
        "You're the reason my world is so full of joy.",
        "I love you more than words can say. But I'll keep trying!",
        "Can't wait to see you later and get my daily dose of happiness.",
        "You're my sunshine on a cloudy day.",
        "My favorite place in the world is right next to you.",
        "You make my world a better, brighter place just by being in it.",
        "I was just thinking about your smile, and now I can't stop smiling too.",
        "Thank you for being you. You're perfect.",
        "I'm counting down the minutes until I can see you again.",
        "You are, and always will be, my greatest adventure.",
        "Life with you is a dream come true.",
        "I didn't know what true happiness was until I met you.",
        "You're the first and last thing on my mind each day.",
        "Being with you feels like coming home.",
        "You're my person. It's as simple and as wonderful as that.",
        "I love our life together. It's my favorite story.",
        "Every love song I hear makes me think of you.",
        "You're the sparkle in my eye and the love in my heart.",
        "Just so you know, you're pretty much my favorite of all time in the history of ever.",
        "I'm so incredibly proud of the person you are.",
        "My heart does a little happy dance every time I think of you."
    ];

    const moodMessages = {
        happy: [
            "Your joy is infectious! Keep shining brightly, my love.",
            "So glad you're feeling happy! You deserve all the good things.",
            "May your happiness multiply today and always.",
            "Seeing your smile is my favorite part of the day.",
            "Embrace this beautiful moment of joy, sweetheart.",
            "Your laughter is my favorite melody.",
            "Shine on, beautiful soul! Your happiness lights up my world.",
            "Cherish this moment. You've earned every bit of this joy.",
            "My heart smiles with yours.",
            "Just a reminder that your happiness is my happiness."
        ],
        sad: [
            "My heart aches to hear you're sad. Remember I'm here for you, always.",
            "Even in sadness, your strength shines through. I'm holding your hand.",
            "It's okay to not be okay. Let me be your comfort.",
            "Sending you all my love to help brighten your day, even just a little.",
            "You are not alone. I'm here to listen, to hug, to simply be with you.",
            "This too shall pass, my love. Lean on me.",
            "Dark clouds don't last forever. My love is your sunshine.",
            "Let me carry some of that weight. We're in this together.",
            "A hug from me, coming right up!",
            "Remember all the good. This feeling won't last forever."
        ],
        mad: [
            "Take a deep breath, my love. Remember, I'm on your side.",
            "It's okay to feel mad. Let it out, then let's find peace together.",
            "Don't let anger consume you. Focus on what brings you joy. I'm here for clarity.",
            "I'm sorry you're feeling this way. What can I do to help ease your anger?",
            "Remember how strong you are. This feeling will pass. I'm with you.",
            "Let me be your calm in this storm. I love you.",
            "Don't stress too much. Your peace is important to me.",
            "I'm sending you patience and understanding. You've got this.",
            "Let go of what you can't control. Breathe.",
            "My love is a soft place for your anger to land."
        ],
        tampo: [ // Filipino term for sulking or subtle annoyance
            "Is something bothering my sweet love? You know you can tell me anything.",
            "My heart feels your tampo. Let's talk it out and fix it.",
            "A little sulk is okay, but don't forget how much I adore you.",
            "I'm here to make you smile again. What can I do to make you feel better?",
            "Come here, let me give you a hug. No tampo can last forever with us.",
            "I miss your bright spirit already. Please tell me what's on your mind.",
            "I'm thinking of you and sending you warm thoughts to melt away any coldness.",
            "My arms are open for you, whenever you're ready.",
            "Let's not let this linger. My love for you is always strong.",
            "Just a little reminder of how much you mean to me, even when you're quiet."
        ],
        doubt: [
            "When doubt creeps in, remember how much I believe in you. You are amazing!",
            "You are capable of incredible things. Trust yourself, as I trust you completely.",
            "Your doubts do not define your worth. You are talented and strong.",
            "Don't let a moment of uncertainty overshadow your immense capabilities.",
            "I'm here to remind you of all your strengths and how far you've come.",
            "Every step forward, no matter how small, conquers a doubt.",
            "Your potential is boundless. Don't let anything hold you back.",
            "You've faced challenges before and always risen. This is no different.",
            "Lean into your courage. I'm here to cheer you on.",
            "See yourself through my eyes: strong, brilliant, and absolutely incredible."
        ],
        motivation: [
            "You've got this! Believe in your potential and go after your dreams.",
            "Every small step forward is progress. Keep pushing, you inspire me!",
            "Your perseverance is incredible. Don't give up now!",
            "The world needs your unique brilliance. Keep moving forward.",
            "You are stronger than any challenge. Rise and shine!",
            "Go conquer your goals, my love. I'm your biggest fan!",
            "Dream big, work hard, stay focused. You can achieve anything.",
            "Your dedication is truly admirable. Keep that fire burning!",
            "Obstacles are just detours in the right direction. Keep moving!",
            "Remember why you started. Now go finish it, beautifully."
        ]
    };

    // Special messages for specific dates (Month-Day format)
    const specialDatesMessages = {
        "08-03": "Happy Anniversary, my love! Every year with you is a treasure. Thank you for everything. I love you more than words can express.",
        "10-27": "Happy Birthday to the most beautiful soul! You light up my world."
    };


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
    selectAndDisplayDailyMessage();
    displayCurrentDate();
    moodMessageDisplayElement.textContent = "Click a button above for a special message!";

    // --- Event Listeners ---
    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mood = event.target.dataset.mood;
            selectAndDisplayMoodMessage(mood);
        });
    });
});
