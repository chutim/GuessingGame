/*

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(arr) {
  let m = arr.length,
    temp,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    temp = arr[m];
    arr[m] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.hintRequests = 0;
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  playersGuessSubmission(guess) {
    if (guess < 1 || guess > 100 || isNaN(guess)) return "Invalid guess!";
    this.playersGuess = guess;
    return this.checkGuess();
  }

  checkGuess() {
    //check to see if the guess was already guessed
    if (this.pastGuesses.includes(this.playersGuess))
      return "You've tried that already!";

    //if not, push it into the array of guesses
    this.pastGuesses.push(this.playersGuess);

    //winning condition. disable all playing buttons
    if (this.playersGuess === this.winningNumber) {
      submitButton.disabled = true;
      hintButton.disabled = true;
      return "YOU GOT IT!";
    }
    //losing condition. disable all playing buttons
    if (this.pastGuesses.length === 5) {
      submitButton.disabled = true;
      hintButton.disabled = true;
      return "GAME OVER";
    }
    //otherwise, evaluate how close the guess is
    if (this.difference() < 10) return "Ooh, so close!";
    if (this.difference() < 25) return "You've got the right idea.";
    if (this.difference() < 50) return "I can see you're trying.";
    if (this.difference() < 100) return "Not even close!";
  }

  provideHint() {
    let arr = [
      this.winningNumber,
      generateWinningNumber(),
      generateWinningNumber()
    ];
    //give user 2 more random numbers than the number of current blank circles
    //otherwise hitting hint at the beginning and getting 3 hints will guarantee a win in 3 guesses
    let blankCircles = 4 - this.pastGuesses.length;
    while (blankCircles--) {
      arr.push(generateWinningNumber());
    }
    return shuffle(arr);
  }
}

function newGame() {
  return new Game();
}

//--------------INITIATE NEW GAME UPON LOADING PAGE-----------------------
let game = newGame();

//--------------GRAB NECESSARY ELEMENTS AND SET TO CONSTANTS--------------
const submitButton = document.getElementById("submit");
const playAgainButton = document.getElementById("again");
const hintButton = document.getElementById("hint");
const statusHeader = document.getElementById("status");

//--------------CALLBACK FUNCTIONS FOR BUTTONS-----------------------------
function submitAction() {
  const guessInput = document.getElementById("guess");
  //pass the input into the prototype function to evaluate, then pass returned string into statusHeader
  let outcome = game.playersGuessSubmission(Number(guessInput.value));

  if (outcome === "GAME OVER") {
    statusHeader.style.color = "red";
  }
  if (outcome === "YOU GOT IT!") {
    statusHeader.style.color = "#6cd602";
    statusHeader.style.fontWeight = "bold";
  }
  statusHeader.innerHTML = outcome;

  //if the guess is a new & unique guess, then add it to the next available guess circle
  if (
    outcome !== "You've tried that already!" &&
    outcome !== "Invalid guess!"
  ) {
    //use the length of the pastGuesses array to select the next available guess circle
    let nextAvailableSlot = document.getElementById(
      `guess${game.pastGuesses.length}`
    );
    nextAvailableSlot.innerHTML = guessInput.value;
  }
  //then clear the input box
  guessInput.value = "";
}

function hintAction() {
  let hint = game.provideHint();
  statusHeader.innerHTML = "Candidates: " + hint.join(", ");
  //stop user from abusing the hint button to identify the commonly occurring number
  hintButton.disabled = true;
  hintButton.style.backgroundColor = "gray";
}

function playAgainAction() {
  //reset all circles to contain '?'
  for (let i = 1; i <= 5; i++) {
    let currentCircle = document.getElementById(`guess${i}`);
    currentCircle.innerHTML = "?";
  }
  //reset all text, buttons, colors to original. then create new game object
  statusHeader.innerHTML = "Let's Play!";
  statusHeader.style.color = "white";
  submitButton.disabled = false;
  hintButton.disabled = false;
  hintButton.style.backgroundColor = "white";
  game = newGame();
}

//-------------RESTRICTING WHAT CAN BE ENTERED INTO THE INPUT FIELD-------------
function onlyNums(input) {
  //note that 'input' here is not just the latest keystroke, but also includes the entire current value inside the input box
  //this regex says that the total input must end in a number. in other words, you can never type a letter
  const numbersOnly = /[0-9]$/;
  //if the total input ends in a number, then allow the total input to populate the field
  if (numbersOnly.test(input)) {
    document.getElementById("guess").value = input;
  }
  //otherwise, trim off the latest addition (that is not a number), and fill the field
  else {
    let trimmed = input.slice(0, -1);
    document.getElementById("guess").value = trimmed;
  }
}

//-------------TWO OPTIONS FOR SUBMITTING A GUESS------------------
//pressing 'enter'
window.addEventListener("keyup", key => {
  if (key.key === "Enter") submitAction();
});
//clicking the 'Guess!' button
submitButton.addEventListener("click", submitAction);

//-------------TWO OPTIONS FOR REQUESTING A HINT-------------------
//pressing 'h'
window.addEventListener("keyup", key => {
  //once a hint has been requested, increment the hintRequests property value
  //if a hint is requested again, hintAction() won't run
  if (key.key === "h" && !game.hintRequests) {
    game.hintRequests++;
    hintAction();
  }
});
//clicking the 'Hint' button
hintButton.addEventListener("click", hintAction);

//-------------TWO OPTIONS FOR PLAYING AGAIN-----------------------
//pressing 'p'
window.addEventListener("keyup", key => {
  if (key.key === "p") playAgainAction();
});
//clicking the 'Play Again?' button
playAgainButton.addEventListener("click", playAgainAction);
