const canvas = document.querySelector('#snake-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.querySelector('#score');
const message = document.querySelector('#game-message');
const restartButton = document.querySelector('#restart');
const controlButtons = document.querySelectorAll('[data-direction]');

const size = 20;
const tile = canvas.width / size;
let snake;
let food;
let direction;
let nextDirection;
let score;
let timer;
let running;
let started;

function newFood() {
  let candidate;
  do {
    candidate = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) };
  } while (snake.some(part => part.x === candidate.x && part.y === candidate.y));
  return candidate;
}

function reset() {
  clearInterval(timer);
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  food = newFood();
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  running = false;
  started = false;
  scoreDisplay.textContent = '000';
  message.innerHTML = 'PRESS AN ARROW KEY<br />TO START';
  message.classList.remove('hidden');
  draw();
}

function start() {
  if (running) return;
  running = true;
  started = true;
  message.classList.add('hidden');
  timer = setInterval(step, 125);
}

function changeDirection(name) {
  const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const chosen = directions[name];
  if (chosen.x === -direction.x && chosen.y === -direction.y) return;
  nextDirection = chosen;
  start();
}

function step() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  // The left and right sides are connected: exit on one side, enter on the other.
  if (head.x < 0) head.x = size - 1;
  if (head.x >= size) head.x = 0;
  const hitWall = head.y < 0 || head.y >= size;
  const hitSnake = snake.some(part => part.x === head.x && part.y === head.y);
  if (hitWall || hitSnake) return endGame();
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = String(score).padStart(3, '0');
    food = newFood();
  } else snake.pop();
  draw();
}

function endGame() {
  clearInterval(timer);
  running = false;
  message.innerHTML = `GAME OVER<br /><small>SCORE: ${score} · PRESS RESTART</small>`;
  message.classList.remove('hidden');
}

function draw() {
  ctx.fillStyle = '#081127';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#2e5b9844';
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i++) {
    ctx.beginPath(); ctx.moveTo(i * tile, 0); ctx.lineTo(i * tile, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * tile); ctx.lineTo(canvas.width, i * tile); ctx.stroke();
  }
  ctx.fillStyle = '#ff64a7';
  ctx.shadowColor = '#ff64a7'; ctx.shadowBlur = 16;
  ctx.fillRect(food.x * tile + 4, food.y * tile + 4, tile - 8, tile - 8);
  ctx.shadowBlur = 0;
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#a2ebff' : '#49bfff';
    ctx.shadowColor = '#46bfff'; ctx.shadowBlur = 10;
    ctx.fillRect(part.x * tile + 2, part.y * tile + 2, tile - 4, tile - 4);
  });
  ctx.shadowBlur = 0;
}

document.addEventListener('keydown', event => {
  const keyMap = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  if (keyMap[event.key]) { event.preventDefault(); changeDirection(keyMap[event.key]); }
});
controlButtons.forEach(button => button.addEventListener('click', () => changeDirection(button.dataset.direction)));
restartButton.addEventListener('click', reset);
reset();
