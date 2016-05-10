var GameView = function(game, bgCtx, mainCtx, controlsCtx) {
  this.game = game;
};

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  this.lastTime = 0;
  this.game.drawLives();
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time) {
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta, time);
  this.game.draw(timeDelta);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

GameView.MOVES = {
  "up": +1,
  "left": Math.PI/6,
  "down": -1,
  "right": -Math.PI/6,
};

GameView.prototype.bindKeyHandlers = function() {
  var ship = this.game.ship;

  // key('left', function () { ship.changeDirection(GameView.MOVES['left']); });
  // key('right', function () { ship.changeDirection(GameView.MOVES['right']); });
  // Object.keys(GameView.MOVES).forEach(function (k) {
  //   var move = GameView.MOVES[k];
  //   key(k, function () { ship.power(move); });
  // });

  //key("space", function() { ship.fireBullet() } );

};

module.exports = GameView;
