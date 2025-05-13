// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {T2CToken} from "../src/T2CToken.sol";
import {T2CManager} from "../src/T2CManager.sol";

contract T2CManagerTest is Test {
    T2CToken public token;
    T2CManager public manager;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy token dengan owner adalah address(this)
        token = new T2CToken(owner);

        // Deploy manager dengan token address dan owner
        manager = new T2CManager(address(token), owner);

        // Transfer ownership token ke manager
        token.transferOwnership(address(manager));

        // Berikan ETH ke user untuk testing
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function test_Deployment() public {
        assertEq(address(manager.t2cToken()), address(token));
        assertEq(token.owner(), address(manager));
        assertEq(manager.owner(), owner);
    }

    function test_MintTokens() public {
        string memory userId = "user123";
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Mint tokens sebagai user1
        vm.prank(user1);
        bytes32 mintId = manager.mintTokens(userId, user1, amount);

        // Cek data mint record
        (string memory storedUserId, address walletAddress, uint256 mintAmount, uint256 timestamp, bytes32 txHash) =
            manager.getMintRecordDetails(mintId);

        // Verifikasi data mint record
        assertEq(storedUserId, userId);
        assertEq(walletAddress, user1);
        assertEq(mintAmount, amount);
        assertTrue(txHash != bytes32(0)); // Transaksi hash harus ada

        // Cek saldo token user1
        assertEq(token.balanceOf(user1), amount);
    }

    function test_MintTokensMultipleTimes() public {
        string memory userId = "user123";
        uint256 amount1 = 100 * 10 ** 18; // 100 tokens
        uint256 amount2 = 200 * 10 ** 18; // 200 tokens

        // Mint tokens pertama kali
        vm.prank(user1);
        bytes32 mintId1 = manager.mintTokens(userId, user1, amount1);

        // Mint tokens kedua kali
        vm.prank(user1);
        bytes32 mintId2 = manager.mintTokens(userId, user1, amount2);

        // Cek saldo total
        assertEq(token.balanceOf(user1), amount1 + amount2);

        // Pastikan mintId berbeda
        assertTrue(mintId1 != mintId2);
    }

    function test_GetUserMintRecords() public {
        string memory userId = "user123";

        // Mint beberapa token untuk user yang sama
        vm.prank(user1);
        bytes32 mint1 = manager.mintTokens(userId, user1, 100 * 10 ** 18);

        vm.prank(user1);
        bytes32 mint2 = manager.mintTokens(userId, user1, 200 * 10 ** 18);

        // Ambil daftar mint record user
        bytes32[] memory mintRecords = manager.getUserMintRecords(userId);

        // Cek hasil
        assertEq(mintRecords.length, 2);
        assertEq(mintRecords[0], mint1);
        assertEq(mintRecords[1], mint2);
    }

    function test_MintTokensForDifferentUsers() public {
        string memory userId1 = "user123";
        string memory userId2 = "user456";
        uint256 amount1 = 100 * 10 ** 18;
        uint256 amount2 = 200 * 10 ** 18;

        // Mint untuk user1
        vm.prank(user1);
        manager.mintTokens(userId1, user1, amount1);

        // Mint untuk user2
        vm.prank(user2);
        manager.mintTokens(userId2, user2, amount2);

        // Cek saldo
        assertEq(token.balanceOf(user1), amount1);
        assertEq(token.balanceOf(user2), amount2);

        // Cek user ID mapping
        assertEq(manager.getUserIdByWallet(user1), userId1);
        assertEq(manager.getUserIdByWallet(user2), userId2);
    }

    function test_GetUserIdByWallet() public {
        string memory userId = "user123";

        // Mint tokens sebagai user1
        vm.prank(user1);
        manager.mintTokens(userId, user1, 100 * 10 ** 18);

        // Cek mapping wallet ke user ID
        string memory storedUserId = manager.getUserIdByWallet(user1);
        assertEq(storedUserId, userId);
    }
}
