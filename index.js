const questions = [
    { question: "What is the correct syntax to declare a variable in JavaScript?", 
        options: ["var x;", "variable x;", "v x;", "let x"], correct: 0 },
    { question: "Which method is used to add an element to the end of an array?", 
        options: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
    { question: "What does `typeof null` return in JavaScript?", 
        options: ["null", "undefined", "object", "string"], correct: 2 },
    { question: "Which keyword is used to define a function in JavaScript?", 
        options: ["method", "function", "func", "def"], correct: 1 },
    { question: "What is the output of `console.log(2 + '2')`?", 
        options: ["4", "22", "NaN", "undefined"], correct: 1 },
    { question: "Which of these is NOT a JavaScript data type?", 
        options: ["Number", "Boolean", "Float", "String"], correct: 2 },
    { question: "What does `===` check for in JavaScript?", 
        options: ["Value only", "Type only", "Value and type", "Reference"], correct: 2 },
    { question: "How do you create a new array in JavaScript?", 
        options: ["let arr = [];", "let arr = {};", "let arr = new Array[];", "let arr = array();"], correct: 0 },
    { question: "What does the `this` keyword refer to in a function?",
         options: ["The global object", "The function itself", "The object that owns the function", "The parent function"], correct: 2 },
    { question: "Which method converts a JSON string into a JavaScript object?", 
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"], correct: 0 },
    { question: "What is the purpose of `setTimeout()`?", 
        options: ["Execute a function repeatedly", "Pause execution", "Execute a function after a delay", "Stop a function"], correct: 2 },
    { question: "Which of these is a falsy value in JavaScript?", 
        options: ["'0'", "[]", "0", "'false'"], correct: 2 },
    { question: "How do you stop an interval timer in JavaScript?", 
        options: ["clearInterval()", "stopInterval()", "clearTimeout()", "stopTimer()"], correct: 0 },
    { question: "What does the `map()` method do?", 
        options: ["Filters elements", "Creates a new array with transformed elements", "Reduces an array to a single value", "Sorts the array"], correct: 1 },
    { question: "What is a closure in JavaScript?",
         options: ["A loop construct", "A function with access to its outer scope", "A method to close a program", "A type of object"], correct: 1 },
    { question: "Which event is triggered when a user clicks an element?", 
        options: ["onhover", "onclick", "onchange", "onkeydown"], correct: 1 },
    { question: "What does the `async` keyword do in a function declaration?", 
        options: ["Makes the function synchronous", "Allows the function to return a Promise", "Delays the function execution", "Stops the function"], correct: 1 },
    { question: "What is the purpose of the `await` keyword?", 
        options: ["Pauses execution until a Promise resolves", "Waits for user input", "Delays a function indefinitely", "Stops a Promise"], correct: 0 },
    { question: "Which method removes the last element from an array?", 
        options: ["shift()", "unshift()", "pop()", "splice()"], correct: 2 },
    { question: "What does `NaN` stand for in JavaScript?", 
        options: ["Not a Number", "Null and None", "Negative and Null", "Not a Null"], correct: 0 }
];


let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");
const highScoresEl = document.getElementById("highScores");
const highScoresList = document.getElementById("highScoresList");
const restartBtn = document.getElementById("restartBtn");

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    
    // Update progress bar
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressEl.style.width = `${progressPercent}%`;

    // Display options
    currentQuestion.options.forEach((option, index) => {
        const optionEl = document.createElement("div");
        optionEl.classList.add("option");
        optionEl.textContent = option;
        optionEl.addEventListener("click", () => selectOption(index));
        optionsEl.appendChild(optionEl);
    });

    // Start timer
    timeLeft = 15;
    timerEl.textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectOption(-1); // Auto-submit if time runs out
        }
    }, 1000);
}

function resetState() {
    clearInterval(timer);
    nextBtn.classList.add("hidden");
    optionsEl.innerHTML = "";
    timerEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
    highScoresEl.classList.add("hidden");
}

function selectOption(index) {
    clearInterval(timer);
    const currentQuestion = questions[currentQuestionIndex];
    const optionEls = optionsEl.children;

    // Disable options after selection
    for (let i = 0; i < optionEls.length; i++) {
        optionEls[i].style.pointerEvents = "none";
        if (i === currentQuestion.correct) {
            optionEls[i].classList.add("correct");
        }
        if (i === index && index !== currentQuestion.correct) {
            optionEls[i].classList.add("wrong");
        }
        if (i === index) {
            optionEls[i].classList.add("selected");
        }
    }

    // Update score
    if (index === currentQuestion.correct) {
        score++;
    }

    // Show next button
    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = "";
    timerEl.classList.add("hidden");
    nextBtn.classList.add("hidden");
    resultEl.classList.remove("hidden");
    resultEl.textContent = `Your Score: ${score}/${questions.length}`;

    // Save high score
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5); // Keep top 5 scores
    localStorage.setItem("highScores", JSON.stringify(highScores));

    // Display high scores
    highScoresEl.classList.remove("hidden");
    highScoresList.innerHTML = "";
    highScores.forEach((score, index) => {
        const li = document.createElement("li");
        li.textContent = `Rank ${index + 1}: ${score}/${questions.length}`;
        highScoresList.appendChild(li);
    });
}

restartBtn.addEventListener("click", startQuiz);

// Start the quiz on page load
startQuiz();