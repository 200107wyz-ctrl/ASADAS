const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const timeElement = document.getElementById("time");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restart");

const keys = {};

let gameOver = false;
let startTime = 0;

const player = {
  x: 100,
  y: 250,
  size: 22,
  speed: 4
};

const asada = {
  x: 700,
  y: 250,
  size: 30,
  speed: 1.7
};

document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

restartButton.addEventListener("click", resetGame);

function resetGame() {
  player.x = 100;
  player.y = 250;

  asada.x = 700;
  asada.y = 250;

  gameOver = false;
  startTime = performance.now();

  messageElement.textContent = "浅田から逃げろ！";

  requestAnimationFrame(gameLoop);
}

function movePlayer() {
  if (keys["w"] || keys["arrowup"]) {
    player.y -= player.speed;
  }

  if (keys["s"] || keys["arrowdown"]) {
    player.y += player.speed;
  }

  if (keys["a"] || keys["arrowleft"]) {
    player.x -= player.speed;
  }

  if (keys["d"] || keys["arrowright"]) {
    player.x += player.speed;
  }

  player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
  player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, player.y));
}

function moveAsada() {
  const dx = player.x - asada.x;
  const dy = player.y - asada.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    asada.x += (dx / distance) * asada.speed;
    asada.y += (dy / distance) * asada.speed;
  }
}

function checkCollision() {
  const dx = player.x - asada.x;
  const dy = player.y - asada.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < player.size / 2 + asada.size / 2;
}

function drawBackground() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 簡単な床
  ctx.strokeStyle = "#222";

  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.fillStyle = "#4da6ff";

  ctx.beginPath();
  ctx.arc(
    player.x,
    player.y,
    player.size / 2,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("あなた", player.x, player.y - 18);
}

function drawAsada() {
  ctx.fillStyle = "#ff2222";

  ctx.beginPath();
  ctx.arc(
    asada.x,
    asada.y,
    asada.size / 2,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // 目
  ctx.fillStyle = "white";

  ctx.beginPath();
  ctx.arc(asada.x - 7, asada.y - 5, 4, 0, Math.PI * 2);
  ctx.arc(asada.x + 7, asada.y - 5, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("浅田", asada.x, asada.y - 25);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff2222";
  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("捕まった！", canvas.width / 2, canvas.height / 2);

  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(
    "「浅田から逃げろ！」",
    canvas.width / 2,
    canvas.height / 2 + 45
  );
}

function gameLoop(now) {
  if (gameOver) {
    drawGameOver();
    return;
  }

  const survivalTime = (now - startTime) / 1000;
  timeElement.textContent = survivalTime.toFixed(1);

  // 時間が経つほど浅田が速くなる
  asada.speed = 1.7 + survivalTime * 0.025;

  movePlayer();
  moveAsada();

  drawBackground();
  drawPlayer();
  drawAsada();

  if (checkCollision()) {
    gameOver = true;
    messageElement.textContent = "捕まった！";
    drawGameOver();
    return;
  }

  requestAnimationFrame(gameLoop);
}

resetGame();
