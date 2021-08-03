const textLabel = document.getElementById("prompt-box");
const container = document.getElementById("container");
const resultContainer = document.getElementById("result-container");
const buttonContainer = document.getElementById("button-container");

console.log("loading still");

// This file is going to be a behemoth

// Page states: Start, Game, Results
const states = ["START", "GAME", "RESULTS"];
const questions = [];
let currState = 0;

const question = {
  prompt: "What is the capital of France?",
  correct: "Paris",
  answers: ["Lyon", "Marseille", "Nice", "Nantes", "Paris"],
};

questions.push(question);

init();

// Display a start button
function init() {
  buildStartRoom();
}

function buildStartRoom() {
  textLabel.textContent = getRoomName();
  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.addEventListener("click", function () {
    nextRoom();
  });
  buttonContainer.appendChild(startButton);
}

function buildGameRoom() {
  promptQuestion();
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
    document.createElement("button"),
  ];
  for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].textContent = thisQuestion.answers[i];
    buttonContainer.appendChild(answerButtons[i]);
    answerButtons[i].addEventListener("click", function (event) {
      resultContainer.innerHTML =
        event.target.textContent === thisQuestion.correct
          ? "<span class='correct'>Correct!</span>"
          : "<span class='incorrect'>Incorrect</span>";
      promptQuestion();
    });
  }
}

function buildResultsRoom() {
  console.log("results room");
  const button = document.createElement("button");
  button.textContent = "Restart";
  button.addEventListener("click", function () {
    nextRoom();
  });
  buttonContainer.appendChild(button);
}

function clearButtons() {
  const childList = buttonContainer.getElementsByTagName("button");
  // Go backwards so mutating the array doesn't affect the loop
  for (let i = childList.length - 1; i >= 0; i--) {
    buttonContainer.removeChild(childList[i]);
  }
}

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
