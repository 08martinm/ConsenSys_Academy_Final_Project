var Master = artifacts.require("./Master.sol");
var RandNum = artifacts.require("./RandNum.sol");
var Claimants = artifacts.require("./Claimants.sol");

contract("Claimants", async accounts => {
  const masterContract = await Master.new(RandNum.address, accounts[3], accounts[4]);
  const claimantsAddress = await masterContract.claimantsAddress();
  const instance = Claimants.at(claimantsAddress);

  describe("Contract: Claimants", () => {
    describe("Public variables are accessible", async () => {
      it("returns owner", async () => {
        const owner = await instance.owner();
        assert.equal(owner, masterContract.address, "Wrong owner");
      })
  
      it("returns claimants", async () => {
        await masterContract.addBounty("test", 2, 3, 4, { from: accounts[0] });
        await masterContract.claimBounty(0, "Test answer", { from: accounts[2] });
        const claimantInfo = await instance.getClaimant.call(0, 0);
        assert.equal(
          claimantInfo[0],
          accounts[2],
          "The claimant address matches account[2].",
        );
        assert.equal(
          claimantInfo[1],
          "Test answer",
          "The claimant response is `Test answer`.",
        );
        assert.equal(claimantInfo[2].c[0], 0, "The claimant id is 0.");
        assert.equal(claimantInfo[3].c[0], 0, "The bounty id is 1.");
      })
    });

    describe("Functions can only be called by owner", async () => {
      it("claimBounty", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.claimBounty(0, "test", accounts[3]);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToApproved", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToApproved(0, 0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToRejected", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToRejected(0, 0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToPendingArbitratorAssignment", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToPendingArbitratorAssignment(0, 0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToPendingArbitration", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToPendingArbitration(0, 0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToFinalApproval", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToFinalApproval(0, 0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToFinalRejection", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToFinalRejection(0, 0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
    });
  })
});
