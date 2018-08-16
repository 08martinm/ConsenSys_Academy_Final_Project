pragma solidity ^0.4.24;


contract Claimants {
    mapping(uint => Respondents) public claimants;

    enum ClaimantStatus {
        PendingApproval,
        Approved,
        Rejected,
        PendingArbitratorAssignment,
        PendingArbitration,
        FinalApproval,
        FinalRejection
    }

    struct Claimant {
        address claimant;
        string answer;
        uint claimantId;
        uint bountyId;
        ClaimantStatus claimantState;
    }

    struct Respondents {
        uint nextClaimantId;
        mapping(uint => Claimant) claimants;
    }

    // TODO: add modifier ensuring it is within expiration, it is not already solved
    function claimBounty(uint bountyId, string answerText, address poster) public returns(uint) {
        uint claimantId = claimants[bountyId].nextClaimantId;
        claimants[bountyId].claimants[claimantId] = Claimant({
            claimant: poster,
            answer: answerText,
            claimantId: claimantId,
            bountyId: bountyId,
            claimantState: ClaimantStatus.PendingApproval
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
        ClaimantStatus claimantState
    ) {
        Claimant memory user = claimants[bountyId].claimants[claimantId];
        claimant = user.claimant;
        answer = user.answer;
        claimantIdRes = user.claimantId;
        bountyIdRes = user.bountyId;
        claimantState = user.claimantState;
    }

    // TODO: add onlyOwner modifier, send money from escrow to claimant
    function setToApproved(uint bountyId, uint claimantId) public returns(uint) {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.Approved;
    }

    function setToRejected(uint bountyId, uint claimantId) public returns(uint) {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.Rejected;
    }

    function setToPendingArbitratorAssignment(uint bountyId, uint claimantId) public {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.PendingArbitratorAssignment;
    }

    function setToPendingArbitration(uint bountyId, uint claimantId) public {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.PendingArbitration;
    }

    function setToFinalApproval(uint bountyId, uint claimantId) public {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.FinalApproval;
    }

    function setToFinalRejection(uint bountyId, uint claimantId) public {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.FinalRejection;
    }
}
