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

let sfx = {
  cappyClick: new Howl({
    src: ["assets/music/270303__littlerobotsoundfactory__collect_point_01.wav"],
  }),
  caimanClick: new Howl({
    src: ["assets/music/350925__cabled_mess__hurt_c_08.wav"],
  }),
  lowTime: new Howl({
    src: [
      "assets/music/651011__therandomsoundbyte2637__final-countdown-timer.wav",
    ],
  }),
};

let music = {
  gameStart: new Howl({
    src: ["assets/music/650965__betabeats__beat-tune-abysses.wav"],
  }),

  gameFinished: new Howl({
    src: ["assets/music/569438__bloodpixelhero__the-end-point.wav"],
  }),
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

    if (timer === 1) {
      let secondsElement = document.getElementById("seconds");
      secondsElement.innerText = "second";
    } else {
      let secondsElement = document.getElementById("seconds");
      secondsElement.innerText = "seconds";
    }
    if (timer <= 10) {
      sfx.lowTime.play();
      sfx.lowTime.volume(0.5);
    }
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
  document.getElementById("play-button").addEventListener("click", () => {
    startCountdown();
    if (!music.gameStart.playing()) {
      music.gameStart.play();
      music.gameStart.volume(0.5);
    }
  });
  document.getElementById("pause-button").addEventListener("click", () => {
    pauseGame();
    music.gameStart.pause();
  });
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
  cappy.src = "assets/new-cappy.png";
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
  caiman.src = "assets/new-caiman.png";
  currCaimanTile.appendChild(caiman);
}

function selectTile() {
  if (gameOver || gamePaused) {
    return;
  }

  if (this === currCappyTile) {
    sfx.cappyClick.play();
    sfx.cappyClick.volume(0.3);
    playerPoints += 100;
    document.getElementById("points").innerText = playerPoints;
  } else if (this === currCaimanTile) {
    if (hearts > 0) {
      updateHealth(hearts - 1);
    }
    sfx.caimanClick.play();
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
  music.gameStart.fade(0.5, 0.0, 3000);

  sfx.lowTime.fade(0.5, 0.0, 3000);
  if (!music.gameFinished.playing()) {
    music.gameFinished.play();
    music.gameFinished.fade(0.8, 0, 10000);
  }
  pauseGame();
  document.getElementById("game-over-overlay").style.display = "block";
  document.getElementById("final-score").innerText = playerPoints;
}

function restartGame() {
  location.reload();
}
