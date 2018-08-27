pragma solidity ^0.4.24;
import "./Bounties.sol";
import "./Claimants.sol";
import "./Arbitrations.sol";
import "./RandNum.sol";

/** @title Bounty System dApp */
contract Master {
    bool private stopped = false;
    address owner;
    Bounties bountiesContract;
    Claimants claimantsContract;
    Arbitrations arbitrationsContract;
    RandNum public randNumContract;
    address public bountiesAddress;
    address public claimantsAddress;
    address public arbitrationsAddress;

    /** @dev Constructor sets owner, created Bounties, Claimants, & Arbitrations contracts; links RandNum contract.
      * @param randNumAddress The contract address for a deployed random number generator contract.
      * @param arbiter1 The address of a pre-approved arbiter.
      * @param arbiter2 The address of a pre-approved arbiter.
      */
    constructor (address randNumAddress, address arbiter1, address arbiter2) payable public {
        owner = msg.sender;

        bountiesAddress = new Bounties();
        claimantsAddress = new Claimants();
        arbitrationsAddress = new Arbitrations();

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

    modifier isAdmin() {
        require(msg.sender == owner);
        _;
    }

    // Circuit breaker
    function toggleContractActive() isAdmin public {
        // You can add an additional modifier that restricts stopping a contract to be based on another action, such as a vote of users
        stopped = !stopped;
    }

    modifier stopInEmergency {
        if (!stopped) _;
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

    /** @dev Reads the balance of the Master contract.
      * @return balance The balance of the current contract.
      */
    function getBalance() public view returns (uint balance) {
        return address(this).balance;
    }

    /** @dev Retrieves the next available integer bounty ID.
      * @return nextBountyId The next available integer bounty ID.
      */
    function nextBountyId() public view returns (uint) {
        return bountiesContract.nextBountyId();
    }

    /** @dev Retrieves all information for a provided bounty ID.
      * @param bountyId The integer bounty ID for which to retrieve information.
      * @return id The integer ID of the bounty.
      * @return bountyState The state of the bounty.
      * @return price The value that the bounty will pay an approved claimant.
      * @return completionExpiration The date by which a claimant may respond to the bounty.
      * @return reviewExpiration The date by which a review is required by the poster.
      * @return poster The address of the poster of the bounty.
      * @return bountyText The text description of the work required to complete the bounty.
      */
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

    /** @dev Retrieves the next available integer claimant ID for a specified bounty.
      * @param bountyId The integer bounty ID for which to retrieve the claimant number.
      * @return claimantId The next available integer claimant ID for a specified bounty.
      */
    function getClaimantNumber(uint bountyId) view public returns (uint) {
        return claimantsContract.getClaimantNumber(bountyId);
    }

    /** @dev Adds a new bounty to the master list of bounties.
      * @param bountyText The text description of the work required to complete the bounty.
      * @param completion The date by which a claimant must respond to receive the reward.
      * @param review The date by which the bounty-poster has to approve an answer.
      * @param price The value to be transferred to an approved claimant.
      */
    function addBounty(string bountyText, uint completion, uint review, uint price) public stopInEmergency {
        emit AddedBounty(msg.sender, bountiesContract.nextBountyId());
        bountiesContract.addBounty(bountyText, completion, review, price, msg.sender);
    }

    /** @dev Adds a claimant's response to a specified bounty.
      * @param bountyId The integer bounty ID to which the claimant is responding.
      * @param answerText The text description provided by the claimant that answers the bounty question.
      * @return response A text response of whether transaction was successful.
      */
    function claimBounty(uint bountyId, string answerText) public stopInEmergency returns(string response) {
        (,,,,,address poster,) = bountiesContract.bounties(bountyId);
        if (poster == msg.sender) {
            response = "Claimant cannot be bounty poster";
        } else {
            uint claimantId = claimantsContract.getClaimantNumber(bountyId);
            emit ClaimedBounty(msg.sender, claimantId, bountyId);
            bountiesContract.setToPendingApproval(bountyId);
            claimantsContract.claimBounty(bountyId, answerText, msg.sender);
            response = "Success";
        }
    }

    /** @dev Retrieves all information pertaining to a specified claimant object.
      * @param bountyId The integer bounty ID to which the claimant responded.
      * @param claimantId The integer claimant ID of the claimant.
      * @return claimant The integer ID of the claimant object.
      * @return answer The text description provided by the claimant that responds to the bounty question.
      * @return claimantIdRes The integer ID of the claimant.
      * @return bountyIdRes The integer ID of the bounty.
      * @return claimantState The current state of the claim.
      */
    function getClaimant(uint256 bountyId, uint256 claimantId) view public returns(
        address claimant,
        string answer,
        uint256 claimantIdRes,
        uint256 bountyIdRes,
        Claimants.ClaimantStatus claimantState
    ) {
        (claimant, answer, claimantIdRes, bountyIdRes, claimantState) = claimantsContract.getClaimant(bountyId, claimantId);
    }

    /** @dev Emits event, sets state of bounty to "Resolved", sets state of claimant to "Approved".
      * @param bountyId The integer bounty ID.
      * @param claimantId The integer claimant ID.
      * @return 
      */
    function approveBounty(uint bountyId, uint claimantId) public stopInEmergency returns(string response) {
        (,,,,,address poster,) = bountiesContract.bounties(bountyId);
        if (msg.sender != poster) {
            response = "Only bounty owner may approve or reject claims";
        } else {
            emit ApprovedBounty(msg.sender, claimantId, bountyId);
            bountiesContract.setToResolved(bountyId);
            claimantsContract.setToApproved(bountyId, claimantId);
            response = "Success";
        }
    }

    /** @dev Emits event and sets the state of the claimant's response to "Rejected".
      * @param bountyId The integer bounty ID.
      * @param claimantId The integer claimant ID.
      */
    function rejectBounty(uint bountyId, uint claimantId) public stopInEmergency returns (string response) {
        (,,,,,address poster,) = bountiesContract.bounties(bountyId);
        if (msg.sender != poster) {
            response = "Only bounty owner may approve or reject claims";
        } else {
            emit RejectedBounty(msg.sender, claimantId, bountyId);
            claimantsContract.setToRejected(bountyId, claimantId);
            response = "Success";
        }
    }

    /** @dev Emits event, sets state of bounty and claimant to "PendingArbitratorAssignment", and calls random number generator.
      * @param bountyId The integer bounty ID.
      * @param claimantId The integer claimant ID.
      */
    function disputeBounty(uint bountyId, uint claimantId) payable public stopInEmergency returns(string response) {
        (address claimant,,,,) = claimantsContract.getClaimant(bountyId, claimantId);
        if (msg.sender != claimant) {
            response = "Only claimant owner may dispute claim";
        } else {
            emit DisputedBounty(msg.sender, claimantId, bountyId);
            bountiesContract.setToPendingArbitratorAssignment(bountyId);
            claimantsContract.setToPendingArbitratorAssignment(bountyId, claimantId);
            uint maxNum = arbitrationsContract.numberOfArbiters();
            randNumContract.update(bountyId, claimantId, address(this), maxNum);
            response = "Success";
        }
    }

    /** @dev Emits event, sets state of bounty and claimant to "PendingArbitration", and selects arbitrator.
      * @param bountyId The integer bounty ID.
      * @param claimantId The integer claimant ID.
      * @param randNum The random integer provided by the random number generator contract.
      */
    function selectArbiter(uint bountyId, uint claimantId, uint randNum) public stopInEmergency returns (string response) {
        if (msg.sender != address(randNumContract)) {
            response = "This function may only be called from the linked random number generator.";
        } else {
            bountiesContract.setToPendingArbitration(bountyId);
            claimantsContract.setToPendingArbitration(bountyId, claimantId);
            address selectedArbiter = arbitrationsContract.selectArbitrator(bountyId, claimantId, randNum);
            emit SelectedArbiter(bountyId, claimantId, randNum, selectedArbiter);
            response = "Success";
        }
    }

    /** @dev Retrieves arbiter for specified integer bounty ID and integer claimant ID.
      * @param bountyId The integer bounty ID.
      * @param claimantId The integer claimant ID.
      * @return arbiter The address of the randomly-selected arbiter from the pre-approved list of arbiters.
      */
    function getArbiter(uint bountyId, uint claimantId) public view returns(address arbiter) {
        return arbitrationsContract.getArbiter(bountyId, claimantId);
    }

    /** @dev Emits event, updates state of bounty and claimant to "FinalApproval" or "FinalRejection".
      * @param bountyId The integer bounty ID.
      * @param claimantId The integer claimant ID.
      * @param upheld The boolean decision of the arbitrator.
      */
    function arbitrate(uint bountyId, uint claimantId, bool upheld) public stopInEmergency returns(string response) {
        address arbiter = arbitrationsContract.getArbiter(bountyId, claimantId);
        if (msg.sender != arbiter) {
            response = "Only arbiter may arbitrate contract";
        } else {
            emit Arbitrated(bountyId, claimantId, upheld);
            response = "Success";
            bountiesContract.setToFinalApproval(bountyId);
            if (upheld) {
                claimantsContract.setToFinalApproval(bountyId, claimantId);
            } else {
                claimantsContract.setToFinalRejection(bountyId, claimantId);
            }
        }
    }
}
