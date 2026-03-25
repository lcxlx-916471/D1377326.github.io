const ROWS = 15;
const COLS = 15;

// boardState: 2D array representing the board
// 0 = empty, 1 = black, 2 = white
let boardState = [];
let currentPlayer = 1; // 1 represents black, 2 represents white
let isGameOver = false;
let lastMoveCell = null;

// DOM Elements
const boardEl = document.getElementById('board');
const statusTextEl = document.getElementById('status-text');
const restartBtn = document.getElementById('restart-btn');

/**
 * Initialize or restart the game
 */
function initGame() {
    // Create 15x15 empty grid
    boardState = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPlayer = 1;
    isGameOver = false;
    lastMoveCell = null;
    
    updateStatusText();
    boardEl.className = 'board turn-black';
    renderBoard();
}

/**
 * Render the entire board to the DOM
 */
function renderBoard() {
    boardEl.innerHTML = '';
    
    // Standard star points for a 15x15 board
    const starPoints = [
        [3, 3], [3, 11], [7, 7], [11, 3], [11, 11]
    ];
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Render star points if matching coordinates
            const isStar = starPoints.some(p => p[0] === r && p[1] === c);
            if (isStar) {
                const starDot = document.createElement('div');
                starDot.className = 'star-dot';
                cell.appendChild(starDot);
            }
            
            // Add a ghost piece for hover effect
            const ghost = document.createElement('div');
            ghost.className = 'ghost-piece';
            cell.appendChild(ghost);

            // Add click event for placing a piece
            cell.addEventListener('click', () => handleMove(r, c));
            boardEl.appendChild(cell);
        }
    }
}

/**
 * Handle player move at coordinates (r, c)
 */
function handleMove(r, c) {
    if (isGameOver || boardState[r][c] !== 0) return;

    // 1. Update logic state
    boardState[r][c] = currentPlayer;
    
    // 2. Update UI
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    cell.classList.add('has-piece');
    
    // Remove the ghost piece to prevent overlapping
    const ghost = cell.querySelector('.ghost-piece');
    if (ghost) ghost.remove();

    // Clear last-move indicator from previous move
    if (lastMoveCell) {
        const prevPiece = lastMoveCell.querySelector('.piece');
        if (prevPiece) prevPiece.classList.remove('last-move');
    }

    // Place the new piece
    const piece = document.createElement('div');
    piece.className = `piece ${currentPlayer === 1 ? 'black' : 'white'} last-move`;
    cell.appendChild(piece);
    lastMoveCell = cell;

    // 3. Check win condition
    if (checkWin(r, c, currentPlayer)) {
        isGameOver = true;
        const winnerColor = currentPlayer === 1 ? '黑子' : '白子';
        statusTextEl.innerHTML = `<span class="${currentPlayer === 1 ? 'black-win' : 'white-win'}">遊戲結束！${winnerColor}獲勝！</span>`;
        boardEl.className = 'board'; // remove hover styles
        
        // Small delay so piece renders before alert blocks the thread
        setTimeout(() => alert(`${winnerColor} 獲勝！`), 50);
        return;
    }

    // 4. Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatusText();
    boardEl.className = `board ${currentPlayer === 1 ? 'turn-black' : 'turn-white'}`;
}

/**
 * Update the text showing whose turn it is
 */
function updateStatusText() {
    if (isGameOver) return;
    const playerColor = currentPlayer === 1 ? '黑子' : '白子';
    const playerClass = currentPlayer === 1 ? 'black-turn' : 'white-turn';
    statusTextEl.innerHTML = `目前輪到：<span class="${playerClass}">${playerColor}</span>`;
}

/**
 * Check if the recent move caused a win
 */
function checkWin(r, c, player) {
    // 4 directions: Horizontal, Vertical, Diagonal (\), Diagonal (/)
    const directions = [
        [[0, 1], [0, -1]], 
        [[1, 0], [-1, 0]], 
        [[1, 1], [-1, -1]],
        [[1, -1], [-1, 1]] 
    ];

    for (let axis of directions) {
        let count = 1; // start with the piece just placed
        
        for (let dir of axis) {
            let nr = r + dir[0];
            let nc = c + dir[1];
            
            // Keep walking in this direction while we see the player's pieces
            while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && boardState[nr][nc] === player) {
                count++;
                nr += dir[0];
                nc += dir[1];
            }
        }
        
        if (count >= 5) {
            return true;
        }
    }
    return false;
}

// Event Listeners
restartBtn.addEventListener('click', initGame);

// Start game
initGame();
