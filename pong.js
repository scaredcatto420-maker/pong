const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===============================
// AJUSTE DE TELA
// ===============================
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===============================
// BARRINHAS (TOPO E CHÃO)
// ===============================
let paddleWidth = canvas.width * 0.3;
let paddleHeight = 12;

let playerX = canvas.width / 2 - paddleWidth / 2;
let playerY = canvas.height - 30;

let botX = canvas.width / 2 - paddleWidth / 2;
let botY = 18;

// ===============================
// BOLA
// ===============================
let ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 4;
let ballDY = 4;

// ===============================
// CONTROLE DO JOGADOR (TOQUE + MOUSE)
// ===============================
function moverJogador(x) {
  playerX = x - paddleWidth / 2;

  if (playerX < 0) playerX = 0;
  if (playerX + paddleWidth > canvas.width)
    playerX = canvas.width - paddleWidth;
}

canvas.addEventListener("touchmove", e => {
  moverJogador(e.touches[0].clientX);
});

canvas.addEventListener("mousemove", e => {
  moverJogador(e.clientX);
});

// ===============================
// BOT SIMPLES (SEGUINDO A BOLA)
// ===============================
function moverBot() {
  let centroBot = botX + paddleWidth / 2;

  if (centroBot < ballX - 10) botX += 3;
  else if (centroBot > ballX + 10) botX -= 3;
}

// ===============================
// RESET DA BOLA
// ===============================
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballDY *= -1;
}

// ===============================
// GAME LOOP
// ===============================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jogador (embaixo)
  ctx.fillStyle = "white";
  ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);

  // Bot (em cima)
  ctx.fillRect(botX, botY, paddleWidth, paddleHeight);

  // Bola
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  // Movimento da bola
  ballX += ballDX;
  ballY += ballDY;

  // Movimento do bot
  moverBot();

  // Parede esquerda/direita
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
    ballDX *= -1;
  }

  // Colisão com jogador (embaixo)
  if (
    ballY + ballRadius >= playerY &&
    ballX >= playerX &&
    ballX <= playerX + paddleWidth
  ) {
    ballDY *= -1;
  }

  // Colisão com bot (em cima)
  if (
    ballY - ballRadius <= botY + paddleHeight &&
    ballX >= botX &&
    ballX <= botX + paddleWidth
  ) {
    ballDY *= -1;
  }

  // Se errar → reset
  if (ballY - ballRadius > canvas.height || ballY + ballRadius < 0) {
    resetBall();
  }

  requestAnimationFrame(draw);
}

draw();
