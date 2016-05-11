var GameView = require("./gameView");
var AssetRepository = require('./assetRepository');
var AssetPaths = require('./assetPaths');

for (var path in AssetPaths) {
    if (AssetPaths.hasOwnProperty(path)) {
       AssetRepository.queueDownload(AssetPaths[path]);
    }
}
var gameView = new GameView();
AssetRepository.downloadAll(gameView.gameIntro.bind(gameView));
