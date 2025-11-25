const boardEl = document.getElementById('board');
const linesCountEl = document.getElementById('linesCount');
const bingoTextEl = document.getElementById('bingoText');
const newBoardBtn = document.getElementById('newBoardBtn');

const SIZE = 5;
let cells = []; // store DOM elements
let marked = []; // 2D array of booleans

// Generate array [1, 2, ..., 25] and shuffle
function generateNumbers() {
  const nums = [];
  for (let i = 1; i <= SIZE * SIZE; i++) nums.push(i);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

function createBoard() {
  boardEl.innerHTML = '';
  cells = [];
  marked = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  bingoTextEl.classList.remove('show');
  linesCountEl.textContent = '0';

  const nums = generateNumbers();
  let idx = 0;

  for (let row = 0; row < SIZE; row++) {
    cells[row] = [];
    for (let col = 0; col < SIZE; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      const number = nums[idx++];
      cell.textContent = number;

      // Optional: make center cell a FREE space
      // if (row === 2 && col === 2) {
      //   cell.textContent = '★';
      //   cell.classList.add('free', 'marked'); 
      //   marked[row][col] = true;
      // }

      cell.addEventListener('click', () => {
        toggleCell(row, col);
      });

      boardEl.appendChild(cell);
      cells[row][col] = cell;
    }
  }

  updateLines();
}

function toggleCell(row, col) {
  // Don't allow clicking to unmark the free space icon if you want
  // You can comment this condition if you want it clickable
  // if (row === 2 && col === 2) return;

  marked[row][col] = !marked[row][col];
  cells[row][col].classList.toggle('marked', marked[row][col]);
  updateLines();
}

function updateLines() {
  let lines = 0;

  // Rows
  for (let r = 0; r < SIZE; r++) {
    if (marked[r].every(v => v)) lines++;
  }

  // Columns
  for (let c = 0; c < SIZE; c++) {
    let colComplete = true;
    for (let r = 0; r < SIZE; r++) {
      if (!marked[r][c]) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) lines++;
  }

  // Diagonal 1 (top-left to bottom-right)
  let diag1 = true;
  for (let i = 0; i < SIZE; i++) {
    if (!marked[i][i]) {
      diag1 = false;
      break;
    }
  }
  if (diag1) lines++;

  // Diagonal 2 (top-right to bottom-left)
  let diag2 = true;
  for (let i = 0; i < SIZE; i++) {
    if (!marked[i][SIZE - 1 - i]) {
      diag2 = false;
      break;
    }
  }
  if (diag2) lines++;

  linesCountEl.textContent = lines;

  if (lines > 0) {
    bingoTextEl.classList.add('show');
  } else {
    bingoTextEl.classList.remove('show');
  }
}

newBoardBtn.addEventListener('click', createBoard);

// init
createBoard();
