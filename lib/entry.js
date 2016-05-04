var Asteroids = require('./asteroids');
var AssetRepository = require('./assetRepository');
var AssetPaths = require('./assetPaths');

for (var path in AssetPaths) {
    if (AssetPaths.hasOwnProperty(path)) {
       AssetRepository.queueDownload(AssetPaths[path]);
    }
}

AssetRepository.downloadAll(Asteroids.gameIntro.bind(Asteroids));
