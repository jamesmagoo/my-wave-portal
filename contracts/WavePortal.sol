// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title A Wave Portal
/// @author James McGauran
/// @notice You can use this contract to wave at your friends
/// @dev Me learning on Buildspace
contract WavePortal {

    uint256 totalWaves ;

    constructor() {
        console.log("First contract using hardhat");
    }

    /// @notice Tally waves
    /// @dev The function is public - anyone can wave 
    function wave() public {
        totalWaves += 1 ;
        console.log("%s has waved!", msg.sender);
    }

    /// @notice Get the total number of waves sent to the contract
    /// @dev pretty simple The function is public - anyone can get waves
    /// @return totalWaves
    function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }   

}