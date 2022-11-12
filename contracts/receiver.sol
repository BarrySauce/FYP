// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Receiver {

    using Counters for Counters.Counter;
    mapping(address => mapping(address => Counters.Counter)) private _noncesManager;

    function activatePermit(
        address[] memory _tokenContracts,
        uint256[] memory _amounts,
        address[] memory _owners,
        uint256[] memory _deadlines,
        uint8[] memory v,
        bytes32[] memory r,
        bytes32[] memory s,
        address[] memory _recipients
    )
    public {
        uint256 i;
        for (i = 0; i < _tokenContracts.length; i++) {
            (bool success, ) = _tokenContracts[i].call
            (
                abi.encodeWithSignature(
                    "callPermit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
                    _owners[i],
                    address(this),
                    _amounts[i],
                    _deadlines[i],
                    v[i],
                    r[i],
                    s[i]
                )
            );

            if(success){
              _noncesManager[_tokenContracts[i]][_owners[i]].increment();
              ERC20 token = ERC20(_tokenContracts[i]);
              token.transferFrom(_owners[i], _recipients[i], _amounts[i]);
            }
        }
    }

    function getNonce(address tokenAddress, address owner) public view returns (uint256) {
        return _noncesManager[tokenAddress][owner].current();
    }
}
