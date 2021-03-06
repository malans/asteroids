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
