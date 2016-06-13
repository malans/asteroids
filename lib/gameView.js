var Game = require("./game");
var AssetRepository = require("./assetRepository");
var AssetPaths = require('./assetPaths');
var Util = require("./util");
var Constants = require("./constants");

var GameView = function() {
  this.game = undefined;
};

GameView.prototype.gameIntro = function() {
  //draw the background
  var bgCanvas = document.getElementById('background');
  bgCanvas.width = Constants.Game.DIM_X;
  bgCanvas.height = Constants.Game.DIM_Y;
  var bgCtx = bgCanvas.getContext('2d');
  bgCtx.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);

  // canvas for game objects
  var mainCanvas = document.getElementById("main-canvas");
  mainCanvas.width = Constants.Game.DIM_X;
  mainCanvas.height = Constants.Game.DIM_Y;
  var mainCtx = mainCanvas.getContext("2d");

  // canvas for the game controls
  var controlsCanvas = document.getElementById("controls-canvas");
  controlsCanvas.width = Constants.Game.DIM_X;
  controlsCanvas.height = Constants.Game.DIM_Y;
  var controlsCtx = controlsCanvas.getContext("2d");

  //draw the Play Game button
  var fontSize = 48;
  controlsCtx.font = fontSize + "px sans-serif";
  controlsCtx.fillStyle = "white";
  var text = "Play Game";
  controlsCtx.fillText(text, 50, Constants.Game.DIM_Y - 50);
  var playGameButton = controlsCtx.measureText(text);

  //draw the Controls
  fontSize = 24;
  controlsCtx.font = fontSize + "px sans-serif";
  controlsCtx.fillStyle = "white";
  text = "Spacebar to shoot";
  controlsCtx.fillText(text, 750, Constants.Game.DIM_Y - 50);
  text = "Arrow keys to move";
  controlsCtx.fillText(text, 750, Constants.Game.DIM_Y - 20);

  //draw Asteroids logo and text
  fontSize = 75;
  controlsCtx.font = fontSize + "px sans-serif";
  text = "Asteroids";
  var logo = controlsCtx.measureText(text);
  controlsCtx.fillText(text, (Constants.Game.DIM_X - logo.width)*0.5, Constants.Game.DIM_Y*0.60 - fontSize*0.5);

  this.game = new Game(bgCtx, mainCtx, controlsCtx);
  this.start();

  // click on Play Game button starts the game
  controlsCanvas.onmousedown = function (e) {
     var loc = Util.windowToCanvas(controlsCanvas, e.clientX, e.clientY);
     if ((loc.x > 50) && (loc.x < playGameButton.width + 50)
        && (loc.y > Constants.Game.DIM_Y - 50 - fontSize)
        && (loc.y < Constants.Game.DIM_Y - 50)) {
          this.game.startGame();
        }
  }.bind(this);
};

GameView.prototype.start = function() {
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time) {
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta, time);
  this.game.draw(timeDelta);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
