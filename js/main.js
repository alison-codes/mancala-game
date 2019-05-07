/*----- constants -----*/
const STARTINGSTONESINPITS = 4;
const PLAYERS = {
  '1': 'Player 1',
  '-1': 'Player 2',
};

/*----- cached element references -----*/
const msgEl = document.getElementById('msg');
const selfEl = document.getElementById('self');
const collapsibleEl = document.getElementsByClassName('collapsible');

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
  msgEl.textContent = "Let's play Mancala";
  render();
}

function displayMsg() {
  disallowCursor();
  if (winner) {
    if (winner === 'T') msgEl.textContent = 'Stalemate.' + '\n' + 'Play again?';//check on line break
    else msgEl.textContent = `Well done, ${winner}! Play again?`;
  } else if (goAgain) {
    msgEl.textContent = `${getPlayer()}'s Turn Again`
    goAgain = false;
  }
  else msgEl.textContent = `${getPlayer()}'s Turn`;
}

function getPlayer() {
  return PLAYERS[turn];
}


function sleep(milliseconds) {
  render(); 
  let start = new Date().getTime();
  for (i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) break;
  }
}


function disallowCursor() {
  pitOneArr = document.querySelectorAll('.player-twos-pits .pit');
  pitTwoArr = document.querySelectorAll('.player-ones-pits .pit');
  setTimeout(function () {
    if (turn === 1) {
      for (i = 0; i < pitOneArr.length; i++) {
        pitOneArr[i].style.cursor = 'not-allowed';
      } for (i = 0; i < pitTwoArr.length; i++) {
        pitTwoArr[i].style.cursor = 'auto';
      }
    }
    if (turn === -1) {
      for (i = 0; i < pitTwoArr.length; i++) {
        pitTwoArr[i].style.cursor = 'not-allowed';
      } for (i = 0; i < pitOneArr.length; i++) {
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
  if ((isNaN(pitIdx)) || (pitIdx === 0) || (pitIdx === 7)) return;
  if (onOwnSide(evt) || (stonesInHand === 0)) return;
  function captureStones() {
    if (stonesInHand === 1 && board[pitIdx] === 0) {
      stonesCaptured = board[pitIdx] + 1 + board[14 - pitIdx];
      if (turn === -1 && pitIdx < 7) return;
      if (turn === 1 && pitIdx > 7 && pitIdx > 0) return;
      if (turn === 1) board[7] += stonesCaptured;
      if (turn === -1) board[0] += stonesCaptured;
      board[pitIdx] = -1;
      board[14 - pitIdx] = 0;
    }
  }
  board[pitIdx] = 0;
  pitIdx++;
  while (stonesInHand >= 1) {
    captureStones();
    if (pitIdx > 13) pitIdx = 0;
    board[pitIdx]++;
    sleep(50);
    stonesInHand--;
    pitIdx++;
  }
  turn *= -1;
  determineWhoWon();
  if (pitIdx - 1 === 0 || pitIdx - 1 === 7) {
    goAgain = true;
    turn *= -1;
  }
  displayMsg();
}

function render() {
  board.forEach(function (item, index) {
    document.getElementById(`pit${index}`).textContent = board[index];
  });
}

function determineWhoWon() {
  render();
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

function prepareForFinalCount() {
  board = board.fill(0, 8, 14);
  board = board.fill(0, 1, 7);
  turn *= -1;
  render();
} 

function toggle() {
  let ruleList = this.nextElementSibling;
  selfEl.style.display === 'block' ? (
    selfEl.style.display = 'none',
    ruleList.style.display = 'block'
  ) :
    (selfEl.style.display = 'block',
      ruleList.style.display = 'none')
}

function toggleOff() {
  let ruleList = this;
  selfEl.style.display === 'block' ? (
    selfEl.style.display = 'none',
    ruleList.style.display = 'block'
  ) :
    (selfEl.style.display = 'block',
      ruleList.style.display = 'none')
}