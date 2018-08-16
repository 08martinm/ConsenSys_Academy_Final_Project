pragma solidity ^0.4.21;
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";
import "./StringUtils.sol";
import "./Master.sol";


contract RandNum is usingOraclize {

    address owner;
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

    // Constructor
    function RandNum() payable public {
        owner = msg.sender;
        // Replace the next line with your version:
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
    }

    // Fallback function
    function() public {
        revert();
    }

    function __callback(bytes32 id, string result, bytes proof) public {
        require(msg.sender == oraclize_cbAddress());
        randNum = parseInt(result);
        emit LogNumber(randNum);
        masterContract = Master(Ids[id].masterContractAddress);
        masterContract.selectArbiter(Ids[id].bountyId, Ids[id].claimantId, randNum);
    }

    function getBalance() public returns (uint _balance) {
        return address(this).balance;
    }

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
