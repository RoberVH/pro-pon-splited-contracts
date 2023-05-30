//SPDX-License-Identifier: MIT
/**
 * pro-pon   -
 *               Solidity Contract for Pro-pon application
 *               July/2022
 *               Author: Roberto Vicuña
 */
pragma solidity ^0.8.9;

// Contract for testing with hardHat environmet. 
// it returns time of blockchain used to sync tiem-related testing of propon Contracts
import "hardhat/console.sol";

contract clockTest {
    
    function getBlockchainClock() view external returns (uint) {
        return block.timestamp;
    }
}