const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "image.js",
  },
  mode: "production",
  plugins: [],
};
