const player = function(value) {
	let _computer = false;

	const setComputer = () => {
		_computer = !_computer;
	}
	const isComputer = () => _computer;
	const getValue = () => value;

	return {getValue, setComputer, isComputer};
}

const gameBoard = (function() {
	let _board = [...new Array(9)];
	const _players = [player("x"), player("o")];
	let _currentTurn = 0;
	let _winner = null;

	return {
		getTile(tile) {
			return _board[tile];
		},
		setTile(tile, value) {
			_board[tile] = value;
		},
		nextTurn() {
			_currentTurn += 1;
			_currentTurn %= 2;
		},
		getCurrentPlayer() {
			return _players[_currentTurn];
		},
		getWinner() {
			return _winner;
		},
		setWinner(player = _players[_currentTurn]) {
			_winner = player;
		},
		resetBoard() {
			_board = [...new Array(9)];
			_currentTurn = 0;
			_winner = null;
			clearBoard();
		}
	}
})();

const scoreBoard = (function() {
	const _score = {"x": 0, "o": 0, "tie": 0}

	return {
		addScore(winner) {
			_score[winner] += 1;
		}
	}
})();

const setEvents = (function() {
	const _tiles = document.querySelectorAll(".tile");
	_tiles.forEach(function(tile) {
		tile.addEventListener("click", drawMove);
	});
})();

function drawMove(e) {
	const tile = e.target;

	if (!gameBoard.getTile(tile.getAttribute("data")) && !gameBoard.getWinner()) {
		const icon = document.createElement("i");

		if (gameBoard.getCurrentPlayer().getValue() === "x") {
			icon.classList.add("fas");
			icon.classList.add("fa-times");
		}
		else if (gameBoard.getCurrentPlayer().getValue() === "o") {
			icon.classList.add("far");
			icon.classList.add("fa-circle");
		}

		tile.appendChild(icon);
		gameBoard.setTile(tile.getAttribute("data"), gameBoard.getCurrentPlayer().getValue());
		
		const win = checkForWin();
		if (win) {
			markWinningTiles(win);
			if (gameBoard.getWinner()) {
				scoreBoard.addScore((gameBoard.getWinner().getValue()));
			}
			else {
				scoreBoard.addScore((gameBoard.getWinner()))
			}
			setTimeout(gameBoard.resetBoard, 3000);
		}

		gameBoard.nextTurn();
	}
}

function markWinningTiles(tileNumber) {
	const tiles = tileNumber.map(function(t) {return document.querySelector(`.tile[data="${t}"]`)})

	tiles.forEach(function(tile) {
		tile.classList.add("win");
		tile.addEventListener("transitionend", removeMark)});
}

function removeMark(e) {
	if (e.propertyName !== "background-color") return;
	e.target.classList.remove("win");
}

function checkForWin() {
	const possibleWins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]];

	for (let possible of possibleWins) {
		const values = possible.map(function(p) {return gameBoard.getTile(p)});
		
		if (values.every(function(v) {return v}) && (values[0] === values[1] && values[0] === values[2])) {
			gameBoard.setWinner();
			return possible;
		}
	}
	if ([0, 1, 2, 3, 4, 5, 6, 7, 8]
		.map(function(t) {return gameBoard.getTile(t)})
		.every(function(t) {return t})) {
			return [0, 1, 2, 3, 4, 5, 6, 7, 8]
		}
	return false;
}

function clearBoard() {
	const tiles = document.querySelectorAll(".tile");

	tiles.forEach(function(tile) {
		if (tile.firstChild) {
			tile.removeChild(tile.firstChild);
		}
	});
}