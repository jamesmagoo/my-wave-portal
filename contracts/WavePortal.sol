// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title A Wave Portal
/// @author James McGauran
/// @notice You can use this contract to wave at your friends
/// @dev Me learning on Buildspace
contract WavePortal {
    uint256 totalWaves;
    // seed to generate random number
    uint256 private seed;
    // mapping for last waved to stop spamming
    mapping(address => uint256) public lastWavedAt;

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
        // set init seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /// @notice Tally wavess & push to waves array
    /// @dev The function is public - anyone can wave
    /// @param _message the message the user is sending
    function wave(string memory _message) public {
        // stop spamming
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
        // generate seed for next user who calls wave
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("random number generated:", seed);
        // Pay user eth if random number is less than 50
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
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
