var GameView = function(game, mainCtx, shipCtx) {
  this.game = game;
  this.mainCtx = mainCtx;
  this.shipCtx = shipCtx;
};

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  this.lastTime = 0;

  requestAnimationFrame(this.animate.bind(this));
  // setInterval(function() {
  //   self.game.step();
  //   self.game.draw(self.ctx);
  // }, 20);
};

GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;
  
  this.game.step(timeDelta);
  this.game.draw(this.mainCtx, this.shipCtx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

GameView.MOVES = {
  "w": [ 0, -0.5],
  "a": Math.PI/15,
  "x": [ 0,  0.5],
  "d": -Math.PI/15,
};

GameView.prototype.bindKeyHandlers = function() {
  var ship = this.game.ship;

  key('a', function () { ship.changeDirection(GameView.MOVES['a']); });
  key('d', function () { ship.changeDirection(GameView.MOVES['d']); });
  key('w', function () { ship.power(GameView.MOVES['w']); });
  key('x', function () { ship.power(GameView.MOVES['x']); });
  // Object.keys(GameView.MOVES).forEach(function (k) {
  //   var move = GameView.MOVES[k];
  //   key(k, function () { ship.power(move); });
  // });

  key("space", function() { ship.fireBullet() } );

};

module.exports = GameView;
