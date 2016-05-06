var Asteroid = require("./asteroid");
var Util = require("./util");

function RotatingAsteroid (options) {
  this.time = 0;
  var directions = [-1, 1]; // -1: clockwise, 1: counter-clockwise
  this.rotationDirection = directions[Math.floor(Math.random()*directions.length)];
  Asteroid.call(this, options);
}

Util.inherits(RotatingAsteroid, Asteroid);

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
