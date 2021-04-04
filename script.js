// Constants for color Changes
const COLOR_OFFSET_RATE = 0.1;
const SIN_PERIOD = 6.28;

// Timing constants
const TIME_ALLOWED = 50;
const WRONG_PENALTY = 3;

// Variables to represent HTML elements
var headerBox = document.querySelector("#headerbox");
var startBtn = document.querySelector("#start-button");
var resetBtn = document.querySelector("#reset-button");
var timerArea = document.querySelector("#timer-area");
var questionArea = document.querySelector("#question");
var nameArea = document.querySelector("#textarea");
var answer1 = document.querySelector("#answer-1");
var answer2 = document.querySelector("#answer-2");
var answer3 = document.querySelector("#answer-3");
var answer4 = document.querySelector("#answer-4");

// Variables used by timeColorChange()
var saturation = 80;
var saturationOffset = 0;

// Timer variable.
var timer;
// The variable which contains the actual number being counted down.
var timeAllowed = 50;
var score = 0;

// Incremented after each question
var questionNum = 0;
// To be randomized by shuffle()
var questionOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Highscore variable. Even indices are names, odd are scores;
var highscores = JSON.parse(localStorage.getItem("highscores"));
if (highscores == null || highscores.length === 0) {
    highscores = ["AAA", "0", "AAA", "0", "AAA", "0", "AAA", "0"];
}

// Question & Answer Sets (4 possible answers per question)
var questions = [
    "To center a section of a website, you can use the CSS property \"margin: _______\".",// #1
    "The bullet points of an ordered or unordered list can be modified using the _______ CSS property.", // #2
    "Which of these HTML tags is not a semantic element?", // #3
    "What should the first line of any HTML file be?", // #4
    "Which JavaScript expression evaluates to true?", // #5
    "Which CSS selector would you use to select every object on a page?", // #6
    "How many arguments does localStorage.setItem() take?", // #7
    "Which HTML tag does not use a closing tag?", // #8
    "Objects with _____ positioning stay in the same spot on the screen even if the rest of the page scrolls.", // #9
    "To change the color of an object's text, change its _____ property." // #10
];

// First answer is correct answer for each question. //
var answers = [
    ["0 auto", "0 center", "50%", "all"], // #1
    ["list-style", "pointer", "bullet-type", "text-decoration"], // #2
    ["span", "main", "article", "nav"], // #3
    ["<!DOCTYPE html>", "<!--DOCTYPE html-->", "<DOCSTYLE html>", "<!DOCSTYLE: html>"], // #4
    ["!(true && false)", "0 > 0", "12 % 2 == \"6\"", "!(false || true)"], // #5
    ["*", ".", "root", ":css"], // #6
    ["2", "1", "0", "3"], // #7
    ["<link>", "<a>", "<li>", "<title>"], // #8
    ["fixed", "static", "relative", "absolute"], // #9
    ["color", "text", "font-color", "text-color"] // #10
];

// Makes header background saturation dependent on sin(time), fluctuating between 65% and 95%.
function timeColorChange() {
    timer = setInterval(function() {
        saturationOffset = (saturationOffset + COLOR_OFFSET_RATE) % 6.28;
        saturation = 80 + (15 * Math.sin(saturationOffset));
        headerBox.setAttribute("style", "background-color:hsl(209, " + saturation + "%, 67%)");
    }, 33);
}

// Runs main quiz timer
function startTimer(event) {
    timeAllowed = TIME_ALLOWED;
    var timer = setInterval(function() {
        timeAllowed -= 0.01;
        if (score != 0) {
            clearInterval(timer);
            timeAllowed = 50;
        }
        else if (timeAllowed <= 0) {
            clearInterval(timer);
            timeAllowed = 0;
            questionArea.textContent = "GAME OVER!";
            answer1.textContent = "Try again!";
            answer2.textContent = "Try again!";
            answer3.textContent = "Try again!";
            answer4.textContent = "Try again!";
            startBtn.disabled = false;

        }
        timerArea.textContent = "Time Left: " + timeAllowed.toFixed(2);
    }, 10);
}

// Used to randomize question and answer order
function shuffle(array) {
    var len = array.length;
    var shuffled = [];
    for (var i = 0; i < len; i++) {
        var rand = Math.floor(Math.random() * array.length);
        shuffled.push(array[rand]);
        array.splice(rand, 1);
    }
    return shuffled;
}

function renderQuestion() {
    var answerOrder = [0, 1, 2, 3];
    answerOrder = shuffle(answerOrder);
    question.textContent = (questionNum + 1) + ") " + questions[questionOrder[questionNum]];
    answer1.textContent = answers[questionOrder[questionNum]][answerOrder[0]];
    answer2.textContent = answers[questionOrder[questionNum]][answerOrder[1]];
    answer3.textContent = answers[questionOrder[questionNum]][answerOrder[2]];
    answer4.textContent = answers[questionOrder[questionNum]][answerOrder[3]];
}

function submitGuess(event) {
    var target = event.target;
    if (target.textContent == answers[questionOrder[questionNum]][0]) {
        questionNum++;
        // If not at end of quiz, render next question
        if (questionNum < questions.length) {
            renderQuestion();
        }
        // Otherwise, render victory screen
        else {
            answer1.disabled = true;
            answer2.disabled = true;
            answer3.disabled = true;
            answer4.disabled = true;
            score = (timeAllowed * 100).toFixed(0);
            highscores = addHighScore();
            questionArea.textContent = "WELL DONE! YOUR SCORE IS: " + score + ".\nHIGHSCORES:";
            answer1.textContent = highscores[0] + " -- " + highscores[1];
            answer2.textContent = highscores[2] + " -- " + highscores[3];
            answer3.textContent = highscores[4] + " -- " + highscores[5];
            answer4.textContent = highscores[6] + " -- " + highscores[7];
        }
    }
    else {
        timeAllowed -= 2;
    }
}

function addHighScore() {
    var newScores = highscores;
    var newName = nameArea.value;
    if (newName.length === 0) {
        newName = "AAA";
    }
    for (var i = 1; i < highscores.length; i += 2) {
        if (score > Number(highscores[i])) {
            newScores.splice(i - 1, 0, String(score));
            newScores.splice(i - 1, 0, newName);
            newScores.pop();
            newScores.pop();
            var newLocalScores = JSON.stringify(newScores);
            localStorage.setItem("highscores", newLocalScores);
            return newScores;
        }
    }
    return newScores;
}
function startQuiz() {
    score = 0;
    startBtn.disabled = true;
    resetBtn.disabled = false;
    answer1.disabled = false;
    answer2.disabled = false;
    answer3.disabled = false;
    answer4.disabled = false;
    questionOrder = shuffle(questionOrder);
    renderQuestion();
    startTimer();
}

function resetQuiz() {
    startBtn.disabled = false;
    resetBtn.disabled = true;
    answer1.disabled = true;
    answer2.disabled = true;
    answer3.disabled = true;
    answer4.disabled = true;
    score = -1;
    questionNum = 0;
    questionArea.textContent = "Click Start Quiz to Begin!";
    answer1.textContent = "";
    answer2.textContent = "";
    answer3.textContent = "";
    answer4.textContent = "";
}


// Function calls & event listeners
timeColorChange();
startBtn.addEventListener("click", startQuiz);
resetBtn.addEventListener("click", resetQuiz);
answer1.addEventListener("click", submitGuess);
answer2.addEventListener("click", submitGuess);
answer3.addEventListener("click", submitGuess);
answer4.addEventListener("click", submitGuess);