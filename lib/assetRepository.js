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
