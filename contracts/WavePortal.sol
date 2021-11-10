// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title A Wave Portal
/// @author James McGauran
/// @notice You can use this contract to wave at your friends
/// @dev Me learning on Buildspace
contract WavePortal {
    uint256 totalWaves;
    /// @notice Emits when a new wave is written to the contract
    /// @dev Explain to a developer any extra details
    /// @param from - the address which sent the wave
    /// @param timestamp - the time when the wave was sent
    /// @param message - the message with the wave
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Wave[] waves;

    constructor() payable {
        console.log("First payable contract using hardhat");
    }

    /// @notice Tally wavess & push to waves array
    /// @dev The function is public - anyone can wave
    /// @param _message the message the user is sending
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
        // Pay user eth
        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
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
