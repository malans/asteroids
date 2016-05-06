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
  },

  randomInteger: function(min, max) {
    if (min > max) {
      return;
    }

    var diff = max - min;
    return Math.floor(Math.random()*diff) + min;
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
