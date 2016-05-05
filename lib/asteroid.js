var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");
var Sprite = require("./sprite");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");

var DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 50,
	SPEED: 1
};

var Asteroid = function(options) {
  // options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  Sprite.call(this, options);

};

Util.inherits(Asteroid, Sprite);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};

Asteroid.prototype.type = "Asteroid";

module.exports = Asteroid;
