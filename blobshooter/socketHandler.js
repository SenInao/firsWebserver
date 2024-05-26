const {borderWidth, width, height, blobradius} = require("./constants");
const { getRandomNumber, findPlayerIndex } = require("./utils");
const { Player } = require("./player");
const { Bullet } = require("./bullet");

function handler(io, gameState) {
	io.on('connection', (socket) => {
		socket.on("blobshooterPlayer", (player) => {
			console.log(`NEW PLAYER CONNECTED WITH ID: ${socket.id}`)
			var x = getRandomNumber(1 + blobradius + borderWidth, width-blobradius-borderWidth)
			var y = getRandomNumber(1 + blobradius + borderWidth, height-blobradius-borderWidth)
			var p = new Player(x, y, player.name, socket.id)
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

		socket.on("disconnect", (reason) => {
			let i = findPlayerIndex(socket.id, gameState);
			if (i === false) {
				return
			}
			gameState.players.splice(i, 1)
		})
	});
}

module.exports = handler
