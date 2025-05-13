// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {T2CToken} from "../src/T2CToken.sol";
import {T2CManager} from "../src/T2CManager.sol";
import {console2} from "forge-std/console2.sol";

/**
 * @title DeploySimplifiedT2C
 * @dev Script untuk deploy versi yang disederhanakan dari T2CToken dan T2CManager
 * Versi ini menggunakan pendekatan minting langsung tanpa pemisahan klaim dan proses
 */
contract DeploySimplifiedT2C is Script {
    function run() public {
        // Ambil private key dari environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("Deploying contracts with address:", deployer);

        // Mulai broadcast transaksi
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy T2CToken
        console2.log("Deploying T2CToken...");
        T2CToken token = new T2CToken(deployer);
        console2.log("T2CToken deployed at:", address(token));

        // 2. Deploy T2CManager
        console2.log("Deploying T2CManager...");
        T2CManager manager = new T2CManager(address(token), deployer);
        console2.log("T2CManager deployed at:", address(manager));

        // 3. Transfer ownership token ke manager
        console2.log("Transferring token ownership to manager...");
        token.transferOwnership(address(manager));
        console2.log("Ownership transferred successfully");

        // Selesai broadcast
        vm.stopBroadcast();

        // Log ringkasan deployment
        console2.log("\n--- Deployment Summary ---");
        console2.log("Network: ", block.chainid);
        console2.log("T2CToken: ", address(token));
        console2.log("T2CManager: ", address(manager));
        console2.log("Owner: ", deployer);
        console2.log("------------------------\n");

        console2.log("Frontend Configuration:");
        console2.log('export const T2C_MANAGER_ADDRESS = "', address(manager), '";');
        console2.log('export const T2C_TOKEN_ADDRESS = "', address(token), '";');
    }
}

// == Logs ==
//   Deploying contracts with address: 0x131E7B1F648d4796865Ed047460CcD9984d590D1
//   Deploying T2CToken...
//   T2CToken deployed at: 0x0871c553fed4E59BA8B53486522888A17f66946d
//   Deploying T2CManager...
//   T2CManager deployed at: 0x5Ce9Be8630781ff9179D1d972D1341c1E832f5e2
//   Transferring token ownership to manager...
//   Ownership transferred successfully

// --- Deployment Summary ---
//   Network:  11155111
//   T2CToken:  0x0871c553fed4E59BA8B53486522888A17f66946d
//   T2CManager:  0x5Ce9Be8630781ff9179D1d972D1341c1E832f5e2
//   Owner:  0x131E7B1F648d4796865Ed047460CcD9984d590D1
//   ------------------------

//   Frontend Configuration:
//   export const T2C_MANAGER_ADDRESS = " 0x5Ce9Be8630781ff9179D1d972D1341c1E832f5e2 ";
//   export const T2C_TOKEN_ADDRESS = " 0x0871c553fed4E59BA8B53486522888A17f66946d ";
