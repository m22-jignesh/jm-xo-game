let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = ""; 
let gameActive = false;

const statusText = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

function setMode(mode) {
    gameMode = mode;
    gameActive = true;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-view').style.display = 'block';
    resetGame();
}

function backToMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game-view').style.display = 'none';
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        if (board[index] !== "" || !gameActive) return;

        makeMove(index, "X");

        if (gameActive && gameMode !== 'friend') {
            setTimeout(botMove, 500);
        }
    });
});

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());

    if (checkWin(board, player)) {
        statusText.innerText = `Player ${player} Wins!`;
        gameActive = false;
    } else if (!board.includes("")) {
        statusText.innerText = "Draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = gameMode === 'friend' ? `Player ${currentPlayer}'s Turn` : "Your Turn";
    }
}

function botMove() {
    if (!gameActive) return;
    let move;
    if (gameMode === 'easy') move = getRandomMove();
    else if (gameMode === 'medium') move = Math.random() > 0.5 ? getBestMove() : getRandomMove();
    else move = getBestMove();

    makeMove(move, "O");
}

function getRandomMove() {
    let avail = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return avail[Math.floor(Math.random() * avail.length)];
}

function getBestMove() {
    // Minimax implementation for Hard mode
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(b, depth, isMaximizing) {
    if (checkWin(b, "O")) return 10;
    if (checkWin(b, "X")) return -10;
    if (!b.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === "") {
                b[i] = "O";
                bestScore = Math.max(bestScore, minimax(b, depth + 1, false));
                b[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === "") {
                b[i] = "X";
                bestScore = Math.min(bestScore, minimax(b, depth + 1, true));
                b[i] = "";
            }
        }
        return bestScore;
    }
}

function checkWin(b, p) {
    const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return win.some(pattern => pattern.every(i => b[i] === p));
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(c => { c.innerText = ""; c.classList.remove('x', 'o'); });
    currentPlayer = "X";
    statusText.innerText = "Your Turn";
    gameActive = true;
}