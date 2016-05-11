var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");
var RotatingAsteroid = require("./rotatingAsteroid");
var Util = require("./util");
var Constants = require("./constants");
var Sprite = require("./sprite");
var Ship = require("./ship");
var NewSprites = require("./newSprites");

var Game = function(bgCtx, mainCtx, controlsCtx) {
  this.bgCtx = bgCtx;
  this.mainCtx = mainCtx;
  this.controlsCtx = controlsCtx;

  this.lives = Constants.Game.LIVES;
  this.num_asteroids = 10;
  this.asteroids = [];
  this.asteroidChunks = [];
  this.time = 0;
  //this.ship = this.addShip(); //new Ship(this.randomPosition(), this);
  this.bullets = [];
  this.sprites = [];
  this.score = 0;
  this.gameStarted = false;
  this.addAsteroids();
};

Game.prototype.startGame = function() {
  this.gameStarted = true;
  this.score = 0;
  this.lives = Constants.Game.LIVES;
  this.redrawControlsCanvas();
  var newShip = this.newShipAtCenter();
  debugger;
  newShip.visible = false;
  this.ship = newShip;
  this.addShipAfterDelay(newShip, 0);
},

Game.prototype.endGame = function() {
  delete this.ship;
  this.drawGameOver();
};

Game.prototype.drawGameOver = function() {
  //draw Asteroids logo and text
  var fontSize = 75;
  this.controlsCtx.font = fontSize + "px sans-serif";
  var text = "Game Over";
  var textDim = this.controlsCtx.measureText(text);
  this.controlsCtx.fillText(text, (Constants.Game.DIM_X - textDim.width)*0.5, Constants.Game.DIM_Y*0.60 - fontSize*0.5);

  fontSize = 48;
  text = "New Game";
  this.controlsCtx.font = fontSize + "px sans-serif";
  textDim = this.controlsCtx.measureText(text);
  this.controlsCtx.fillText(text, (Constants.Game.DIM_X - textDim.width)*0.5, (Constants.Game.DIM_Y*0.60 + fontSize*0.5));

  // click on New Game button starts the game again
  var controlsCanvas = document.getElementById("controls-canvas");
  var listener = function (e) {
     var loc = Util.windowToCanvas(controlsCanvas, e.clientX, e.clientY);
     if ((loc.x > (Constants.Game.DIM_X - textDim.width)*0.5)
        && (loc.x < textDim.width + (Constants.Game.DIM_X - textDim.width)*0.5)
        && (loc.y > Constants.Game.DIM_Y*0.60 - fontSize*0.5)
        && (loc.y < Constants.Game.DIM_Y*0.60 + fontSize*0.5)) {
          this.startGame();
          controlsCanvas.removeEventListener("mousedown", listener);
        }
  }.bind(this);

  controlsCanvas.addEventListener("mousedown", listener);
};

Game.prototype.newShipAtCenter = function() {
  var scale = Constants.Ship.SHIP_SCALE;
  return Ship.newSpaceship(
    {pos: Ship.getCenterPosition(),
    game: this}
  );
};

Game.prototype.addAsteroids = function() {
  for (var i = 0; i < this.num_asteroids; i++) {
    this.add(this.randomAsteroidCanvasBorder());
  }
};

Game.prototype.splitAsteroidIntoChunks = function(asteroid) {
  if (asteroid.scale > 0.7) {
    for (var i = 0; i < 3; i++) {
      this.add(RotatingAsteroid.newRotatingAsteroid(
        {pos: [asteroid.pos[0], asteroid.pos[1]],
         vel: Util.randomVec(Constants.Asteroid.SPEED/2),
         scaleMin: 0.4,
         scaleMax: 0.7,
         chunk: true,
         game: this}));
    }
  } else if ((0.4 < asteroid.scale) && (asteroid.scale <= 0.7)) {
    for (var i = 0; i < 3; i++) {
      this.add(RotatingAsteroid.newRotatingAsteroid(
        {pos: [asteroid.pos[0], asteroid.pos[1]],
         vel: Util.randomVec(Constants.Asteroid.SPEED/4),
         scaleMin: 0.2,
         scaleMax: 0.4,
         chunk: true,
         game: this}));
    }
  }
  this.remove(asteroid);
};

Game.prototype.allObjects = function() {
  if (this.ship && this.ship.visible === true) {
    return [].concat(this.ship, this.asteroids, this.asteroidChunks, this.bullets, this.sprites);
  } else {
    return [].concat(this.asteroids, this.asteroidChunks, this.bullets, this.sprites);
  }
};

Game.prototype.add = function(object) {

  if (object.type === "Asteroid") {
    if (object.chunk === false) {
      this.asteroids.push(object);
    } else {
      this.asteroidChunks.push(object);
    }
  } else if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    object.visible = true;
  } else if (object.type === "Sprite") {
    this.sprites.push(object);
  }

};

Game.prototype.randomAsteroid = function() {
  return RotatingAsteroid.newRotatingAsteroid({pos: this.randomPosition(), game: this, scale: 0.8});
};

Game.prototype.randomAsteroidCanvasBorder = function() {
  return RotatingAsteroid.newRotatingAsteroid({pos: this.randomPositionOnBorders(), game: this, scale: 0.8});
},

Game.prototype.randomPosition = function() {
  return [Math.random()*Constants.Game.DIM_X, Math.random()*Constants.Game.DIM_Y];
};

