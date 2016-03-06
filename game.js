var MODE = "edit";
/* MODE is used for development. 
   "play" = normal; play game
   "edit" = edit levels and (in future) export level codes
   Alt key toggles MODE */


var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

var gridSize = 32,
	camX = 0,
	camY = 0;

var selectedTile = 1;

var pressedKeys = [];
var mx = 0, my = 0; // Mouse position relative to canvas

var images = [
	{
		name: "player",
		url: "img/player.png",
		solid: false
	},
	{
		name: "grass",
		url: "img/Ground/Grass/grass.png",
		solid: true
	},
	{
		name: "grassCenter",
		url: "img/Ground/Grass/grassCenter.png",
		solid: true
	},
	{
		name: "grassCenter_round",
		url: "img/Ground/Grass/grassCenter_round.png",
		solid: true
	},
	{
		name: "grassCliff_left",
		url: "img/Ground/Grass/grassCliff_left.png",
		solid: true
	},
	{
		name: "grassCliff_right",
		url: "img/Ground/Grass/grassCliff_right.png",
		solid: true
	},
	{
		name: "grassCenter",
		url: "img/Ground/Grass/grassCenter.png",
		solid: true
	},
	{
		name: "grassCliffAlt_left",
		url: "img/Ground/Grass/grassCliffAlt_left.png",
		solid: true
	},
	{
		name: "grassCliffAlt_right",
		url: "img/Ground/Grass/grassCliffAlt_right.png",
		solid: true
	},
	{
		name: "grassCorner_left",
		url: "img/Ground/Grass/grassCorner_left.png",
		solid: true
	},
	{
		name: "grassCorner_right",
		url: "img/Ground/Grass/grassCorner_right.png",
		solid: true
	},
	{
		name: "grassHalf",
		url: "img/Ground/Grass/grassHalf.png",
		solid: true
	},
	{
		name: "grassHalf_left",
		url: "img/Ground/Grass/grassHalf_left.png",
		solid: true
	},
	{
		name: "grassHalf_mid",
		url: "img/Ground/Grass/grassHalf_mid.png",
		solid: true
	},
	{
		name: "grassHalf_right",
		url: "img/Ground/Grass/grassHalf_right.png",
		solid: true
	},
	{
		name: "grassHill_left",
		url: "img/Ground/Grass/grassHill_left.png",
		solid: true
	},
	{
		name: "grassHill_right",
		url: "img/Ground/Grass/grassHill_right.png",
		solid: true
	},
	{
		name: "grassLeft",
		url: "img/Ground/Grass/grassLeft.png",
		solid: true
	},
	{
		name: "grassMid",
		url: "img/Ground/Grass/grassMid.png",
		solid: true
	},
	{
		name: "grassRight",
		url: "img/Ground/Grass/grassRight.png",
		solid: true
	}
];

