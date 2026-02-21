const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let active = true;

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener('click', () => {
    const i = cell.dataset.index;
    if(board[i] !== "" || !active) return;
    
    board[i] = currentPlayer;
    cell.innerText = currentPlayer;
    
    if(checkWin()) {
        statusText.innerText = `Player ${currentPlayer} Wins! 🎉`;
        active = false;
    } else if(!board.includes("")) {
        statusText.innerText = "Draw! 🤝";
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Player ${currentPlayer}'s Turn`;
    }
}));

function checkWin() {
    return winPatterns.some(p => p.every(i => board[i] === currentPlayer));
}

resetBtn.addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(c => c.innerText = "");
    currentPlayer = "X";
    statusText.innerText = "Player X's Turn";
    active = true;
});