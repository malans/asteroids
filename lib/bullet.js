var Util = require("./util");
var Sprite = require("./sprite");
var NewSprites = require("./newSprites");
var Constants = require("./constants");

var Bullet = function(options) {
  options.radius = Constants.Bullet.RADIUS;
  Sprite.call(this, options);
};

Util.inherits(Bullet, Sprite);

Bullet.prototype.isWrappable = false;
Bullet.prototype.type = "Bullet";

Bullet.prototype.collideWith = function(otherObject) {
  if (otherObject.type === "Asteroid") {
    this.game.remove(this);
    this.game.splitAsteroidIntoChunks(otherObject);
    var explosion = NewSprites.newExplosion({pos:otherObject.pos, game: this.game, scale: 1}); //scale: otherObject.scale});
    this.game.add(explosion);
    this.game.increaseScore();
  }
};

module.exports = Bullet;
