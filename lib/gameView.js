var GameView = function(game, bgCtx, mainCtx, shipCtx) {
  this.game = game;
  this.bgCtx = bgCtx;
  this.mainCtx = mainCtx;
  this.shipCtx = shipCtx;
};

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  this.lastTime = 0;

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time) {
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.bgCtx, this.mainCtx, this.shipCtx, timeDelta);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

GameView.MOVES = {
  "up": +1,
  "left": Math.PI/15,
  "down": -1,
  "right": -Math.PI/15,
};

GameView.prototype.bindKeyHandlers = function() {
  var ship = this.game.ship;

  key('left', function () { ship.changeDirection(GameView.MOVES['left']); });
  key('right', function () { ship.changeDirection(GameView.MOVES['right']); });
  key('up', function () { ship.power(GameView.MOVES['up']); });
  key('down', function () { ship.power(GameView.MOVES['down']); });
  // Object.keys(GameView.MOVES).forEach(function (k) {
  //   var move = GameView.MOVES[k];
  //   key(k, function () { ship.power(move); });
  // });

  key("space", function() { ship.fireBullet() } );

};

module.exports = GameView;
