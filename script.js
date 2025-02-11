let countdownInterval = null;
let cappyInterval = null;
let caimanInterval = null;
let gameOver = false;
let gamePaused = false;
let playerPoints = 0;
let hearts = 3;
let timer = 60;
let currCappyTile = null;
let currCaimanTile = null;

window.onload = function () {
  startGame();
};

function startGame() {
  createBoard();
  setupButtons();
}

function createBoard() {
  const board = document.getElementById("board");
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    board.appendChild(tile);
  }
}

function startCountdown() {
  if (countdownInterval || gameOver) {
    return;
  }
  gamePaused = false;
  countdownInterval = setInterval(updateTimer, 1000);
  if (!cappyInterval) cappyInterval = setInterval(setCappy, 1000);
  if (!caimanInterval) caimanInterval = setInterval(setCaiman, 2000);
}

function updateTimer() {
  if (timer > 0) {
    timer--;
    document.getElementById("remaining-time").innerText = timer;
  } else {
    endGame();
  }
}

function pauseGame() {
  if (gameOver) {
    clearInterval(countdownInterval);
    return;
  }

  gamePaused = true;
  clearInterval(countdownInterval);
  clearInterval(cappyInterval);
  clearInterval(caimanInterval);

  countdownInterval = null;
  cappyInterval = null;
  caimanInterval = null;
}

function setupButtons() {
  document
    .getElementById("play-button")
    .addEventListener("click", startCountdown);
  document.getElementById("pause-button").addEventListener("click", pauseGame);
  document
    .getElementById("restart-button")
    .addEventListener("click", restartGame);
  document
    .getElementById("game-over-restart")
    .addEventListener("click", restartGame);
}

function getRandomTile() {
  return Math.floor(Math.random() * 9).toString();
}

function setCappy() {
  if (gameOver || gamePaused) {
    return;
  }

  if (currCappyTile) currCappyTile.innerHTML = "";

  let num = getRandomTile();
  if (currCaimanTile && currCaimanTile.id === num) {
    return;
  }

  currCappyTile = document.getElementById(num);
  let cappy = document.createElement("img");
  cappy.src = "assets/capybara.png";
  currCappyTile.appendChild(cappy);
}

function setCaiman() {
  if (gameOver || gamePaused) {
    return;
  }

  if (currCaimanTile) currCaimanTile.innerHTML = "";

  let num = getRandomTile();
  if (currCappyTile && currCappyTile.id === num) {
    return;
  }

  currCaimanTile = document.getElementById(num);
  let caiman = document.createElement("img");
  caiman.src = "assets/caiman.png";
  currCaimanTile.appendChild(caiman);
}

function selectTile() {
  if (gameOver || gamePaused) {
    return;
  }

  if (this === currCappyTile) {
    playerPoints += 100;
    document.getElementById("points").innerText = playerPoints;
  } else if (this === currCaimanTile) {
    if (hearts > 0) {
      updateHealth(hearts - 1);
    }
  }

  if (hearts === 0 || timer === 0) {
    endGame();
  }
}

function updateHealth(remainingHearts) {
  hearts = remainingHearts;
  document.getElementById("remaining-hearts").innerText = hearts;

  const healthContainer = document.getElementById("player-health");
  if (hearts === 1) {
    healthContainer.classList.add("low-health");
  } else {
    healthContainer.classList.remove("low-health");
  }

  if (hearts === 0) {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  pauseGame();
  document.getElementById("game-over-overlay").style.display = "block";
  document.getElementById("final-score").innerText = playerPoints;
}

function restartGame() {
  location.reload();
}
