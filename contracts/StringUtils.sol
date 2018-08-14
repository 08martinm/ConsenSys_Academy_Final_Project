pragma solidity ^0.4.21;

library StringUtils {
    /// @dev Converts an unsigned integert to its string representation.
    /// @param v The number to be converted.
    function uintToBytes(uint v) view private returns (bytes32 ret) {
        uint num = v;
        if (num == 0) {
            ret = "0";
        }
        else {
            while (num > 0) {
                ret = bytes32(uint(ret) / (2 ** 8));
                ret |= bytes32(((num % 10) + 48) * 2 ** (8 * 31));
                num /= 10;
            }
        }
        return ret;
    }

    function bytes32ToString (bytes32 x) private pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory resultBytes = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            resultBytes[j] = bytesString[j];
        }

        return string(resultBytes);
    }

    function uintToString(uint v) view public returns (string ret) {
        return bytes32ToString(uintToBytes(v));
    }
}