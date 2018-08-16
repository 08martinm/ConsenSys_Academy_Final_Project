pragma solidity ^0.4.24;


contract Bounties {
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

    function addBounty(string bountyText, uint completion, uint review, uint price, address poster) public {
        bounties[nextBountyId] = Bounty({
            id: nextBountyId,
            bountyState: BountyStatus.Unclaimed,
            price: price,
            completionExpiration: completion,
            reviewExpiration: review,
            poster: poster,
            bountyText: bountyText
        });
        nextBountyId += 1;
    }

    function setToPendingApproval(uint bountyId) public {
        bounties[bountyId].bountyState = BountyStatus.PendingApproval;
    }

    function setToResolved(uint bountyId) public {
        bounties[bountyId].bountyState = BountyStatus.Resolved;
    }

    function setToPendingArbitratorAssignment(uint bountyId) public {
        bounties[bountyId].bountyState = BountyStatus.PendingArbitratorAssignment;
    }

    function setToPendingArbitration(uint bountyId) public {
        bounties[bountyId].bountyState = BountyStatus.PendingArbitration;
    }

    function setToFinalApproval(uint bountyId) public {
        bounties[bountyId].bountyState = BountyStatus.FinalApproval;
    }
}