var map = {
	grid: [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
			[1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1],
			[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		  ],
	initialPos: {
		x: 4,
		y: 5
	},
	initPlayerAndCam: function() {
		player.x = this.initialPos.x;
		player.y = this.initialPos.y;
		camX = this.initialPos.x * gridSize - canvas.width / 2;
		camY = this.initialPos.y * gridSize - canvas.height / 2;
	}
};

var game = {
	tick: function() {
		player.physics();
		game.render();
		if(MODE === "edit") {
			game.editExtras.action();
		}
		window.requestAnimationFrame(game.tick);
	},
	render: function() {

		function renderTile(id, x, y) {
			var tileObj = game.getTileObj(id);
			ctx.drawImage(tileObj.img, x * gridSize - camX, y * gridSize - camY, gridSize, gridSize);
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(x = Math.max(0, Math.floor(camX / gridSize)); x < Math.min(map.grid[0].length, (camX + canvas.width) / gridSize); x++) {
			for(y = Math.max(0, Math.floor(camY / gridSize)); y < Math.min(map.grid.length, (camY + canvas.height) / gridSize); y++) {
				if(map.grid[y][x] > 0) {
					renderTile(map.grid[y][x], x, y);
				}
			}
		}
		renderTile("player", player.x, player.y);
		if(MODE === "edit") {
			renderTile(selectedTile, Math.round((mx + camX) / gridSize - 0.5), Math.round((my + camY) / gridSize - 0.5));
		}
	},
	preload: function(callback) {
		var loadedCount = 0;
		for(i = 0; i < images.length; i++) {
			images[i].img = new Image();
			images[i].img.onload = function() {
				if(++loadedCount >= images.length) {
					callback();
				}
			}
			images[i].img.src = images[i].url;
		}
	},
	getTileObj: function(id) {
		var tileObj;
		if(id === parseInt(id, 10)) {
			tileObj = images[id];
		} else {
			for(i = 0; i < images.length; i++) {
				if(images[i].name === id) {
					tileObj = images[i];
				}
			}
		}

		if(tileObj === undefined) {
			console.log("Tile type not found. Passed id:" + id);
			return false;
		}

		return tileObj;
	},
	init: function() {
		canvas.width = 640;
		canvas.height = 480;
		canvas.onmousemove = function(e) {
			function getMousePos(canvas, evt) {
				var rect = canvas.getBoundingClientRect();
				return {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
				};
			}

			var mousePos = getMousePos(canvas, e);
			mx = Math.round(mousePos.x);
			my = Math.round(mousePos.y);
		};
		canvas.onmousedown = function(e) {
			e.preventDefault();
			if(MODE === "edit") {
				if(e.button === 0) {
					game.editExtras.placePiece(Math.round((mx + camX) / gridSize - 0.5), Math.round((my + camY) / gridSize - 0.5), selectedTile);
				} else {
					game.editExtras.placePiece(Math.round((mx + camX) / gridSize - 0.5), Math.round((my + camY) / gridSize - 0.5), 0);
				}
			}
		};
		game.preload(function(){
			map.initPlayerAndCam();
			(function setKeyEvents(){
				window.onkeydown = function(e) {
					e.preventDefault();
					if(e.keyCode === 18) {
						if(MODE === "edit") {
							MODE = "play";
						} else {
							MODE = "edit";
						}
						return;
					}
					if(pressedKeys.indexOf(e.keyCode) === -1) {
						pressedKeys.push(e.keyCode);
					}
				}

				window.onkeyup = function(e) {
					while(pressedKeys.indexOf(e.keyCode) > -1) {
						pressedKeys.splice(pressedKeys.indexOf(e.keyCode), 1);
					}
				}
			})();
			window.requestAnimationFrame(game.tick);
		});
	},
	editExtras: {
		frameCount: 0,
		action: function() {
			if(game.editExtras.frameCount < 1) {
				if(pressedKeys.indexOf(81) > -1) {
					selectedTile--;
					if(selectedTile < 1) {
						selectedTile = images.length - 1;
					}
					game.editExtras.frameCount = 5;
				}
				if(pressedKeys.indexOf(69) > -1) {
					selectedTile++;
					if(selectedTile > images.length - 1) {
						selectedTile = 1;
					}
					game.editExtras.frameCount = 5;
				}
			} else {
				game.editExtras.frameCount--;
			}
		},
		placePiece: function(x, y, type) {
			// Increase array size if attempting to place out of bounds
			if(y < 0) {
				var insert = [];
				for(i = 0; i < map.grid[0].length; i++) {
					insert[i] = 0;
				}
				for(i = 0; i < Math.abs(y); i++) {
					map.grid.splice(0, 0, JSON.parse(JSON.stringify(insert)));
				}
				player.y += Math.abs(y);
				camY += Math.abs(y) * gridSize;
			}
			if(y >= map.grid.length) {
				var insert = [];
				for(i = 0; i < map.grid[0].length; i++) {
					insert[i] = 0;
				}
				for(i = 0; i < Math.abs(y); i++) {
					map.grid.push(JSON.parse(JSON.stringify(insert)));
				}
			}
			if(x < 0) {
				for(i = 0; i < map.grid.length; i++) {
					for(n = 0; n < Math.abs(x); n++) {
						map.grid[i].splice(0, 0, 0);
					}
				}
				player.x += Math.abs(x);
				camX += Math.abs(x) * gridSize;
			}
			if(x > map.grid[0].length) {
				for(i = 0; i < map.grid.length; i++) {
					for(n = 0; n < Math.abs(x); n++) {
						map.grid[i].push(0);
					}
				}
			}

			map.grid[Math.max(0, y)][Math.max(0, x)] = type;
		}
	}
};

var player = {
		x: 0,
		y: 0,
		xVel: 0,
		yVel: 0,
		physics: function() {

			function keyPressed(key) {
				switch(key) {
					case "up":
						return pressedKeys.indexOf(38) > -1 || pressedKeys.indexOf(87) > -1;
						break;
					case "down":
						return pressedKeys.indexOf(40) > -1 || pressedKeys.indexOf(83) > -1;
						break;
					case "left":
						return pressedKeys.indexOf(37) > -1 || pressedKeys.indexOf(65) > -1;
						break;
					case "right":
						return pressedKeys.indexOf(39) > -1 || pressedKeys.indexOf(68) > -1;
						break;
					default:
						return false;
						break;
				}
			}


			if(MODE === "edit") {
				var camSpeed = 0.3;
				if(keyPressed("right")) {
					camX += camSpeed * gridSize;
				}
				if(keyPressed("left")) {
					camX -= camSpeed * gridSize;
				}
				if(keyPressed("up")) {
					camY -= camSpeed * gridSize;
				}
				if(keyPressed("down")) {
					camY += camSpeed * gridSize;
				}
				return;
			}

			function solidAt(x, y) {
				function blockIsSolid(intX, intY) {
					// Just in case
					intX = Math.round(intX);
					intY = Math.round(intY);

					if(intX < 0 || intX > map.grid[0].length || intY < 0 || intY > map.grid.length - 1) {
						return false;
					}
					return game.getTileObj(map.grid[intY][intX]).solid;
				}

				// We assume that either the x or the y will be a whole number. Slightly dangerous...
				if(x !== Math.round(x)) {
					return blockIsSolid(Math.floor(x), y) || blockIsSolid(Math.ceil(x), y);
				}
				if(y !== Math.round(y)) {
					return blockIsSolid(x, Math.floor(y)) || blockIsSolid(x, Math.ceil(y));
				}
				return blockIsSolid(x, y);
			}

			if(keyPressed("right")) {
				player.xVel += 0.03;
			}
			if(keyPressed("left")) {
				player.xVel -= 0.03;
			}
			player.x += player.xVel;
			if(solidAt(Math.ceil(player.x), player.y)) {
				player.x = Math.floor(player.x);
				player.xVel = 0;
			}
			if(solidAt(Math.floor(player.x), player.y)) {
				player.x = Math.ceil(player.x);
				player.xVel = 0;
			}
			player.yVel += 0.03;
			player.y += player.yVel;
			if(solidAt(player.x, Math.ceil(player.y))) {

				player.y = Math.floor(player.y);
				if(keyPressed("up")) {
					player.yVel = -0.5;
				} else {
					player.yVel = 0;
				}

			}
			if(solidAt(player.x, Math.floor(player.y))) {
				player.y = Math.ceil(player.y);
				player.yVel = 0;
			}
			player.xVel *= 0.9;
			player.yVel *= 0.98;

			camX += (player.x * gridSize - canvas.width / 2 - camX) * 0.25;
			camY += (player.y * gridSize - canvas.height / 2 - camY) * 0.25;

			if (player.x < -25 ||
				player.y < -25 ||
				player.x > map.grid[0].length + 25 ||
				player.y > map.grid.length + 25) {

				player.x = map.initialPos.x;
				player.y = map.initialPos.y;
				player.xVel = 0;
				player.yVel = 0;
				camX = player.x * gridSize - canvas.width / 2;
				camY = player.y * gridSize - canvas.height / 2;
			}
		}
	}

window.onload = game.init;