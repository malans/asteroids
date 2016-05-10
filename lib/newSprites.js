var Asteroid = require("./asteroid");
var RotatingAsteroid = require("./rotatingAsteroid");
var Sprite = require("./sprite");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");
var Util = require("./util");
var Ship = require("./ship");

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
};

module.exports = NewSprites;
