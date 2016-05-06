var Util = require("./util");
var MovingObject = require("./movingObject");
var Ship = require("./ship");
var Sprite = require("./sprite");

var DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 50,
	SPEED: 2
};

function Asteroid (options) {
  // options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  Sprite.call(this, options);

}

Util.inherits(Asteroid, Sprite);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.type === "Ship") {
    otherObject.relocate();
  }
};

// Asteroid.prototype.draw = function(ctx, timeDelta) {
//
// 	ctx.save();
// 	ctx.translate(this.pos[0]-this.width*0.5, this.pos[1]-this.height*0.5);
// 	ctx.rotate((Math.PI/180)*((timeDelta/1000) % 1000));
// 	ctx.translate(-(this.pos[0]-this.width*0.5), -(this.pos[1]-this.height*0.5));
// 	// call superclass's draw method (Sprite.draw)
// 	Object.getPrototypeOf(this.constructor.prototype).draw.bind(this)(ctx, timeDelta);
// 	ctx.restore();
// };

Asteroid.prototype.type = "Asteroid";

module.exports = Asteroid;
