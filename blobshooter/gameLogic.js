const { totalPowerups, width, height, borderWidth, powerupWidth } = require("./constants");
const { Heal } = require("./powerups");
const { getRandomNumber } = require("./utils");
const powerupModels = [Heal]

function updatePlayers(gameState, io) {
	let players = [...gameState.players];
	for (let i = 0; i<gameState.players.length; i++) {
		if (!gameState.players[i].isAlive()) {
			io.emit("playerDeath", gameState.players[i]);
			players.splice(i, 1);
			continue;
		};
		gameState.players[i].move();
		gameState.players[i].checkBulletCollision(gameState);
	};
	gameState.players = players;
};

function updateBullets(gameState) {
	var bullets = [...gameState.bullets];
	for (let i = 0; i<gameState.bullets.length; i++) {
		let hasHitWall = gameState.bullets[i].move();
		if (hasHitWall) {
			bullets.splice(i, 1);
		};
	};
	gameState.bullets = bullets;
};

function updatePowerups(gameState) {
	let powerupsToCreate = totalPowerups - gameState.powerups.length;

	for (let i = 0; i < powerupsToCreate; i++) {
		let x = getRandomNumber(1 + powerupWidth + borderWidth, width - borderWidth - powerupWidth - 1);
		let y = getRandomNumber(1 + powerupWidth + borderWidth, height - borderWidth - powerupWidth - 1);

		let index = getRandomNumber(0, powerupModels.length);
		let powerup = new powerupModels[index](x, y);

		gameState.powerups.push(powerup);
	};

	for (let i = 0; i<gameState.powerups.length; i++) {
		gameState.powerups[i].checkPlayerCollision(gameState);
	};
};

module.exports = {updateBullets, updatePlayers, updatePowerups};
