document.addEventListener("DOMContentLoaded", async () => {
  const categoryDropdown = document.getElementById("category");
  const difficultyDropdown = document.getElementById("difficulty");
  const typeDropdown = document.getElementById("type");
  const startButton = document.getElementById("start");
  const questionsDiv = document.getElementById("questions");

  const API_BASE_URL = "https://trivia-game-rvg3.onrender.com"; // Updated backend URL

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedCategory = "";
  let selectedDifficulty = "";
  let selectedType = "";

  // Load categories from API
  async function loadCategories() {
    try {
      const response = await fetch("https://opentdb.com/api_category.php");
      const data = await response.json();
      data.trivia_categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  // Fetch questions from API
  async function fetchQuestions() {
    const category = categoryDropdown.value;
    const difficulty = difficultyDropdown.value;
    const type = typeDropdown.value;

    if (!category || !difficulty || !type) {
      alert("Please select a category, difficulty, and type.");
      return;
    }

    // Save selections globally
    selectedCategory = category;
    selectedDifficulty = difficulty;
    selectedType = type;

    let url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      questions = data.results;
      currentQuestionIndex = 0;
      score = 0;
      displayQuestion();
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  // Display a question
  function displayQuestion() {
    questionsDiv.innerHTML = "";

    if (currentQuestionIndex >= questions.length) {
      endGame();
      return;
    }

    const question = questions[currentQuestionIndex];
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
      <h3>${question.question}</h3>
      <ul>
        ${[...question.incorrect_answers, question.correct_answer]
          .sort(() => Math.random() - 0.5)
          .map((answer) => `<li>${answer}</li>`)
          .join("")}
      </ul>
    `;

    questionsDiv.appendChild(questionDiv);

    const options = questionDiv.querySelectorAll("li");
    options.forEach((option) => {
      option.addEventListener("click", () =>
        checkAnswer(option.textContent, question.correct_answer)
      );
    });
  }

  // Check answer
  function checkAnswer(selectedAnswer, correctAnswer) {
    const feedback = document.createElement("p");
    feedback.className = "feedback";

    if (selectedAnswer === correctAnswer) {
      feedback.textContent = "Correct!";
      feedback.classList.add("correct");
      score++;
    } else {
      feedback.textContent = `Wrong! The correct answer was: ${correctAnswer}`;
      feedback.classList.add("wrong");
    }

    questionsDiv.appendChild(feedback);

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

    const playerName = prompt("Enter your name to save your score:");
    if (!playerName) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_name: playerName,
          score,
          category: selectedCategory,
          difficulty: selectedDifficulty,
          type: selectedType,
        }),
      });

      if (!response.ok) throw new Error("Failed to save score");

      const data = await response.json();
      showLeaderboard(playerName, data.score);
    } catch (error) {
      console.error("Error saving score:", error);
      alert("Error saving your score. Try again later.");
    }

    addNewGameButton();
  }

  function addNewGameButton() {
    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    newGameButton.style.marginTop = "20px";
    newGameButton.addEventListener("click", () => {
      window.location.reload();
    });
    questionsDiv.appendChild(newGameButton);
  }

  // Show leaderboard and player's rank
  async function showLeaderboard(playerName, playerScore) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
      const leaderboard = await response.json();

      let playerRank =
        leaderboard.findIndex(
          (entry) =>
            entry.player_name === playerName && entry.score === playerScore
        ) + 1;

      questionsDiv.innerHTML += `
        <h2>Leaderboard</h2>
        <ol>
          ${leaderboard
            .map((player) => `<li>${player.player_name}: ${player.score}</li>`)
            .join("")}
        </ol>
        <p>Your rank: ${playerRank}</p>
      `;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      alert("Error loading leaderboard. Try again later.");
    }
  }

  startButton.addEventListener("click", fetchQuestions);
  loadCategories();
});
