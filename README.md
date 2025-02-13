# Trivia Challenge Game 🎮

## Overview
**Trivia Challenge** is a fun and interactive web application where users can test their knowledge by answering trivia questions. The game allows players to select a category of their choice, answer randomized questions, and track their scores. It's built using modern web development technologies and fetches questions dynamically from a backend API.

---

## Features
- 🌟 **Select a Question Category**: Choose from categories like General Knowledge, Science, History, and Sports.
- 🧠 **Dynamic Questions**: Questions are fetched from the backend based on the selected category.
- 🎲 **Randomized Answers**: Shuffled answers to keep the game challenging.
- 🏆 **Score Tracking**: Keeps track of your score and displays it at the end of the game.
- 💾 **Save Scores**: Option to save your score to a database.

---

## Technologies Used
- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- **Backend**:
  - Node.js (with an API for fetching questions and saving scores)
- **Database**:
  - PostgreSQL (to store high scores)
- **API**:
  - Custom API for delivering trivia questions and saving scores.

---

## How to Run the Project

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

### Setup Instructions

#### 1. Clone the Repository
Clone the project repository to your local machine using the following command:
```bash
git clone https://github.com/Galomer310/trivia-game.git
```
Navigate into the project directory:
```bash
cd trivia-game
```

---

#### 2. Install Dependencies
Install all required Node.js packages by running:
```bash
npm install
```

---

#### 3. Setup the PostgreSQL Database
1. Open PostgreSQL and create a new database for the project:
   ```sql
   CREATE DATABASE trivia_game;
   ```
2. Create a `scores` table for saving player scores:
   ```sql
   CREATE TABLE scores (
       id SERIAL PRIMARY KEY,
       player_name VARCHAR(255),
       score INTEGER,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

---

#### 4. Configure Environment Variables
Create a `.env` file in the root of the project and add the following:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/trivia_game
PORT=3000
```
- Replace `<user>`, `<password>`, `<host>`, and `<port>` with your PostgreSQL credentials.

---

#### 5. Start the Backend Server
Run the server using the following command:
```bash
node server.js
```
The backend will start on `http://localhost:3000`.

---

#### 6. Launch the Frontend
1. Open `index.html` in your browser.
2. Alternatively, use a live server like the VS Code Live Server extension for a better development experience.

---

## Gameplay Instructions
1. **Choose a Category**: 
   - Select a category from the dropdown menu.
2. **Start the Game**: 
   - Click the "Start Game" button to begin.
   - The trivia poster will disappear, and the first question will appear.
3. **Answer Questions**:
   - Select the correct answer from the options. 
   - Your score is updated based on your correct answers.
4. **End of Game**:
   - When all questions are answered, your score is displayed.
   - Save your score to the database if desired.

---

## Folder Structure
```
trivia-game/
├── images/              # Contains the trivia poster image
├── node_modules/        # Node.js dependencies
├── .env                 # Environment variables
├── index.html           # Main HTML file
├── style.css            # CSS file for styling
├── script.js            # JavaScript file for game logic
├── server.js            # Backend server logic
├── README.md            # Project documentation
├── package.json         # Node.js project metadata
```

---

## Contribution
Contributions are welcome! Feel free to submit a pull request or report issues.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Contact
- **Author**: [Gal Omer](https://github.com/Galomer310)
- **Email**: galomer6708@gmail.com
