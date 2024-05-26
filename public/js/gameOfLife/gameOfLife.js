let width = 800;
let cellwidth = 10;
let timer = 0;
let cells = [];
let run = false

class Cell {
	constructor(xPos, yPos, alive, x, y) {
		this.index = cells.length
		this.xPos = xPos;
		this.yPos = yPos;
		this.x = x;
		this.y = y;
		this.alive = alive;
		this.nextAlive;
		this.neighbours = [];
	}

	draw(ctx) {
		if (this.alive) {
			ctx.fillRect(this.xPos, this.yPos, cellwidth, cellwidth);
		}
	}

	findNeighbour() {
		var incr = Math.floor(width/cellwidth);
		var differs = [-1, 0, 1];

		for (let x = 0; x < differs.length; x++) {
			for (let y = 0; y < differs.length; y++) {

				var nx = this.x + differs[x]
				var ny = this.y + differs[y]

				if (((0 <= nx) && (nx < incr)) && ((0 <= ny) && (ny < incr))) {
					if (cells[nx*incr + ny] === this) {
						continue;
					}
					this.neighbours.push(cells[nx * incr + ny])
				}

			}
		}
	}

	checkNext() {
		var aliveNeighbours = 0
		for (let i = 0; i < this.neighbours.length; i++) {
			if (this.neighbours[i].alive) {
				aliveNeighbours += 1;
			}
		}


		if (this.alive) {
			if ([2,3].includes(aliveNeighbours)) {
				this.nextAlive = 1;
			} else {
				this.nextAlive = 0;
			}
		} else {
			if (aliveNeighbours == 3) {
				this.nextAlive = 1;
			} else {
				this.nextAlive = 0;
			}
		}
	}

	update() {
		this.alive = this.nextAlive
	}
}

function createCells() {
	for (let x = 0; x < width/cellwidth; x++) {
		for (let y = 0; y < width/cellwidth; y++) {
			var alive = Math.round(Math.random())
			var cell = new Cell(x * cellwidth,y * cellwidth, alive, x, y);
			cells.push(cell);
		}
	}
}

function drawCells(ctx) {
	for (let i = 0; i < cells.length; i++) {
		ctx.fillStyle = "white";
		cells[i].draw(ctx);
	}
}

function draw(ctx) {
	ctx.clearRect(0, 0, width, width);
	drawCells(ctx);
}

async function gameLoop(ctx) {
	createCells()
	for (let i = 0; i < cells.length; i++) {
		cells[i].findNeighbour()
	}

	run = true

	while (true) {
		if (run) {
			draw(ctx)
			for (let i = 0; i < cells.length; i++) {
				cells[i].checkNext()
			}

			for (let i = 0; i < cells.length; i++) {
				cells[i].update()
			}
		}

		await new Promise((resolve) => setTimeout(resolve, timer*1000));
	}
}


window.onload = function () {
	var canvas = document.getElementById('canvas-1');

	let timerSlider = document.getElementById("timer");
	let widthSlider = document.getElementById("width");
	let cellwidthSlider = document.getElementById("cellwidth");
	let timerDisplay = document.getElementById("timerDisplay")
	let widthDisplay = document.getElementById("widthDisplay")
	let cellwidthDisplay = document.getElementById("cellwidthDisplay")
	let start = document.getElementById("start")
	let stop = document.getElementById("stop")
	let reset = document.getElementById("reset")

	timerDisplay.innerHTML = timerSlider.value
	widthDisplay.innerHTML = widthSlider.value
	cellwidthDisplay.innerHTML = cellwidthSlider.value


	start.onclick = function(){
		run = true;
	}

	stop.onclick = function(){
		run = false;
	}

	reset.onclick = function( ){
		ctx.clearRect(0,0, width, width)
		width = widthSlider.value
		canvas.width = widthSlider.value
		canvas.height = widthSlider.value
		cellwidth = cellwidthSlider.value
		cells = []
		gameLoop(ctx);
	}

	timerSlider.oninput = function() {
		timerDisplay.innerHTML = timerSlider.value
		timer = timerSlider.value
	}
	widthSlider.oninput = function() {
		widthDisplay.innerHTML = widthSlider.value
	}
	cellwidthSlider.oninput = function() {
		cellwidthDisplay.innerHTML = cellwidthSlider.value
	}


	var ctx = canvas.getContext('2d');
	ctx.canvas.width = width;
	ctx.canvas.height = width;

	gameLoop(ctx)
}



