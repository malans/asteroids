var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");

var DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 25,
	SPEED: 1
};

var Asteroid = function(options) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function(otherObject) {
	debugger;
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};



// Overrides moving object's draw method
Asteroid.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.moveTo(this.pos[0],this.pos[1]);
  ctx.bezierCurveTo(this.pos[0], this.pos[1] - 50, this.pos[0]
    + 50, this.pos[1] - 50, this.pos[0] + 50, this.pos[1]);
  ctx.bezierCurveTo(this.pos[0] + 50, this.pos[1] + 25, this.pos[0],
    this.pos[1] + 25, this.pos[0], this.pos[1]);
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fill();
};

Asteroid.prototype.type = "Asteroid";

module.exports = Asteroid;
