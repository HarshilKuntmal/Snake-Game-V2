
  // Selecting HTML elements
  const playBoard = document.querySelector(".play-board");
  const scoreElement = document.querySelector(".score");
  const highScoreElement = document.querySelector(".high-score");
  const controls = document.querySelectorAll(".controls i");

  // Game variables
  let gameOver = false;
  let foodX, foodY;
  let snakeX = 17, snakeY = 5;
  let childSnakeX = 20, childSnakeY = 20;
  let velocityX = 0, velocityY = 0;
  let snakeBody = [];
  let childSnake = [];
  let childSnakeSize = 0;
  let setIntervalId;
  let score = 0;
  let highScore = localStorage.getItem("high-score") || 0;

  // Function to update food position
  const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 20) + 1;
    foodY = Math.floor(Math.random() * 19) + 1;
  };

  // Function to handle game over
  const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
  };

  // Function to change the snake's direction
  const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) {
      velocityX = 0;
      velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
      velocityX = 0;
      velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
      velocityX = -1;
      velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
      velocityX = 1;
      velocityY = 0;
    }
  };

  // Adding click event listeners to control buttons
  controls.forEach((button) =>
    button.addEventListener("click", () =>
      changeDirection({ key: button.dataset.key })
    )
  );

  // Function to add a segment to the child snake
  const addChildSnake = () => {
    childSnake.push([childSnake.length + 1, 20]);
  };

  // Function to grow the child snake
  const growChildSnake = () => {
    addChildSnake();
    childSnakeSize++;
  };

  // Main game logic
  const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
      updateFoodPosition();
      snakeBody.push([foodY, foodX]);
      score++;
      highScore = score >= highScore ? score : highScore;
      localStorage.setItem("high-score", highScore);
      scoreElement.innerText = `Score: ${score}`;
      highScoreElement.innerText = `High Score: ${highScore}`;
      growChildSnake();
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
      snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
      return (gameOver = true);
    }

    // Rendering the main snake
    for (let i = 0; i < snakeBody.length; i++) {
      html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
      if (
        i !== 0 &&
        snakeBody[0][1] === snakeBody[i][1] &&
        snakeBody[0][0] === snakeBody[i][0]
      ) {
        gameOver = true;
      }
    }

     // Render the child snake
    for (let i = 0; i < childSnake.length; i++) {
      html += `<div class="head child" style="grid-area: ${childSnake[i][1]} / ${childSnake[i][0]}"></div>`;
    }

    playBoard.innerHTML = html;
  };

  // Initialize the game
  updateFoodPosition();
  addChildSnake();
  setIntervalId = setInterval(initGame, 150);
  document.addEventListener("keyup", changeDirection);

