// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {T2CToken} from "../src/T2CToken.sol";
import {console} from "forge-std/console.sol";

/**
 * @title Deploy Trash2Cash Token
 * @dev Script to deploy the T2C token contract
 */
contract DeployT2CToken is Script {
    function run() external returns (T2CToken) {
        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy the token contract with the sender as the owner
        T2CToken token = new T2CToken(msg.sender);

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log the token address
        console.log("T2C Token deployed at:", address(token));

        return token;
    }
}

// 0xAfEb4aA59621559d300384c20D5B39E67A824658
