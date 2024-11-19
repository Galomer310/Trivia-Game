document.addEventListener('DOMContentLoaded', async () => {
    const categoryDropdown = document.getElementById('category');
    const difficultyDropdown = document.getElementById('difficulty');
    const typeDropdown = document.getElementById('type');
    const startButton = document.getElementById('start');
    const questionsDiv = document.getElementById('questions');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Load categories from api
    async function loadCategories() {
        try {
            const response = await fetch('https://opentdb.com/api_category.php');
            const data = await response.json();
            data.trivia_categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Fetch questions from api
    async function fetchQuestions() {
        const category = categoryDropdown.value;
        const difficulty = difficultyDropdown.value;
        const type = typeDropdown.value;
// if one of the values not selected send a message
        if (!category || !difficulty || !type) {
            alert('Please select a category, difficulty, and type.');
            return;
        }

        let url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            questions = data.results;
            currentQuestionIndex = 0;
            score = 0;
            displayQuestion();
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    // Display a question
    function displayQuestion() {
        questionsDiv.innerHTML = '';
// if more then 10 questions was asked end the game
        if (currentQuestionIndex >= questions.length) {
            endGame();
            return;
        }
// else
        const question = questions[currentQuestionIndex]; /// add the question to array
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <h3>${question.question}</h3>
            <ul>
                ${[...question.incorrect_answers, question.correct_answer]
                    .sort(() => Math.random() - 0.5) /// randomize order of questions
                    .map(answer => `<li>${answer}</li>`)
                    .join('')}
            </ul>
        `;

        questionsDiv.appendChild(questionDiv);

        // Handle answer clicks
        const options = questionDiv.querySelectorAll('li');
        options.forEach(option => {
            option.addEventListener('click', () => checkAnswer(option.textContent, question.correct_answer));
        });
    }

    // Check answer
    function checkAnswer(selectedAnswer, correctAnswer) {
        const feedback = document.createElement('p');
        feedback.className = 'feedback';

        if (selectedAnswer === correctAnswer) {
            feedback.textContent = 'Correct!';
            feedback.classList.add('correct');
            score++;
        } else {
            feedback.textContent = `Wrong! The correct answer was: ${correctAnswer}`;
            feedback.classList.add('wrong');
        }

        questionsDiv.appendChild(feedback);
        // between questions after clicking
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 2000);
    }

    // End game and save score
    async function endGame() {
        questionsDiv.innerHTML = `
            <h2>Game Over!</h2>
            <p>Your final score is: ${score} / ${questions.length}</p>
        `;

        const playerName = prompt('Enter your name to save your score:');
        if (!playerName) return;

        // Save score to the database
        try {
            const response = await fetch('http://localhost:3000/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: playerName, score }),
            });
            const data = await response.json();
            showLeaderboard(playerName, data.score);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }

    // Show leaderboard and player's rank
    async function showLeaderboard(playerName, playerScore) {
        try {
            const response = await fetch('http://localhost:3000/api/leaderboard');
            const leaderboard = await response.json();

            let playerRank = leaderboard.findIndex(entry => entry.player_name === playerName && entry.score === playerScore) + 1;

            questionsDiv.innerHTML += `
                <h2>Leaderboard</h2>
                <ol>
                    ${leaderboard
                        .map(player => `<li>${player.player_name}: ${player.score}</li>`)
                        .join('')}
                </ol>
                <p>Your rank: ${playerRank}</p>
            `;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    }

    startButton.addEventListener('click', fetchQuestions);
    loadCategories();
});
