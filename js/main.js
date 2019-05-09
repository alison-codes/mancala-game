/*----- constants -----*/
const STARTINGSTONESINPITS = 4;
const PLAYERS = {
  '1': 'Player 1',
  '-1': 'Player 2',
};
/*----- cached element references -----*/
const msgEl = document.getElementById('msg');
const startingmsgEl = document.getElementById('starting-msg');
const titleEl = document.getElementById('game-title');
const collapsibleEl = document.getElementsByClassName('collapsible');
const resetEl = document.getElementById('new-game-button');
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
  startingmsgEl.textContent = 'Orange goes first';
  resetEl.style.display = 'none';
  render();
}

function displayMsg() {
  startingmsgEl.textContent = '';
  disallowCursor();
  let currentPlayer = PLAYERS[turn];
  if (winner) {
    if (winner === 'T') msgEl.textContent = 'Stalemate.' + '\n' + 'Play again?';
    else msgEl.textContent = `Well done, ${winner}! Play again?`;
  } else if (goAgain) {
    msgEl.textContent = `${currentPlayer}'s Turn Again`
    goAgain = false;
  } else msgEl.textContent = `${currentPlayer}'s Turn`;
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

function sleep(milliseconds) {
  render();
  let start = new Date().getTime();
  for (i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) break;
  }
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
  pitIdx++;
  while (stonesInHand >= 1) {
    distributeStonesOnDelay(stonesInHand, pitIdx);
    captureStones(stonesInHand, pitIdx);
    if (pitIdx > 13) pitIdx = 0;
    board[pitIdx]++;
    stonesInHand--;
    pitIdx++;
  }
  board.forEach(function(item, idx) {
    document.getElementById(`pit${idx}`).style.fontWeight = "500";
  });
  turn *= -1;
  determineWhoWon();
  if (pitIdx - 1 === 0 || pitIdx - 1 === 7) {
    goAgain = true;
    turn *= -1;
  }
  displayMsg();
}

function distributeStonesOnDelay(stonesInHand, pitIdx) {
  if (pitIdx > 13) pitIdx = 0;
  changeEl = document.getElementById(`pit${pitIdx}`);

  let offset = 0;
  board.forEach(function(item, idx) {
    setTimeout(function(){
      console.log(savedpitIdx);
      console.log(savedStones);
      if (idx >=  savedpitIdx && idx <= savedpitIdx+ savedStones)
      document.getElementById(`pit${idx}`).style.fontWeight = "900";
      board.forEach(function(item, idx) {
      document.getElementById(`pit${idx}`).textContent = board[idx];
      });
    }, 100 + offset);    
   offset += 100;
  });



  // changeEl.style.color = " green";
  // console.log(changeEl);
  //~~~~~
  // var divs = $(".pit")
  // var index = 0;

  // var delay = setInterval (function() {
  //   if (index <= divs.length) {
  //     $(divs[pitIdx - 1]).addClass('lightblue');
  //     index += 1;
  //   } else {
  //     clearInterval(delay);
  //   }
  // }, 2000);
  // debugger;
  //~~~~~
  // sleep(1000);
  //   var divs = $(".pit")
  //   var index = 0;
  //   var delay = setInterval (function() {
  //     if (index <= divs.length) {
  //       $(divs[pitIdx - 1]).addClass('lightblue');
  //       index += 1;
  //     } else {
  //       clearInterval(delay);
  //     }
  //   }, 2000);
  //  //~~~~~

  // let pitCollection = document.querySelectorAll('.all-playable-pits .pit');
  // let index = pitIdx-1;
  // let interval = setInterval(function() {
  //   pitCollection[index++].classList.add('lightblue')
  //   if (index === pitCollection.length - savedStones) {
  //     clearInterval(interval);
  //   }
  // }, 500);
  //   $(pitCollection).each(function() {
  //     let box = this;
  //     $("body").queue(function(next) {
  //         $(box).classList.add('lightblue');
  //         next();
  //     }).delay(1000)
  // });

}
// ////////////////////////////////////
//   let pitCollection = document.querySelectorAll('.all-playable-pits .pit');
//   let index = 0;
//   let interval = setInterval(function() {
//     pitCollection[pitIdx++].classList.add('lightblue')

//     if (stonesInHand === 0) {
//       clearInterval(interval);
//     }
//   }, 500);
// } 


function captureStones(stonesInHand, pitIdx) {
	if (stonesInHand === 1 && board[pitIdx] === 0) {
		let stonesCaptured = board[pitIdx] + 1 + board[14 - pitIdx];
		if (turn === -1 && pitIdx < 7) return;
		if (turn === 1 && pitIdx > 7 && pitIdx > 0) return;
		if (turn === 1) board[7] += stonesCaptured;
		if (turn === -1) board[0] += stonesCaptured;
		board[pitIdx] = -1;
		board[14 - pitIdx] = 0;
	}
}

function render() {
	board.forEach(function(item, idx) {
		document.getElementById(`pit${idx}`).textContent = board[idx];
	});
}

function determineWhoWon() {
	resetEl.style.display = 'inline';
	// render();
	if (gameEnd()) {
		let playerOneFinalCount = board[7];
		let playerTwoFinalCount = board[0];
		if (playerOneFinalCount > playerTwoFinalCount) winner = PLAYERS[1];
		else if (playerOneFinalCount < playerTwoFinalCount) winner = PLAYERS[-1];
		else winner = 'T';
	}
}

function gameEnd() {
	let playerOneBoardStones = board.slice(1, 7);
	let playerTwoBoardStones = board.slice(8, 14);
	let stonesCapturedAtEnd = 0;
	let onlyPlayerOneCanMove = playerTwoBoardStones.every(function(pit) {
		return pit === 0;
	});
	let onlyPlayerTwoCanMove = playerOneBoardStones.every(function(pit) {
		return pit === 0;
	});
	if (onlyPlayerOneCanMove) {
		playerOneBoardStones.forEach(function(num, idx) {
			stonesCapturedAtEnd += num;
		});
		board[7] += stonesCapturedAtEnd;
		prepareForFinalCount();
		return true;
	}
	if (onlyPlayerTwoCanMove) {
		playerTwoBoardStones.forEach(function(num, idx) {
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
	titleEl.style.display === 'none' ? (titleEl.style.display = 'block', ruleList.style.display = 'none') : (titleEl.style.display = 'none', ruleList.style.display = 'block')
}

function toggleOff() {
	let ruleList = this;
	titleEl.style.display === 'block' ? (titleEl.style.display = 'none', ruleList.style.display = 'block') : (titleEl.style.display = 'block', ruleList.style.display = 'none')
}