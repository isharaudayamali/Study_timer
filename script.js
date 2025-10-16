document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const settingsScreen = document.getElementById('settings-screen');
    const timerScreen = document.getElementById('timer-screen');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const timeDisplay = document.getElementById('time-display');
    const statusHeading = document.getElementById('status-heading');
    const progressBar = document.getElementById('progress-bar');
    const completionModalElement = document.getElementById('completion-modal');
    const completionModal = new bootstrap.Modal(completionModalElement);
    const quoteDisplay = document.getElementById('quote-display');
    const quoteAuthor = document.getElementById('quote-author');
    const nextActionBtn = document.getElementById('next-action-btn');
    const modalTitle = document.getElementById('modal-title');

    // Settings Inputs
    const sessionHoursInput = document.getElementById('session-hours');
    const sessionMinutesInput = document.getElementById('session-minutes');
    const breakHoursInput = document.getElementById('break-hours');
    const breakMinutesInput = document.getElementById('break-minutes');
    const totalSessionsInput = document.getElementById('total-sessions');
    const breakMusicSelect = document.getElementById('break-music');

    // State Variables
    let timerInterval;
    let totalSeconds;
    let initialDuration; // in seconds
    let isPaused = false;
    let isBreak = false;
    let currentSession = 1;
    let totalSessions;
    let breakDurationInMinutes; // total break duration in minutes
    
    // Audio Objects
    const alarm = new Audio();
    const breakMusic = new Audio();
    
    const quotes = [
        { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
        { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Well done is better than well said.", author: "Benjamin Franklin" }
    ];

    // Event Listeners
    startBtn.addEventListener('click', startStudySession);
    pauseBtn.addEventListener('click', togglePause);
    stopBtn.addEventListener('click', resetToSettings);
    nextActionBtn.addEventListener('click', handleNextAction);

    function startStudySession() {
        // Get settings
        const sessionHours = parseInt(sessionHoursInput.value) || 0;
        const sessionMinutes = parseInt(sessionMinutesInput.value) || 0;
        const breakHours = parseInt(breakHoursInput.value) || 0;
        const breakMinutes = parseInt(breakMinutesInput.value) || 0;
        totalSessions = parseInt(totalSessionsInput.value);

        const totalSessionMinutes = (sessionHours * 60) + sessionMinutes;
        breakDurationInMinutes = (breakHours * 60) + breakMinutes;

        alarm.src = 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3';
        
        const musicSrc = breakMusicSelect.value;
        if (musicSrc) {
            breakMusic.src = musicSrc;
            breakMusic.loop = true;
        } else {
            breakMusic.src = '';
        }
        
        if (totalSessionMinutes < 1 || breakDurationInMinutes < 1 || isNaN(totalSessions) || totalSessions < 1) {
            alert("Please ensure study, break, and session counts are valid positive numbers.");
            return;
        }

        settingsScreen.classList.add('d-none');
        timerScreen.classList.remove('d-none');
        
        currentSession = 1;
        isBreak = false;
        startNewTimer(totalSessionMinutes, `📚 Study Session ${currentSession} of ${totalSessions}`);
    }

    function startNewTimer(minutes, statusText) {
        initialDuration = minutes * 60;
        totalSeconds = initialDuration;
        isPaused = false;
        pauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
        statusHeading.textContent = statusText;
        updateDisplay();
        startTimer();
    }
    
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!isPaused && totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                handleSessionEnd();
            }
        }, 1000);
    }
    
    function updateDisplay() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Dynamically change format based on total duration
        if (initialDuration >= 3600) {
            timeDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        
        document.title = `${timeDisplay.textContent} - Study Bloom`;

        const progress = ((initialDuration - totalSeconds) / initialDuration) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            pauseBtn.innerHTML = '<i class="bi bi-play-fill"></i> Resume';
            if (isBreak && breakMusic.src) breakMusic.pause();
        } else {
            pauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
            if (isBreak && breakMusic.src) breakMusic.play();
        }
    }

    function handleSessionEnd() {
        alarm.play();
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteDisplay.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = randomQuote.author;
        
        if (!isBreak) { // Study session just ended
            if (currentSession >= totalSessions) {
                modalTitle.textContent = "🎉 All Sessions Done! Great Job! 🎉";
                nextActionBtn.textContent = "Start Over";
            } else {
                modalTitle.textContent = `✨ Session ${currentSession} Complete! ✨`;
                nextActionBtn.textContent = `Start ${breakDurationInMinutes} min Break`;
            }
        } else { // Break just ended
             modalTitle.textContent = "⏰ Break's Over! ⏰";
             nextActionBtn.textContent = `Start Study Session ${currentSession + 1} of ${totalSessions}`;
        }
        completionModal.show();
    }
    
    function handleNextAction() {
        if (!isBreak) { // Study session just ended, about to start a break
            if (currentSession >= totalSessions) {
                resetToSettings();
            } else {
                isBreak = true;
                if (breakMusic.src) breakMusic.play();
                startNewTimer(breakDurationInMinutes, '☕️ Break Time!');
            }
        } else { // Break just ended, about to start studying
            isBreak = false;
            currentSession++;
            if (breakMusic.src) {
                breakMusic.pause();
                breakMusic.currentTime = 0;
            }
            const sessionHours = parseInt(sessionHoursInput.value) || 0;
            const sessionMinutes = parseInt(sessionMinutesInput.value) || 0;
            const totalSessionMinutes = (sessionHours * 60) + sessionMinutes;

            startNewTimer(totalSessionMinutes, `📚 Study Session ${currentSession} of ${totalSessions}`);
        }
    }

    function resetToSettings() {
        clearInterval(timerInterval);
        if (breakMusic.src) {
            breakMusic.pause();
            breakMusic.currentTime = 0;
        }
        timerScreen.classList.add('d-none');
        settingsScreen.classList.remove('d-none');
        document.title = 'Study Bloom Timer';
    }
});