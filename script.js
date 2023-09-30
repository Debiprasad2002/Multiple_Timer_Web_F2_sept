const activeTimers = [];


// Creating a new timer----------------
function startNewTimer(hours, minutes, seconds) {
  if (!isValidTime(hours, minutes, seconds)) {
    alert("Please enter a valid time.");
    return;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const timer = {
    id: nextTimerId++,
    totalTime: totalSeconds,
    remainingTime: totalSeconds,
    intervalId: null,
    element: null,
    audio: new Audio("alert.mp3"),
  };

  const timerElement = document.createElement("div");
  timerElement.classList.add("timer");

  timerElement.innerHTML = `
      <section class="timer-section">
          <p>Time Left:</p>
          <div class="timer-display">${formatTime(timer.remainingTime)}</div>
          <button class="Delete-button btn">Delete</button>
      </section>
      `;

  const DeleteButton = timerElement.querySelector(".Delete-button");
  DeleteButton.addEventListener("click", () => {
    deleteTimer(timer, timerElement);
  });

  document.querySelector("#active-timers-section").appendChild(timerElement);

  timer.intervalId = setInterval(() => {
    timer.remainingTime--;
    if (timer.remainingTime <= 0) {
      timer.remainingTime = 0;
      clearInterval(timer.intervalId);

      timer.audio.play();

      const completedTimerElement = document.createElement("div");
      completedTimerElement.classList.add("timer-completed");

      completedTimerElement.innerHTML = `
          <section class="timers-Element">
            <h1>Timer Is Up !</h1>
            <button class="stop-button">
              Stop
            </button>
          </section>
        `;

      // Assign the timerElement reference to the timer object
      timer.element = completedTimerElement;

      timerElement.replaceWith(completedTimerElement);

      timer.stopButton = completedTimerElement.querySelector(".stop-button");
      timer.stopButton.addEventListener("click", () => {
        stopTimer(timer);
      });
    } else {
      timerElement.querySelector(".timer-display").textContent = formatTime(
        timer.remainingTime
      );
    }
  }, 1000);

  activeTimers.push(timer);

  if (activeTimers.length === 0) {
    document.getElementById("no-timers-message").style.display = "block";
  } else {
    document.getElementById("no-timers-message").style.display = "none";
  }
}


// Function to play an audio alert
function playAlertSound() {
  const alertSound = document.getElementById("alert-sound");
  if (alertSound) {
    alertSound.play();
  }
}

// Stop timer-------------

let nextTimerId = 1;

function stopTimer(timer) {
  if (!timer.alertStopped) {
    timer.audio.pause();
    timer.audio.currentTime = 0;
    timer.alertStopped = true; 
    console.log(`Timer with ID ${timer.id} paused successfully`);
  } else {
    // Delete the timer when the "Stop" button is clicked again
    const timerElement = timer.element;
    clearInterval(timer.intervalId);
    const index = activeTimers.indexOf(timer);
    if (index !== -1) {
      activeTimers.splice(index, 1);
    }
    timer.audio.pause();
    timer.audio.currentTime = 0;
    timerElement.remove();

    if (activeTimers.length === 0) {
      document.getElementById("no-timers-message").style.display = "block";
    } else {
      document.getElementById("no-timers-message").style.display = "none";
    } 
    console.log(`Timer with ID ${timer.id} deleted successfully`);
  }
}



// Function to delete a timer
function deleteTimer(timer, timerElement) {
  clearInterval(timer.intervalId);
  const index = activeTimers.indexOf(timer);
  if (index !== -1) {
    activeTimers.splice(index, 1);
  }
  timer.audio.pause();
  timer.audio.currentTime = 0;

  timerElement.remove();

  if (activeTimers.length === 0) {
    document.getElementById("no-timers-message").style.display = "block";
  } else {
    document.getElementById("no-timers-message").style.display = "none";
  }
}

// Time Format------------------
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${padZero(hours)} : ${padZero(minutes)} : ${padZero(
    remainingSeconds
  )}`;
}

function padZero(number) {
  return number < 10 ? `0${number}` : `${number}`;
}


// Function to validate user input
function isValidTime(hours, minutes, seconds) {
    if (hours <= 0 && minutes <=0 && seconds <= 0) {
        return false;
    }
    return true;
}

  
// setting Button
const setButton = document.querySelector(".btn");
setButton.addEventListener("click", () => {
  const hours = parseInt(document.querySelector("#hours").value) || 0;
  const minutes = parseInt(document.querySelector("#minutes").value) || 0;
  const seconds = parseInt(document.querySelector("#seconds").value) || 0;

  if (isValidTime(hours, minutes, seconds)) {
    startNewTimer(hours, minutes, seconds);
  } else {
    alert("Please enter a valid time.");
  }

  document.querySelector("#hours").value = "";
  document.querySelector("#minutes").value = "";
  document.querySelector("#seconds").value = "";
});

// Initialize the timer app
function init() {
  // Add any initialization code here

  // Handle timer end display design (update CSS class when timer completes)
  activeTimers.forEach((timer) => {
    if (timer.remainingTime <= 0) {
      timer.element.classList.add("timer-completed");
    }
  });

  if (activeTimers.length === 0) {
    document.getElementById("no-timers-message").style.display = "block";
  } else {
    document.getElementById("no-timers-message").style.display = "none";
  }
}