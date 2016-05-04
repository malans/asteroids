/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroids = __webpack_require__(1);
	var AssetRepository = __webpack_require__(9);
	var AssetPaths = __webpack_require__(10);
	
	for (var path in AssetPaths) {
	    if (AssetPaths.hasOwnProperty(path)) {
	       AssetRepository.queueDownload(AssetPaths[path]);
	    }
	}
	
	AssetRepository.downloadAll(Asteroids.gameIntro.bind(Asteroids));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var GameView = __webpack_require__(8);
	var AssetRepository = __webpack_require__(9);
	var AssetPaths = __webpack_require__(10);
	
	var Asteroids = {
	
	  gameIntro: function() {
	    var bgCanvas = document.getElementById('background');
	    bgCanvas.width = Game.DIM_X;
	    bgCanvas.height = Game.DIM_Y;
	    var bgContext = bgCanvas.getContext('2d');
	
	    //draw the background
	    bgContext.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);
	
	    //draw the logo
	    var asteroidsLogo = AssetRepository.getAsset(AssetPaths.asteroidsLogo);
	    bgContext.drawImage(asteroidsLogo, bgCanvas.width/2 -  asteroidsLogo.width/2, 50 );
	
	    //draw the button
	    var playGameButton = AssetRepository.getAsset(AssetPaths.playGameButton);
	    bgContext.drawImage(playGameButton, 50, Game.DIM_Y - 50 - playGameButton.height);
	    // bgContext.font = "48px serif";
	    // bgContext.strokeStyle = "white";
	    // bgContext.strokeText(" Play Game", 50, 550);
	
	    function windowToCanvas(canvas, x, y) {
	       var rect = canvas.getBoundingClientRect();
	
	       return { x: x - rect.left,
	                y: y - rect.top
	              };
	    }
	
	    bgCanvas.onmousedown = function (e) {
	       var loc = windowToCanvas(bgCanvas, e.clientX, e.clientY);
	       if ((loc.x > 50) && (loc.x < playGameButton.width + 50)
	          && (loc.y > Game.DIM_Y - 50 - playGameButton.height)
	          && (loc.y < Game.DIM_Y - 50)) {
	            this.startGame();
	          }
	    }.bind(this);
	  },
	
	  startGame: function() {
	    // draw the background
	    var bgCanvas = document.getElementById('background');
	    bgCanvas.width = Game.DIM_X;
	    bgCanvas.height = Game.DIM_Y;
	    var bgContext = bgCanvas.getContext('2d');
	    bgContext.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    bgContext.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);
	
	    var gameCanvas = document.getElementById("game-canvas");
	    gameCanvas.width = Game.DIM_X;
	    gameCanvas.height = Game.DIM_Y;
	    var mainCtx = gameCanvas.getContext("2d");
	
	    var shipCanvas = document.getElementById("ship-canvas");
	    shipCanvas.width = Game.DIM_X;
	    shipCanvas.height = Game.DIM_Y;
	    var shipCtx = shipCanvas.getContext("2d");
	
	    var game = new Game();
	
	    new GameView(game, mainCtx, shipCtx).start();
	  }
	};
	
	module.exports = Asteroids;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var Bullet = __webpack_require__(7);
	var Ship = __webpack_require__(6);
	
	var Game = function() {
	  this.num_asteroids = 3;
	  this.asteroids = [];
	  this.ship = new Ship(this.randomPosition(), this);
	  this.bullets = [];
	  this.score = 0;
	  this.addAsteroids();
	};
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	
	Game.prototype.addAsteroids = function() {
	
	  for (var i = 0; i < this.num_asteroids; i++) {
	    this.asteroids.push(this.randomAsteroid());
	  }
	};
	
	Game.prototype.allObjects = function() {
	  return [].concat(this.ship, this.asteroids, this.bullets);
	};
	
	Game.prototype.add = function(object) {
	
	  if (object.type === "Asteroid") {
	    this.asteroids.push(object);
	  } else if (object.type === "Bullet") {
	    this.bullets.push(object);
	  } else if (object.type === "Ship") {
	    this.ships.push(object);
	  }
	
	};
	
	Game.prototype.randomAsteroid = function() {
	  return new Asteroid({pos: this.randomPosition(), game: this});
	};
	
	Game.prototype.randomPosition = function() {
	
	  return [Math.random()*Game.DIM_X, Math.random()*Game.DIM_Y];
	};
	
	Game.prototype.draw = function(mainCtx, shipCtx) {
	  var allObjects = this.allObjects();
	
	  mainCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  shipCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  for (var i = 0; i < allObjects.length; i++) {
	    if (allObjects[i].type === "Ship") {
	      allObjects[i].draw(shipCtx);
	    } else {
	      allObjects[i].draw(mainCtx);
	    }
	  }
	};
	
	Game.prototype.moveObjects = function(delta) {
	  var allObjects = this.allObjects();
	
	  for (var i = 0; i < allObjects.length; i++) {
	    allObjects[i].move(delta);
	  }
	};
	
	Game.prototype.checkCollisions = function() {
	  var allObjects = this.allObjects();
	
	  for (var i = 0; i < allObjects.length; i++) {
	    for (var j = 0; j < allObjects.length; j++) {
	      if (allObjects[i] == allObjects[j]) {
	        continue;
	      }
	      if (allObjects[i].isCollidedWith(allObjects[j])) {
	        allObjects[i].collideWith(allObjects[j]);
	      }
	    }
	  }
	};
	
	Game.prototype.increaseScore = function() {
	  this.score += 10;
	};
	
	Game.prototype.step = function(delta) {
	  this.ship.slowDownShip();
	  this.moveObjects(delta);
	  this.checkCollisions();
	};
	
	Game.prototype.remove = function(object) {
	
	  if (object.type === "Asteroid") {
	    var idx = this.asteroids.indexOf(object);
	    this.asteroids[idx] = new Asteroid({ game: this });
	  } else if (object.type === "Bullet") {
	      this.bullets.splice(this.bullets.indexOf(object), 1);
	  } else if (object.type === "Ship") {
	      this.ships.splice(this.ships.indexOf(object), 1);
	  }
	};
	
	Game.prototype.wrap = function(pos) {
	  var newPos = pos.slice();
	
	  if (pos[0] > Game.DIM_X) {
	    newPos[0] = 0;
	  } else if (pos[0] < 0) {
	    newPos[0] = Game.DIM_X;
	  }
	
	  if (pos[1] > Game.DIM_Y) {
	    newPos[1] = 0;
	  } else if (pos[1] < 0) {
	    newPos[1] = Game.DIM_Y;
	  }
	
	  return newPos;
	
	};
	
	Game.prototype.isOutOfBounds = function(pos) {
	
	  if (pos[0] > Game.DIM_X || pos[0] < 0 || pos[1] > Game.DIM_Y || pos[1] < 0) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Ship = __webpack_require__(6);
	
	var DEFAULTS = {
		COLOR: "#505050",
		RADIUS: 25,
		SPEED: 1
	};
	
	var Asteroid = function(options) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Asteroid, MovingObject);
	
	Asteroid.prototype.collideWith = function(otherObject) {
	  if (otherObject.type === "Ship") {
	    otherObject.relocate();
	  }
	};
	
	
	
	// Overrides moving object's draw method
	Asteroid.prototype.draw = function(ctx) {
	  ctx.beginPath();
	  ctx.moveTo(this.pos[0],this.pos[1]);
	  ctx.bezierCurveTo(this.pos[0], this.pos[1] - 50, this.pos[0]
	    + 50, this.pos[1] - 50, this.pos[0] + 50, this.pos[1]);
	  ctx.bezierCurveTo(this.pos[0] + 50, this.pos[1] + 25, this.pos[0],
	    this.pos[1] + 25, this.pos[0], this.pos[1]);
	  ctx.stroke();
	  ctx.fillStyle = "red";
	  ctx.fill();
	};
	
	Asteroid.prototype.type = "Asteroid";
	
	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = {
	
	  inherits: function (ChildClass, BaseClass) {
	    var Surrogate = function() { this.constructor = ChildClass; };
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	
	  // Return a randomly oriented vector with the given length.
	  randomVec: function(length) {
	    var deg = 2 * Math.PI * Math.random();
	
	    var rv = Util.scale([Math.sin(deg), Math.cos(deg)], length);
	    return rv;
	  },
	
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	// Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	
	// Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	// Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	var MovingObject = function (options, game) {
	  this.pos = options["pos"];  // two element array
	  this.vel = options["vel"];  // two element array
	  this.radius = options["radius"];
	  this.color = options["color"];
	  this.game = options["game"];
	};
	
	MovingObject.prototype.isWrappable = true;
	
	MovingObject.prototype.draw = function(mainCtx) {
	  mainCtx.fillStyle = this.color;
	  mainCtx.beginPath();
	
	  mainCtx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	
	  mainCtx.fill();
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function(timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
	  var offsetX = this.vel[0] * velocityScale;
	  var offsetY = this.vel[1] * velocityScale;
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	  if (this.isWrappable === true) {
	    this.pos = this.game.wrap(this.pos);
	  } else {
	    if (this.game.isOutOfBounds(this.pos) === true) {
	      this.game.remove(this);
	    }
	  }
	};
	
	// Find distance to other object (Pythagoras)
	MovingObject.prototype.distance = function(otherObject) {
	  return Math.sqrt(
	    Math.pow(this.pos[0] - otherObject.pos[0], 2)
	    + Math.pow(this.pos[1] - otherObject.pos[1], 2));
	};
	
	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  if (this.distance(otherObject) <= (this.radius + otherObject.radius)) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	MovingObject.prototype.collideWith = function(otherObject) {
	  
	};
	
	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(5);
	var Util = __webpack_require__(4);
	var Bullet = __webpack_require__(7);
	
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
	    pos: this.pos,
	    vel: bulletVel,
	    color: "red",
	    game: this.game
	  };
	  var bullet = new Bullet(options);
	
	  this.game.add(bullet);
	};
	
	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Asteroid = __webpack_require__(3);
	
	var Bullet = function(options) {
	  options.radius = Bullet.RADIUS;
	  MovingObject.call(this, options);
	};
	
	Bullet.RADIUS = 3;
	Bullet.SPEED = 15;
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.isWrappable = false;
	Bullet.prototype.type = "Bullet";
	
	Bullet.prototype.collideWith = function(otherObject) {
	  if (otherObject.type === "Asteroid") {
	    this.game.remove(this);
	    this.game.remove(otherObject);
	    this.game.increaseScore();
	  }
	
	};
	
	module.exports = Bullet;


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	var AssetRepository = function() {
	  this.successCount = 0;
	  this.errorCount = 0;
	  this.cache = {};
	  this.downloadQueue = [];
	};
	
	AssetRepository.prototype.queueDownload = function(path) {
	  this.downloadQueue.push(path);
	};
	
	AssetRepository.prototype.downloadAll = function(downloadCallback) {
	  if (this.downloadQueue.length === 0) {
	    downloadCallback();
	  }
	
	  for (var i = 0; i < this.downloadQueue.length; i++) {
	      var path = this.downloadQueue[i];
	      var img = new Image();
	      var that = this;
	      img.addEventListener("load", function() {
	          that.successCount += 1;
	          if (that.isDone()) {
	              downloadCallback();
	          }
	      }, false);
	      img.addEventListener("error", function() {
	          that.errorCount += 1;
	          if (that.isDone()) {
	              downloadCallback();
	          }
	      }, false);
	      img.src = path;
	      this.cache[path] = img;
	  }
	};
	
	AssetRepository.prototype.isDone = function() {
	    return (this.downloadQueue.length === this.successCount + this.errorCount);
	};
	
	AssetRepository.prototype.getAsset = function(path) {
	    return this.cache[path];
	};
	
	module.exports = new AssetRepository;


/***/ },
/* 10 */
/***/ function(module, exports) {

	var AssetPaths = {
	  background: "./bg.png",
	  asteroidsLogo: "./asteroids_logo.png",
	  playGameButton: "./playGame.png"
	};
	
	module.exports = AssetPaths;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map