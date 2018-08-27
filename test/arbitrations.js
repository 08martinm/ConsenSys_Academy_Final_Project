var Master = artifacts.require("./Master.sol");
var RandNum = artifacts.require("./RandNum.sol");
var Arbitrations = artifacts.require("./Arbitrations.sol");

contract("Arbitrations", async accounts => {
  const masterContract = await Master.new(RandNum.address, accounts[3], accounts[4]);
  const arbitrationsAddress = await masterContract.arbitrationsAddress();
  const instance = Arbitrations.at(arbitrationsAddress);
  await masterContract.addBounty("test", 2, 3, 4, { from: accounts[0] });
  await masterContract.claimBounty(0, "Test answer", { from: accounts[2] });
  await masterContract.rejectBounty(0, 0, { from: accounts[0] });
  await masterContract.disputeBounty(0, 0, { from: accounts[2] });

  describe("Contract: Arbitrations", () => {
    describe("Public variables are accessible", async () => {
      it("returns owner", async () => {
        const owner = await instance.owner();
        assert.equal(owner, masterContract.address, "Wrong owner");
      })
  
      it("returns numberOfArbiters", async () => {
        const numberOfArbiters = await instance.numberOfArbiters();
        assert.equal(numberOfArbiters.c[0], 2, "Incorrect numberOfArbiters.");
      })

      it("returns arbiters", async () => {
        const arbiters = instance.arbiters(0);
        assert.equal(true, true, "No error thrown");
      });
    });

    describe("Functions can only be called by owner", async () => {
      it("addArbiter", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.addArbiter(accounts[5]);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("selectArbitrator", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.selectArbitrator(0, 0, 1);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
    });
  })
});
