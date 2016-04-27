var Game = require("./game");
var GameView = require("./gameView");

var Asteroids = {
  startGame: function() {
    var bgCanvas = document.getElementById('background');
    bgCanvas.width = Game.DIM_X;
    bgCanvas.height = Game.DIM_Y;
    var bgContext = bgCanvas.getContext('2d');
    bgContext.drawImage(ImageRepository.background, 0, 0);

    var gameCanvas = document.getElementById("game-canvas");
    gameCanvas.width = Game.DIM_X;
    gameCanvas.height = Game.DIM_Y;
    var mainCtx = gameCanvas.getContext("2d");

    var shipCanvas = document.getElementById("ship-canvas");
    shipCanvas.width = Game.DIM_X;
    shipCanvas.height = Game.DIM_Y;
    var shipCtx = shipCanvas.getContext("2d");

    var game = new Game();

    //new GameView(game, mainCtx, shipCtx).start();
  }
};

var ImageRepository = new function() {
	// Define images
	this.background = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 1;
	var numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			Asteroids.startGame();
		}
	}

	var self = this;
	this.background.onload = function() {
		imageLoaded();
	};

	// Set images src
	this.background.src = "./bg.png";
  //this.spaceship.src = "./imgs/ship.png";
};
