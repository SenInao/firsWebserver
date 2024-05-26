const width = 680;
const height = 680;
const timer = 0.15;
let snake;
let fruit;

class Snake {
	constructor() {
		this.width = 40;
		this.height = 40;
		this.headPos = [(width/2)-(this.width/2), (height/2)-(this.height/2)];
		this.body = [];
		this.xVel = 0;
		this.yVel = 0;
	}

	draw(ctx) {
		ctx.fillStyle = 'green';
		ctx.fillRect(this.headPos[0], this.headPos[1], this.width, this.height);
		for (let i = 0; i < this.body.length; i++) {
			ctx.fillRect(this.body[i][0], this.body[i][1], this.width, this.height);
		}
	}

	move() {
		const newHeadPos = [...this.headPos];

		newHeadPos[0] += this.xVel * this.width;
		newHeadPos[1] += this.yVel * this.height;

	    if (this.body.length > 0) {
		   this.body.pop();
			this.body.unshift([...this.headPos]);
		}

		this.headPos = newHeadPos;
	}

}

class Fruit {
	constructor() {
		this.width = 40;
		this.height = 40;
		this.randomPos();
	}

	randomPos() {
		while (true) {
			var xPos = Math.round(Math.random() * ((width-40)/this.width));
			var yPos = Math.round(Math.random() * ((height-40)/this.height));

			for (let i = 0; i < snake.body.length; i++) {
				if (snake.body[i][0] == xPos && snake.body[i][1] == yPos) {
					continue;
				}
			}
			break;
		}
		this.pos = [xPos*40, yPos*40];
	}

	draw(ctx) {
		ctx.fillStyle = 'red';
		ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
	}
}


function draw(ctx, snake) {
	ctx.clearRect(0, 0, width, height);

	ctx.fillStyle = 'lightgreen';
	ctx.fillRect(0,0, width, height);

	fruit.draw(ctx);
	snake.draw(ctx);
}


function checkCollision() {
	if (snake.headPos[0] === fruit.pos[0] && snake.headPos[1] === fruit.pos[1]) {
		snake.body.push( [...snake.headPos]);
		console.log(snake.body);
		fruit.randomPos();

	} else if (snake.headPos[0] >= width || snake.headPos[0] <  0 || snake.headPos[1] >= height || snake.headPos[1] < 0 ) {
		reset();

	} else {
		for (let i = 0; i < snake.body.length; i++) {
			if (snake.body[i][0] === snake.headPos[0] && snake.body[i][1] === snake.headPos[1]) {
				reset();
			}
		}
	}
	
}

function reset() {
	snake = new Snake();
	fruit = new Fruit();
}

async function gameLoop(ctx, scoreCounter) {

	snake = new Snake();
	fruit = new Fruit();

	let alive = true;

	draw(ctx, snake);
	while (alive) {
		scoreCounter.innerHTML = snake.body.length.toString();


		snake.move();
		checkCollision();

		draw(ctx, snake);

		await new Promise((resolve) => setTimeout(resolve, timer*1000));
	}
}

window.onload = function () {
	var canvas = document.getElementById('canvas-1');
	var scoreCounter = document.getElementById('scoreCount');

	var ctx = canvas.getContext('2d');
	ctx.canvas.width = width;
	ctx.canvas.height = height;

	gameLoop(ctx, scoreCounter)
}

document.addEventListener('keydown', function(event) {
	switch (event.key) {
		case 'ArrowUp':
			if (snake.yVel != 1) {
				snake.yVel = -1;
				snake.xVel = 0;
			}
			break;
		case 'ArrowDown':
			if  (snake.yVel != -1) {
				snake.yVel = 1;
				snake.xVel = 0;
			}
			break;
		case 'ArrowLeft':
			if (snake.xVel != 1) {
				snake.yVel = 0;
				snake.xVel = -1; 
			}
			break;
		case 'ArrowRight':
			if (snake.xVel != -1) {
				snake.yVel = 0;
				snake.xVel = 1;
			}
			break;
	}
});
