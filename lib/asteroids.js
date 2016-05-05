var Game = require("./game");
var GameView = require("./gameView");
var AssetRepository = require("./assetRepository");
var AssetPaths = require('./assetPaths');

var Asteroids = {

  gameIntro: function() {
    var bgCanvas = document.getElementById('background');
    bgCanvas.width = Game.DIM_X;
    bgCanvas.height = Game.DIM_Y;
    var bgCtx = bgCanvas.getContext('2d');

    //draw the background
    bgCtx.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);

    //draw the logo
    var asteroidsLogo = AssetRepository.getAsset(AssetPaths.asteroidsLogo);
    bgCtx.drawImage(asteroidsLogo, bgCanvas.width/2 -  asteroidsLogo.width/2, 50 );

    //draw the button
    var playGameButton = AssetRepository.getAsset(AssetPaths.playGameButton);
    bgCtx.drawImage(playGameButton, 50, Game.DIM_Y - 50 - playGameButton.height);
    // bgCtx.font = "48px serif";
    // bgCtx.strokeStyle = "white";
    // bgCtx.strokeText(" Play Game", 50, 550);

    function windowToCanvas(canvas, x, y) {
       var rect = canvas.getBoundingClientRect();

       return { x: x - rect.left,
                y: y - rect.top
              };
    }

    bgCanvas.onmousedown = function (e) {
       var loc = windowToCanvas(bgCanvas, e.clientX, e.clientY);
       if ((loc.x > 50) && (loc.x < playGameButton.width + 50)
          && (loc.y > Game.DIM_Y - 50 - playGameButton.height)
          && (loc.y < Game.DIM_Y - 50)) {
            this.startGame();
          }
    }.bind(this);
  },

  startGame: function() {
    // draw the background
    var bgCanvas = document.getElementById('background');
    bgCanvas.width = Game.DIM_X;
    bgCanvas.height = Game.DIM_Y;
    var bgCtx = bgCanvas.getContext('2d');
    bgCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    bgCtx.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);

    // canvas for objects other than ship
    var gameCanvas = document.getElementById("game-canvas");
    gameCanvas.width = Game.DIM_X;
    gameCanvas.height = Game.DIM_Y;
    var mainCtx = gameCanvas.getContext("2d");

    // canvas for the ship
    var shipCanvas = document.getElementById("ship-canvas");
    shipCanvas.width = Game.DIM_X;
    shipCanvas.height = Game.DIM_Y;
    var shipCtx = shipCanvas.getContext("2d");

    //draw the score count
    shipCtx.font = "48px sans-serif";
    shipCtx.strokeStyle = "white";
    shipCtx.strokeText("0", 50, 550);

    var game = new Game();

    new GameView(game, bgCtx, mainCtx, shipCtx).start();
  }
};

module.exports = Asteroids;
