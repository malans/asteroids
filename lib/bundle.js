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

	var GameView = __webpack_require__(1);
	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	
	for (var path in AssetPaths) {
	    if (AssetPaths.hasOwnProperty(path)) {
	       AssetRepository.queueDownload(AssetPaths[path]);
	    }
	}
	var gameView = new GameView();
	AssetRepository.downloadAll(gameView.gameIntro.bind(gameView));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	var Util = __webpack_require__(7);
	var Constants = __webpack_require__(10);
	
	var GameView = function() {
	  this.game = undefined;
	};
	
	GameView.prototype.gameIntro = function() {
	  //draw the background
	  var bgCanvas = document.getElementById('background');
	  bgCanvas.width = Constants.Game.DIM_X;
	  bgCanvas.height = Constants.Game.DIM_Y;
	  var bgCtx = bgCanvas.getContext('2d');
	  bgCtx.drawImage(AssetRepository.getAsset(AssetPaths.background), 0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);
	
	  // canvas for game objects
	  var mainCanvas = document.getElementById("main-canvas");
	  mainCanvas.width = Constants.Game.DIM_X;
	  mainCanvas.height = Constants.Game.DIM_Y;
	  var mainCtx = mainCanvas.getContext("2d");
	
	  // canvas for the game controls
	  var controlsCanvas = document.getElementById("controls-canvas");
	  controlsCanvas.width = Constants.Game.DIM_X;
	  controlsCanvas.height = Constants.Game.DIM_Y;
	  var controlsCtx = controlsCanvas.getContext("2d");
	
	  //draw the Play Game button
	  var fontSize = 48;
	  controlsCtx.font = fontSize + "px sans-serif";
	  controlsCtx.fillStyle = "white";
	  var text = "Play Game";
	  controlsCtx.fillText(text, 50, Constants.Game.DIM_Y - 50);
	  var playGameButton = controlsCtx.measureText(text);
	
	  //draw the Controls
	  fontSize = 24;
	  controlsCtx.font = fontSize + "px sans-serif";
	  controlsCtx.fillStyle = "white";
	  text = "Spacebar to shoot";
	  controlsCtx.fillText(text, 750, Constants.Game.DIM_Y - 50);
	  text = "Arrow keys to move";
	  controlsCtx.fillText(text, 750, Constants.Game.DIM_Y - 20);
	
	  //draw Asteroids logo and text
	  fontSize = 75;
	  controlsCtx.font = fontSize + "px sans-serif";
	  text = "Asteroids";
	  var logo = controlsCtx.measureText(text);
	  controlsCtx.fillText(text, (Constants.Game.DIM_X - logo.width)*0.5, Constants.Game.DIM_Y*0.60 - fontSize*0.5);
	
	  this.game = new Game(bgCtx, mainCtx, controlsCtx);
	  this.start();
	
	  // click on Play Game button starts the game
	  controlsCanvas.onmousedown = function (e) {
	     var loc = Util.windowToCanvas(controlsCanvas, e.clientX, e.clientY);
	     if ((loc.x > 50) && (loc.x < playGameButton.width + 50)
	        && (loc.y > Constants.Game.DIM_Y - 50 - fontSize)
	        && (loc.y < Constants.Game.DIM_Y - 50)) {
	          this.game.startGame();
	        }
	  }.bind(this);
	};
	
	GameView.prototype.start = function() {
	  this.lastTime = 0;
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
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	var RotatingAsteroid = __webpack_require__(5);
	var Util = __webpack_require__(7);
	var Constants = __webpack_require__(10);
	var Sprite = __webpack_require__(8);
	var Ship = __webpack_require__(11);
	var NewSprites = __webpack_require__(13);
	
	var Game = function(bgCtx, mainCtx, controlsCtx) {
	  this.bgCtx = bgCtx;
	  this.mainCtx = mainCtx;
	  this.controlsCtx = controlsCtx;
	
	  this.lives = Constants.Game.LIVES;
	  this.num_asteroids = 10;
	  this.asteroids = [];
	  this.asteroidChunks = [];
	  this.time = 0;
	  //this.ship = this.addShip(); //new Ship(this.randomPosition(), this);
	  this.bullets = [];
	  this.sprites = [];
	  this.score = 0;
	  this.gameStarted = false;
	  this.addAsteroids();
	};
	
	Game.prototype.startGame = function() {
	  this.gameStarted = true;
	  this.score = 0;
	  this.lives = Constants.Game.LIVES;
	  this.redrawControlsCanvas();
	  var newShip = this.newShipAtCenter();
	  newShip.visible = false;
	  this.ship = newShip;
	  this.addShipAfterDelay(newShip, 0);
	},
	
	Game.prototype.endGame = function() {
	  delete this.ship;
	  this.drawGameOver();
	};
	
	Game.prototype.drawGameOver = function() {
	  //draw Asteroids logo and text
	  var fontSize = 75;
	  this.controlsCtx.font = fontSize + "px sans-serif";
	  var text = "Game Over";
	  var textDim = this.controlsCtx.measureText(text);
	  this.controlsCtx.fillText(text, (Constants.Game.DIM_X - textDim.width)*0.5, Constants.Game.DIM_Y*0.60 - fontSize*0.5);
	
	  fontSize = 48;
	  text = "New Game";
	  this.controlsCtx.font = fontSize + "px sans-serif";
	  textDim = this.controlsCtx.measureText(text);
	  this.controlsCtx.fillText(text, (Constants.Game.DIM_X - textDim.width)*0.5, (Constants.Game.DIM_Y*0.60 + fontSize*0.5));
	
	  // click on New Game button starts the game again
	  var controlsCanvas = document.getElementById("controls-canvas");
	  var listener = function (e) {
	     var loc = Util.windowToCanvas(controlsCanvas, e.clientX, e.clientY);
	     if ((loc.x > (Constants.Game.DIM_X - textDim.width)*0.5)
	        && (loc.x < textDim.width + (Constants.Game.DIM_X - textDim.width)*0.5)
	        && (loc.y > Constants.Game.DIM_Y*0.60 - fontSize*0.5)
	        && (loc.y < Constants.Game.DIM_Y*0.60 + fontSize*0.5)) {
	          this.startGame();
	          controlsCanvas.removeEventListener("mousedown", listener);
	        }
	  }.bind(this);
	
	  controlsCanvas.addEventListener("mousedown", listener);
	};
	
	Game.prototype.newShipAtCenter = function() {
	  var scale = Constants.Ship.SHIP_SCALE;
	  return Ship.newSpaceship(
	    {pos: Ship.getCenterPosition(),
	    game: this}
	  );
	};
	
	Game.prototype.addAsteroids = function() {
	  for (var i = 0; i < this.num_asteroids; i++) {
	    this.add(this.randomAsteroidCanvasBorder());
	  }
	};
	
	Game.prototype.splitAsteroidIntoChunks = function(asteroid) {
	  if (asteroid.scale > 0.7) {
	    for (var i = 0; i < 2; i++) {
	      this.add(RotatingAsteroid.newRotatingAsteroid(
	        {pos: [asteroid.pos[0], asteroid.pos[1]],
	         vel: Util.randomVec(Constants.Asteroid.SPEED/2),
	         scaleMin: 0.4,
	         scaleMax: 0.7,
	         chunk: true,
	         game: this}));
	    }
	  } else if ((0.4 < asteroid.scale) && (asteroid.scale <= 0.7)) {
	    for (var i = 0; i < 3; i++) {
	      this.add(RotatingAsteroid.newRotatingAsteroid(
	        {pos: [asteroid.pos[0], asteroid.pos[1]],
	         vel: Util.randomVec(Constants.Asteroid.SPEED/4),
	         scaleMin: 0.2,
	         scaleMax: 0.4,
	         chunk: true,
	         game: this}));
	    }
	  }
	  this.remove(asteroid);
	};
	
	Game.prototype.allObjects = function() {
	  if (this.ship && this.ship.visible === true) {
	    return [].concat(this.asteroids, this.asteroidChunks, this.bullets, this.sprites, this.ship);
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
	    object.visible = true;
	  } else if (object.type === "Sprite") {
	    this.sprites.push(object);
	  }
	
	};
	
	Game.prototype.randomAsteroid = function() {
	  return RotatingAsteroid.newRotatingAsteroid({pos: this.randomPosition(), game: this, scale: 0.8});
	};
	
	Game.prototype.randomAsteroidCanvasBorder = function() {
	  return RotatingAsteroid.newRotatingAsteroid({pos: this.randomPositionOnBorders(), game: this, scale: 0.8});
	},
	
	Game.prototype.randomPosition = function() {
	  return [Math.random()*Constants.Game.DIM_X, Math.random()*Constants.Game.DIM_Y];
	};
	
	Game.prototype.randomPositionOnBorders = function() {
	  var borders = ["x", "y"];
	  var border = borders[Util.randomInteger(0,1)];
	  var pos;
	  if (border === "y") {
	    pos = [[0 - Constants.Game.CANVAS_BORDER, Constants.Game.DIM_X][Util.randomInteger(0,1)], Math.random()*Constants.Game.DIM_Y];
	  } else {
	    pos = [Math.random()*Constants.Game.DIM_X, [0 - Constants.Game.CANVAS_BORDER, Constants.Game.DIM_Y][Util.randomInteger(0,1)]];
	  }
	  return pos;
	},
	
	Game.prototype.drawLives = function() {
	  var life = new Sprite({
	    pos: [20,20],
	    game: this,
	    spritePos: [0,0],
	    image: AssetRepository.getAsset(AssetPaths.spaceShip),
	    width: 810,
	    height: 495,
	    speed: 0,
	    scale: 0.05,
	    frames: [[0,0]],
	    once: false});
	  // rotate image: spaceship image is horizontal initially, we need it to be vertical
	  this.controlsCtx.save();
	  this.controlsCtx.translate(life.pos[0]+life.width*life.scale*0.5, life.pos[1]+life.height*life.scale*0.5);
	  this.controlsCtx.rotate(-Math.PI/2);
	  this.controlsCtx.translate(-(life.pos[0]+life.width*life.scale*0.5), -(life.pos[1]+life.height*life.scale*0.5));
	  for (var i = 0; i < this.lives; i++) {
	    life.pos = [20, (i+1)*25];
	    life.draw(this.controlsCtx);
	  }
	  this.controlsCtx.restore();
	};
	
	Game.prototype.draw = function(timeDelta) {
	  var allObjects = this.allObjects();
	
	  this.mainCtx.clearRect(0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);
	  // controlsCtx.clearRect(0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);
	
	  for (var i = 0; i < allObjects.length; i++) {
	    if (allObjects[i].type === "Ship") {
	      allObjects[i].draw(this.mainCtx, timeDelta);
	    } else if (allObjects[i].type === "Sprite") {
	      allObjects[i].draw(this.mainCtx, timeDelta);
	    } else {
	      allObjects[i].draw(this.mainCtx, timeDelta);
	    }
	  }
	
	  if (this.gameStarted === true) {
	    this.mainCtx.font = "48px sans-serif";
	    this.mainCtx.fillStyle = "white";
	    this.mainCtx.fillText(this.score, 50, 550);
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
	
	Game.prototype.shipCrash = function(ship, otherObject) {
	
	  if (otherObject.type === "Asteroid") {
	    this.remove(ship);
	    this.splitAsteroidIntoChunks(otherObject);
	    var explosion = NewSprites.newExplosion({pos: ship.pos, game: this});
	    this.add(explosion);
	    ship.resetAtCenter();
	  }
	
	  this.redrawControlsCanvas();
	  if (this.lives > 0) {
	    this.addShipAfterDelay(ship, 3000);
	  } else {
	    this.endGame();
	  }
	};
	
	Game.prototype.addShipAfterDelay = function(ship, delay) {
	  window.setTimeout(function() {
	    this.add(ship);
	    ship.immune = true;
	    this.removeImmunityAfterDelay(ship);
	  }.bind(this), delay);
	};
	
	Game.prototype.removeImmunityAfterDelay = function(ship) {
	  window.setTimeout(function() {
	    ship.immune = false;
	  }.bind(this), 2000);
	};
	
	Game.prototype.redrawControlsCanvas = function() {
	  this.clearControlsCanvas();
	  this.drawLives();
	};
	
	Game.prototype.clearControlsCanvas = function() {
	  this.controlsCtx.clearRect(0, 0, Constants.Game.DIM_X, Constants.Game.DIM_Y);
	};
	
	Game.prototype.step = function(timeDelta, time) {
	  this.time = time;
	  //this.ship.slowDownShip();
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
	      if (this.ship != undefined) {
	      this.ship.visible = false;
	      this.lives -= 1;
	    }
	  } else if (object.type === "Sprite") {
	     this.sprites.splice(this.sprites.indexOf(object), 1);
	  }
	};
	
	Game.prototype.wrap = function(pos) {
	  var newPos = pos.slice();
	
	  if (pos[0] > (Constants.Game.DIM_X)) {
	    newPos[0] = 0 - Constants.Game.CANVAS_BORDER;
	  } else if (pos[0] < 0 - Constants.Game.CANVAS_BORDER) {
	    newPos[0] = Constants.Game.DIM_X;
	  }
	
	  if (pos[1] > Constants.Game.DIM_Y) {
	    newPos[1] = 0 - Constants.Game.CANVAS_BORDER;
	  } else if (pos[1] < (0 - Constants.Game.CANVAS_BORDER)) {
	    newPos[1] = Constants.Game.DIM_Y;
	  }
	
	  return newPos;
	
	};
	
	Game.prototype.isOutOfBounds = function(pos) {
	
	  if (pos[0] > Constants.Game.DIM_X || pos[0] < 0 || pos[1] > Constants.Game.DIM_Y || pos[1] < 0) {
	    return true;
	  } else {
	    return false;
	  }
	};
	
	module.exports = Game;


/***/ },
/* 3 */
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
/* 4 */
/***/ function(module, exports) {

	var AssetPaths = {
	  background: "./imgs/bgg.jpg",
	  spaceShip: "./imgs/spaceship.png",
	  asteroidSprite: "./imgs/asteroids.png",
	  asteroidExplosion: "./imgs/asteroidExplosion.png",
	  bullet: "./imgs/bullet_strip.png"
	};
	
	module.exports = AssetPaths;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(6);
	var Util = __webpack_require__(7);
	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	
	// Constructor for an Asteroid that rotates based on canvas rotate, not on
	// multiple sprite sheet images
	function RotatingAsteroid (options) {
	  this.time = 0;
	  this.rotationDirection = [-1,1][Util.randomInteger(0,1)];
	  Asteroid.call(this, options);
	}
	
	Util.inherits(RotatingAsteroid, Asteroid);
	
	RotatingAsteroid.newRotatingAsteroid = function(options) {
	  var scale = options.scale || (Asteroid.scaleAsteroidMinMax(options.scaleMin, options.scaleMax)
	              || Asteroid.scaleAsteroid());
	  var randomSpriteX = Util.randomInteger(0,6);
	  var randomSpriteY = Util.randomInteger(0,7);
	  return new RotatingAsteroid({
	    pos: options.pos,
	    vel: options.vel,
	    game: options.game,
	    spritePos: [0,0],
	    image: AssetRepository.getAsset(AssetPaths.asteroidSprite),
	    width: 128,
	    height: 128,
	    speed: 10,
	    scale: scale,
	    frames: [[randomSpriteX, randomSpriteY]],
	    once: false,
	    chunk: options.chunk});
	};
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(7);
	var Sprite = __webpack_require__(8);
	var Constants = __webpack_require__(10);
	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	
	function Asteroid (options) {
	  // options.color = DEFAULTS.COLOR;
	  // options.radius = options.radius;
	  options.vel = Util.randomVec(Constants.Asteroid.SPEED);
		this.chunk = options.chunk || false;
	
	  Sprite.call(this, options);
	
	}
	
	Util.inherits(Asteroid, Sprite);
	
	Asteroid.scaleAsteroid = function() {
	  return Math.random()*0.8 + 0.2;
	};
	
	Asteroid.scaleAsteroidMinMax = function(min, max) {
	  if ((min === undefined) || (max === undefined) || (min > max)) {
	    return;
	  }
	  return Math.random()*((max - min)) + min;
	};
	
	Asteroid.newAsteroid = function(options) {
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
	};
	
	Asteroid.prototype.collideWith = function(otherObject) {
	  if (otherObject.type === "Ship") {
	    otherObject.relocate();
	  }
	};
	
	Asteroid.prototype.type = "Asteroid";
	
	module.exports = Asteroid;


/***/ },
/* 7 */
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
	  },
	
	  windowToCanvas: function(canvas, x, y) {
	     var rect = canvas.getBoundingClientRect();
	
	     return { x: x - rect.left,
	              y: y - rect.top
	            };
	  }
	
	};
	
	module.exports = Util;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(9);
	var Util = __webpack_require__(7);
	
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(10);
	
	var MovingObject = function (options) {
	  this.pos = options.pos || options.game.randomPosition();  // two element array
	  this.vel = options.vel; // two element array
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
	  var velocityScale = timeDelta / Constants.MovingObject.NORMAL_FRAME_TIME_DELTA;
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
/* 10 */
/***/ function(module, exports) {

	var Constants = {
	  Asteroid: {
	  	COLOR: "#505050",
	  	RADIUS: 50,
	  	SPEED: 0.5
	  },
	  
	  Game: {
	    DIM_X: 1000,
	    DIM_Y: 600,
	    CANVAS_BORDER: 128,
	    LIVES: 3
	  },
	
	  MovingObject: {
	    NORMAL_FRAME_TIME_DELTA: 1000/60
	  },
	
	  Ship: {
	    DIRECTION_CHANGE_SPEED: Math.PI/30,
	    POWER: 0.20,
	    FIRE_BULLET_INTERVAL: 100,
	    SHIP_SPRITE_WIDTH: 810,
	    SHIP_SPRITE_HEIGHT: 495,
	    SHIP_SCALE: 0.1
	  },
	
	  GameView: {
	    MOVES: {
	      "up": +1,
	      "left": Math.PI/6,
	      "down": -1,
	      "right": -Math.PI/6,
	    }
	  },
	
	  Bullet: {
	    RADIUS: 3,
	    SPEED: 15,
	    BULLET_SPRITE_WIDTH: 39
	  }
	};
	
	module.exports = Constants;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(8);
	var Util = __webpack_require__(7);
	var Bullet = __webpack_require__(12);
	var Constants = __webpack_require__(10);
	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	
	var Ship = function(options) {
	  this.direction = Math.PI / 2;
	  this.visible = true;
	  this.immune = false;
	  this.lastBulletFired = options.game.time;
	  options.vel = [0,0],
	  Sprite.call(this, options);
	};
	
	Util.inherits(Ship, Sprite);
	
	Ship.prototype.type = "Ship";
	
	Ship.newSpaceship = function(options) {
	  return new Ship({
	    pos: options.pos,
	    game: options.game,
	    spritePos: [0,0],
	    image: AssetRepository.getAsset(AssetPaths.spaceShip),
	    width: Constants.Ship.SHIP_SPRITE_WIDTH,
	    height: Constants.Ship.SHIP_SPRITE_HEIGHT,
	    speed: 0,
	    scale: options.scale || Constants.Ship.SHIP_SCALE,
	    frames: [[0,0]],
	    once: false});
	};
	
	Ship.prototype.resetAtCenter = function() {
	  this.direction = Math.PI/2;
	  this.vel = [0,0];
	  this.pos = Ship.getCenterPosition();
	};
	
	Ship.prototype.collideWith = function(otherObject) {
	  if (this.immune === false && otherObject.type === "Asteroid") {
	    this.game.shipCrash(this, otherObject);
	  }
	};
	
	Ship.getCenterPosition = function() {
	  return [(Constants.Game.DIM_X
	          - Constants.Ship.SHIP_SPRITE_WIDTH*Constants.Ship.SHIP_SCALE)*0.5,
	         (Constants.Game.DIM_Y
	          - Constants.Ship.SHIP_SPRITE_HEIGHT*Constants.Ship.SHIP_SCALE)*0.5];
	};
	
	Ship.prototype.power = function(impulse) {
	  this.vel[0] += impulse*Math.cos(this.direction);
	  this.vel[1] += -impulse*Math.sin(this.direction);
	};
	
	Ship.prototype.slowDownShip = function() {
	  this.vel = Util.scale(this.vel, 0.96);
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
	
	Ship.prototype.draw = function(mainCtx, timeDelta) {
	  this.time += timeDelta;
	  // rotate the ship around it's center point
	  mainCtx.save();
	  mainCtx.translate(this.pos[0]+this.width*this.scale*0.5, this.pos[1]+this.height*this.scale*0.5);
	  mainCtx.rotate(-this.direction);
	  mainCtx.translate(-(this.pos[0]+this.width*this.scale*0.5), -(this.pos[1]+this.height*this.scale*0.5));
	  // call superclass's draw method (Sprite.draw)
	  Object.getPrototypeOf(this.constructor.prototype).draw.bind(this)(mainCtx, timeDelta);
	  mainCtx.restore();
	};
	
	Ship.prototype.move = function(timeDelta) {
	  Object.getPrototypeOf(this.constructor.prototype).move.bind(this)(timeDelta);
	  var directionScale = timeDelta / Constants.MovingObject.NORMAL_FRAME_TIME_DELTA;
	  if (key.isPressed("right")) {
	    this.direction -= directionScale*Constants.Ship.DIRECTION_CHANGE_SPEED;
	  } else if (key.isPressed("left")) {
	    this.direction += directionScale*Constants.Ship.DIRECTION_CHANGE_SPEED;
	  }
	  if (key.isPressed("up")) {
	    this.power(Constants.Ship.POWER);
	  }
	  if (key.isPressed("down")) {
	    this.power(-Constants.Ship.POWER);
	  }
	  if (key.isPressed("space")) {
	    if (this.game.time - this.lastBulletFired > Constants.Ship.FIRE_BULLET_INTERVAL) {
	      this.fireBullet();
	      this.lastBulletFired = this.game.time;
	    }
	  }
	  this.slowDownShip();
	};
	
	Ship.prototype.fireBullet = function() {
	
	  var direction_vector = [Math.cos(this.direction), -Math.sin(this.direction)];
	
	  // relative velocity vector of the bullet is the normalized velocity vector
	  // times the Bullet.SPEED constant
	  var relVel = Util.scale(
	    Util.dir(direction_vector),
	    Constants.Bullet.SPEED
	  );
	
	  // bullet velocity adds the ship's velocity to the bullet's default speed
	  var bulletVel = [
	    relVel[0] + this.vel[0], relVel[1] + this.vel[1]
	  ];
	
	  var options = {
	    pos: [this.pos[0] + this.scaledWidth()*0.5 - Constants.Bullet.BULLET_SPRITE_WIDTH*0.5,
	          this.pos[1] + this.scaledHeight()*0.5 - Constants.Bullet.BULLET_SPRITE_WIDTH*0.5],
	    vel: bulletVel,
	    game: this.game
	  };
	
	  var bullet = newBullet(options);
	
	  this.game.add(bullet);
	};
	
	var newBullet = function(options) {
	  return new Bullet({
	    pos: options.pos,
	    vel: options.vel,
	    game: options.game,
	    spritePos: [0,0],
	    image: AssetRepository.getAsset(AssetPaths.bullet),
	    width: Constants.Bullet.BULLET_SPRITE_WIDTH,
	    height: Constants.Bullet.BULLET_SPRITE_WIDTH,
	    speed: 0,
	    scale: 1,
	    frames: [[0,0]],
	    once: false});
	};
	
	module.exports = Ship;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(7);
	var Sprite = __webpack_require__(8);
	var NewSprites = __webpack_require__(13);
	var Constants = __webpack_require__(10);
	
	var Bullet = function(options) {
	  options.radius = Constants.Bullet.RADIUS;
	  Sprite.call(this, options);
	};
	
	Util.inherits(Bullet, Sprite);
	
	Bullet.prototype.isWrappable = false;
	Bullet.prototype.type = "Bullet";
	
	Bullet.prototype.collideWith = function(otherObject) {
	  if (otherObject.type === "Asteroid") {
	    this.game.remove(this);
	    this.game.splitAsteroidIntoChunks(otherObject);
	    var explosion = NewSprites.newExplosion({pos:otherObject.pos, game: this.game, scale: 1}); //scale: otherObject.scale});
	    this.game.add(explosion);
	    this.game.increaseScore();
	  }
	};
	
	module.exports = Bullet;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Asteroid = __webpack_require__(6);
	var RotatingAsteroid = __webpack_require__(5);
	var Sprite = __webpack_require__(8);
	var AssetRepository = __webpack_require__(3);
	var AssetPaths = __webpack_require__(4);
	var Util = __webpack_require__(7);
	var Ship = __webpack_require__(11);
	
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
	};
	
	module.exports = NewSprites;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map