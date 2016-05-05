var MovingObject = require("./movingObject");
var Util = require("./util");

function Sprite (options) {
    this.canvasPos = options.canvasPos;
    this.spritePos = options.spritePos;
    this.image = options.image;
    this.width = options.width;
    this.height = options.height;
    this.speed = typeof options.speed === 'number' ? options.speed : 0;
    this.frames = options.frames;
    this._index = 0;
    this.once = options.once;
    this.done = false;

    MovingObject.call(this, options);
}

Util.inherits(Sprite, MovingObject);

Sprite.prototype.update = function (timeDelta, canvasPos) {
  // if (this.done === true) {
  //   this.game.remove(this);
  // }
  this._index += this.speed*(timeDelta/1000);
  this.canvasPos = canvasPos;
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
               this.canvasPos[0], this.canvasPos[1],
               this.width, this.height);

};

Sprite.prototype.type = "Sprite";

module.exports = Sprite;
