/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var ImageRepository = new function() {
	// Define images
	this.background = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 1;
	var numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			this.imagesLoaded = true;
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

module.exports = ImageRepository;
