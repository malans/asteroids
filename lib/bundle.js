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

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(5);
	// var ImageRepository = require("./imageRepository");
	
	
	
	
	// document.addEventListener("DOMContentLoaded", function() {
	//   var bgCanvas = document.getElementById('background');
	//   var bgContext = bgCanvas.getContext('2d');
	//
	//   bgContext.drawImage(ImageRepository.background, 0, 0);
	//   debugger;
	//   var canvasEl = document.getElementById("game-canvas");
	//   var mainCtx = canvasEl.getContext("2d");
	//
	//   canvasEl = document.getElementById("ship-canvas");
	//   var shipCtx = canvasEl.getContext("2d");
	//
	//   var game = new Game();
	//
	//   new GameView(game, mainCtx, shipCtx).start();
	// });
	
	var Asteroids = {
	  startGame: function() {
	    var bgCanvas = document.getElementById('background');
	    var bgContext = bgCanvas.getContext('2d');
	    bgContext.drawImage(ImageRepository.background, 0, 0);
	
	    var canvasEl = document.getElementById("game-canvas");
	    var mainCtx = canvasEl.getContext("2d");
	
	    canvasEl = document.getElementById("ship-canvas");
	    var shipCtx = canvasEl.getContext("2d");
	
	    var game = new Game();
	
	    new GameView(game, mainCtx, shipCtx).start();
	  }
	};
	
	var ImageRepository = new function() {
		// Define images
		this.background = new Image();
	
		// Ensure all images have loaded before starting the game
		var numImages = 1;
		var numLoaded = 0;
	
		function imageLoaded() {
			numLoaded++;
			if (numLoaded === numImages) {
				Asteroids.startGame();
			}
		}
	
		var self = this;
		this.background.onload = function() {
			imageLoaded();
		};
	
		// Set images src
		this.background.src = "./bg.png";
	  //this.spaceship.src = "./imgs/ship.png";
	};
	
	// module.exports = Asteroids;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(2);
	var Bullet = __webpack_require__(6);
	var Ship = __webpack_require__(7);
	
	var Game = function() {
	  this.num_asteroids = 4;
	  this.asteroids = [];
	  this.ship = new Ship(this.randomPosition(), this);
	  this.bullets = [];
	
	  this.addAsteroids();
	};
	
	Game.DIM_X = 600;
	Game.DIM_Y = 360;
	
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
	
	Game.prototype.step = function(delta) {
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Ship = __webpack_require__(7);
	
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
		debugger;
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
/* 3 */
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
/* 4 */
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
	  debugger;
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Asteroid = __webpack_require__(2);
	
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
	  }
	};
	
	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	var Bullet = __webpack_require__(6);
	
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
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};
	
	Ship.prototype.changeDirection = function(radians) {
	  this.direction += radians;
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map