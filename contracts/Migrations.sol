pragma solidity ^0.4.24;

/** @title Migrations contract */
contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    constructor() public {
        owner = msg.sender;
    }

    /** @dev Updates the integer variable lastCompletedMigration.
      * @param completed The integer id of the completed contract.
      */
    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }

    /** @dev Performs the migrations of contracts.
      * @param newAddress The address of the next contract.
      */
    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }
}
