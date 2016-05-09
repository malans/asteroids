/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroids = __webpack_require__(1);
	var AssetRepository = __webpack_require__(10);
	var AssetPaths = __webpack_require__(11);

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
	var GameView = __webpack_require__(12);
	var AssetRepository = __webpack_require__(10);
	var AssetPaths = __webpack_require__(11);

	var Asteroids = {

	  gameIntro: function() {
	    var bgCanvas = document.getElementById('background');
	    bgCanvas.width = Game.DIM_X;
	    bgCanvas.height = Game.DIM_Y;
	    var bgCtx = bgCanvas.getContext('2d');

	    //draw the background
	    bgCtx.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);

	    //draw the logo
	    var asteroidsLogo = AssetRepository.getAsset(AssetPaths.asteroidsLogo);
	    bgCtx.drawImage(asteroidsLogo, bgCanvas.width/2 -  asteroidsLogo.width/2, 50 );

	    //draw the button
	    var playGameButton = AssetRepository.getAsset(AssetPaths.playGameButton);
	    bgCtx.drawImage(playGameButton, 50, Game.DIM_Y - 50 - playGameButton.height);
	    // bgCtx.font = "48px serif";
	    // bgCtx.strokeStyle = "white";
	    // bgCtx.strokeText(" Play Game", 50, 550);

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
	    var bgCtx = bgCanvas.getContext('2d');
	    bgCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    bgCtx.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Game.DIM_X, Game.DIM_Y);

	    // canvas for objects other than ship
	    var gameCanvas = document.getElementById("game-canvas");
	    gameCanvas.width = Game.DIM_X;
	    gameCanvas.height = Game.DIM_Y;
	    var mainCtx = gameCanvas.getContext("2d");

	    // canvas for the ship
	    var shipCanvas = document.getElementById("ship-canvas");
	    shipCanvas.width = Game.DIM_X;
	    shipCanvas.height = Game.DIM_Y;
	    var shipCtx = shipCanvas.getContext("2d");

	    //draw the score count
	    shipCtx.font = "48px sans-serif";
	    shipCtx.strokeStyle = "white";
	    shipCtx.strokeText("0", 50, 550);

	    var game = new Game();

	    new GameView(game, bgCtx, mainCtx, shipCtx).start();
	  }
	};

	module.exports = Asteroids;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var AssetRepository = __webpack_require__(10);
	var AssetPaths = __webpack_require__(11);
	var NewSprites = __webpack_require__(9);
	var Util = __webpack_require__(4);
	var Constants = __webpack_require__(14);

	var Game = function() {
	  this.lives = 3;
	  this.num_asteroids = 0;
	  this.asteroids = [];
	  this.asteroidChunks = [];
	  this.time = 0;
	  this.ship = this.addShip(); //new Ship(this.randomPosition(), this);
	  this.bullets = [];
	  this.sprites = [];
	  this.score = 0;
	  this.addAsteroids();
	};

	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.canvasBorder = 128;

	Game.prototype.addShip = function() {
	  return NewSprites.newSpaceShip(
	    {pos: this.randomPosition(),
	    game: this}
	  );
	};

	Game.prototype.addAsteroids = function() {
	  for (var i = 0; i < this.num_asteroids; i++) {
	    this.add(this.randomAsteroid());
	  }
	};

	Game.prototype.splitAsteroidIntoChunks = function(asteroid) {
	  if (asteroid.scale > 0.7) {
	    for (var i = 0; i < 3; i++) {
	      this.add(NewSprites.newRotatingAsteroid(
	        {pos: [asteroid.pos[0], asteroid.pos[1]],
	         vel: Util.randomVec(Constants.AsteroidDEFAULTS.SPEED/2),
	         scaleMin: 0.4,
	         scaleMax: 0.7,
	         chunk: true,
	         game: this}));
	    }
	  } else if ((0.4 < asteroid.scale) && (asteroid.scale <= 0.7)) {
	    // for (var i = 0; i < 3; i++) {
	    //   this.add(NewSprites.newRotatingAsteroid(
	    //     {pos: [asteroid.pos[0], asteroid.pos[1]],
	    //      vel: Util.randomVec(Constants.AsteroidDEFAULTS.SPEED/4),
	    //      scaleMin: 0.2,
	    //      scaleMax: 0.4,
	    //      chunk: true,
	    //      game: this}));
	    // }
	  }
	  this.remove(asteroid);
	};

	Game.prototype.allObjects = function() {
	  if (this.ship.visible === true) {
	    return [].concat(this.ship, this.asteroids, this.asteroidChunks, this.bullets, this.sprites);
	  } else {
	    return [].concat(this.asteroids, this.asteroidChunks, this.bullets, this.sprites);
	  }
	};

	Game.prototype.add = function(object) {

	  if (object.type === "Asteroid") {
	    if (object.chunk === false) {
	      this.asteroids.push(object);
	    } else {
	      this.asteroidChunks.push(object);
	    }
	  } else if (object.type === "Bullet") {
	    this.bullets.push(object);
	  } else if (object.type === "Ship") {
	    this.ships.push(object);
	  } else if (object.type === "Sprite") {
	    this.sprites.push(object);
	  }

	};

	Game.prototype.randomAsteroid = function() {
	  return NewSprites.newRotatingAsteroid({pos: this.randomPosition(), game: this, scale: 0.8});
	};

	Game.prototype.randomAsteroidCanvasBorder = function() {
	  return NewSprites.newRotatingAsteroid({pos: this.randomPositionOnBorders(), game: this, scale: 0.8});
	},

	Game.prototype.randomPosition = function() {
	  return [Math.random()*Game.DIM_X, Math.random()*Game.DIM_Y];
	};

	Game.prototype.randomPositionOnBorders = function() {
	  var borders = ["x", "y"];
	  var border = borders[Util.randomInteger(0,1)];
	  var pos;
	  if (border === "y") {
	    pos = [[0 - Game.canvasBorder, Game.DIM_X][Util.randomInteger(0,1)], Math.random()*Game.DIM_Y];
	  } else {
	    pos = [Math.random()*Game.DIM_X, [0 - Game.canvasBorder, Game.DIM_Y][Util.randomInteger(0,1)]];
	  }
	  return pos;
	},

	Game.prototype.draw = function(bgCtx, mainCtx, shipCtx, timeDelta) {
	  var allObjects = this.allObjects();

	  mainCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  shipCtx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

	  shipCtx.font = "48px sans-serif";
	  shipCtx.fillStyle = "white";
	  shipCtx.fillText(this.score, 50, 550);

	  for (var i = 0; i < allObjects.length; i++) {
	    if (allObjects[i].type === "Ship") {
	      allObjects[i].draw(shipCtx, timeDelta);
	    } else if (allObjects[i].type === "Sprite") {
	      allObjects[i].draw(mainCtx, timeDelta);
	    } else {
	      allObjects[i].draw(mainCtx, timeDelta);
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

	Game.prototype.step = function(timeDelta, time) {
	  this.time = time;
	  this.ship.slowDownShip();
	  this.moveObjects(timeDelta);
	  this.checkCollisions();
	};

	Game.prototype.remove = function(object) {

	  if (object.type === "Asteroid") {
	    if (object.chunk === false) {
	      var idx = this.asteroids.indexOf(object);
	      this.asteroids[idx] = this.randomAsteroidCanvasBorder();
	    } else {
	      this.asteroidChunks.splice(this.asteroidChunks.indexOf(object), 1);
	    }
	  } else if (object.type === "Bullet") {
	      this.bullets.splice(this.bullets.indexOf(object), 1);
	  } else if (object.type === "Ship") {
	      this.ship.visible = false;
	  } else if (object.type === "Sprite") {
	     this.sprites.splice(this.sprites.indexOf(object), 1);
	  }
	};

	Game.prototype.wrap = function(pos) {
	  var newPos = pos.slice();

	  if (pos[0] > (Game.DIM_X)) {
	    newPos[0] = 0 - Game.canvasBorder;
	  } else if (pos[0] < 0 - Game.canvasBorder) {
	    newPos[0] = Game.DIM_X;
	  }

	  if (pos[1] > Game.DIM_Y) {
	    newPos[1] = 0 - Game.canvasBorder;
	  } else if (pos[1] < (0 - Game.canvasBorder)) {
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
	var Sprite = __webpack_require__(8);
	var Constants = __webpack_require__(14);

	function Asteroid (options) {
	  options.radius = Constants.AsteroidDEFAULTS.RADIUS;
		this.chunk = options.chunk || false;
	  Sprite.call(this, options);

	}

	Util.inherits(Asteroid, Sprite);

	Asteroid.prototype.collideWith = function(otherObject) {
	  if (otherObject.type === "Ship") {
	    otherObject.relocate();
	  }
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

	  newVec: function(deg, length) {
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
	  },

	  randomInteger: function(min, max) {
	    if (min > max) {
	      return;
	    }

	    var diff = max - min;
	    return Math.floor(Math.random()*(diff + 1) + min);
	  },

	  arrayRotate: function(arr, reverse, times) {
	    for (var i = 0; i < times; i++) {
	      if(reverse)
	        arr.unshift(arr.pop());
	      else
	        arr.push(arr.shift());
	    }
	    return arr;
	  }

	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(14);
	var Util = __webpack_require__(4);

	var MovingObject = function (options) {
	  this.pos = options.pos || options.game.randomPosition();  // two element array
	  this.vel = options.vel || Util.randomVec(Constants.AsteroidDEFAULTS.SPEED);  // two element array
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
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

	// var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function(timeDelta) {
	  //timeDelta is number of milliseconds since last move
	  //if the computer is busy the time delta will be larger
	  //in this case the MovingObject should move farther in this frame
	  //velocity of object is how far it should move in 1/60th of a second
	  var velocityScale = timeDelta / Constants.movingObject.NORMAL_FRAME_TIME_DELTA;
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
	  // console.log(this.pos);
	};

	// Find distance to other object (Pythagoras)
	MovingObject.prototype.distance = function(otherObject) {
	  return Math.sqrt(
	    Math.pow((this.pos[0] + this.radius) - (otherObject.pos[0] + otherObject.radius), 2)
	    + Math.pow((this.pos[1]+ this.radius) - (otherObject.pos[1] + otherObject.radius), 2));
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  if (otherObject.type === "Asteroid")
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

	var Sprite = __webpack_require__(8);
	var Util = __webpack_require__(4);
	var Bullet = __webpack_require__(7);
	var NewSprites = __webpack_require__(9);
	var Constants = __webpack_require__(14);

	var Ship = function(options) {
	  this.direction = Math.PI / 2;
	  this.visible = true;
	  this.lastBulletFired = options.game.time;
	  options.vel = [0,0],
	  Sprite.call(this, options);
	  // MovingObject.call(this, options);
	};

	Util.inherits(Ship, Sprite);

	Ship.prototype.type = "Ship";

	Ship.prototype.relocate = function() {
	  this.pos = this.game.randomPosition();
	  this.vel = [0, 0];
	};

	Ship.prototype.collideWith = function(otherObject) {
	  if (otherObject.type === "Asteroid") {
	    this.game.remove(this);
	    this.game.splitAsteroidIntoChunks(otherObject);
	    var explosion = NewSprites.newExplosion({pos: this.pos, game: this.game});
	    this.game.add(explosion);
	  }
	};

	Ship.prototype.power = function(impulse) {
	  this.vel[0] += impulse*Math.cos(this.direction);
	  this.vel[1] += -impulse*Math.sin(this.direction);
	};

	Ship.prototype.slowDownShip = function() {
	  this.vel = Util.scale(this.vel, 0.95);
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

	Ship.prototype.draw = function(shipCtx, timeDelta) {
	  this.time += timeDelta;
	  // rotate the ship around it's center point
	  shipCtx.save();
	  shipCtx.translate(this.pos[0]+this.width*this.scale*0.5, this.pos[1]+this.height*this.scale*0.5);
	  shipCtx.rotate(-this.direction);
	  shipCtx.translate(-(this.pos[0]+this.width*this.scale*0.5), -(this.pos[1]+this.height*this.scale*0.5));
	  // call superclass's draw method (Sprite.draw)
	  debugger;
	  Object.getPrototypeOf(this.constructor.prototype).draw.bind(this)(shipCtx, timeDelta);
	  shipCtx.restore();
	};

	Ship.prototype.move = function(timeDelta) {
	  Object.getPrototypeOf(this.constructor.prototype).move.bind(this)(timeDelta);
	  var directionScale = timeDelta / Constants.movingObject.NORMAL_FRAME_TIME_DELTA;
	  if (key.isPressed("right")) {
	    this.direction -= directionScale*Constants.ship.DIRECTION_CHANGE_SPEED;
	  } else if (key.isPressed("left")) {
	    this.direction += directionScale*Constants.ship.DIRECTION_CHANGE_SPEED;
	  }
	  if (key.isPressed("up")) {
	    this.power(Constants.ship.POWER);
	  }
	  if (key.isPressed("space")) {
	    if (this.game.time - this.lastBulletFired > 100) {
	      this.fireBullet();
	      this.lastBulletFired = this.game.time;
	  }
	}
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
	    pos: [this.pos[0] + this.scaledWidth()*0.5, this.pos[1] + this.scaledHeight()*0.5],
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
	var Sprite = __webpack_require__(8);
	var NewSprites = __webpack_require__(9);

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
	    this.game.splitAsteroidIntoChunks(otherObject);
	    var explosion = NewSprites.newExplosion({pos:otherObject.pos, game: this.game, scale: otherObject.scale});
	    this.game.add(explosion);
	    this.game.increaseScore();
	  }
	};

	module.exports = Bullet;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(5);
	var Util = __webpack_require__(4);

	function Sprite (options) {
	    this.pos = options.pos;
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

	    //options.radius = this.width*this.scale;

	    MovingObject.call(this, options);
	}

	Util.inherits(Sprite, MovingObject);

	Sprite.prototype.update = function (timeDelta, pos) {
	  if (this.done === true) {
	    this.game.remove(this);
	  }
	  this._index += this.speed*(timeDelta/1000);
	  this.pos = pos;
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var RotatingAsteroid = __webpack_require__(13);
	var Sprite = __webpack_require__(8);
	var AssetRepository = __webpack_require__(10);
	var AssetPaths = __webpack_require__(11);
	var Util = __webpack_require__(4);
	var Ship = __webpack_require__(6);

	var NewSprites = {
	  newExplosion: function(options) {
	    return new Sprite({
	        vel: [0,0],
	        radius: 0,
	        pos: options.pos,
	        game: options.game,
	        spritePos: [0,0],
	        image: AssetRepository.getAsset(AssetPaths.asteroidExplosion),
	        width: 64,
	        height: 64,
	        speed: 30,
	        scale: options.scale || 1,
	        frames: [[0,0], [0,1], [0,2], [0,3], [0,4],
	                 [1,0], [1,1], [1,2], [1,3], [1,4],
	                 [2,0], [2,1], [2,2], [2,3], [2,4],
	                 [3,0], [3,1], [3,2], [3,3], [3,4],
	                 [4,0], [4,1], [4,2], [4,3], [4,4]],
	        once: true});
	  },

	  scaleAsteroid: function() {
	    return Math.random()*0.8 + 0.2;
	  },

	  scaleAsteroidMinMax: function(min, max) {
	    if ((min === undefined) || (max === undefined) || (min > max)) {
	      return;
	    }
	    return Math.random()*((max - min)) + min;
	  },

	  newAsteroid: function(options) {
	    var scale = (this.scaleAsteroidMinMax(options.min, options.max)
	                || this.scaleAsteroid());
	    return new Asteroid({pos: options.pos,
	      game: options.game,
	      spritePos: [0,0],
	      image: AssetRepository.getAsset(AssetPaths.asteroidSprite),
	      width: 128,
	      height: 128,
	      speed: 10,
	      scale: scale,
	      frames: [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [0,7],
	               [1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7],
	               [2,0], [2,1], [2,2], [2,3], [2,4], [2,5], [2,6], [2,7],
	               [3,0], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6], [3,7]],
	      once: false});
	  },

	  newRotatingAsteroid: function(options) {
	    var scale = options.scale || (this.scaleAsteroidMinMax(options.scaleMin, options.scaleMax)
	                || this.scaleAsteroid());
	    var randomSpriteX = Util.randomInteger(0,6);
	    var randomSpriteY = Util.randomInteger(0,7);
	    return new RotatingAsteroid({
	      pos: options.pos,
	      vel: options.vel,
	      game: options.game,
	      spritePos: [0,0],
	      image: AssetRepository.getAsset(AssetPaths.asteroid2Sprite),
	      width: 128,
	      height: 128,
	      speed: 10,
	      scale: scale,
	      frames: [[randomSpriteX, randomSpriteY]],
	      once: false,
	      chunk: options.chunk});
	  },

	  newSpaceShip: function(options) {
	    return new Ship({
	      pos: options.pos,
	      game: options.game,
	      spritePos: [0,0],
	      image: AssetRepository.getAsset(AssetPaths.spaceShip),
	      width: 810,
	      height: 495,
	      speed: 10,
	      scale: 0.1,
	      frames: [[0,0]],
	      once: false});
	  }
	};

	module.exports = NewSprites;


/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports) {

	var AssetPaths = {
	  background: "./imgs/bgg.jpg",
	  asteroidsLogo: "./imgs/asteroids_logo.png",
	  playGameButton: "./imgs/playGame.png",
	  spaceShip: "./imgs/spaceship.png",
	  asteroidSprite: "./imgs/asteroids.png",
	  asteroid2Sprite: "./imgs/asteroids2.png",
	  asteroidExplosion: "./imgs/asteroidExplosion.png"
	};

	module.exports = AssetPaths;


/***/ },
/* 12 */
/***/ function(module, exports) {

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

	  this.game.step(timeDelta, time);
	  this.game.draw(this.bgCtx, this.mainCtx, this.shipCtx, timeDelta);
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

	  key("space", function() { ship.fireBullet() } );

	};

	module.exports = GameView;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(3);
	var Util = __webpack_require__(4);

	// Constructor for an Asteroid that rotates based on canvas rotate, not on
	// multiple sprite sheet images
	function RotatingAsteroid (options) {
	  this.time = 0;
	  this.rotationDirection = [-1,1][Util.randomInteger(0,1)];
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


/***/ },
/* 14 */
/***/ function(module, exports) {

	var Constants = {
	  AsteroidDEFAULTS: {
	  	COLOR: "#505050",
	  	RADIUS: 50,
	  	SPEED: 2
	  },
	  movingObject: {
	    NORMAL_FRAME_TIME_DELTA: 1000/60
	  },
	  ship: {
	    DIRECTION_CHANGE_SPEED: Math.PI/30,
	    POWER: 0.20
	  },
	  gameView: {
	    MOVES: {
	      "up": +1,
	      "left": Math.PI/6,
	      "down": -1,
	      "right": -Math.PI/6,
	    }
	  }
	};

	module.exports = Constants;


/***/ }
/******/ ]);