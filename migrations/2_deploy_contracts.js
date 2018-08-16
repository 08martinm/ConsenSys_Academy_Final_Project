const StringUtils = artifacts.require("./StringUtils.sol");
const Master = artifacts.require("./Master.sol");
const RandNum = artifacts.require("./RandNum.sol");

module.exports = async (deployer, network, accounts) => {
  deployer
    .deploy(StringUtils, { from: accounts[9] })
    .then(() => deployer.link(StringUtils, RandNum))
    .then(() =>
      deployer.deploy(RandNum, {
        from: accounts[9],
        gas: 6721975,
        value: 500000000000000000,
      }),
    )
    .then(() => deployer.deploy(Master, RandNum.address, accounts[3], accounts[4]));
};
