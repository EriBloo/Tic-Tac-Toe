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
	const _board = [...new Array(9)];
	const _players = [player("x"), player("o")];
	let _currentTurn = 0;

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
		}
	}
})();

const setEvents = (function() {
	const _tiles = document.querySelectorAll(".tile");
	_tiles.forEach(function(tile) {
		tile.addEventListener("click", drawMove);
	})
})();

function drawMove(e) {
	const tile = e.target;
	console.log(tile.getAttribute("data"))
	if (!gameBoard.getTile(tile.getAttribute("data"))) {
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
		gameBoard.nextTurn();
	}
}
