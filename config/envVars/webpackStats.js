const productionVars = require("./production");

module.exports = {
  ...productionVars,
  WEBPACK_ANALYZER: true,
};
