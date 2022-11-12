// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC20, ERC20Permit} from "./ERC20Permit.sol";

contract TokenA is ERC20Permit {

    address public receiver;

    constructor(address _receiver, address _holder, uint256 _initialSupply) ERC20("TOKEN_A", "TKA") {
        receiver = _receiver;
        _mint(_holder, _initialSupply);
    }


    function callPermit(
        address _owner,
        address _spender,
        uint256 _amount,
        uint256 _deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(msg.sender == receiver, "Only receiver is allowed to call this function");
        permit(_owner, _spender, _amount, _deadline, v, r, s);
    }
}
