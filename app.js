const textLabel = document.getElementById("prompt-box");
const container = document.getElementById("container");
const resultContainer = document.getElementById("result-container");
const buttonContainer = document.getElementById("button-container");
const timerContainer = document.getElementById("timer-container");
const stats = {
  correct: 0,
  incorrect: 0,
  timeLeft: 0,
};
const startTime = 30;
let timeLeft = startTime;

// This file is going to be a behemoth

// Page states: Start, Game, Results
const states = ["START", "GAME", "RESULTS"];
let currState = 0;

const questions = [];

buildStartRoom();

// Display a start button
function init() {
  const questionList = [
    {
      prompt: "Which option will NOT create a new variable named 'foo'?",
      correct: "array foo",
      answers: ["var foo", "array foo", "const foo", "let foo"],
    },
    {
      prompt: "Given an array of size 100, what index is the final entry?",
      correct: "99",
      answers: ["99", "100", "0", "array.length"],
    },
    {
      prompt: "What does the O in JSON stand for?",
      correct: "Object",
      answers: ["Objective", "Oriented", "Object", "Ornery"],
    },
  ];
  for (let i = 0; i < questionList.length; i++) {
    questions.push(questionList[i]);
  }
  shuffleArray(questions);
}

function buildStartRoom() {
  init();
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
  const thisQuestion = questions.pop();
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
  if (questions.length > 0) promptQuestion();
  else {
    stats.timeLeft = timeLeft;
    nextRoom();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function buildResultsRoom() {
  timerContainer.style.display = "none";
  //   resultContainer.style.display = "none";
  const prevScore = JSON.parse(localStorage.getItem("results"));

  if (prevScore === null) {
    resultContainer.textContent = "";
  } else {
    resultContainer.textContent = `Current Saved Score: ${prevScore.initials}: ${prevScore.score}`;
  }

  const displayResults = `Results
  Score: ${stats.correct - stats.incorrect}
  Time Remaining: ${stats.timeLeft}`;

  const resultsBox = document.createElement("pre");
  resultsBox.textContent = displayResults;
  textLabel.textContent = "";
  textLabel.appendChild(resultsBox);
  const form = document.createElement("form");
  const submitButton = document.createElement("button");
  const getName = document.createElement("input");
  submitButton.textContent = "Overwrite Old Score";
  getName.type = "text";
  getName.placeholder = "Enter your initials";
  form.appendChild(getName);
  form.appendChild(submitButton);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const entry = {
      initials: getName.value,
      score: stats.correct - stats.incorrect,
      timeLeft: stats.timeLeft,
    };
    localStorage.setItem("results", JSON.stringify(entry));
    const prevScore = JSON.parse(localStorage.getItem("results"));
    resultContainer.textContent = `Current Saved Score: ${prevScore.initials}: ${prevScore.score} points with ${prevScore.timeLeft} seconds to spare`;
  });
  textLabel.appendChild(form);

  const button = document.createElement("button");
  button.textContent = "Restart";
  button.addEventListener("click", function () {
    buttonContainer.classList.add("flex");
    nextRoom();
  });
  buttonContainer.classList.remove("flex");
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
