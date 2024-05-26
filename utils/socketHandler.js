const {borderWidth, width, height, blobradius} = require("../blobshooter/constants");
const { getRandomNumber, findPlayerIndex } = require("../blobshooter/utils");
const { blobPlayer } = require("../blobshooter/player");
const { Bullet } = require("../blobshooter/bullet");
const { chessPlayer } = require("../chess/Player");
const { handlePackage } = require("../chess/gameLogic");
const CD = require("lodash");

function handler(io, gameState, chessPlayers, chessGames) {
	io.on('connection', (socket) => {
		socket.on("blobshooterPlayer", (player) => {
			console.log(`NEW PLAYER CONNECTED WITH ID: ${socket.id}`)
			var x = getRandomNumber(1 + blobradius + borderWidth, width-blobradius-borderWidth)
			var y = getRandomNumber(1 + blobradius + borderWidth, height-blobradius-borderWidth)
			var p = new blobPlayer(x, y, player.name, socket.id)
			gameState.players.push(p)

			socket.emit("id", socket.id)
		});
	
		socket.on("playerUpdate", (player) => {
			let i = findPlayerIndex(socket.id, gameState);
			if (i === false) {
				return
			}
			gameState.players[i].xVel = player.xVel
			gameState.players[i].yVel = player.yVel
		});

		socket.on("shoot", (player) => {
			let i = findPlayerIndex(socket.id, gameState);
			if (i === false) {
				return
			}
			gameState.players[i].mouseX = player.mouseX
			gameState.players[i].mouseY = player.mouseY
			var b = new Bullet(gameState.players[i])
			gameState.bullets.push(b)
		});

		socket.on("chessPlayer", (player) => {
			console.log("New player connected");
			let newPlayer = new chessPlayer(player.name, socket.id);
			chessPlayers.push(newPlayer);
			socket.emit("id", socket.id);
		});

		socket.on("chessReady", (packet) => {
			for (let player = 0; player < chessPlayers.length; player++) {
				if (chessPlayers[player].id === socket.id) {
					chessPlayers[player].name = packet.name;
					chessPlayers[player].queue = packet.queue;
				};
			};
		});

		socket.on("chessMove", (packet) => {
			let i = handlePackage(chessGames, packet, socket.id, io);
			var gameData = CD.cloneDeep(chessGames[i]);
			if (gameData.timerId) {
				delete gameData.timerId;
			};
			io.emit("gameUpdate",gameData) 
			if (chessGames[i].player1.winner || chessGames[i].player2.winner) {
				chessGames[i].player1.winner = false;
				chessGames[i].player2.winner = false;
				chessGames.splice(i, 1);
			};
		});

		socket.on("disconnect", (reason) => {
			console.log("Player disconnected");
			for (var game = 0; game < chessGames.length; game++) {
				if (chessGames[game].player1.id === socket.id) {
					disconnectPlayer(io, chessGames[game].player2, chessGames[game]);
					chessGames.splice(game, 1);
					break;
				} else if (chessGames[game].player2.id === socket.id) {
					disconnectPlayer(io, chessGames[game].player1, chessGames[game]);
					chessGames.splice(game, 1);
					break;
				};
			};

			for (let p = 0; p < chessPlayers.length; p++) {
				if (chessPlayers[p].id === socket.id) {
					chessPlayers.splice(p, 1);
					return;
				};
			};

			let i = findPlayerIndex(socket.id, gameState);
			if (i === false) {
				return
			}
			gameState.players.splice(i, 1)
		})
	});
};

function disconnectPlayer(io, player, game) {
	player.winner = true;
	player.inGame = false;
	game.stopTimer()
	io.emit("gameUpdate", game);
	player.winner = false;
};

module.exports = handler
