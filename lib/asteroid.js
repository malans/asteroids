var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");
var Sprite = require("./sprite");
var Constants = require("./constants");

function Asteroid (options) {
  // options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = Constants.AsteroidDEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(Constants.AsteroidDEFAULTS.SPEED);
	this.chunk = options.chunk || false;

  Sprite.call(this, options);

}

Util.inherits(Asteroid, Sprite);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};

Asteroid.prototype.type = "Asteroid";

module.exports = Asteroid;
