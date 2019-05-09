/*----- constants -----*/
const STARTINGSTONESINPITS = 4;
const PLAYERS = {
  '1': 'Orange',
  '-1': 'Pink',
};

/*----- cached element references -----*/
const largerMsgEl = document.getElementById('msg');
const smallerMsgEl = document.getElementById('starting-msg');
const titleEl = document.getElementById('game-title');
const collapsibleEl = document.getElementsByClassName('collapsible');
const resetButtonEl = document.getElementById('new-game-button');

/*----- app's state (variables) -----*/
let board, winner, turn, stonesCaptured, goAgain;

/*----- event listeners -----*/
document.querySelector('section').addEventListener('click', handleClick);
document.querySelector('.new-game-button').addEventListener('click', init);
document.querySelector('.collapsible').addEventListener('click', toggle);
document.querySelector('.rules').addEventListener('click', toggleOff);

/*----- functions -----*/
init();

function init() {
  board = [
    0,
    STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS,
    0,
    STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS, STARTINGSTONESINPITS,
  ];
  turn = 1;
  winner = null;
  displayMsg();
  disallowCursor();
  largerMsgEl.textContent = 'Let\'s play Mancala';
  smallerMsgEl.textContent = 'Orange goes first';
  resetButtonEl.style.display = 'none';
  renderNumbers();
}

function displayMsg() {
  smallerMsgEl.textContent = '';
  disallowCursor();
  let currentPlayer = PLAYERS[turn];
  if (winner) {
    if (winner === 'T') {
      largerMsgEl.textContent = 'Stalemate.';
      smallerMsgEl.textContent = 'Play again?';
    }
    else {
      largerMsgEl.textContent = `Well done, ${winner}!`;
      smallerMsgEl.textContent = 'Play again?';
    }
  } else if (goAgain) {
    largerMsgEl.textContent = `${currentPlayer}'s Turn Again`;
  } else largerMsgEl.textContent = `${currentPlayer}'s Turn`;
}

function disallowCursor() {
  let pitOneArr = document.querySelectorAll('.player-twos-pits .pit');
  let pitTwoArr = document.querySelectorAll('.player-ones-pits .pit');
  setTimeout(function () {
    if (turn === 1) {
      for (i = 0; i < pitOneArr.length; i++) {
        pitOneArr[i].style.cursor = 'not-allowed';
      }
      for (i = 0; i < pitTwoArr.length; i++) {
        pitTwoArr[i].style.cursor = 'auto';
      }
    }
    if (turn === -1) {
      for (i = 0; i < pitTwoArr.length; i++) {
        pitTwoArr[i].style.cursor = 'not-allowed';
      }
      for (i = 0; i < pitOneArr.length; i++) {
        pitOneArr[i].style.cursor = 'auto';
      }
    }
  }, 500);
}

function onOwnSide(evt) {
  let stonesInPit = evt.target;
  let pitIdx = parseInt(stonesInPit.id.replace('pit', ''));
  if ((turn === 1 && pitIdx > 7) || (turn === -1 && pitIdx < 7)) return true;
}

function handleClick(evt) {
  let stonesInPit = evt.target;
  let stonesInHand = (board[evt.target.id.replace('pit', '')]);
  let pitIdx = parseInt(stonesInPit.id.replace('pit', ''));
  savedStones = stonesInHand;
  savedpitIdx = pitIdx;
  if ((isNaN(pitIdx)) || (pitIdx === 0) || (pitIdx === 7)) return;
  if (onOwnSide(evt) || (stonesInHand === 0)) return;
  board[pitIdx] = 0;
  moveStones(pitIdx, stonesInHand)
  turn *= -1; 
  resetButtonEl.style.display = 'inline'; 
}

async function moveStones(pitIdx, stonesInHand) {
	setTimeout(function() {
		if (pitIdx === 13) pitIdx = 0;
		else pitIdx += 1;
		if (pitIdx === 7 && turn === 1) {
			pitIdx = 8;
		}
		if (pitIdx === 13 && turn === -1) {
			pitIdx = 0;
		}
		board[pitIdx]++;
		stonesInHand--;
		renderNumbers();
		if (stonesInHand === 0) {
			captureStones(stonesInHand, pitIdx);
			if (pitIdx === 7 || pitIdx === 0) {
				goAgain = true;
				turn *= -1;
			}
			displayMsg();
			goAgain = false;
			if (gameEnd()) {
				determineWhoWon();
				displayMsg();
			}
			return true;
		} else {
			moveStones(pitIdx, stonesInHand);
		}
	}, 420)
}

function captureStones(stonesInHand, pitIdx) {
  if (pitIdx === 0 || pitIdx === 7) return;
  if (turn === 1 && pitIdx < 7) return;
  if (turn === -1 && pitIdx > 7 && pitIdx > 0) return;
  if (board[pitIdx] == 1) {
    let stonesCaptured = board[pitIdx] + board[14 - pitIdx];
    board[pitIdx] = 0;
    board[14 - pitIdx] = 0;
    turn === 1 ? board[0] += stonesCaptured : board[7] += stonesCaptured;
    renderNumbers();
  }
}

function renderNumbers() {
  board.forEach(function (item, idx) {
    document.getElementById(`pit${idx}`).textContent = board[idx];
  });
}

function determineWhoWon() {
  if (gameEnd()) {
    let playerOneFinalCount = board[7];
    let playerTwoFinalCount = board[0];
    if (playerOneFinalCount > playerTwoFinalCount) winner = PLAYERS[1];
    else if (playerOneFinalCount < playerTwoFinalCount) winner = PLAYERS[-1];
    else winner = 'T';
  }
}

function prepareForFinalCount() {
  board = board.fill(0, 8, 14);
  board = board.fill(0, 1, 7);
  renderNumbers();
}

function gameEnd() {
  let playerOneBoardStones = board.slice(1, 7);
  let playerTwoBoardStones = board.slice(8, 14);
  let stonesCapturedAtEnd = 0;
  let onlyPlayerOneCanMove = playerTwoBoardStones.every(function (pit) {
    return pit === 0;
  });
  let onlyPlayerTwoCanMove = playerOneBoardStones.every(function (pit) {
    return pit === 0;
  });
  if (onlyPlayerOneCanMove) {
    playerOneBoardStones.forEach(function (num, idx) {
      stonesCapturedAtEnd += num;
    });
    board[7] += stonesCapturedAtEnd;
    prepareForFinalCount();
    return true;
  }
  if (onlyPlayerTwoCanMove) {
    playerTwoBoardStones.forEach(function (num, idx) {
      stonesCapturedAtEnd += num;
    });
    board[0] += stonesCapturedAtEnd;
    prepareForFinalCount();
    return true;
  }
}

function toggle() {
  let ruleList = this.nextElementSibling;
  titleEl.style.display === 'none' ? (titleEl.style.display = 'block', ruleList.style.display = 'none') : (titleEl.style.display = 'none', ruleList.style.display = 'block')
}

function toggleOff() {
  let ruleList = this;
  titleEl.style.display === 'block' ? (titleEl.style.display = 'none', ruleList.style.display = 'block') : (titleEl.style.display = 'block', ruleList.style.display = 'none')
}