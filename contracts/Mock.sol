// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// MockToken extends the ERC20 contract from OpenZeppelin Contracts
contract Mock is ERC20 {
    // The constructor calls ERC20 constructor to set the token name and symbol
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // Function to mint new tokens
    // Only for testing purposes - in a real contract, you'd need access control
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
