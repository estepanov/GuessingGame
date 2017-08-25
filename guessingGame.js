function generateWinningNumber () {
    var init = Math.random();
    var initInt = (init * 100) + 1;
    var initIntFin = Math.floor(initInt);
    // if (!initIntFin) initIntFin = 1;
    return initIntFin;
}

function shuffle(arr) {
    var init = Math.random();
    var initInt = (init * 10)-4;
    var initIntFin = Math.abs(Math.floor(initInt));
    if (initIntFin >= arr.length) initIntFin = 1;
    var removed = [];
    for (var i = 0; i <= initIntFin; i++) {
        removed.push(arr.pop());
    }
    removed.forEach((elem) => { arr.push(elem) });
    return arr;
}

function Game () {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
    return (this.playersGuess < this.winningNumber);
}

Game.prototype.playersGuessSubmission = function (newGuess) {
    if (typeof (newGuess)!== "number" || newGuess < 1 || newGuess > 100) throw 'That is an invalid guess.';
    this.playersGuess = newGuess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) return 'You Win!';
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) return 'You have already guessed that number.';
    this.pastGuesses.push(this.playersGuess);
    if (this.pastGuesses.length >= 5) return 'You Lose.';
    if (this.difference() < 10) return 'You\'re burning up!';
    if (this.difference() < 25) return 'You\'re lukewarm.';
    if (this.difference() < 50) return 'You\'re a bit chilly.';
    if (this.difference() < 100) return 'You\'re ice cold!';
}

function newGame () {
    return new Game();
}

Game.prototype.provideHint = function () {
    var results = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(results);
}
