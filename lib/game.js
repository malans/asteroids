var Ship = require("./ship");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");
var NewSprites = require("./newSprites");

var Game = function() {
  this.num_asteroids = 10;
  this.asteroids = [];
  this.ship = new Ship(this.randomPosition(), this);
  this.bullets = [];
  this.sprites = [];
  this.score = 0;
  this.addAsteroids();
};

Game.DIM_X = 1000;
Game.DIM_Y = 600;

Game.prototype.addAsteroids = function() {
  for (var i = 0; i < this.num_asteroids; i++) {
    this.asteroids.push(this.randomAsteroid());
  }
};

Game.prototype.allObjects = function() {
  return [].concat(this.ship, this.asteroids, this.bullets, this.sprites);
};

Game.prototype.add = function(object) {

  if (object.type === "Asteroid") {
    this.asteroids.push(object);
  } else if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    this.ships.push(object);
  } else if (object.type === "Sprite") {
    this.sprites.push(object);
  }

};

Game.prototype.randomAsteroid = function() {
  // return (NewSprites.newAsteroid(this.randomPosition(), this));
  return (NewSprites.newRotatingAsteroid(this.randomPosition(), this));
};

Game.prototype.randomPosition = function() {

  return [Math.random()*Game.DIM_X, Math.random()*Game.DIM_Y];
};

Game.prototype.draw = function(bgCtx, mainCtx, shipCtx, timeDelta) {
  var allObjects = this.allObjects();

  mainCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  shipCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

  shipCtx.font = "48px sans-serif";
  shipCtx.fillStyle = "white";
  shipCtx.fillText(this.score, 50, 550);

  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i].type === "Ship") {
      allObjects[i].draw(shipCtx);
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

Game.prototype.step = function(delta) {
  this.ship.slowDownShip();
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.remove = function(object) {

  if (object.type === "Asteroid") {
    var idx = this.asteroids.indexOf(object);
    this.asteroids[idx] = this.randomAsteroid();
  } else if (object.type === "Bullet") {
      this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object.type === "Ship") {
      this.ships.splice(this.ships.indexOf(object), 1);
  } else if (object.type === "Sprite") {
     this.sprites.splice(this.sprites.indexOf(object), 1);
  }
};

Game.prototype.wrap = function(pos) {
  var newPos = pos.slice();

  if (pos[0] > Game.DIM_X) {
    newPos[0] = 0;
  } else if (pos[0] < 0) {
    newPos[0] = Game.DIM_X;
  }

  if (pos[1] > Game.DIM_Y) {
    newPos[1] = 0;
  } else if (pos[1] < 0) {
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
