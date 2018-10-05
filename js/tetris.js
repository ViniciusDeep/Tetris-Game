var score = 0000;
var COLS = 10,
  ROWS = 20;
var board = [];
var lose;
var score = 0;
var interval;
var current; // current moving shape
var currentX, currentY; // position of current shape
var shapes = [
  [1, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 1, 1],
  [0, 1, 0, 0, 1, 1, 1]
];
var colors = ["cyan", "orange", "blue", "yellow", "red", "green", "purple"];
var scoreholder = document.querySelector("[data-score]");

scoreholder.innerHTML = score;

// updates score value
function updateScore(v) {
  score += v;
  scoreholder.innerHTML = score;
}

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newShape() {
  var id = Math.floor(Math.random() * shapes.length);
  var shape = shapes[id]; // maintain id for color filling

  current = [];
  for (var y = 0; y < 4; ++y) {
    current[y] = [];
    for (var x = 0; x < 4; ++x) {
      var i = 4 * y + x;
      if (typeof shape[i] != "undefined" && shape[i]) {
        current[y][x] = id + 1;
      } else {
        current[y][x] = 0;
      }
    }
  }
  // position where the shape will evolve
  currentX = 5;
  currentY = 0;
}

// clears the board
function init() {
  for (var y = 0; y < ROWS; ++y) {
    board[y] = [];
    for (var x = 0; x < COLS; ++x) {
      board[y][x] = 0;
    }
  }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {
  if (valid(0, 1)) {
    ++currentY;
  }
  // if the element settled
  else {
    freeze();
    clearLines();
    if (lose) {
      newGame();
      return false;
    }
    newShape();
  }
}

// stop shape at its position and fix it to board
function freeze() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current[y][x]) {
        board[y + currentY][x + currentX] = current[y][x];
      }
    }
  }
  updateScore(20);
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate(current) {
  var newCurrent = [];
  for (var y = 0; y < 4; ++y) {
    newCurrent[y] = [];
    for (var x = 0; x < 4; ++x) {
      newCurrent[y][x] = current[3 - x][y];
    }
  }

  return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
  for (var y = ROWS - 1; y >= 0; --y) {
    var rowFilled = true;
    for (var x = 0; x < COLS; ++x) {
      if (board[y][x] == 0) {
        rowFilled = false;
        break;
      }
    }
    if (rowFilled) {
      // increases score
      score++;
      document.getElementById("clearsound").play();
      updateScore(100);
      for (var yy = y; yy > 0; --yy) {
        for (var x = 0; x < COLS; ++x) {
          board[yy][x] = board[yy - 1][x];
        }
      }
      ++y;
    }
  }
}

function keyPress(key) {
  switch (key) {
    case "left":
      if (valid(-1)) {
        --currentX;
      }
      break;
    case "right":
      if (valid(1)) {
        ++currentX;
      }
      break;
    case "down":
      if (valid(0, 1)) {
        ++currentY;
      }
      break;
    case "rotate":
      var rotated = rotate(current);
      if (valid(0, 0, rotated)) {
        current = rotated;
      }
      break;

    //
    case "esquerda":
      if (valid(-1)) {
        --currentX;
      }
      break;
    case "direita":
      if (valid(1)) {
        ++currentX;
      }
      break;
    case "baixo":
      if (valid(0, 1)) {
        ++currentY;
      }
      break;
    case "rodar":
      var rotated = rotate(current);
      if (valid(0, 0, rotated)) {
        current = rotated;
      }
      break;

    //
  }
}

// checks if the resulting position of current shape will be feasible
function valid(offsetX, offsetY, newCurrent) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || current;

  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (newCurrent[y][x]) {
        if (
          typeof board[y + offsetY] == "undefined" ||
          typeof board[y + offsetY][x + offsetX] == "undefined" ||
          board[y + offsetY][x + offsetX] ||
          x + offsetX < 0 ||
          y + offsetY >= ROWS ||
          x + offsetX >= COLS
        ) {
          if (offsetY == 1) lose = true; // lose if the current shape at the top row when checked
          return false;
        }
      }
    }
  }
  return true;
}

function gameOver() {
  if (board.length == 20) {
    alert("GAME OVER");
  }
}

function newGame() {
  gameOver();
  clearInterval(interval);
  init();
  newShape();
  lose = false;
  score = 0;
  interval = setInterval(tick, 250);
}

newGame();
