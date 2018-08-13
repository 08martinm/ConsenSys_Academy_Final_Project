var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var BountyStorage = artifacts.require("./BountyStorage.sol");

module.exports = async deployer => {
  await deployer.deploy(BountyStorage);
  await deployer.deploy(SimpleStorage);
};
