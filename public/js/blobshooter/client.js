const socket = io();
var canvas;
var button;
var nameInput;
var mouseX;
var mouseY;
var ctx;
var mouseEvent;
const timer = 0;
const width = 3000;
const height = 1500;
const windowBorderWidth = width/2 + window.innerWidth/2
const windowBorderHeight = height/2 + window.innerHeight/2
const blobSpeed = 1.5;
const blobRadius = 15;
const bulletRadius = 5;
var bgImage = new Image();
bgImage.src = "images/blobshooter/rutenett.png"

var keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

var game = {
	players: [],
	bullets: [],
	powerups: []
};

var player = {
	id: "Sen",
	name: "",
	xVel: 0,
	yVel: 0,
	mouseY:0,
	mouseX:0,
	x: 0,
	y: 0,
	xOffset: 0,
	yOffset: 0,
	alive: true
}

function findPlayerIndex(id) {
	for (let i = 0; i<game.players.length; i++) {
		if (game.players[i].id == id) {
			return i
		}
	}
	return false
}

function drawPowerup(ctx, powerup) {
	let img = new Image();
	img.src = powerup.image;
	ctx.beginPath();
	ctx.drawImage(img,powerup.x + player.xOffset, powerup.y + player.yOffset);
};

function drawBullet(ctx, bullet){
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.arc(bullet.x+player.xOffset, bullet.y+player.yOffset, bulletRadius, 0, Math.PI * 2);
	ctx.fill();
};

