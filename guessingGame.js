function generateWinningNumber () {
    var init = Math.random();
    var initInt = (init * 100) + 1;
    var initIntFin = Math.floor(initInt);
    // if (!initIntFin) initIntFin = 1;
    return initIntFin;
}

function shuffle(arr) {
    var init = Math.random();
    var initInt = (init * 10) - 4;
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

    if (isNaN(newGuess) || typeof (newGuess) != 'number' || newGuess < 1 || newGuess > 100) {
        throw 'Guess must be a number greater than 0 and less than 100.';
    } else {
        this.playersGuess = newGuess;
        return this.checkGuess();
    }
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

function generateHistory(obj) {
    var listString = '';
    var header = ['1st', '2nd', '3rd', '4th', 'FINAL'];
    for (var i = 0; i < obj.pastGuesses.length; i++) {
        listString += '<li class="items"><h5>' + header[i] + '</h5>' + obj.pastGuesses[i] + '</li>';
    }
    return listString;
}

function generateHints(obj) {
    var result = '<h1>Hint!</h1>Your guess : <b>' + obj.playersGuess + '</b><br><br>';
    (obj.isLower()) ? result += '... is lower than the winning number' : result += 'is greater than the winning number';
    result += '<br><br>';
    if (obj.pastGuesses.length > 3) result += '... and the difference from the winning number is: ' + obj.difference();
    return result;
}


$(document).ready(function() {
    var currGame = newGame();
    var errBox = $('#message');
    var feedback = $('#message2');
    var submitButton = $('form').find('#submit');
    var inputBox = $('form').find('#guessInput');
    var guess = $('#guesses');
    var hintBox = $('#hintBox');
    var winMsg = $('#winMsg');
    var escapeMsg = $('#escapeMsg');

    //escape key to reset.
    $(document).on('keyup', function(evt) {
        if (evt.keyCode == 27) {
            resetGame();
        }
    });

    function clearGame (obj) {
        //if obj is passed, clear past guesses
        if (obj != undefined) obj.pastGuesses = [];

        // Hide message boxs when button is clicked
        errBox.hide();
        feedback.hide();
        guess.hide();
        hintBox.hide();
        escapeMsg.hide();
        winMsg.hide();

        // enable input box and show submit button;
        inputBox.prop('disabled', false);
        inputBox.val('');
        submitButton.show();
        inputBox.focus();
    }

    function resetGame () {
        console.log('reset button has been clicked')
        clearGame();
        // reset game object
        currGame = newGame();
        $('#clear').show();
    }


    $('#closeBox').click(function(e) {
        $('#helpMsg').toggle();
    });

    $('#theAction').submit(function(e) {
        errBox.hide();
        feedback.hide();
        hintBox.hide();

        var result;
        var guessInput = parseInt(inputBox.val());

        try {
            result = currGame.playersGuessSubmission(guessInput);
        }
        catch (err) {
            errBox.show();
            errBox.html('<b>error</b><br>' + err);
        }

        // If result is present then process:
        if (result != undefined) {
            //update hint
            hintBox.html(generateHints(currGame));
            guess.show();
            guess.find('#guessElem').html(generateHistory(currGame));
            feedback.show();
            feedback.html(result);
            // disable submissions if lost.
            if (result === 'You Lose.') {
                console.log('user lost')
                escapeMsg.show();
                submitButton.hide();
                $('#clear').hide();
                inputBox.prop('disabled', true);
            }
            if (result === 'You Win!') {
                winMsg.find('#guessedNumber').html(currGame.winningNumber);
                winMsg.show();
                submitButton.hide();
                $('#clear').hide();
                inputBox.prop('disabled', true);
            }

        }

        inputBox.val('');
        inputBox.focus();
        e.preventDefault();
    });

    $('#help').click(function(e) {
        console.log('help button has been clicked', e)
        $('#helpMsg').toggle();
    });

    $('#reset').click(function(e) {
        resetGame();
    });

    $('#clear').click(function(e) {
        console.log('clear button has been clicked', e)
        clearGame(currGame);
    });

    $('#hints').click(function(e) {
        console.log('hints button has been clicked', e)
        hintBox.toggle();
    });
});
