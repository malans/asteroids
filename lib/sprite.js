var MovingObject = require("./movingObject");
var Util = require("./util");

function Sprite (options) {
    this.spritePos = options.spritePos;
    this.image = options.image;
    this.width = options.width;
    this.height = options.height;
    this.speed = typeof options.speed === 'number' ? options.speed : 0;
    this.frames = options.frames;
    this._index = 0;
    this.scale = options.scale || 1;
    this.once = options.once;
    this.done = false;

    options.radius = this.scaledWidth()*0.45;

    MovingObject.call(this, options);
}

Util.inherits(Sprite, MovingObject);

Sprite.prototype.update = function (timeDelta, pos) {
  if (this.done === true) {
    this.game.remove(this);
  }
  this._index += this.speed*(timeDelta/1000);
  // this.pos = pos;
};

Sprite.prototype.scaledWidth = function() {
  return this.width*this.scale;
};

Sprite.prototype.scaledHeight = function() {
  return this.height*this.scale;
};

Sprite.prototype.draw = function (ctx, timeDelta) {
  this.update(timeDelta, this.pos);
  if (this.done === true) {
    return;
  }

  var frame;

  if (this.speed > 0) {
    var max = this.frames.length;
    var idx = Math.floor(this._index);
    frame = this.frames[idx % max];
    if (this.once && idx >= max) {
      this.done = true;
      return;
    }
  } else {
    frame = [0,0];
  }

  var x = this.spritePos[0];
  var y = this.spritePos[1];

  x += frame[1] * this.width;
  y += frame[0] * this.height;

  // Draw the animation
  ctx.drawImage(this.image,
               x, y,
               this.width, this.height,
               this.pos[0], this.pos[1],
               this.scaledWidth(), this.scaledHeight());
};

Sprite.prototype.type = "Sprite";

module.exports = Sprite;
