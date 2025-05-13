// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import {Script} from "forge-std/Script.sol";
// import {T2CToken} from "../src/T2CToken.sol";
// import {T2CManager} from "../src/T2CManager.sol";
// import {console2} from "forge-std/console2.sol";

// contract DeployT2CContracts is Script {
//     function run() public {
//         // Ambil private key dari environment variable
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

//         // Mulai broadcast transaksi
//         vm.startBroadcast(deployerPrivateKey);

//         // Deploy T2CToken
//         address deployer = vm.addr(deployerPrivateKey);
//         T2CToken token = new T2CToken(deployer);

//         // Deploy T2CManager
//         T2CManager manager = new T2CManager(address(token), deployer);

//         // Transfer ownership token ke manager
//         token.transferOwnership(address(manager));

//         // Selesai broadcast
//         vm.stopBroadcast();

//         // Log alamat kontrak
//         console2.log("T2CToken deployed at:", address(token));
//         console2.log("T2CManager deployed at:", address(manager));
//     }
// }

// //  T2CToken deployed at: 0xdbAf9313dcDe35E83B4f1822A4010A6f45BA7243
// //  T2CManager deployed at: 0xFC0A527bF85cF36BF879e4f6C814cB1e60198b0b
