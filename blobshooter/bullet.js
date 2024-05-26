const {bulletSpeed, bulletRadius, borderWidth, width, height, blobSpeed} = require("./constants")

class Bullet{
	constructor(player) {
		this.creator = player
		this.xVel = player.xVel
		this.yVel = player.yVel
		this.x = player.x;
		this.y = player.y;
		this.xDir = player.mouseX - this.x;
		this.yDir = player.mouseY - this.y;
		let length = Math.sqrt(this.yDir*this.yDir + this.xDir*this.xDir);
		this.dx = this.xDir/length;
		this.dy = this.yDir/length;
		this.x += this.dx*30
		this.y += this.dy*30
	}

	move() {
		if (this.x + this.dx*bulletSpeed <= bulletRadius + borderWidth) {
			return true
		} else if (this.x + this.dx*bulletRadius >= width - bulletRadius - borderWidth) {
			return true
		} else if (this.y + this.dy*bulletRadius <= bulletRadius + borderWidth) {
			return true
		} else if (this.y + this.dy*bulletRadius >= height - bulletRadius - borderWidth) {
			return true
		}
		this.x += this.dx*bulletSpeed + this.xVel*blobSpeed;
		this.y += this.dy*bulletSpeed + this.yVel*blobSpeed;
		return false
	}
}

module.exports = {Bullet}
