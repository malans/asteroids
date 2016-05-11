var Sprite = require("./sprite");
var Util = require("./util");
var Bullet = require("./bullet");
var Constants = require("./constants");
var AssetRepository = require("./assetRepository");
var AssetPaths = require("./assetPaths");

var Ship = function(options) {
  this.direction = Math.PI / 2;
  this.visible = true;
  this.immune = false;
  this.lastBulletFired = options.game.time;
  options.vel = [0,0],
  Sprite.call(this, options);
};

Util.inherits(Ship, Sprite);

Ship.prototype.type = "Ship";

Ship.newSpaceship = function(options) {
  return new Ship({
    pos: options.pos,
    game: options.game,
    spritePos: [0,0],
    image: AssetRepository.getAsset(AssetPaths.spaceShip),
    width: Constants.Ship.SHIP_SPRITE_WIDTH,
    height: Constants.Ship.SHIP_SPRITE_HEIGHT,
    speed: 0,
    scale: options.scale || Constants.Ship.SHIP_SCALE,
    frames: [[0,0]],
    once: false});
};

Ship.prototype.resetAtCenter = function() {
  this.direction = Math.PI/2;
  this.vel = [0,0];
  this.pos = Ship.getCenterPosition();
};

Ship.prototype.collideWith = function(otherObject) {
  if (this.immune === false && otherObject.type === "Asteroid") {
    this.game.shipCrash(this, otherObject);
  }
};

Ship.getCenterPosition = function() {
  return [(Constants.Game.DIM_X
          - Constants.Ship.SHIP_SPRITE_WIDTH*Constants.Ship.SHIP_SCALE)*0.5,
         (Constants.Game.DIM_Y
          - Constants.Ship.SHIP_SPRITE_HEIGHT*Constants.Ship.SHIP_SCALE)*0.5];
};

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse*Math.cos(this.direction);
  this.vel[1] += -impulse*Math.sin(this.direction);
};

Ship.prototype.slowDownShip = function() {
  this.vel = Util.scale(this.vel, 0.96);
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

Ship.prototype.draw = function(mainCtx, timeDelta) {
  this.time += timeDelta;
  // rotate the ship around it's center point
  mainCtx.save();
  mainCtx.translate(this.pos[0]+this.width*this.scale*0.5, this.pos[1]+this.height*this.scale*0.5);
  mainCtx.rotate(-this.direction);
  mainCtx.translate(-(this.pos[0]+this.width*this.scale*0.5), -(this.pos[1]+this.height*this.scale*0.5));
  // call superclass's draw method (Sprite.draw)
  Object.getPrototypeOf(this.constructor.prototype).draw.bind(this)(mainCtx, timeDelta);
  mainCtx.restore();
};

Ship.prototype.move = function(timeDelta) {
  Object.getPrototypeOf(this.constructor.prototype).move.bind(this)(timeDelta);
  var directionScale = timeDelta / Constants.MovingObject.NORMAL_FRAME_TIME_DELTA;
  if (key.isPressed("right")) {
    this.direction -= directionScale*Constants.Ship.DIRECTION_CHANGE_SPEED;
  } else if (key.isPressed("left")) {
    this.direction += directionScale*Constants.Ship.DIRECTION_CHANGE_SPEED;
  }
  if (key.isPressed("up")) {
    this.power(Constants.Ship.POWER);
  }
  if (key.isPressed("down")) {
    this.power(-Constants.Ship.POWER);
  }
  if (key.isPressed("space")) {
    if (this.game.time - this.lastBulletFired > Constants.Ship.FIRE_BULLET_INTERVAL) {
      this.fireBullet();
      this.lastBulletFired = this.game.time;
    }
  }
  this.slowDownShip();
};

Ship.prototype.fireBullet = function() {

  var direction_vector = [Math.cos(this.direction), -Math.sin(this.direction)];

  // relative velocity vector of the bullet is the normalized velocity vector
  // times the Bullet.SPEED constant
  var relVel = Util.scale(
    Util.dir(direction_vector),
    Constants.Bullet.SPEED
  );

  // bullet velocity adds the ship's velocity to the bullet's default speed
  var bulletVel = [
    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
  ];

  var options = {
    pos: [this.pos[0] + this.scaledWidth()*0.5 - Constants.Bullet.BULLET_SPRITE_WIDTH*0.5,
          this.pos[1] + this.scaledHeight()*0.5 - Constants.Bullet.BULLET_SPRITE_WIDTH*0.5],
    vel: bulletVel,
    game: this.game
  };

  var bullet = newBullet(options);

  this.game.add(bullet);
};

var newBullet = function(options) {
  return new Bullet({
    pos: options.pos,
    vel: options.vel,
    game: options.game,
    spritePos: [0,0],
    image: AssetRepository.getAsset(AssetPaths.bullet),
    width: Constants.Bullet.BULLET_SPRITE_WIDTH,
    height: Constants.Bullet.BULLET_SPRITE_WIDTH,
    speed: 0,
    scale: 1,
    frames: [[0,0]],
    once: false});
};

module.exports = Ship;
