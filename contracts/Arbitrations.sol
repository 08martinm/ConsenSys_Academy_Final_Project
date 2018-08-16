pragma solidity ^0.4.24;


contract Arbitrations {
    mapping(uint => mapping(uint => address)) public arbitrations;
    mapping(uint => address) public arbiters;
    uint public numberOfArbiters = 0;

    function addArbiter(address arbiter) public {
        numberOfArbiters += 1;
        arbiters[numberOfArbiters] = arbiter;
    }

    function selectArbitrator(uint bountyId, uint claimantId, uint randNum) public returns(address arbitrator) {
        arbitrator = arbiters[randNum];
        arbitrations[bountyId][claimantId] = arbitrator;
    }

    function getArbiter(uint bountyId, uint claimantId) public view returns(address arbiter) {
        arbiter = arbitrations[bountyId][claimantId];
    }
}
