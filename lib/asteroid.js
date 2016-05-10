var Util = require("./util");
var Sprite = require("./sprite");
var Constants = require("./constants");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");

function Asteroid (options) {
  // options.color = DEFAULTS.COLOR;
  // options.radius = options.radius;
  options.vel = Util.randomVec(Constants.Asteroid.SPEED);
	this.chunk = options.chunk || false;

  Sprite.call(this, options);

}

Util.inherits(Asteroid, Sprite);

Asteroid.scaleAsteroid = function() {
  return Math.random()*0.8 + 0.2;
};

Asteroid.scaleAsteroidMinMax = function(min, max) {
  if ((min === undefined) || (max === undefined) || (min > max)) {
    return;
  }
  return Math.random()*((max - min)) + min;
};

Asteroid.newAsteroid = function(options) {
  var scale = (this.scaleAsteroidMinMax(options.min, options.max)
              || this.scaleAsteroid());
  return new Asteroid({pos: options.pos,
    game: options.game,
    spritePos: [0,0],
    image: AssetRepository.getAsset(AssetPaths.asteroidSprite),
    width: 128,
    height: 128,
    speed: 10,
    scale: scale,
    frames: [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [0,7],
             [1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7],
             [2,0], [2,1], [2,2], [2,3], [2,4], [2,5], [2,6], [2,7],
             [3,0], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6], [3,7]],
    once: false});
};

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};

Asteroid.prototype.type = "Asteroid";

module.exports = Asteroid;
