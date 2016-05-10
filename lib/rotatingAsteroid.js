var Asteroid = require("./asteroid");
var Util = require("./util");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");

// Constructor for an Asteroid that rotates based on canvas rotate, not on
// multiple sprite sheet images
function RotatingAsteroid (options) {
  this.time = 0;
  this.rotationDirection = [-1,1][Util.randomInteger(0,1)];
  Asteroid.call(this, options);
}

Util.inherits(RotatingAsteroid, Asteroid);

RotatingAsteroid.newRotatingAsteroid = function(options) {
  var scale = options.scale || (Asteroid.scaleAsteroidMinMax(options.scaleMin, options.scaleMax)
              || Asteroid.scaleAsteroid());
  var randomSpriteX = Util.randomInteger(0,6);
  var randomSpriteY = Util.randomInteger(0,7);
  return new RotatingAsteroid({
    pos: options.pos,
    vel: options.vel,
    game: options.game,
    spritePos: [0,0],
    image: AssetRepository.getAsset(AssetPaths.asteroidSprite),
    width: 128,
    height: 128,
    speed: 10,
    scale: scale,
    frames: [[randomSpriteX, randomSpriteY]],
    once: false,
    chunk: options.chunk});
};

RotatingAsteroid.prototype.draw = function(ctx, timeDelta) {
  this.time += timeDelta;
  // rotate the asteroid around it's center point
	ctx.save();
	ctx.translate(this.pos[0]+this.width*this.scale*0.5, this.pos[1]+this.height*this.scale*0.5);
	ctx.rotate(this.rotationDirection*this.time / 1000);
	ctx.translate(-(this.pos[0]+this.width*this.scale*0.5), -(this.pos[1]+this.height*this.scale*0.5));
	// call superclass's draw method (Sprite.draw)
	Object.getPrototypeOf(this.constructor.prototype).draw.bind(this)(ctx, timeDelta);
	ctx.restore();
};

module.exports = RotatingAsteroid;
