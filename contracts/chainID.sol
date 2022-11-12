// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChainID {

    uint256 public a;

    function _chainID() public{
        uint256 chainID;
        /*assembly {
            chainID := chainid()
        }*/

        chainID = 1337;

        a = chainID;

    }


}
