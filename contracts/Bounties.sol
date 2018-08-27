pragma solidity ^0.4.24;

/** @title Bounties handler */
contract Bounties {
    address public owner;
    uint public nextBountyId;
    mapping(uint => Bounty) public bounties;

    enum BountyStatus {
        Unclaimed, 
        PendingApproval, 
        Resolved, 
        PendingArbitratorAssignment,
        PendingArbitration,
        FinalApproval
    }

    struct Bounty {
        uint id;
        BountyStatus bountyState;
        uint price;
        uint completionExpiration;
        uint reviewExpiration;
        address poster;
        string bountyText;
    }

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    /** @dev Adds a new bounty to the master-list of bounties.
      * @param bountyText The text description of the work required to complete the bounty.
      * @param completion The date by which the bounty must be completed by a respondent.
      * @param review The date by which the reviewer plans to review all respondent submissions.
      * @param price The amount that the poster will pay for a fulfilled bounty.
      * @param poster The address of the bounty poster.
      * @return createdBounty The integer ID of the created bounty.
      */
    function addBounty(
        string bountyText,
        uint completion,
        uint review,
        uint price,
        address poster
    ) public onlyOwner returns(uint createdBounty) {
        createdBounty = nextBountyId;
        bounties[createdBounty] = Bounty({
            id: createdBounty,
            bountyState: BountyStatus.Unclaimed,
            price: price,
            completionExpiration: completion,
            reviewExpiration: review,
            poster: poster,
            bountyText: bountyText
        });
        nextBountyId += 1;
    }

    /** @dev Changes the bountyState of a particular bounty to "PendingApproval".
      * @param bountyId The integer ID of a particular bounty.
      */
    function setToPendingApproval(uint bountyId) public onlyOwner {
        bounties[bountyId].bountyState = BountyStatus.PendingApproval;
    }

    /** @dev Changes the bountyState of a particular bounty to "Resolved".
      * @param bountyId The integer ID of a particular bounty.
      */
    function setToResolved(uint bountyId) public onlyOwner {
        bounties[bountyId].bountyState = BountyStatus.Resolved;
    }

    /** @dev Changes the bountyState of a particular bounty to "PendingArbitratorAssignment".
      * @param bountyId The integer ID of a particular bounty.
      */
    function setToPendingArbitratorAssignment(uint bountyId) public onlyOwner {
        bounties[bountyId].bountyState = BountyStatus.PendingArbitratorAssignment;
    }

    /** @dev Changes the bountyState of a particular bounty to "PendingArbitration".
      * @param bountyId The integer ID of a particular bounty.
      */
    function setToPendingArbitration(uint bountyId) public onlyOwner {
        bounties[bountyId].bountyState = BountyStatus.PendingArbitration;
    }

    /** @dev Changes the bountyState of a particular bounty to "FinalApproval".
      * @param bountyId The integer ID of a particular bounty.
      */
    function setToFinalApproval(uint bountyId) public onlyOwner {
        bounties[bountyId].bountyState = BountyStatus.FinalApproval;
    }
}
