var MovingObject = require("./movingObject");
var Util = require("./util");
var Bullet = require("./bullet");

var Ship = function(pos, game) {
  this.direction = Math.PI / 2;
  var options = {
    color: "blue",
    radius: 5,
    pos: pos,
    vel: [0, 0],
    game: game
  };
  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.type = "Ship";

Ship.prototype.relocate = function() {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse*Math.cos(this.direction);
  this.vel[1] += -impulse*Math.sin(this.direction);
};

Ship.prototype.changeDirection = function(radians) {
  this.direction += radians;
};

Ship.prototype.slowDownShip = function() {
  this.vel = Util.scale(this.vel, 0.99);
};

Ship.prototype.draw = function(shipCtx) {
  shipCtx.beginPath();

  shipCtx.moveTo(this.pos[0] + 10*Math.cos(this.direction),
    this.pos[1] - 10*Math.sin(this.direction));
  shipCtx.lineTo(this.pos[0] + 10*Math.cos(this.direction
    + Math.PI - Math.PI/8), this.pos[1] - 10*Math.sin(this.direction
      + Math.PI - Math.PI/8));
  shipCtx.lineTo(this.pos[0] + 10*Math.cos(this.direction + Math.PI
    + Math.PI/8), this.pos[1] - 10*Math.sin(this.direction + Math.PI
      + Math.PI/8));
  shipCtx.closePath();
  shipCtx.strokeStyle="red";
  shipCtx.stroke();
  //shipCtx.drawImage(imageRepository.spaceship, this.pos[0], this.pos[1]);
};

Ship.prototype.fireBullet = function() {
  var norm = Util.norm(this.vel);

  // do nothing if velocity vector has norm 0
  if (norm === 0) {
    return;
  }

  // relative velocity vector of the bullet is the normalized velocity vector
  // times the Bullet.SPEED constant
  var relVel = Util.scale(
    Util.dir(this.vel),
    Bullet.SPEED
  );

  // bullet velocity adds the ship's velocity to the bullet's default speed
  var bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
  ];

  var options = {
    pos: this.pos,
    vel: bulletVel,
    color: "red",
    game: this.game
  };
  var bullet = new Bullet(options);

  this.game.add(bullet);
};

module.exports = Ship;
