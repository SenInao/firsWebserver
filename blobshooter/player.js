const {borderWidth, width, height, blobSpeed, blobradius} = require("./constants")

class blobPlayer{
	constructor(x,y, name, id) {
		this.radius = blobradius;
		this.x = x;
		this.y = y;
		this.xVel = 0;
		this.yVel = 0;
		this.name = name;
		this.id = id;
		this.mouseX = 0;
		this.mouseY = 0;
		
		this.hp = 10;
	}
	move() {
		if (this.x + this.xVel*blobSpeed <= blobradius/2 + borderWidth) {
			return
		} else if (this.x + this.xVel*blobSpeed >= width - blobradius/2 - borderWidth) {
			return
		} else if (this.y + this.yVel*blobSpeed <= blobradius + borderWidth/2) {
			return
		} else if (this.y + this.yVel*blobSpeed >= height - blobradius/2 - borderWidth) {
			return
		}
		this.x += this.xVel*blobSpeed;
		this.y += this.yVel*blobSpeed;
	}

	checkBulletCollision(gameState) {
		let bullets = gameState.bullets
		for (let i = 0; i<gameState.bullets.length; i++) {
			if (gameState.bullets[i].creator.id == this.id) {
				continue;
			}
			if (this.x + blobradius > gameState.bullets[i].x && this.x - blobradius < gameState.bullets[i].x) {
				if (this.y + blobradius > gameState.bullets[i].y && this.y - blobradius < gameState.bullets[i].y){
					this.hp -= 1;
					bullets.splice(i, 1)
				}
			}
		}
		gameState.bullets = bullets
	}

	isAlive() {
		return this.hp > 0
	}
}

module.exports = {blobPlayer}
