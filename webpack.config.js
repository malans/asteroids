module.exports = {
  entry: "./lib/asteroids.js",
  output: {
  	filename: "./lib/bundle.js"
  },
  module: {
    loaders: [
        { test: /\.css$/, loader: "style!css" }
    ]
  },
  devtool: 'source-map',
};
