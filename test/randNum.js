var Master = artifacts.require("./Master.sol");
var RandNum = artifacts.require("./RandNum.sol");

contract("RandNum", async accounts => {
  const instance = RandNum.at(RandNum.address);

  describe("Contract: RandNum", () => {
    describe("Public variables are accessible", async () => {
      it("returns owner", async () => {
        const owner = await instance.owner();
        assert.equal(owner, accounts[9], "Wrong owner");
      })
    });

    it("Callback has to be called by Oraclize", async () => {
      let threwRevertError = false;
      try {
        const response = await instance.__callback("asfsadf", 1);
      } catch (error) {
        threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
      }
      assert.equal(threwRevertError, true, "Never threw Revert error");
    });
    it("Update can be called by any address", async () => {
      let threwRevertError = false;
      try {
        const response = await instance.update(accounts[5]);
      } catch (error) {
        threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
      }
      assert.equal(threwRevertError, false, "Threw Revert error");
    });
  })
});
