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
