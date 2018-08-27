pragma solidity ^0.4.24;

/** @title Arbitrations handler */
contract Arbitrations {
    address public owner;
    mapping(uint => mapping(uint => address)) public arbitrations;
    mapping(uint => address) public arbiters;
    uint public numberOfArbiters = 0;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    /** @dev Adds an arbiter's address to the list of approved arbiters.
      * @param arbiter Address of the arbiter to add to the pre-approved list.
      * @return numberOfArbiters The total number of pre-approved arbiters.
      */
    function addArbiter(address arbiter) public onlyOwner returns(uint) {
        numberOfArbiters += 1;
        arbiters[numberOfArbiters] = arbiter;
        return numberOfArbiters;
    }

    /** @dev Sets an arbitrator for a particular dispute.
      * @param bountyId The integer Id for a particular bounty.
      * @param claimantId The integer Id for a particular claimant.
      * @param randNum A random integer within the span of 1 to the total number of pre-approved arbiters.
      * @return arbitrator The address of the selected arbitrator.
      */
    function selectArbitrator(uint bountyId, uint claimantId, uint randNum) public onlyOwner returns(address arbitrator) {
        arbitrator = arbiters[randNum];
        arbitrations[bountyId][claimantId] = arbitrator;
    }

    /** @dev Retrieves an arbitrator's address based on provided criteria.
      * @param bountyId The integer Id for a particular bounty.
      * @param claimantId The integer Id for a particular claimant.
      * @return arbiter The address of the selected arbitrator.
      */
    function getArbiter(uint bountyId, uint claimantId) public view returns(address arbiter) {
        arbiter = arbitrations[bountyId][claimantId];
    }
}
