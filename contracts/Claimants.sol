pragma solidity ^0.4.24;

/** @title Claimants handler */
contract Claimants {
    address public owner;
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

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    /** @dev Adds a new claim to the list of claimants for a given bounty.
      * @param bountyId The integer id of the bounty to which this claim pertains.
      * @param answerText The text answer to the bounty-poster's question.
      * @param poster The address of the bounty claimant.
      * @return nextClaimantId The integer ID of the next claimant.
      */
    function claimBounty(uint bountyId, string answerText, address poster) public onlyOwner returns(uint) {
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

    /** @dev Returns the integer ID of the next claimant object.
      * @param bountyId The integer id of the bounty to which the list of claimants corresponds.
      * @return nextClaimantId The integer ID of the next claimant.
      */
    function getClaimantNumber(uint bountyId) view public returns(uint) {
        return claimants[bountyId].nextClaimantId;
    }

    /** @dev Returns all claimant information given specifying bounty and claimant IDs.
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      * @return claimant The address of the claimant.
      * @return answer The text answer to the bounty posted by the claimant.
      * @return claimantIdRes The claimant integer ID.
      * @return bountyIdRes The bounty integer ID.
      * @return claimantState The current state of the claim.
      */
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

    /** @dev Sets the state of a particular claim to Approved
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      */
    function setToApproved(uint bountyId, uint claimantId) public onlyOwner {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.Approved;
    }

    /** @dev Sets the state of a particular claim to Rejected
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      */
    function setToRejected(uint bountyId, uint claimantId) public onlyOwner {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.Rejected;
    }

    /** @dev Sets the state of a particular claim to PendingArbitratorAssignment
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      */
    function setToPendingArbitratorAssignment(uint bountyId, uint claimantId) public onlyOwner {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.PendingArbitratorAssignment;
    }

    /** @dev Sets the state of a particular claim to PendingArbitration
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      */
    function setToPendingArbitration(uint bountyId, uint claimantId) public onlyOwner {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.PendingArbitration;
    }

    /** @dev Sets the state of a particular claim to FinalApproval
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      */
    function setToFinalApproval(uint bountyId, uint claimantId) public onlyOwner {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.FinalApproval;
    }

    /** @dev Sets the state of a particular claim to FinalRejection
      * @param bountyId The integer id of the bounty.
      * @param claimantId The integer id of the claimant.
      */
    function setToFinalRejection(uint bountyId, uint claimantId) public onlyOwner {
        claimants[bountyId].claimants[claimantId].claimantState = ClaimantStatus.FinalRejection;
    }
}
