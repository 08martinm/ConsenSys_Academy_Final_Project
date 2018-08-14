pragma solidity ^0.4.21;
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";
import "./StringUtils.sol";


contract OraclizeTest is usingOraclize {

    address owner;
    string public ETHUSD;
    uint public randNum;

    event LogInfo(string description);
    event LogPriceUpdate(string price);
    event LogUpdate(address indexed _owner, uint indexed _balance);

    // Constructor
    function OraclizeTest() payable public {
        owner = msg.sender;
        emit LogUpdate(owner, address(this).balance);
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
        ETHUSD = result;
        randNum = parseInt(ETHUSD);
        emit LogPriceUpdate(ETHUSD);
    }

    function getBalance() public returns (uint _balance) {
        return address(this).balance;
    }

    function update() payable public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize query was sent, standing by for the answer..");
            oraclize_query("URL", strConcat("https://www.random.org/integers/?num=1&min=1&max=", StringUtils.uintToString(100), "&col=1&base=10&format=plain"));
        }
    }
}