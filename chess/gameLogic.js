const { Queen } = require("./pieces");
const { makeMove, isCheck, isCheckmateOrDraw, updateAllowedMoves, checkCollision } = require("./utils1");

function handlePackage(games, packet, id, io) {
	for (var i = 0; i < games.length; i++) {
		if (games[i].player1.id == id ) {
			updateGame(games[i].player1, games[i].player2, games[i], packet, io, games, i);
			break;
		} else if (games[i].player2.id == id) {
			updateGame(games[i].player2, games[i].player1, games[i], packet, io, games, i);
			break;
		};
	};

	return i;
};

function updateGame(player1, player2, game, packet, io, games, i) {
	let last = JSON.parse(JSON.stringify(game.pieces));

	for (let i = 0; i < game.pieces.length; i++) {
		let [_, piece] = checkCollision(game, packet.piece.x, packet.piece.y)
		let [a, collision] = checkCollision(game, packet.newX, packet.newY);

		for (let m = 0; m < piece.allowedMoves.length; m++) {
			if (piece.allowedMoves[m][0] === packet.newX && piece.allowedMoves[m][1] === packet.newY) {
				if (collision) {
					game.pieces.splice(a, 1)
				};

				piece.newX(packet.newX);
				piece.newY(packet.newY);

				game.stopTimer();
				game.startTimer(player2, io, games, i);
				player2.turn = true;
				player1.turn = false;
				game.lastPos = last;
				game.originalSquare = [packet.piece.x, packet.piece.y];
				game.newSquare = [packet.newX, packet.newY];

				updateAllowedMoves(game, player1.colour);
				return true;
			};
		};
	};

	return false;

	last = JSON.parse(JSON.stringify(game.pieces));
	let moveSuccess = makeMove(game, packet, player1);
	if (moveSuccess) {
		if (packet.piece.piece === "P" && packet.piece.type === "W" && packet.newY === 0) {
			let newPiece = new Queen(packet.newX, packet.newY, "white");
			game.pieces.push(newPiece);
		} else if (packet.piece.piece === "P" && packet.piece.type === "B" && packet.newY === 7) {
			let newPiece = new Queen(packet.newX, packet.newY, "black");
			game.pieces.push(newPiece);
		};

		game.stopTimer()
		game.startTimer(player2, io, games, i);

		player2.turn = true;
		player1.turn = false;
		game.lastPos = last;
		game.originalSquare = [packet.piece.x, packet.piece.y];
		game.newSquare = [packet.newX, packet.newY];

		updateAllowedMoves(game, player1.colour);
				
		player2.inCheck = isCheck(game, player2.colour);

		if (isCheckmateOrDraw(game, player2.colour)) {
			game.stopTimer;
			if (player2.inCheck) {
				player1.winner = true;
			} else {
				player1.winner = true;
				player2.winner = true;
			};
			player1.inGame = false;
			player2.inGame = false;
		};
	};
};

module.exports = {handlePackage};
