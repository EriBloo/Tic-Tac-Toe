const Player = function(symbol) {
	const _computer = false;
	const _name = `Player ${symbol}`;
	
	const getName = () => _name;
	const setName = () => _name = name;
	const getSymbol = () => symbol;
	const setComputer = () => _computer = !_computer;
	const isComputer = () => _computer;

	return {getName, setName, getSymbol, setComputer, isComputer}
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
	let _score = {"x": 0, "o": 0, "tie": 0};

	const getPlayer = (position) => _players[position];
	const nextPlayer = () => _currentPlayer = (_currentPlayer + 1) % 2;
	const getCurrentPlayer = () => _players[_currentPlayer];
	const getTile = (id) => _board[id];
	const getBoard = () => _board;
	const resetBoard = () => {
		_board = [Tile(0), Tile(1), Tile(2), Tile(3), Tile(4), Tile(5), Tile(6), Tile(7), Tile(8)];
		_players = [];
	}

	return {getPlayer, nextPlayer, getCurrentPlayer, getTile, getBoard, resetBoard}
})();

const Controller = (function () {
	const _tileEvents = (() => {
		for (let tile of Board.getBoard()) {
			tile.getTileElement().addEventListener("click",() => {
				if (!tile.getSymbol()) {
					tile.setSymbol(Board.getCurrentPlayer().getSymbol());
					Board.nextPlayer();
					_drawBoard();
				}
			})
		}
	})();

	const _drawBoard = () => {
		for (let tile of Board.getBoard()) {
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
})();
