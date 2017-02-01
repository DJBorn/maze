var wallSize = 20;
var wallWidth = 4;
var height, width;
var maze = [];

function dfs_randomize() {
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

function kruskal_randomise() {
	var set = [];
	var walls = [];

	// Make a list of all walls and sets
	for(let i = 0; i < width*height; i++) {
		maze[i] = [];
		set[i] = i;
		if((i+1)%width != 0)			// right
			walls.push([i, i+1]);
		if(i+width < height*width)		// down
			walls.push([i, i+width]);
	}

	// Shuffle the walls
	for(let i = walls.length; i > 1; i--) {
		var index = Math.floor(Math.random() * i);
		var temp = walls[i-1];
		walls[i-1] = walls[index];
		walls[index] = temp;
	}

	// Start removing walls using kruskals algorithm
	while(walls.length > 0) {
		var wall = walls.pop();
		// If the wall combines two separate sets then remove it
		if(!(set[wall[0]] == set[wall[1]])) {
			var change = set[wall[0]];
			// Update the sets
			for(let i = 0; i < set.length; i++) {
				if(set[i] == change)
					set[i] = set[wall[1]];
			}
			maze[wall[0]].push(wall[1]);
			maze[wall[1]].push(wall[0]); 
		}
	}
}

function prim_randomize() {
	// Add first wall
	var walls = [[0, 1], [0, width]];
	var visited = [true];
	maze[0] = [];
	
	for(let i = 1; i < width*height; i++) {
		maze[i] = [];
		visited[i] = false;
	}
	
	while(walls.length > 0){
		// Pick a random wall inside the maze
		var next = Math.floor(Math.random() * walls.length);
		var visitedCell = null;
		var newCell = null;
		
		// Determine the cell thats part of the maze and the cell not part of the maze
		if(visited[walls[next][0]] && !visited[walls[next][1]]) {
			visitedCell = walls[next][0];
			newCell = walls[next][1];
		}
		else if(!visited[walls[next][0]] && visited[walls[next][1]]) {
			visitedCell = walls[next][1];
			newCell = walls[next][0];
		}
		
		// If the wall is separating a non maze and a maze cell, remove the wall and add the new cells walls
		if(visitedCell != null) {
			visited[newCell] = true;
			var up = newCell-width;
			var right = newCell+1;
			var left = newCell-1;
			var down = newCell+width;
			
			if(up >= 0 && up != visitedCell)
				walls.push([newCell, up]);
			if(right%width != 0 && right != visitedCell)
				walls.push([newCell, right]);
			if(down < height*width && down != visitedCell)
				walls.push([newCell, down]);
			if(left%width != width-1 && left >= 0 && left != visitedCell)
				walls.push([newCell, left]);
			maze[visitedCell].push(newCell);
			maze[newCell].push(visitedCell);
			visited[newCell] = true;
		}
		walls.splice(next, 1);
	}
}

function generateMaze(type) {
	height = Number(document.getElementById("height").value);
	width = Number(document.getElementById("width").value);
	if(height < 1 || width < 1) {
		document.getElementById("maze").innerHTML = "Width and Height must at least be 1";
		return;
	}
	else
		document.getElementById("maze").innerHTML = "";
	if(type == "kruskal")
		kruskal_randomise();
	else if(type == "dfs")
		dfs_randomize();
	else if(type == "prim")
		prim_randomize();
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