var Util = require("./util");
var MovingObject = require("./movingObject");
var Asteroid = require("./asteroid");
var Sprite = require("./sprite");
var NewSprites = require("./newSprites");

var Bullet = function(options) {
  options.radius = Bullet.RADIUS;
  MovingObject.call(this, options);
};

Bullet.RADIUS = 3;
Bullet.SPEED = 15;

Util.inherits(Bullet, MovingObject);

Bullet.prototype.isWrappable = false;
Bullet.prototype.type = "Bullet";

Bullet.prototype.collideWith = function(otherObject) {
  debugger;
  if (otherObject.type === "Asteroid") {
    this.game.remove(this);
    this.game.splitAsteroidIntoChunks(otherObject);
    var explosion = NewSprites.newExplosion({pos:otherObject.pos, game: this.game, scale: otherObject.scale});
    this.game.add(explosion);
    this.game.increaseScore();
  }

};

module.exports = Bullet;
