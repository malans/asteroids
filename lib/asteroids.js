var Game = require("./game");
var GameView = require("./gameView");
// var ImageRepository = require("./imageRepository");




// document.addEventListener("DOMContentLoaded", function() {
//   var bgCanvas = document.getElementById('background');
//   var bgContext = bgCanvas.getContext('2d');
//
//   bgContext.drawImage(ImageRepository.background, 0, 0);
//   debugger;
//   var canvasEl = document.getElementById("game-canvas");
//   var mainCtx = canvasEl.getContext("2d");
//
//   canvasEl = document.getElementById("ship-canvas");
//   var shipCtx = canvasEl.getContext("2d");
//
//   var game = new Game();
//
//   new GameView(game, mainCtx, shipCtx).start();
// });

var Asteroids = {
  startGame: function() {
    var bgCanvas = document.getElementById('background');
    var bgContext = bgCanvas.getContext('2d');
    bgContext.drawImage(ImageRepository.background, 0, 0);

    var canvasEl = document.getElementById("game-canvas");
    var mainCtx = canvasEl.getContext("2d");

    canvasEl = document.getElementById("ship-canvas");
    var shipCtx = canvasEl.getContext("2d");

    var game = new Game();

    new GameView(game, mainCtx, shipCtx).start();
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

// module.exports = Asteroids;
