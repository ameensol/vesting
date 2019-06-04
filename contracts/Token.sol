pragma solidity ^0.5.0;

import "./ERC20.sol";

contract Token is ERC20 {
    constructor(uint256 initialBalance) public {
        _mint(msg.sender, initialBalance);
    }
}
