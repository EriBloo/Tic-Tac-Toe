const Player = function(symbol) {
	let _computer = false;
	let _name = `Player ${symbol}`;
	let _isComputerTurn = false;
	
	const getName = () => _name;
	const setName = (name) => _name = name;
	const getSymbol = () => symbol;
	const setComputer = () => {
		_computer = !_computer
	};
	const isComputer = () => _computer;
	const iscomputerTurn = () => _isComputerTurn;
	const computerTurn = (val) => _isComputerTurn = val;

	return {getName, setName, getSymbol, setComputer, isComputer, iscomputerTurn, computerTurn}
}

const Tile = function(id) {
	const _tileElement = document.querySelector(`.tile[data="${id}"]`);
	let _symbol = null;

	const getSymbol = () => _symbol;
	const setSymbol = (symbol) => _symbol = symbol;
	const getId = () => id;
	const getTileElement = () => _tileElement;

	return {getSymbol, setSymbol, getId, getTileElement}
}

const Board = (function() {
	let _board = [Tile(0), Tile(1), Tile(2), Tile(3), Tile(4), Tile(5), Tile(6), Tile(7), Tile(8)];
	let _players = [Player("x"), Player("o")];
	let _currentPlayer = 0;
	let _currentTurn = 1;
	let _winner = null;
	let _score = {"x": 0, "o": 0};

	const getPlayer = (position) => _players[position];
	const nextPlayer = () => _currentPlayer = (_currentPlayer + 1) % 2;
	const getCurrentPlayer = () => _players[_currentPlayer];
	const getTile = (id) => _board[id];
	const getBoard = () => _board;
	const getCurrentTurn = () => _currentTurn;
	const nextTurn = () => _currentTurn += 1;
	const setWinner = () => {
		_winner = getCurrentPlayer();
	}
	const getWinner = () => _winner;
	const isWinner = () => !!_winner;
	const getScore = () => _score;
	const addScore = () => _score[_winner.getSymbol()] += 1;
	const resetBoard = () => {
		_board = [Tile(0), Tile(1), Tile(2), Tile(3), Tile(4), Tile(5), Tile(6), Tile(7), Tile(8)];
		_currentTurn = 1;
		_winner = null;
	}

	return {getPlayer, nextPlayer, getCurrentPlayer, getTile, getBoard, getCurrentTurn, nextTurn, setWinner, getWinner, isWinner, getScore, addScore, resetBoard}
})();

const Controller = (function () {
	const _tileEvents = (() => {
		for (let tile of Board.getBoard()) {
			tile.getTileElement().addEventListener("click",() => {
				if (!tile.getSymbol() && !Board.getPlayer(1).iscomputerTurn() && !Board.isWinner()) {
					tile.setSymbol(Board.getCurrentPlayer().getSymbol());
					_drawBoard([tile]);
					
					const win = _checkForWinner();
					if (win) {
						_winEvents(win);
					}

					Board.nextPlayer();
					Board.nextTurn();

					if (Board.getPlayer(1).isComputer() && Board.getCurrentTurn() < 9 && !Board.isWinner()) {
						_computerTurn();
					}
				}
			})
		}
	})();

	const _toggleComputer = (() => document.querySelector(".toggle").addEventListener("click",(e) => {
		if (e.target.classList.contains("fa-toggle-off")) {
			e.target.classList.remove("fa-toggle-off");
			e.target.classList.add("fa-toggle-on");
		}
		else {
			e.target.classList.remove("fa-toggle-on");
			e.target.classList.add("fa-toggle-off");
		}
		Board.getPlayer(1).setComputer();
		
		if (Board.getCurrentPlayer().getSymbol() === "o" && Board.getCurrentTurn() < 9) {
			_computerTurn();
		}
	}))();

	const _updateName = (() => document.querySelectorAll(".input-name").forEach((i) => {
		addEventListener("keyup", () => {
			Board.getPlayer(i.getAttribute("data")).setName(i.value);
		})
	}))();
	
	const _drawBoard = (tiles = Board.getBoard()) => {
		for (let tile of tiles) {
			if (tile.getTileElement().childElementCount > 0) {
				tile.getTileElement().removeChild(tile.getTileElement().firstChild);
			}
			if (tile.getSymbol()) {
				const icon = document.createElement("i");
				if (tile.getSymbol() === "x") {
					icon.classList.add("fas");
					icon.classList.add("fa-times");
				}
				else {
					icon.classList.add("far");
					icon.classList.add("fa-circle");
				}
				tile.getTileElement().appendChild(icon);
			}
		}
	}

	const _computerTurn = () => {
		Board.getPlayer(1).computerTurn(true);
		let computerChoice;

		do {
			computerChoice = Math.floor(Math.random() * 9);
		} while (Board.getTile(computerChoice).getSymbol());

		Board.getTile(computerChoice).setSymbol(Board.getCurrentPlayer().getSymbol());

		const win = _checkForWinner();
		if (win) {
			_winEvents(win);
		}

		Board.nextPlayer();
		Board.nextTurn();
		_drawBoard([Board.getTile(computerChoice)]);
		Board.getPlayer(1).computerTurn(false);
	}

	const _checkForWinner = () => {
		const possibleWins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]];

		for (let possible of possibleWins) {
			const values = possible.map((p) => Board.getTile(p).getSymbol());

			if (values.every((v) => v) && (values[0] === values[1] && values[0] === values[2])) {
				return possible;
			}
			else if (Board.getCurrentTurn() === 9) {
				return "tie";
			}
		}
		return false;
	}

	const _winEvents = (win) => {
		Board.setWinner()
		const winner = document.querySelector(".winner");
		if (win === "tie") {
			_markWinningTiles(Board.getBoard());
			winner.textContent = "Tie!";
		}
		else {
			_markWinningTiles(win.map((t) => Board.getTile(t)));
			Board.addScore();
			winner.textContent = `${Board.getWinner().getName()} won!`
		}
		winner.classList.add("win-text");
		winner.addEventListener("transitionend", (e) => {
			e.target.classList.remove("win-text");
		})

		_updateScore()
	}

	const _markWinningTiles = (tiles) => {
		tiles.forEach((tile) => {
			tile.getTileElement().classList.add(("win"));
			tile.getTileElement().addEventListener("transitionend", _removeMark);
		})
	}

	const _removeMark = (e) => {
		if (e.propertyName !== "background-color") return;
		e.target.classList.remove("win");
	}

	const _updateScore = () => {
		const score = document.querySelector(".score");
		score.textContent = `${Board.getScore()["x"]} : ${Board.getScore()["o"]}`
	}
})();
