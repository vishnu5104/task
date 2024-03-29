// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    IERC20 public token;

    mapping(address => uint256) public balances;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        balances[msg.sender] += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        require(token.transfer(msg.sender, amount), "Token transfer failed");
    }
}
