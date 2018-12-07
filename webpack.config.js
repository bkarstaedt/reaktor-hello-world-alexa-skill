const path = require("path");

module.exports = {
  entry: { updateSatelliteTle: "./src/updateSatelliteTle.js" },
  module: {
    rules: [ ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
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
