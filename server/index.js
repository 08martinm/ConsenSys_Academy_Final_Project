/* eslint-disable */
require("babel-polyfill");
require("babel-register")({
  presets: ["env", "es2017"],
  plugins: ["transform-runtime", "transform-async-to-generator"],
});

// Import the rest of our application.
require("./server.js");
