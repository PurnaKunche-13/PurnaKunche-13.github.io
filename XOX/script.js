let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

function makeMove(cell, index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  if (currentPlayer !== "X") {
    document.body.style.backgroundColor = "#0d0d61";
  } else {
    document.body.style.backgroundColor = "#9a0b0b";
  }
  cell.innerText = currentPlayer;
  if (checkWinner()) {
    document.getElementById("result").innerText = `${currentPlayer} Wins!`;
    gameActive = false;
    document.body.style.backgroundColor = "green";
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return board[a] !== "" && board[a] === board[b] && board[a] === board[c];
  });
}

function resetGame() {
  board.fill("");
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerText = ""));
  document.getElementById("result").innerText = "";
  currentPlayer = "X";
  gameActive = true;
  document.body.style.backgroundColor = "#0d0d61";
}
