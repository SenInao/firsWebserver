const { powerupWidth } = require("./constants");

class Powerup{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	};

	checkPlayerCollision(gameState) {
		for (let i = 0; i<gameState.players.length; i++) {
			if (this.x + powerupWidth > gameState.players[i].x && this.x - powerupWidth < gameState.players[i].x) {
				if (this.y + powerupWidth > gameState.players[i].y && this.y - powerupWidth < gameState.players[i].y){
					let index = gameState.powerups.indexOf(this);
					gameState.powerups.splice(index, 1)
					this.use(gameState.players[i]);
				};
			};
		};
	};
};

class Heal extends Powerup {
	constructor(x,y) {
		super(x,y);
		this.image = "images/blobshooter/heart.png";
	};

	use(player) {
		player.hp += 5;
		if (player.hp > 10) {
			player.hp = 10
		};
	};
};

module.exports = {Heal};
