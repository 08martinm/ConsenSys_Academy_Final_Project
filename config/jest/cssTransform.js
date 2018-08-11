// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/tutorial-webpack.html
/* eslint-disable */
module.exports = {
  process() {
    return "module.exports = {};";
  },
  getCacheKey(fileData, filename) {
    // The output is always the same.
    return "cssTransform";
  },
};
