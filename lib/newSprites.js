var Asteroid = require("./asteroid");
var RotatingAsteroid = require("./rotatingAsteroid");
var Sprite = require("./sprite");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");
var Util = require("./util");

var NewSprites = {
  newExplosion: function(options) {
    return new Sprite({
        vel: [0,0],
        radius: 0,
        pos: options.pos,
        game: options.game,
        spritePos: [0,0],
        image: AssetRepository.getAsset(AssetPaths.asteroidExplosion),
        width: 64,
        height: 64,
        speed: 30,
        scale: options.scale || 1,
        frames: [[0,0], [0,1], [0,2], [0,3], [0,4],
                 [1,0], [1,1], [1,2], [1,3], [1,4],
                 [2,0], [2,1], [2,2], [2,3], [2,4],
                 [3,0], [3,1], [3,2], [3,3], [3,4],
                 [4,0], [4,1], [4,2], [4,3], [4,4]],
        once: true});
  },

  scaleAsteroid: function() {
    return Math.random()*0.8 + 0.2;
  },

  scaleAsteroidMinMax: function(min, max) {
    if ((min === undefined) || (max === undefined) || (min > max)) {
      return;
    }
    return Math.random()*((max - min)) + min;
  },

  newAsteroid: function(options) {
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
  },

  newRotatingAsteroid: function(options) {
    var scale = options.scale || (this.scaleAsteroidMinMax(options.scaleMin, options.scaleMax)
                || this.scaleAsteroid());
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
  }
};

module.exports = NewSprites;
