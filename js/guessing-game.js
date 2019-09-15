/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber () {
    return Math.ceil(Math.random() * 100);
}

function shuffle (arr) {
    let m = arr.length, temp, i;
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
    }

    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }

    playersGuessSubmission(guess) {
        if (guess < 1 || guess > 100 || isNaN(guess)) return ('Invalid guess!');
        this.playersGuess = guess;
        return this.checkGuess();
    }

    checkGuess() {
        //check to see if the guess was already guessed
        if (this.pastGuesses.includes(this.playersGuess)) return 'You\'ve tried that already!';

        //if not, push it into the array of guesses
        this.pastGuesses.push(this.playersGuess);

        //winning condition. disable all playing buttons
        if (this.playersGuess === this.winningNumber) {
            submitButton.disabled = true;
            hintButton.disabled = true;
            return 'YOU GOT IT!';
        }
        //losing condition. disable all playing buttons
        if (this.pastGuesses.length === 5) {
            submitButton.disabled = true;
            hintButton.disabled = true;
            return 'GAME OVER';
        }
        //otherwise, evaluate how close the guess is
        if (this.difference() < 10) return 'Ooh, so close!';
        if (this.difference() < 25) return 'You\'ve got the right idea.';
        if (this.difference() < 50) return 'I can see you\'re trying.';
        if (this.difference() < 100) return 'Not even close!';
    }

    provideHint() {
        let arr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
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
    return new Game;
}

let game = newGame();

const submitButton = document.getElementById('submit');
const playAgainButton = document.getElementById('again');
const hintButton = document.getElementById('hint');
const statusHeader = document.getElementById('status');

submitButton.addEventListener('click', () => {
    const guessInput = document.getElementById('guess');
    let outcome = game.playersGuessSubmission(Number(guessInput.value));
    
    if (outcome === 'GAME OVER') {
        statusHeader.style.color = 'red';
    }
    if (outcome === 'YOU GOT IT!') {
        statusHeader.style.color = '#6cd602';
        statusHeader.style.fontWeight = 'bold';
    }
    statusHeader.innerHTML = outcome;

    //if the guess is a new & unique guess, then add it to the next available guess circle
    if (outcome !== 'You\'ve tried that already!' && outcome !== 'Invalid guess!') {
        //use the length of the pastGuesses array to select the next available guess circle
        let nextAvailableSlot = document.getElementById(`guess${game.pastGuesses.length}`);
        nextAvailableSlot.innerHTML = guessInput.value;
    }
    //then clear the input box
    guessInput.value = '';
})

hintButton.addEventListener('click', () => {
    let hint = game.provideHint();
    statusHeader.innerHTML = 'Candidates: ' + hint.join(', ');
    //stop user from abusing the hint button to identify the commonly occurring number
    hintButton.disabled = true;
    hintButton.style.backgroundColor = 'gray';

})

playAgainButton.addEventListener('click', () => {
    //reset all circles to contain '?'
    for (let i = 1; i <= 5; i++){
        let currentCircle = document.getElementById(`guess${i}`);
        currentCircle.innerHTML = '?';
    }
    //reset all text, buttons, colors to original. then create new game object
    statusHeader.innerHTML = 'Let\'s Play!';
    statusHeader.style.color = 'white';
    submitButton.disabled = false;
    hintButton.disabled = false;
    hintButton.style.backgroundColor = 'white';
    game = newGame();
})
