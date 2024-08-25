// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ContractB is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address public superAdmin;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        superAdmin = msg.sender;
    }

    function addAdmin(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
    }

    function removeAdmin(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
    }

    function transferAdminRole(address newAdmin) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, newAdmin);
        revokeRole(ADMIN_ROLE, msg.sender);
    }

    function renounceAdminRole() external onlyRole(ADMIN_ROLE) {
        renounceRole(ADMIN_ROLE, msg.sender);
    }
}
