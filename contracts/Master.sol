pragma solidity ^0.4.21;
import "./Bounties.sol";
import "./Claimants.sol";
import "./Arbitrations.sol";
import "./RandNum.sol";


contract Master {
    address owner;
    Bounties bountiesContract;
    Claimants claimantsContract;
    Arbitrations arbitrationsContract;
    RandNum randNumContract;

    function Master(address randNumAddress, address arbiter1, address arbiter2) payable public {
        owner = msg.sender;

        address bountiesAddress = new Bounties();
        address claimantsAddress = new Claimants();
        address arbitrationsAddress = new Arbitrations();
        // address randNumAddress = new RandNum();
        bountiesContract = Bounties(bountiesAddress);
        claimantsContract = Claimants(claimantsAddress);
        arbitrationsContract = Arbitrations(arbitrationsAddress);
        randNumContract = RandNum(randNumAddress);

        arbitrationsContract.addArbiter(arbiter1);
        arbitrationsContract.addArbiter(arbiter2);
    }

    // Fallback function
    function() public {
        revert();
    }

    event AddedBounty(address from, uint id);
    event ClaimedBounty(address from, uint claimantId, uint bountyId);
    event ApprovedBounty(address from, uint claimantId, uint bountyId);
    event RejectedBounty(address from, uint claimantId, uint bountyId);
    event DisputedBounty(address from, uint claimantId, uint bountyId);
    event SelectedArbiter(uint bountyId, uint claimantId, uint randNum, address arbiter);
    event Arbitrated(uint bountyId, uint claimantId, bool upheld);
    event LogInfo(string description);
    event LogNumber(uint price);

    function getBalance() public returns (uint balance) {
        return address(this).balance;
    }

    function nextBountyId() public view returns (uint) {
        return bountiesContract.nextBountyId();
    }
    function bounties(uint bountyId) public view returns (
        uint id,
        Bounties.BountyStatus bountyState,
        uint price,
        uint completionExpiration,
        uint reviewExpiration,
        address poster,
        string bountyText
    ) {
        (
            id,
            bountyState,
            price,
            completionExpiration,
            reviewExpiration,
            poster,
            bountyText
        ) = bountiesContract.bounties(bountyId);
    }
    function getClaimantNumber(uint bountyId) view public returns (uint) {
        return claimantsContract.getClaimantNumber(bountyId);
    }

    function addBounty(string bountyText, uint completion, uint review, uint price) public {
        emit AddedBounty(msg.sender, bountiesContract.nextBountyId());
        bountiesContract.addBounty(bountyText, completion, review, price, msg.sender);
    }

    function claimBounty(uint bountyId, string answerText) public returns(uint) {
        uint claimantId = claimantsContract.getClaimantNumber(bountyId);
        emit ClaimedBounty(msg.sender, claimantId, bountyId);
        bountiesContract.setToPendingApproval(bountyId);
        claimantsContract.claimBounty(bountyId, answerText, msg.sender);
    }

    function getClaimant(uint256 bountyId, uint256 claimantId) view public returns(
        address claimant,
        string answer,
        uint256 claimantIdRes,
        uint256 bountyIdRes,
        Claimants.ClaimantStatus claimantState
    ) {
        (claimant, answer, claimantIdRes, bountyIdRes, claimantState) = claimantsContract.getClaimant(bountyId, claimantId);
    }

    function approveBounty(uint bountyId, uint claimantId) public returns(uint) {
        emit ApprovedBounty(msg.sender, claimantId, bountyId);
        bountiesContract.setToResolved(bountyId);
        claimantsContract.setToApproved(bountyId, claimantId);
    }

    function rejectBounty(uint bountyId, uint claimantId) public returns(uint) {
        emit RejectedBounty(msg.sender, claimantId, bountyId);
        claimantsContract.setToRejected(bountyId, claimantId);
    }

    function disputeBounty(uint bountyId, uint claimantId) payable public {
        emit DisputedBounty(msg.sender, claimantId, bountyId);
        bountiesContract.setToPendingArbitratorAssignment(bountyId);
        claimantsContract.setToPendingArbitratorAssignment(bountyId, claimantId);
        uint maxNum = arbitrationsContract.numberOfArbiters();
        randNumContract.update(bountyId, claimantId, address(this), maxNum);
    }

    function selectArbiter(uint bountyId, uint claimantId, uint randNum) public {
        bountiesContract.setToPendingArbitration(bountyId);
        claimantsContract.setToPendingArbitration(bountyId, claimantId);
        address selectedArbiter = arbitrationsContract.selectArbitrator(bountyId, claimantId, randNum);
        emit SelectedArbiter(bountyId, claimantId, randNum, selectedArbiter);
    }

    function getArbiter(uint bountyId, uint claimantId) public view returns(address arbiter) {
        return arbitrationsContract.getArbiter(bountyId, claimantId);
    }

    function arbitrate(uint bountyId, uint claimantId, bool upheld) public {
        emit Arbitrated(bountyId, claimantId, upheld);
        bountiesContract.setToFinalApproval(bountyId);
        if (upheld) {
            claimantsContract.setToFinalApproval(bountyId, claimantId);
        } else {
            claimantsContract.setToFinalRejection(bountyId, claimantId);
        }
    }
}
