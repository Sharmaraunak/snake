const BG_COLOR = "#231f20";
const SNAKE_COLOR = "#c2c2c2";
const FOOD_COLOR = "#e66916";

const gamescreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameButton = document.getElementById("newGameButton");
const joingameButton = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");

newGameButton.addEventListener("click", newGame);
joingameButton.addEventListener("click", joinGame);

function newGame() {
  socket.emit("newGame");
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit("joinGame", code);
  init();
}

const socket = io("http://localhost:3000");
socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownGame", handleUnknownGame);
socket.on("tooManyPlayers", handleTooManyPlayers);


let canvas, ctx;
let playernumber;
let gameActive = false;
function init() {
  initialScreen.style.display = "none";
  gamescreen.style.display = "block";

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOR;

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener("keydown", keydown);
  gameActive = true;
}

function keydown(e) {
  // console.log(e.keyCode);
  socket.emit("keydown", e.keyCode);
}





function paintGame(state) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridSize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, SNAKE_COLOR);
  paintPlayer(state.players[1], size, "red");
}

function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;
  ctx.fillStyle = colour;

  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}



function handleInit(number) {
  playernumber = number;
 
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);

  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) return;

  data = JSON.parse(data);
  if (data.winner === playernumber) {
    alert("YOU WIN!!!!!");
  } else {
    alert("YOU LOSE!!!!!!");
  }
  gameActive = false;
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownGame() {
  reset();
  alert("Unknown Game Code");
}

function handleTooManyPlayers() {
  reset();
  alert("Game already going on.");
}

function reset() {
  playernumber = null;
  gameCodeInput.value = "";
  gameCodeDisplay.innerText = " ";
  initialScreen.style.display = "block";
  gamescreen.style.display = "none";
}
