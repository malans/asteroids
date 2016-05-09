var Sprite = require("./sprite");
var Util = require("./util");
var Bullet = require("./bullet");
var NewSprites = require("./newSprites");
var Constants = require("./constants");

var Ship = function(options) {
  this.direction = Math.PI / 2;
  this.visible = true;
  this.lastBulletFired = options.game.time;
  options.vel = [0,0],
  Sprite.call(this, options);
  // MovingObject.call(this, options);
};

Util.inherits(Ship, Sprite);

Ship.prototype.type = "Ship";

Ship.prototype.relocate = function() {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Ship.prototype.collideWith = function(otherObject) {
  if (otherObject.type === "Asteroid") {
    this.game.remove(this);
    this.game.splitAsteroidIntoChunks(otherObject);
    var explosion = NewSprites.newExplosion({pos: this.pos, game: this.game});
    this.game.add(explosion);
  }
};

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse*Math.cos(this.direction);
  this.vel[1] += -impulse*Math.sin(this.direction);
};

Ship.prototype.slowDownShip = function() {
  this.vel = Util.scale(this.vel, 0.95);
};

// Ship.prototype.draw = function(shipCtx) {
//   shipCtx.beginPath();
//
//   shipCtx.moveTo(this.pos[0] + 10*Math.cos(this.direction),
//     this.pos[1] - 10*Math.sin(this.direction));
//   shipCtx.lineTo(this.pos[0] + 10*Math.cos(this.direction
//     + Math.PI - Math.PI/8), this.pos[1] - 10*Math.sin(this.direction
//       + Math.PI - Math.PI/8));
//   shipCtx.lineTo(this.pos[0] + 10*Math.cos(this.direction + Math.PI
//     + Math.PI/8), this.pos[1] - 10*Math.sin(this.direction + Math.PI
//       + Math.PI/8));
//   shipCtx.closePath();
//   shipCtx.strokeStyle="red";
//   shipCtx.stroke();
//   //shipCtx.drawImage(imageRepository.spaceship, this.pos[0], this.pos[1]);
// };

Ship.prototype.draw = function(shipCtx, timeDelta) {
  this.time += timeDelta;
  // rotate the ship around it's center point
  shipCtx.save();
  shipCtx.translate(this.pos[0]+this.width*this.scale*0.5, this.pos[1]+this.height*this.scale*0.5);
  shipCtx.rotate(-this.direction);
  shipCtx.translate(-(this.pos[0]+this.width*this.scale*0.5), -(this.pos[1]+this.height*this.scale*0.5));
  // call superclass's draw method (Sprite.draw)
  debugger;
  Object.getPrototypeOf(this.constructor.prototype).draw.bind(this)(shipCtx, timeDelta);
  shipCtx.restore();
};

Ship.prototype.move = function(timeDelta) {
  Object.getPrototypeOf(this.constructor.prototype).move.bind(this)(timeDelta);
  var directionScale = timeDelta / Constants.movingObject.NORMAL_FRAME_TIME_DELTA;
  if (key.isPressed("right")) {
    this.direction -= directionScale*Constants.ship.DIRECTION_CHANGE_SPEED;
  } else if (key.isPressed("left")) {
    this.direction += directionScale*Constants.ship.DIRECTION_CHANGE_SPEED;
  }
  if (key.isPressed("up")) {
    this.power(Constants.ship.POWER);
  }
  if (key.isPressed("space")) {
    if (this.game.time - this.lastBulletFired > 100) {
      this.fireBullet();
      this.lastBulletFired = this.game.time;
  }
}
};

Ship.prototype.fireBullet = function() {

  var direction_vector = [Math.cos(this.direction), -Math.sin(this.direction)];

  // relative velocity vector of the bullet is the normalized velocity vector
  // times the Bullet.SPEED constant
  var relVel = Util.scale(
    Util.dir(direction_vector),
    Bullet.SPEED
  );

  // bullet velocity adds the ship's velocity to the bullet's default speed
  var bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
  ];

  var options = {
    pos: [this.pos[0] + this.scaledWidth()*0.5, this.pos[1] + this.scaledHeight()*0.5],
    vel: bulletVel,
    color: "red",
    game: this.game
  };
  var bullet = new Bullet(options);

  this.game.add(bullet);
};

module.exports = Ship;
