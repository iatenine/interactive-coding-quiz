const textLabel = document.getElementById("prompt-box");
const container = document.getElementById("container");
const resultContainer = document.getElementById("result-container");
const buttonContainer = document.getElementById("button-container");
const timerContainer = document.getElementById("timer-container");
const stats = {
  correct: 0,
  incorrect: 0,
};
const startTime = 1;
let timeLeft = startTime;

console.log("loading still");

// This file is going to be a behemoth

// Page states: Start, Game, Results
const states = ["START", "GAME", "RESULTS"];
const questions = [];
let currState = 0;

const question = {
  prompt: "What is the capital of France?",
  correct: "Paris",
  answers: ["Lyon", "Marseille", "Nice", "Paris"],
};

questions.push(question);

init();

// Display a start button
function init() {
  buildStartRoom();
}

function buildStartRoom() {
  timeLeft = startTime;
  textLabel.textContent = getRoomName();
  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.addEventListener("click", function () {
    nextRoom();
  });
  buttonContainer.appendChild(startButton);
}

function buildGameRoom() {
  timerContainer.style.display = "block";
  resultContainer.style.display = "block";
  timerContainer.innerHTML = "Time left: " + timeLeft;
  promptQuestion();

  let timer = setInterval(function () {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      clearButtons();
      timerContainer.innerHTML = "Time's up!";
      clearInterval(timer);
      nextRoom();
    }
    timerContainer.innerHTML = "Time left: " + timeLeft;
  }, 1000);
}

function promptQuestion() {
  clearButtons();
  const thisQuestion = questions[0];
  textLabel.textContent = thisQuestion.prompt;
  const answerButtons = [
    document.createElement("button"),
    document.createElement("button"),
    document.createElement("button"),
    document.createElement("button"),
  ];
  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].textContent = thisQuestion.answers[i];
    answerButtons[i].addEventListener("click", function (event) {
      handleAnswer(event.target.textContent === thisQuestion.correct);
    });
  }

  shuffleArray(answerButtons);
  for (let i = 0; i < answerButtons.length; i++) {
    buttonContainer.appendChild(answerButtons[i]);
  }
}

function handleAnswer(correct) {
  if (correct) {
    stats.correct += 1;
    resultContainer.innerHTML = "<span class='correct'>Correct!</span>";
  } else {
    stats.incorrect += 1;
    if (timeLeft > 3) {
      timeLeft -= 3;
    } else {
      timeLeft = 0;
    }
    resultContainer.innerHTML = "<span class='incorrect'>Incorrect</span>";
  }
  promptQuestion();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function buildResultsRoom() {
  timerContainer.style.display = "none";
  resultContainer.style.display = "none";

  const displayResults = `Results
  Correct: ${stats.correct}
  Incorrect: ${stats.incorrect}
  Score: ${stats.correct - stats.incorrect}`;

  const resultsBox = document.createElement("pre");
  resultsBox.textContent = displayResults;
  textLabel.textContent = "";
  textLabel.appendChild(resultsBox);
  const button = document.createElement("button");
  button.textContent = "Restart";
  button.addEventListener("click", function () {
    nextRoom();
  });
  buttonContainer.appendChild(button);
}

// Clears all buttons from the buttonContainer
function clearButtons() {
  const childList = buttonContainer.getElementsByTagName("button");
  for (let i = childList.length - 1; i >= 0; i--) {
    buttonContainer.removeChild(childList[i]);
  }
}

// Helper functions below here mostly
function nextRoom() {
  updateState(1);
}

function prevRoom() {
  updateState(-1);
}

function getRoomName() {
  return states[currState];
}

// Adds stateChange to currState, looping around to avoid OOB errors
function updateState(stateChange) {
  if (isNaN(stateChange)) {
    console.error("Invalid state change");
    return;
  }
  currState += stateChange;
  currState = currState % states.length;
  console.assert(
    currState >= 0 && currState < states.length,
    "currState got out of bounds on updateState: ",
    currState
  );
  clearButtons();
  switch (getRoomName()) {
    case "START":
      buildStartRoom();
      break;
    case "GAME":
      buildGameRoom();
      break;
    case "RESULTS":
      buildResultsRoom();
      break;
  }
}
