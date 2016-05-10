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

  this.lives = 3;
  this.num_asteroids = 3;
  this.asteroids = [];
  this.asteroidChunks = [];
  this.time = 0;
  this.ship = this.addShip(); //new Ship(this.randomPosition(), this);
  this.bullets = [];
  this.sprites = [];
  this.score = 0;
  this.addAsteroids();
};

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.canvasBorder = 128;

Game.prototype.addShip = function() {
  return Ship.newSpaceship(
    {pos: [Game.DIM_X/2, Game.DIM_Y/2],
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
    // for (var i = 0; i < 3; i++) {
    //   this.add(RotatingAsteroid.newRotatingAsteroid(
    //     {pos: [asteroid.pos[0], asteroid.pos[1]],
    //      vel: Util.randomVec(Constants.Asteroid.SPEED/4),
    //      scaleMin: 0.2,
    //      scaleMax: 0.4,
    //      chunk: true,
    //      game: this}));
    // }
  }
  this.remove(asteroid);
};

Game.prototype.allObjects = function() {
  if (this.ship.visible === true) {
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
    this.ship.visible = true;
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
  return [Math.random()*Game.DIM_X, Math.random()*Game.DIM_Y];
};

Game.prototype.randomPositionOnBorders = function() {
  var borders = ["x", "y"];
  var border = borders[Util.randomInteger(0,1)];
  var pos;
  if (border === "y") {
    pos = [[0 - Game.canvasBorder, Game.DIM_X][Util.randomInteger(0,1)], Math.random()*Game.DIM_Y];
  } else {
    pos = [Math.random()*Game.DIM_X, [0 - Game.canvasBorder, Game.DIM_Y][Util.randomInteger(0,1)]];
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

  this.mainCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  // controlsCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i].type === "Ship") {
      allObjects[i].draw(this.mainCtx, timeDelta);
    } else if (allObjects[i].type === "Sprite") {
      allObjects[i].draw(this.mainCtx, timeDelta);
    } else {
      allObjects[i].draw(this.mainCtx, timeDelta);
    }
  }
  this.mainCtx.font = "48px sans-serif";
  this.mainCtx.fillStyle = "white";
  this.mainCtx.fillText(this.score, 50, 550);
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
  }

  if (this.lives > 0) {
    this.redrawControlsCanvas();
    this.addShipAfterDelay(ship);
  } else {
    this.gameOver();
  }
};

Game.prototype.gameOver = function() {
  
};

Game.prototype.addShipAfterDelay = function(ship) {
  window.setTimeout(function() {
    ship.pos = [Game.DIM_X/2, Game.DIM_Y/2];
    this.add(ship);
    ship.immune = true;
    this.removeImmunityAfterDelay(ship);
  }.bind(this), 3000);
};

Game.prototype.removeImmunityAfterDelay = function(ship) {
  window.setTimeout(function() {
    ship.immune = false;
  }.bind(this), 2000);
};

Game.prototype.redrawControlsCanvas = function() {
  this.controlsCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.drawLives();
};

Game.prototype.step = function(timeDelta, time) {
  this.time = time;
  this.ship.slowDownShip();
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

  if (pos[0] > (Game.DIM_X)) {
    newPos[0] = 0 - Game.canvasBorder;
  } else if (pos[0] < 0 - Game.canvasBorder) {
    newPos[0] = Game.DIM_X;
  }

  if (pos[1] > Game.DIM_Y) {
    newPos[1] = 0 - Game.canvasBorder;
  } else if (pos[1] < (0 - Game.canvasBorder)) {
    newPos[1] = Game.DIM_Y;
  }

  return newPos;

};

Game.prototype.isOutOfBounds = function(pos) {

  if (pos[0] > Game.DIM_X || pos[0] < 0 || pos[1] > Game.DIM_Y || pos[1] < 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = Game;
