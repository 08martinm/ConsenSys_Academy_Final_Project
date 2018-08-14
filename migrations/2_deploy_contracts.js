var StringUtils = artifacts.require("./StringUtils.sol");
var BountyStorage = artifacts.require("./BountyStorage.sol");
var OraclizeTest = artifacts.require("./OraclizeTest.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BountyStorage);
  deployer.deploy(StringUtils);
  deployer.link(StringUtils, OraclizeTest);
  deployer.deploy(OraclizeTest, {
    from: accounts[9],
    gas: 6721975,
    value: 500000000000000000,
  });
};
