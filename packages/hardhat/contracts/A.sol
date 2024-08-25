// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ContractA is Ownable, ReentrancyGuard {
    uint256 private value;

    event ValueSet(uint256 newValue);

    function setValue(uint256 newValue) external onlyOwner nonReentrant {
        value += newValue;
        emit ValueSet(value);
    }

    function getValue() external view returns (uint256) {
        return value;
    }
}
