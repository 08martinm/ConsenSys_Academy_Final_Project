var Master = artifacts.require("./Master.sol");
var RandNum = artifacts.require("./RandNum.sol");
var Bounties = artifacts.require("./Bounties.sol");

contract("Bounties", async accounts => {
  const masterContract = await Master.new(RandNum.address, accounts[3], accounts[4]);
  const bountiesAddress = await masterContract.bountiesAddress();
  const instance = Bounties.at(bountiesAddress);

  describe("Contract: Bounties", () => {
    describe("Public variables are accessible", async () => {
      it("returns nextBountyId", async () => {
        const nextBountyId = await instance.nextBountyId();
        assert.equal(nextBountyId, 0, "Wrong bountyId");
      })
  
      it("returns bounties", async () => {
        await masterContract.addBounty("test", 2, 3, 4, { from: accounts[0] });
        const bountyInfo = await instance.bounties(0);
        assert.equal(bountyInfo[0].c[0], 0, "Incorrect bounty Id.");
        assert.equal(bountyInfo[1].c[0], 0, "Incorrect bounty state.");
        assert.equal(bountyInfo[2].c[0], 4, "Incorrect bounty price.");
        assert.equal(
          bountyInfo[3].c[0],
          2,
          "Incorrect bounty completion expiration.",
        );
        assert.equal(
          bountyInfo[4].c[0],
          3,
          "Incorrect bounty review expiration.",
        );
        assert.equal(bountyInfo[5], accounts[0], "Incorrect bounty poster.");
        assert.equal(bountyInfo[6], "test", "Incorrect bounty text.");
      })
    });

    describe("Functions can only be called by owner", async () => {
      it("addBounty", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.addBounty("test", 2, 3, 4, accounts[0]);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToPendingApproval", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToPendingApproval(0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToResolved", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToResolved(0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToPendingArbitratorAssignment", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToPendingArbitratorAssignment(0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToPendingArbitration", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToPendingArbitration(0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
      it("setToFinalApproval", async () => {
        let threwRevertError = false;
        try {
          const response = await instance.setToFinalApproval(0);
        } catch (error) {
          threwRevertError = error.message.startsWith("VM Exception while processing transaction: revert");
        }
        assert.equal(threwRevertError, true, "Never threw Revert error");
      });
    });
  })
});
