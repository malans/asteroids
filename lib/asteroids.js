var Game = require("./game");
var GameView = require("./gameView");
var AssetRepository = require("./assetRepository");
var AssetPaths = require('./assetPaths');

var Asteroids = {

  gameIntro: function() {
    var bgCanvas = document.getElementById('background');
    bgCanvas.width = Game.DIM_X;
    bgCanvas.height = Game.DIM_Y;
    var bgContext = bgCanvas.getContext('2d');

    //draw the background
    bgContext.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);

    //draw the logo
    var asteroidsLogo = AssetRepository.getAsset(AssetPaths.asteroidsLogo);
    bgContext.drawImage(asteroidsLogo, bgCanvas.width/2 -  asteroidsLogo.width/2, 50 );

    //draw the button
    var playGameButton = AssetRepository.getAsset(AssetPaths.playGameButton);
    bgContext.drawImage(playGameButton, 50, Game.DIM_Y - 50 - playGameButton.height);
    // bgContext.font = "48px serif";
    // bgContext.strokeStyle = "white";
    // bgContext.strokeText(" Play Game", 50, 550);

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
    var bgContext = bgCanvas.getContext('2d');
    bgContext.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    bgContext.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);

    var gameCanvas = document.getElementById("game-canvas");
    gameCanvas.width = Game.DIM_X;
    gameCanvas.height = Game.DIM_Y;
    var mainCtx = gameCanvas.getContext("2d");

    var shipCanvas = document.getElementById("ship-canvas");
    shipCanvas.width = Game.DIM_X;
    shipCanvas.height = Game.DIM_Y;
    var shipCtx = shipCanvas.getContext("2d");

    var game = new Game();

    new GameView(game, mainCtx, shipCtx).start();
  }
};

module.exports = Asteroids;
