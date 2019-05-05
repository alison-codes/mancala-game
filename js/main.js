/*----- constants -----*/
const startingStonesInPits = 1;
const PLAYERS = {
  '1': 'Player 1',
  '-1': 'Player 2',
};

/*----- cached element references -----*/
const msgEl = document.getElementById('msg');

/*----- app's state (variables) -----*/
let board, winner, turn, stonesCaptured;

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
    startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits, startingStonesInPits,
  ];
  for (i = 0; i < board.length - 1; i++) {
    document.getElementById(`pit${i}`).textContent = board[i]; //check to see if this can be done with forEach()
  }
  winner = null;
  turn = 1;
  displayMsg();
  disallowCursor();
  msgEl.textContent = 'empty state'; //update message displayed when code is improved
}

function displayMsg() {
  disallowCursor();
  if (winner) {
    if (winner === 'T') msgEl.textContent = 'Stalemate.' + '\n' + 'Play again?';//check on line break
    else msgEl.textContent = `Well done, ${winner}! Play again?`;
  } else
    msgEl.textContent = `${getPlayer()}'s Turn`;
}

function getPlayer() {
  return PLAYERS[turn];
}

function disallowCursor() {
  pitOneArr = document.querySelectorAll('.pit-player-one .pit');
  pitTwoArr = document.querySelectorAll('.pit-player-two .pit');
  setTimeout(function () {
    if (turn === 1) {
      for (i = 0; i < pitOneArr.length; i++) {
        pitOneArr[i].style.cursor = "not-allowed";
      } for (i = 0; i < pitTwoArr.length; i++) {
        pitTwoArr[i].style.cursor = "auto";
      }
    }
    if (turn === -1) {
      for (i = 0; i < pitTwoArr.length; i++) {
        pitTwoArr[i].style.cursor = "not-allowed";
      } for (i = 0; i < pitOneArr.length; i++) {
        pitOneArr[i].style.cursor = "auto";
      }
    }
  }, 500);
}

function handleClick(evt) {
  const stonesInPit = evt.target;
  let stonesInHand = (board[evt.target.id.replace('pit', '')]);
  let pitIdx = parseInt(stonesInPit.id.replace('pit', ''));
  if ((isNaN(pitIdx)) || (pitIdx === 0) || (pitIdx === 7)) return;
  if (stonesInHand === 0) {
    return;
  }
  if ((turn === 1 && pitIdx > 7) || (turn === -1 && pitIdx < 7)) return;
  while (stonesInHand >= 1) {
    if (pitIdx === 13) {
      board[0]++;
      board[pitIdx] = 0;
      stonesInHand -= 1;
    } else {
      board[pitIdx] = 0;
      captureStones();
      pitIdx++;
      board[pitIdx]++;
      stonesInHand -= 1;
    }
  }
  function captureStones() {
    if (stonesInHand === 1 && board[pitIdx + 1] === 0) {
      stonesCaptured = board[pitIdx + 1] + 1 + board[13 - pitIdx];
      if (turn === 1) board[7] += stonesCaptured;
      if (turn === -1) board[0] += stonesCaptured;
      board[pitIdx + 1] = -1;
      board[13 - pitIdx] = 0;
    }
  }
  for (i = 0; i < board.length - 1; i++) document.getElementById(`pit${i}`).textContent = board[i]; //check to see if this can be done with forEach()
  turn *= -1;
  gameEnd();
  whoWon();
  displayMsg();
}

function whoWon() {
  if (gameEnd()) {
    let playerOneFinalCount = board[7];
    let playerTwoFinalCount = board[0];
    if (playerOneFinalCount > playerTwoFinalCount)
      winner = 'Player 1';
    else if (playerOneFinalCount < playerTwoFinalCount)
      winner = 'Player 2';
    else winner = 'T';
  }
}

function gameEnd() {
  let playerOneBoardStones = board.slice(1, 7);
  let playerTwoBoardStones = board.slice(8, 14);
  let onlyPlayerOneCanMove = playerOneBoardStones.every(function(pit) {
    return pit === 0;
  });
  let onlyPlayerTwoCanMove = playerTwoBoardStones.every(function(pit) {
    return pit === 0;
  });
  if (onlyPlayerTwoCanMove) {
    playerOneBoardStones.forEach(function(num) {
      stonesCaptured = + num;
    });
    // console.log(stonesCaptured);
    return true;
  }
  if (onlyPlayerOneCanMove) {
    let stonesCaptured2 = 0;
    playerTwoBoardStones.forEach(function(num) {
      stonesCaptured2 = + num;
      // console.log(stonesCaptured2);
    });
    return true;
  }
}