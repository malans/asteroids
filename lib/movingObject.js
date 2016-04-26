
var MovingObject = function (options, game) {
  this.pos = options["pos"];  // two element array
  this.vel = options["vel"];  // two element array
  this.radius = options["radius"];
  this.color = options["color"];
  this.game = options["game"];
};

MovingObject.prototype.isWrappable = true;

MovingObject.prototype.draw = function(mainCtx) {
  mainCtx.fillStyle = this.color;
  mainCtx.beginPath();

  mainCtx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  mainCtx.fill();
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
MovingObject.prototype.move = function(timeDelta) {
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  var offsetX = this.vel[0] * velocityScale;
  var offsetY = this.vel[1] * velocityScale;

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  if (this.isWrappable === true) {
    this.pos = this.game.wrap(this.pos);
  } else {
    if (this.game.isOutOfBounds(this.pos) === true) {
      this.game.remove(this);
    }
  }
};

// Find distance to other object (Pythagoras)
MovingObject.prototype.distance = function(otherObject) {
  return Math.sqrt(
    Math.pow(this.pos[0] - otherObject.pos[0], 2)
    + Math.pow(this.pos[1] - otherObject.pos[1], 2));
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  if (this.distance(otherObject) <= (this.radius + otherObject.radius)) {
    return true;
  } else {
    return false;
  }
};

MovingObject.prototype.collideWith = function(otherObject) {
  debugger;
};

module.exports = MovingObject;
