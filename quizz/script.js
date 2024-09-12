// script.js
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Rome", "Berlin"],
        answer: "Paris"
    },
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        answer: "JavaScript"
    },
    {
        question: "What does CSS stand for?",
        options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
        answer: "Cascading Style Sheets"
    },
    {
        question: "What year was JavaScript launched?",
        options: ["1996", "1995", "1994", "None of the above"],
        answer: "1995"
    }
];

const quizContainer = document.getElementById('quiz');
const nextBtn = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const scoreSpan = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const timerElement = document.createElement('div'); // Timer element
timerElement.classList.add('timer'); // Add timer class for styling
const progressBar = document.createElement('div'); // Progress bar container
progressBar.classList.add('progress-bar');
const progress = document.createElement('div'); // Progress bar fill
progress.classList.add('progress');
progressBar.appendChild(progress);
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15; // 15 seconds for each question

// Shuffle the quiz data at the start
shuffleArray(quizData);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to shuffle options within each question
function shuffleOptions(question) {
    question.options = question.options.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 15; // Reset timer
    updateTimer(); // Update timer display
    timer = setInterval(countdown, 1000); // Start countdown

    const currentQuestion = quizData[currentQuestionIndex];
    shuffleOptions(currentQuestion); // Shuffle the options

    quizContainer.innerHTML = `
        <h2>${currentQuestion.question}</h2>
        ${currentQuestion.options.map((option, index) => `
            <label onclick="selectOption(this)">
                <input type="radio" name="answer" value="${option}">
                ${option}
            </label>
        `).join('')}
    `;
    quizContainer.appendChild(timerElement); // Display the timer
    quizContainer.appendChild(progressBar); // Display the progress bar
    updateProgress(); // Update the progress bar width
}

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        moveToNextQuestion(); // Automatically move to next question if time runs out
    } else {
        timeLeft--;
        updateTimer();
    }
}

function updateTimer() {
    timerElement.textContent = `Time left: ${timeLeft} seconds`;
}

function selectOption(label) {
    const allOptions = document.querySelectorAll('label');
    allOptions.forEach(option => option.classList.remove('selected')); // Clear previous selection
    label.classList.add('selected'); // Highlight the selected option
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption && selectedOption.value === quizData[currentQuestionIndex].answer) {
        score++;
    }
}

nextBtn.addEventListener('click', moveToNextQuestion);

function moveToNextQuestion() {
    checkAnswer();
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    shuffleArray(quizData); // Shuffle questions on restart
    loadQuestion();
});

function showResult() {
    quizContainer.classList.add('hidden');
    nextBtn.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreSpan.textContent = `${score} / ${quizData.length}`;

    // Store the high score in localStorage
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        alert('New High Score!');
    }
}

function updateProgress() {
    const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progress.style.width = `${progressPercentage}%`;
}

// Initial call to load the first question
loadQuestion();
