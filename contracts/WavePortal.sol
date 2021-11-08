// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title A Wave Portal
/// @author James McGauran
/// @notice You can use this contract to wave at your friends
/// @dev Me learning on Buildspace
contract WavePortal {

    uint256 totalWaves ;
    
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Wave[] waves;

    constructor() {
        console.log("First contract using hardhat");
    }

    /// @notice Tally wavess & push to waves array
    /// @dev The function is public - anyone can wave
    /// @param _message the message the user is sending

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /// @notice Get all waves stored in contract
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    /// @notice Get the total number of waves sent to the contract
    /// @dev pretty simple The function is public - anyone can get waves
    /// @return totalWaves
    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
