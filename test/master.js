var Master = artifacts.require("./Master.sol");
var RandNum = artifacts.require("./RandNum.sol");

contract("Master", accounts => {
  let instance;

  beforeEach("Get new contract instance", async () => {
    instance = await Master.new(RandNum.address, accounts[3], accounts[4]);
  });

  describe("Adds a new bounty", async () => {
    beforeEach("Adds a single bounty", async () => {
      await instance.addBounty("test", 2, 3, 4, { from: accounts[0] });
    });

    it("returns the correct nextBountyId", async () => {
      const numBounties = await instance.nextBountyId.call();
      assert.equal(numBounties, 1, "The value 1 was not retrieved.");
    });

    it("returns all bounty information calling `bounties`", async () => {
      const bountyInfo = await instance.bounties.call(0);
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
    });
  });

  describe("Adds a claimant to a particular bounty", async () => {
    beforeEach("Adds two bounties", async () => {
      await instance.addBounty("test1", 1, 2, 3, { from: accounts[0] });
      await instance.addBounty("test2", 4, 3, 2, { from: accounts[1] });
    });

    it("Prevents the same user to both post and claim the same bounty", async () => {
      const response = await instance.claimBounty.call(1, "Test answer", {
        from: accounts[1],
      });
      assert.equal(
        response,
        "Claimant cannot be bounty poster",
        "Expected response to be 'Claimant cannot be bounty poster'",
      );
    });

    it("Allows a different user to claim a bounty", async () => {
      const response = await instance.claimBounty.call(1, "Test answer");
      assert.equal(response, "Success", "The function returns `Success`.");
    });

    it("getClaimantInfo returns all relevant claimant information", async () => {
      await instance.claimBounty(1, "Test answer", { from: accounts[2] });
      const claimantInfo = await instance.getClaimant.call(1, 0);
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
      assert.equal(claimantInfo[3].c[0], 1, "The bounty id is 1.");
    });
  });

  describe("Allows a bounty-owner to approve or reject a claimant", async () => {
    beforeEach("Adds two bounties and one claimant", async () => {
      await instance.addBounty("test1", 1, 2, 3, { from: accounts[0] });
      await instance.addBounty("test2", 4, 3, 2, { from: accounts[1] });
      await instance.claimBounty(1, "Test answer", { from: accounts[2] });
    });

    it("Prevents non-bounty-owner from approving a bounty's claimants", async () => {
      const response = await instance.approveBounty.call(1, 0);
      assert.equal(
        response,
        "Only bounty owner may approve or reject claims",
        "Should inform user that only bounty-owner may call this function",
      );
    });

    it("Prevents non-bounty-owner from rejecting a bounty's claimants", async () => {
      const response = await instance.rejectBounty.call(1, 0);
      assert.equal(
        response,
        "Only bounty owner may approve or reject claims",
        "Should inform user that only bounty-owner may call this function",
      );
    });

    it("Allows a bounty-owner to reject a claimant", async () => {
      await instance.rejectBounty(1, 0, { from: accounts[1] });
      const bountyInfo = await instance.getClaimant(1, 0);
      assert.equal(
        bountyInfo[4].c[0],
        2,
        "Claimant state should now be set to 2",
      );
    });

    it("Allows a bounty-owner to approve a claimant", async () => {
      await instance.approveBounty(1, 0, { from: accounts[1] });
      const bountyInfo = await instance.getClaimant(1, 0);
      assert.equal(
        bountyInfo[4].c[0],
        1,
        "Claimant state should now be set to 1",
      );
    });
  });

  describe("Allows claimant owner to dispute a rejected bounty", async () => {
    beforeEach("Adds two bounties and one rejected claimant", async () => {
      await instance.addBounty("test1", 1, 2, 3, { from: accounts[0] });
      await instance.addBounty("test2", 4, 3, 2, { from: accounts[1] });
      await instance.claimBounty(1, "Test answer", { from: accounts[2] });
      await instance.rejectBounty(1, 0, { from: accounts[1] });
    });

    it("Prevents a non-claimant-owner from disputing a claim", async () => {
      const response = await instance.disputeBounty.call(1, 0);
      assert.equal(response, "Only claimant owner may dispute claim", "The response informs callee that disputes can only be raised by the claim owner.");
    });

    it("Allows a claimant-owner to initiate a dispute", async () => {
      const response = await instance.disputeBounty.call(1, 0, { from: accounts[2] });
      assert.equal(response, "Success", "The function returns `Success`.");
    });

    it("Changes the state of disputed claim to 'PendingArbitratorAssignment'", async () => {
      await instance.disputeBounty(1, 0, { from: accounts[2] });
      const claimInfo = await instance.getClaimant(1, 0);
      assert.equal(claimInfo[4].c[0], 3, "The state field is set to 3.");
    });
  });

  describe("Arbiter selection", async () => {
    beforeEach("Adds two bounties and one disputed claim", async () => {
      await instance.addBounty("test1", 1, 2, 3, { from: accounts[0] });
      await instance.addBounty("test2", 4, 3, 2, { from: accounts[1] });
      await instance.claimBounty(1, "Test answer", { from: accounts[2] });
      await instance.rejectBounty(1, 0, { from: accounts[1] });
      await instance.disputeBounty(1, 0, { from: accounts[2] });
    });

    it("Prevents anyone but the associated random number contract from calling 'selectArbiter'", async () => {
      const response = await instance.selectArbiter.call(1, 0, 1);
      assert.equal(response, "This function may only be called from the linked random number generator.", "Informs callee that function may only be called by linked random number generator.");
    });

    it("Allows the linked random number generator to call 'selectArbiter'", async () => {
      const response = await instance.selectArbiter.call(1, 0, 1, { from: RandNum.address });
      assert.equal(response, "Success", "Allows random number generator to call 'selectArbiter'");
    });

    // it("'selectArbiter' sets bounty state to 'PendingArbitration'", async () => {
    //   await instance.selectArbiter.call(1, 0, 1, { from: RandNum.address });
    //   setTimeout(async function() {
    //     const bountyInfo = await instance.bounties(1);
    //     assert.equal(bountyInfo[1].c[0], 4, "Incorrect bounty state.");
    //   }, 1000);
    // });

    // it("'selectArbiter' sets claimant state to 'PendingArbitration'", async () => {
    //   await instance.selectArbiter.call(1, 0, 1, { from: accounts[0] });
    //   setTimeout(async function() {
    //     const bountyInfo = await instance.getClaimant(1, 0);
    //     assert.equal(bountyInfo[4].c[0], 4, "Incorrect bounty state.");
    //   }, 1000);
    // });
  });

  // describe("Arbitration actions", async () => {
  //   beforeEach("Adds two bounties and one claim in arbitration", async () => {
  //     await instance.addBounty("test1", 1, 2, 3, { from: accounts[0] });
  //     await instance.addBounty("test2", 4, 3, 2, { from: accounts[1] });
  //     await instance.claimBounty(1, "Test answer", { from: accounts[2] });
  //     await instance.rejectBounty(1, 0, { from: accounts[1] });
  //     await instance.disputeBounty(1, 0, { from: accounts[2] });
  //   });

  //   it("Prevents non-arbitrator from arbitrating claim", async () => {
  //     const response = await instance.arbitrate.call(1, 0, true);
  //     assert.equal(response, "Only arbiter may arbitrate contract", "Informs callee that function may only be called by aribtrator.");
  //   });

  //   it("Allows arbitrator to arbitrate claim", async () => {
  //     const response = await instance.arbitrate.call(1, 0, true, { from: accounts[3] });
  //     assert.equal(response, "Success", "Returns `Success`");
  //   });

  //   it("Arbitrator may uphold bounty-poster's decision", async () => {
  //     await instance.arbitrate(1, 0, true, { from: accounts[3] });
  //     const claimantInfo = instance.getClaimant(1, 0);
  //     assert.equal(claimantInfo[4].c[0], 5, "Claimant state set to 5");
  //   });

  //   it("Arbitrator may overrule bounty-poster's decision", async () => {
  //     await instance.arbitrate(1, 0, false, { from: accounts[3] });
  //     const claimantInfo = instance.getClaimant(1, 0);
  //     assert.equal(claimantInfo[4].c[0], 6, "Claimant state set to 6");
  //   });

  //   it("Arbitrator's decision sets bounty state to 'FinalApproval'", async () => {
  //     await instance.arbitrate(1, 0, false, { from: accounts[3] });
  //     const bountyInfo = instance.bounties(1);
  //     assert.equal(bountyInfo[1].c[0], 5, "Bounty state set to 5.");
  //   });
  // });
});