Game.prototype.randomPositionOnBorders = function() {
  var borders = ["x", "y"];
  var border = borders[Util.randomInteger(0,1)];
  var pos;
  if (border === "y") {
    pos = [[0 - Constants.Game.CANVAS_BORDER, Constants.Game.DIM_X][Util.randomInteger(0,1)], Math.random()*Constants.Game.DIM_Y];
  } else {
    pos = [Math.random()*Constants.Game.DIM_X, [0 - Constants.Game.CANVAS_BORDER, Constants.Game.DIM_Y][Util.randomInteger(0,1)]];
  }
  return pos;
},

Game.prototype.drawLives = function() {
  var life = new Sprite({
    pos: [20,20],
    game: this,
    spritePos: [0,0],
    image: AssetRepository.getAsset(AssetPaths.spaceShip),
    width: 810,
    height: 495,
    speed: 0,
    scale: 0.05,
    frames: [[0,0]],
    once: false});
  // rotate image: spaceship image is horizontal initially, we need it to be vertical
  this.controlsCtx.save();
  this.controlsCtx.translate(life.pos[0]+life.width*life.scale*0.5, life.pos[1]+life.height*life.scale*0.5);
  this.controlsCtx.rotate(-Math.PI/2);
  this.controlsCtx.translate(-(life.pos[0]+life.width*life.scale*0.5), -(life.pos[1]+life.height*life.scale*0.5));
  for (var i = 0; i < this.lives; i++) {
    life.pos = [20, (i+1)*25];
    life.draw(this.controlsCtx);
  }
  this.controlsCtx.restore();
};

Game.prototype.draw = function(timeDelta) {
  var allObjects = this.allObjects();

  this.mainCtx.clearRect(0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);
  // controlsCtx.clearRect(0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);

  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i].type === "Ship") {
      allObjects[i].draw(this.mainCtx, timeDelta);
    } else if (allObjects[i].type === "Sprite") {
      allObjects[i].draw(this.mainCtx, timeDelta);
    } else {
      allObjects[i].draw(this.mainCtx, timeDelta);
    }
  }

  if (this.gameStarted === true) {
    this.mainCtx.font = "48px sans-serif";
    this.mainCtx.fillStyle = "white";
    this.mainCtx.fillText(this.score, 50, 550);
  }
};

Game.prototype.moveObjects = function(delta) {
  var allObjects = this.allObjects();

  for (var i = 0; i < allObjects.length; i++) {
    allObjects[i].move(delta);
  }
};

Game.prototype.checkCollisions = function() {
  var allObjects = this.allObjects();
  for (var i = 0; i < allObjects.length; i++) {
    for (var j = 0; j < allObjects.length; j++) {
      if (allObjects[i] == allObjects[j]) {
        continue;
      }
      if (allObjects[i].isCollidedWith(allObjects[j])) {
        allObjects[i].collideWith(allObjects[j]);
      }
    }
  }
};

Game.prototype.increaseScore = function() {
  this.score += 10;
};

Game.prototype.shipCrash = function(ship, otherObject) {

  if (otherObject.type === "Asteroid") {
    this.remove(ship);
    this.splitAsteroidIntoChunks(otherObject);
    var explosion = NewSprites.newExplosion({pos: ship.pos, game: this});
    this.add(explosion);
    ship.resetAtCenter();
  }

  this.redrawControlsCanvas();
  if (this.lives > 0) {
    this.addShipAfterDelay(ship, 3000);
  } else {
    this.endGame();
  }
};

Game.prototype.addShipAfterDelay = function(ship, delay) {
  window.setTimeout(function() {
    this.add(ship);
    ship.immune = true;
    this.removeImmunityAfterDelay(ship);
  }.bind(this), delay);
};

Game.prototype.removeImmunityAfterDelay = function(ship) {
  window.setTimeout(function() {
    ship.immune = false;
  }.bind(this), 2000);
};

Game.prototype.redrawControlsCanvas = function() {
  this.clearControlsCanvas();
  this.drawLives();
};

Game.prototype.clearControlsCanvas = function() {
  this.controlsCtx.clearRect(0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);
};

Game.prototype.step = function(timeDelta, time) {
  this.time = time;
  //this.ship.slowDownShip();
  this.moveObjects(timeDelta);
  this.checkCollisions();
};

Game.prototype.remove = function(object) {

  if (object.type === "Asteroid") {
    if (object.chunk === false) {
      var idx = this.asteroids.indexOf(object);
      this.asteroids[idx] = this.randomAsteroidCanvasBorder();
    } else {
      this.asteroidChunks.splice(this.asteroidChunks.indexOf(object), 1);
    }
  } else if (object.type === "Bullet") {
      this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object.type === "Ship") {
      this.ship.visible = false;
      this.lives -= 1;
  } else if (object.type === "Sprite") {
     this.sprites.splice(this.sprites.indexOf(object), 1);
  }
};

Game.prototype.wrap = function(pos) {
  var newPos = pos.slice();

  if (pos[0] > (Constants.Game.DIM_X)) {
    newPos[0] = 0 - Constants.Game.CANVAS_BORDER;
  } else if (pos[0] < 0 - Constants.Game.CANVAS_BORDER) {
    newPos[0] = Constants.Game.DIM_X;
  }

  if (pos[1] > Constants.Game.DIM_Y) {
    newPos[1] = 0 - Constants.Game.CANVAS_BORDER;
  } else if (pos[1] < (0 - Constants.Game.CANVAS_BORDER)) {
    newPos[1] = Constants.Game.DIM_Y;
  }

  return newPos;

};

Game.prototype.isOutOfBounds = function(pos) {

  if (pos[0] > Constants.Game.DIM_X || pos[0] < 0 || pos[1] > Constants.Game.DIM_Y || pos[1] < 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = Game;
