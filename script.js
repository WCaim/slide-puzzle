window.addEventListener('DOMContentLoaded', () => {
  const SIZE = 4;
  const TOTAL = SIZE * SIZE;
  const puzzle = document.getElementById('puzzle');
  const collectionBtn = document.getElementById('collectionBtn');

  // Determine puzzle number
  const p = new URLSearchParams(location.search).get('p')?.padStart(2, '0') || '01';
  const IMG = `images/puzzle${p}.jpg`;

  // Compute tile size
  const PUZZLE_DIM = puzzle.clientWidth;
  const TILE_DIM = PUZZLE_DIM / SIZE;

  // Data array, 0-15; 15 is empty
  let data = [];
  let solved = false;

  // Initialize in solved order, then perform random valid moves
  function initData() {
    data = Array.from({ length: TOTAL }, (_, i) => i);
    let emptyIdx = TOTAL - 1;
    // Do random moves
    for (let i = 0; i < 2000; i++) {
      const x = emptyIdx % SIZE;
      const y = Math.floor(emptyIdx / SIZE);
      const neighbors = [];
      if (x > 0) neighbors.push(emptyIdx - 1);
      if (x < SIZE - 1) neighbors.push(emptyIdx + 1);
      if (y > 0) neighbors.push(emptyIdx - SIZE);
      if (y < SIZE - 1) neighbors.push(emptyIdx + SIZE);
      const swapIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      [data[emptyIdx], data[swapIdx]] = [data[swapIdx], data[emptyIdx]];
      emptyIdx = swapIdx;
    }
    solved = false;
  }

  // Render current state
  function render() {
    puzzle.innerHTML = '';
    data.forEach((v, idx) => {
      const x = idx % SIZE;
      const y = Math.floor(idx / SIZE);
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.width = `${TILE_DIM}px`;
      tile.style.height = `${TILE_DIM}px`;
      tile.style.left = `${x * TILE_DIM}px`;
      tile.style.top = `${y * TILE_DIM}px`;
      if (v !== TOTAL - 1) {
        const tx = v % SIZE;
        const ty = Math.floor(v / SIZE);
        tile.style.backgroundImage = `url('${IMG}')`;
        tile.style.backgroundSize = `${PUZZLE_DIM}px ${PUZZLE_DIM}px`;
        tile.style.backgroundPosition = `-${tx * TILE_DIM}px -${ty * TILE_DIM}px`;
        tile.addEventListener('click', () => moveTile(idx));
      } else {
        tile.classList.add('hidden');
      }
      puzzle.appendChild(tile);
    });
  }

  // Attempt to move tile at idx
  function moveTile(idx) {
    if (solved) return;
    const emptyIdx = data.indexOf(TOTAL - 1);
    const x1 = idx % SIZE;
    const y1 = Math.floor(idx / SIZE);
    const x2 = emptyIdx % SIZE;
    const y2 = Math.floor(emptyIdx / SIZE);
    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1) {
      [data[idx], data[emptyIdx]] = [data[emptyIdx], data[idx]];
      render();
      checkWin();
    }
  }

  // Check if solved
  function checkWin() {
    if (data.every((v, i) => v === i) && !solved) {
      solved = true;
      const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?'!/()&:;=+-_\"$@";
      const code = codes.charAt(Math.floor(Math.random() * codes.length));
      alert(`Your code: ${code}`);
      localStorage.setItem(`code${p}`, code);
    }
  }

  // Init & render
  initData();
  render();

  // Navigation
  collectionBtn.addEventListener('click', () => location.href = 'collection.html');
});