function drawPlayer(ctx, p) {
	ctx.beginPath();
	ctx.fillStyle = 'purple';
	ctx.arc(p.x+player.xOffset, p.y+player.yOffset, blobRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.arc(p.x+player.xOffset, p.y+player.yOffset, blobRadius+0.1, 0, Math.PI * 2);
	ctx.stroke()

	ctx.font = "20px serif";
	for (let i = 0; i<10; i++) {
		ctx.beginPath();
		if (i < p.hp) {
			ctx.fillStyle = "green"
		} else {
			ctx.fillStyle = "red"
		}
		ctx.rect(p.x + player.xOffset - 5*6 + i*5 + i, p.y + player.yOffset - blobRadius*2 , 5, 10)
		ctx.fill()
	}

	ctx.beginPath();
	ctx.fillStyle = "black"
	let offset = 5 * p.name.length
	ctx.fillText(p.name, p.x+player.xOffset - offset, p.y+player.yOffset - blobRadius*2.5)
}

function draw(ctx, blob) {
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(bgImage,-player.x+width/2, -player.y+height/2);

	for (let i = 0; i<game.players.length; i++) {
		if (game.players[i].x + player.xOffset > windowBorderWidth || game.players[i].y+player.yOffset > windowBorderHeight || game.players[i].x+player.xOffset < windowBorderWidth-window.innerWidth || game.players[i].y + player.yOffset < windowBorderHeight - window.innerHeight) {
			continue;
		};
		drawPlayer(ctx, game.players[i]);
	};
	for (let i = 0; i<game.bullets.length; i++) {
		if (game.bullets[i].x + player.xOffset > windowBorderWidth || game.bullets[i].y+player.yOffset > windowBorderHeight || game.bullets[i].x+player.xOffset < windowBorderWidth-window.innerWidth || game.bullets[i].y + player.yOffset < windowBorderHeight - window.innerHeight) {
			continue;
		};
		drawBullet(ctx, game.bullets[i]);
	};

	for (let i = 0; i<game.powerups.length; i++) {
		if (game.powerups[i].x + player.xOffset > windowBorderWidth || game.powerups[i].y+player.yOffset > windowBorderHeight || game.powerups[i].x+player.xOffset < windowBorderWidth-window.innerWidth || game.powerups[i].y + player.yOffset < windowBorderHeight - window.innerHeight) {
			continue;
		};
		drawPowerup(ctx, game.powerups[i])
	};

	let vectorX = player.mouseX - player.x;
	let vectorY = player.mouseY - player.y;

	let x1 = player.mouseX;
	let x2 = player.x;
	let y1 = player.mouseY;
	let y2 = player.y;
	let k = 30 * (Math.sqrt(x2*x2 - 2*x2*x1 + y2*y2 - 2*y2*y1 + x1*x1 + y1*y1)/(x2*x2 - 2*x2*x1 + y2*y2 - 2*y2*y1 + x1*x1 + y1*y1));

	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.rect(player.x + player.xOffset + vectorX*k - blobRadius/2 + 5, player.y + player.yOffset + vectorY*k - blobRadius/2 + 5, 10,10);
	ctx.fill();
}

function checkMovement() {
	if (keys.a && keys.d) {
		player.xVel = 0;
	} else if (keys.a) {
		player.xVel = -1;
	} else if (keys.d) {
		player.xVel = 1;
	} else {
		player.xVel = 0;
	};

	if (keys.s && keys.w) {
		player.yVel = 0;
	} else if (keys.s) {
		player.yVel = 1;
	} else if (keys.w) {
		player.yVel = -1;
	} else {
		player.yVel = 0;
	};
};

async function gameLoop(ctx) {

	while (player.alive) {
		if (mouseEvent) {
			player.mouseX = mouseEvent.clientX - canvas.offsetLeft - player.xOffset;
			player.mouseY = mouseEvent.clientY - canvas.offsetTop - player.yOffset;
		};

		checkMovement();
		socket.emit("playerUpdate", player);

		draw(ctx, timer);
		await new Promise((resolve) => setTimeout(resolve, timer*1000));
	};

	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = "red";
	ctx.font = "50px serif";
	ctx.fillText("YOU DIED", player.x + player.xOffset - 100, player.y + player.yOffset);
	ctx.font = "20px serif";
	ctx.fillText("refresh to respawn", player.x + player.xOffset - 55, player.y + player.yOffset + 50);
};

socket.on("gameState", (gameState) => {
	game = gameState
	let i = findPlayerIndex(player.id)
	if (i === false) {
		return
	}
	player.x = game.players[i].x
	player.y = game.players[i].y
	player.xOffset = (width/2) - player.x;
	player.yOffset = (height/2) - player.y;
})

socket.on("playerDeath", (p) => {
	console.log("death")
	if (p.id == player.id) {
		player.alive = false
	}
})

socket.on("id", (id) => {
	player.id = id
	console.log(id)
})


function buttonClicked() {
	player.name = nameInput.value;
	document.getElementsByTagName("nav")[0].remove();
	document.getElementsByClassName("usernameInput")[0].remove();

	socket.emit("blobshooterPlayer", player);
	
	canvas.style.left = (window.innerWidth/2)-(width/2) + "px";
	canvas.style.top = (window.innerHeight/2)-(height/2) + "px";
	canvas.width = width
	canvas.height = height
	gameLoop(ctx);
}

window.onload = function () {
	document.body.style.overflow = "hidden";
	canvas = document.getElementById('canvas');
	nameInput = document.getElementById("name");
	button = document.getElementById("button");

	ctx = canvas.getContext('2d');
	canvas.style.position = "absolute"
	canvas.style.left = (window.innerWidth/2) + "px";
	canvas.style.top = (window.innerHeight/2) + "px";
	canvas.width = 0;
	canvas.height = 0;
}

document.addEventListener('keydown', function(event) {
	if (event.key in keys) {
        keys[event.key] = true;
    }
	if (event.key == " " && player.alive) {
		socket.emit("shoot", player);
	}
});

document.addEventListener('keyup', function(event) {
	if (event.key in keys) {
        keys[event.key] = false;
    }
});

document.addEventListener('mousemove', (event) => {
	mouseEvent = event
	player.mouseX = event.clientX - canvas.offsetLeft - player.xOffset;
	player.mouseY = event.clientY - canvas.offsetTop - player.yOffset;
});
