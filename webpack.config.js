const path = require("path");

module.exports = {
  entry: {
    updateSatelliteTle: "./src/updateSatelliteTle.js",
    retrieveCurrentSatelliteLocation: "./src/retrieveCurrentSatelliteLocation.js"
  },
  module: {
    rules: [ ]
  },
  resolve: {
    extensions: [".js"]
  },
  target: 'node',
  externals: [
    'aws-sdk'
  ],
  output: {
    filename: "[name]/[name].js",
    path: path.resolve(__dirname, "build"),
    library: "[name]",
    libraryTarget: "umd"
  }
};
