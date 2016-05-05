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
  if (otherObject.type === "Asteroid") {
    this.game.remove(this);
    this.game.remove(otherObject);
    var explosion = NewSprites.newExplosion(otherObject.pos, this.game);
    this.game.add(explosion);
    this.game.increaseScore();
  }

};

module.exports = Bullet;
