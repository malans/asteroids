var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");
var NewSprites = require("./newSprites");
var Util = require("./util");
var Constants = require("./constants");

var Game = function() {
  this.lives = 3;
  this.num_asteroids = 0;
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
  return NewSprites.newSpaceShip(
    {pos: this.randomPosition(),
    game: this}
  );
};

Game.prototype.addAsteroids = function() {
  for (var i = 0; i < this.num_asteroids; i++) {
    this.add(this.randomAsteroid());
  }
};

Game.prototype.splitAsteroidIntoChunks = function(asteroid) {
  if (asteroid.scale > 0.7) {
    for (var i = 0; i < 3; i++) {
      this.add(NewSprites.newRotatingAsteroid(
        {pos: [asteroid.pos[0], asteroid.pos[1]],
         vel: Util.randomVec(Constants.AsteroidDEFAULTS.SPEED/2),
         scaleMin: 0.4,
         scaleMax: 0.7,
         chunk: true,
         game: this}));
    }
  } else if ((0.4 < asteroid.scale) && (asteroid.scale <= 0.7)) {
    // for (var i = 0; i < 3; i++) {
    //   this.add(NewSprites.newRotatingAsteroid(
    //     {pos: [asteroid.pos[0], asteroid.pos[1]],
    //      vel: Util.randomVec(Constants.AsteroidDEFAULTS.SPEED/4),
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
    this.ships.push(object);
  } else if (object.type === "Sprite") {
    this.sprites.push(object);
  }

};

Game.prototype.randomAsteroid = function() {
  return NewSprites.newRotatingAsteroid({pos: this.randomPosition(), game: this, scale: 0.8});
};

Game.prototype.randomAsteroidCanvasBorder = function() {
  return NewSprites.newRotatingAsteroid({pos: this.randomPositionOnBorders(), game: this, scale: 0.8});
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

Game.prototype.draw = function(bgCtx, mainCtx, shipCtx, timeDelta) {
  var allObjects = this.allObjects();

  mainCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  shipCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

  shipCtx.font = "48px sans-serif";
  shipCtx.fillStyle = "white";
  shipCtx.fillText(this.score, 50, 550);

  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i].type === "Ship") {
      allObjects[i].draw(shipCtx, timeDelta);
    } else if (allObjects[i].type === "Sprite") {
      allObjects[i].draw(mainCtx, timeDelta);
    } else {
      allObjects[i].draw(mainCtx, timeDelta);
    }
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
