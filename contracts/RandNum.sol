pragma solidity ^0.4.24;
import "../installed_contracts/oraclize-api/contracts/usingOraclize.sol";
import "./StringUtils.sol";
import "./Master.sol";

/** @title Random Number Generator */
contract RandNum is usingOraclize {

    address public owner;
    uint public randNum;
    mapping(bytes32 => Id) Ids;
    Master masterContract;

    struct Id {
        address masterContractAddress;
        uint bountyId;
        uint claimantId;
    }

    event LogInfo(string description);
    event LogNumber(uint randNum);
    event LogUpdate(address indexed _owner, uint indexed _balance);

    /// @dev Constructor sets owner, Oraclize Resolver, and Oraclize proof.
    constructor () payable public {
        owner = msg.sender;
        // Replace the next line with your version:
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
    }

    // Fallback function
    function() public {
        revert();
    }

    /** @dev Callback function invoked by async response from Oraclize API call.
      * @param id The id of the oraclize callback address.
      * @param result The result of the API call.
      */
    function __callback(bytes32 id, string result) public {
        require(msg.sender == oraclize_cbAddress());
        randNum = parseInt(result);
        emit LogNumber(randNum);
        masterContract = Master(Ids[id].masterContractAddress);
        masterContract.selectArbiter(Ids[id].bountyId, Ids[id].claimantId, randNum);
    }

    /** @dev Retrieves the balance for the current contract.
      * @return balance The balance for the current contract.
      */
    function getBalance() public view returns (uint _balance) {
        return address(this).balance;
    }

    /** @dev Calls Oraclize to retrieve a random number.
      * @param bountyId The integer ID of the bounty.
      * @param claimantId The integer ID of the claimant.
      * @param _m The address of contract that called this function.
      * @param maxNum The maximum integer allowable from the random number call.
      */
    function update(uint bountyId, uint claimantId, address _m, uint maxNum) payable public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize query was sent, standing by for the answer..");
            bytes32 queryId = oraclize_query("URL", strConcat("https://www.random.org/integers/?num=1&min=1&max=", StringUtils.uintToString(maxNum), "&col=1&base=10&format=plain"));
            Ids[queryId] = Id({
                masterContractAddress: _m,
                bountyId: bountyId,
                claimantId: claimantId
            });
        }
    }
}
