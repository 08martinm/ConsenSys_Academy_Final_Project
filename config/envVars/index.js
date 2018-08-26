const dotenv = require("dotenv");

dotenv.config();
const defaultVars = require("./default");
const developmentVars = require("./development");
const productionVars = require("./production");
const webpackStats = require("./webpackStats");

const getVars = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return { ...defaultVars, ...developmentVars };
    case "production":
      return { ...defaultVars, ...productionVars };
    case "webpackStats":
      return { ...defaultVars, ...webpackStats };
    default:
      return { ...defaultVars };
  }
};

module.exports = getVars();
