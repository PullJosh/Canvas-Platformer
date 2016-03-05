var MODE = "edit";
/* MODE is used for development. 
   "play" = normal; play game
   "edit" = edit levels and export level codes
   F7 key toggles MODE */


var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

var gridSize = 32,
	camX = 0,
	camY = 0;

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
			renderTile("player", Math.round((mx + camX) / gridSize - 0.5), Math.round((my + camY) / gridSize - 0.5));
			console.log();
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
		game.preload(function(){
			map.initPlayerAndCam();
			(function setKeyEvents(){
				window.onkeydown = function(e) {
					e.preventDefault();
					if(e.keyCode === 118) {
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
				// We assume that either the x or the y will be a whole number. Slightly dangerous...
				if(x !== Math.round(x)) {
					return game.getTileObj(map.grid[y][Math.floor(x)]).solid || game.getTileObj(map.grid[y][Math.ceil(x)]).solid;
				}
				if(y !== Math.round(y)) {
					return game.getTileObj(map.grid[Math.floor(y)][x]).solid || game.getTileObj(map.grid[Math.ceil(y)][x]).solid;
				}
				return map.grid[y][x] > 0;
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
		}
	}

window.onload = game.init;