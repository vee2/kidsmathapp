document.addEventListener('DOMContentLoaded', () => {
    // Game State
    let currentMode = ''; // 'addition' or 'subtraction'
    let num1, num2, correctAnswer;

    // DOM Elements
    const mainMenu = document.getElementById('main-menu');
    const gameScreen = document.getElementById('game-screen');
    
    const startAdditionBtn = document.getElementById('start-addition-btn');
    const startSubtractionBtn = document.getElementById('start-subtraction-btn');
    const backBtn = document.getElementById('back-btn');
    
    const instructionText = document.getElementById('instruction-text');
    const visualArea = document.getElementById('visual-area');
    const problemText = document.getElementById('problem-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackText = document.getElementById('feedback-text');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    // --- Event Listeners ---
    startAdditionBtn.addEventListener('click', () => startGame('addition'));
    startSubtractionBtn.addEventListener('click', () => startGame('subtraction'));
    backBtn.addEventListener('click', showMainMenu);
    nextQuestionBtn.addEventListener('click', generateQuestion);
    optionsContainer.addEventListener('click', handleOptionClick);

    // --- Core Functions ---
    function startGame(mode) {
        currentMode = mode;
        mainMenu.classList.remove('visible');
        gameScreen.classList.add('visible');
        generateQuestion();
    }

    function showMainMenu() {
        gameScreen.classList.remove('visible');
        mainMenu.classList.add('visible');
    }

    function generateQuestion() {
        // 1. Reset UI
        feedbackText.textContent = '';
        feedbackText.className = '';
        nextQuestionBtn.style.display = 'none';
        optionsContainer.innerHTML = ''; // Clear old options

        // 2. Generate numbers (max number is 9 for simplicity)
        num1 = Math.floor(Math.random() * 5) + 1; // 1 to 5
        num2 = Math.floor(Math.random() * 5) + 1; // 1 to 5

        // For subtraction, ensure the first number is always bigger
        if (currentMode === 'subtraction' && num2 > num1) {
            [num1, num2] = [num2, num1]; // Swap the numbers
        }

        // 3. Calculate Correct Answer and Display Problem
        let operator = '';
        let instruction = '';
        let icon = '';

        if (currentMode === 'addition') {
            correctAnswer = num1 + num2;
            operator = '+';
            icon = '🍎';
            instruction = `Let's add ${num2} ${icon} to the ${num1} ${icon}!`;
        } else { // subtraction
            correctAnswer = num1 - num2;
            operator = '−'; // Using the proper minus sign
            icon = '🦆';
            instruction = `If you have ${num1} ${icon} and ${num2} swim away...`;
        }

        instructionText.textContent = instruction;
        problemText.textContent = `${num1} ${operator} ${num2} = ?`;
        displayVisuals(icon);
        displayOptions();
    }

    function displayVisuals(icon) {
        visualArea.innerHTML = '';
        if (currentMode === 'addition') {
            visualArea.innerHTML = `<div>${icon.repeat(num1)}</div> + <div>${icon.repeat(num2)}</div>`;
        } else { // subtraction
            for (let i = 0; i < num1; i++) {
                const span = document.createElement('span');
                span.textContent = icon;
                if (i >= num1 - num2) {
                    // This is a duck that's "left"
                } else {
                    // This is a duck that "swam away"
                    span.classList.add('item-strikethrough');
                }
                visualArea.appendChild(span);
            }
        }
    }

    function displayOptions() {
        const options = generateShuffledOptions(correctAnswer);
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.dataset.value = option; // Store value in data attribute
            optionsContainer.appendChild(button);
        });
    }

    function generateShuffledOptions(correct) {
        const options = new Set([correct]);
        // Generate two other unique random options
        while (options.size < 3) {
            const randomOffset = Math.floor(Math.random() * 5) - 2; // -2 to +2
            let randomOption = correct + randomOffset;
            if (randomOption < 0) randomOption = 0; // No negative answers
            if (randomOption !== correct) {
                options.add(randomOption);
            }
        }
        // Shuffle the array
        return Array.from(options).sort(() => Math.random() - 0.5);
    }
    
    function handleOptionClick(event) {
        if (event.target.tagName !== 'BUTTON') return; // Only listen for button clicks

        const selectedValue = parseInt(event.target.dataset.value, 10);
        checkAnswer(selectedValue);
    }

    function checkAnswer(selectedValue) {
        // Disable all option buttons after a choice is made
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

        if (selectedValue === correctAnswer) {
            feedbackText.textContent = "Yay, that's right! 🎉";
            feedbackText.classList.add('correct');
            nextQuestionBtn.style.display = 'block';
        } else {
            feedbackText.textContent = "Oops, try again on the next one! 😊";
            feedbackText.classList.add('incorrect');
            // Show the correct answer after a short delay
            setTimeout(() => {
                nextQuestionBtn.style.display = 'block';
            }, 1500);
        }
    }
});
