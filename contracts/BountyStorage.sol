pragma solidity ^0.4.24;


contract BountyStorage {
    uint public nextBountyId;
    mapping(uint => Bounty) public bounties;
    mapping(uint => Claimants) public claimants;

    enum Status { Unclaimed, PendingApproval, Arbitration, Resolved }
    struct Bounty {
        uint id;
        Status state;
        uint price;
        uint completionExpiration;
        uint reviewExpiration;
        address poster;
        string bountyText;
    }
    struct Claimant {
        address claimant;
        string answer;
        uint claimantId;
        uint bountyId;
        bool approved;
    }
    struct Claimants {
        uint nextClaimantId;
        mapping(uint => Claimant) claimants;
    }

    event addedBounty(address _from, uint _id);
    event claimedBounty(address _from, uint _claimantId, uint _bountyId);
    event approvedBounty(address _from, uint _claimantId, uint _bountyId);
    event arbitratedBounty(address _from, uint _id);

    // TODO: make payable and accept/store balances
    function addBounty(string bountyText, uint completion, uint review, uint price) public {
        emit addedBounty(msg.sender, nextBountyId);
        bounties[nextBountyId] = Bounty({
            id: nextBountyId,
            state: Status.Unclaimed,
            price: price,
            completionExpiration: completion,
            reviewExpiration: review,
            poster: msg.sender,
            bountyText: bountyText
        });
        nextBountyId += 1;
    }

    // TODO: add modifier ensuring it is within expiration, it is not already solved
    function claimBounty(uint bountyId, string answerText) public returns(uint) {
        uint claimantId = claimants[bountyId].nextClaimantId;
        emit claimedBounty(msg.sender, claimantId, bountyId);
        bounties[bountyId].state = Status.PendingApproval;
        claimants[bountyId].claimants[claimantId] = Claimant({
            claimant: msg.sender,
            answer: answerText,
            claimantId: claimantId,
            bountyId: bountyId,
            approved: false
        });
        claimants[bountyId].nextClaimantId = claimantId + 1;
        return claimants[bountyId].nextClaimantId;
    }

    function getClaimantNumber(uint bountyId) view public returns(uint) {
        return claimants[bountyId].nextClaimantId;
    }

    function getClaimant(uint256 bountyId, uint256 claimantId) view public returns(
        address claimant,
        string answer,
        uint256 claimantIdRes,
        uint256 bountyIdRes,
        bool approved
    ) {
        Claimant storage user = claimants[bountyId].claimants[claimantId];
        claimant = user.claimant;
        answer = user.answer;
        claimantIdRes = user.claimantId;
        bountyIdRes = user.bountyId;
        approved = user.approved;
    }

    // TODO: add onlyOwner modifier, send money from escrow to claimant
    function approveBounty(uint bountyId, uint claimantId) public returns(uint) {
        emit approvedBounty(msg.sender, claimantId, bountyId);
        bounties[bountyId].state = Status.Resolved;
        claimants[bountyId].claimants[claimantId].approved = true;
    }
}