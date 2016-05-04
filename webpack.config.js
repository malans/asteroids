module.exports = {
  entry: "./lib/entry.js",
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
