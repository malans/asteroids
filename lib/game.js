var Asteroid = require("./asteroid");
var Bullet = require("./bullet");
var Ship = require("./ship");

var Game = function() {
  this.num_asteroids = 3;
  this.asteroids = [];
  this.ship = new Ship(this.randomPosition(), this);
  this.bullets = [];
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
  return [].concat(this.ship, this.asteroids, this.bullets);
};

Game.prototype.add = function(object) {

  if (object.type === "Asteroid") {
    this.asteroids.push(object);
  } else if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Ship") {
    this.ships.push(object);
  }

};

Game.prototype.randomAsteroid = function() {
  return new Asteroid({pos: this.randomPosition(), game: this});
};

Game.prototype.randomPosition = function() {

  return [Math.random()*Game.DIM_X, Math.random()*Game.DIM_Y];
};

Game.prototype.draw = function(mainCtx, shipCtx) {
  var allObjects = this.allObjects();

  mainCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  shipCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i].type === "Ship") {
      allObjects[i].draw(shipCtx);
    } else {
      allObjects[i].draw(mainCtx);
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
    this.asteroids[idx] = new Asteroid({ game: this });
  } else if (object.type === "Bullet") {
      this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object.type === "Ship") {
      this.ships.splice(this.ships.indexOf(object), 1);
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
