var wallSize = 20;
var wallWidth = 4;
var height, width;
var maze = [];

function randomize() {
	for(let i = 0; i < width*height; i++) {
		maze[i] = [];
	}
	var stack = [0];
	var visited = {"0": true};
	while(stack.length > 0) {
		var cur = stack[stack.length-1];
		visited[cur] = true;
		var directions = [];
		
		var up = cur-width;
		var right = cur+1;
		var left = cur-1;
		var down = cur+width;
		
		// Pick only available adjacent cells
		if(up >= 0 && !visited[up])
			directions.push(up);
		if(right%width != 0 && !visited[right])
			directions.push(right);
		if(down < height*width && !visited[down])
			directions.push(down);
		if(left%width != width-1 && left >= 0 && !visited[left])
			directions.push(left);
		if(directions.length == 0)
			stack.pop();
		else {
			var dir = directions[Math.floor((Math.random() * directions.length))];
			stack.push(dir);
			maze[cur].push(dir);
			maze[dir].push(cur);
		}
	}
}

function generateMaze() {
	height = Number(document.getElementById("height").value);
	width = Number(document.getElementById("width").value);
	if(height < 1 || width < 1) {
		document.getElementById("maze").innerHTML = "Width and Height must at least be 1";
		return;
	}
	else
		document.getElementById("maze").innerHTML = "";
	randomize();
	gameArea.start();
}
var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = width * wallSize;
		this.canvas.height = height * wallSize;
		this.context = this.canvas.getContext("2d");
		document.getElementById("maze").insertBefore(this.canvas, document.getElementById("maze").firstChild);
		drawMaze();
	}
}

function drawMaze() {
	// Draw outer wall
	ctx = gameArea.context;
	ctx.fillStyle = "black";
	ctx.fillRect(wallSize, 0 - wallWidth/2, width * wallSize, wallWidth);
	ctx.fillRect(0 - wallWidth/2, 0, wallWidth, height * wallSize);
	ctx.fillRect(0, height*wallSize - wallWidth/2, (width-1) * wallSize, wallWidth);
	ctx.fillRect(width*wallSize - wallWidth/2, 0, wallWidth, height * wallSize);
	
	// Draw cell walls
	var cell = 0;
	for(let j = 0; j < height; j++) {
		for(let i = 0; i < width; i++) {
			if(i != width-1 && !maze[cell].includes(cell+1)) {
				ctx.fillRect((i+1)*wallSize - wallWidth/2, j*wallSize, wallWidth, wallSize);
			}
			if(j != height-1 && !maze[cell].includes(cell+width)) {
				ctx.fillRect(i*wallSize, (j+1)*wallSize - wallWidth/2, wallSize, wallWidth);
			}
			cell++;
		}
	}
}