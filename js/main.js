/*----- constants -----*/
const startingStonesInPits = 1;
const PLAYERS = {
  '1': 'Player 1',
  '-1': 'Player 2',
};

/*----- cached element references -----*/
const msgEl = document.getElementById('msg');

/*----- app's state (variables) -----*/
let board, winner, turn;

/*----- event listeners -----*/
document.querySelector('section').addEventListener('click', handleClick);
document.querySelector('button').addEventListener('click', init);

/*----- functions -----*/
init();

function init() {
  board = [
    0,
    startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits,
    0,
    startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits
  ];
  for (var i = 0; i < board.length - 3; i++) {
    document.getElementById(`pit${i}`).textContent = board[i]; //check to see if this can be done with forEach()
  }
  document.getElementById('pit1').textContent = board[i];
  winner = null;
  turn = 1;
  displayMsg();
  msgEl.textContent = 'empty state'; //update message displayed when code is improved
}

function handleClick() {
  
}

function displayMsg() {
  if (winner) {
    if (winner === 'T') msgEl.textContent = 'Stalemate.' + '\n' + 'Play again?';//check on line break
    else msgEl.textContent = `Well done, ${winner}! Play again?`;
  } else
    msgEl.textContent = `${getPlayer()}'s Turn`;
}

function getPlayer() {
  return PLAYERS[turn];
}
