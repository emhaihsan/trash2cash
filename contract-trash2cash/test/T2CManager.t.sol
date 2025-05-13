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

    function test_CreateClaim() public {
        string memory userId = "user123";
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Buat klaim sebagai user1
        vm.prank(user1);
        bytes32 claimId = manager.createClaim(userId, user1, amount);

        // Cek data klaim
        (string memory storedUserId, address walletAddress, uint256 claimAmount, uint256 timestamp, bytes32 txHash) =
            manager.getClaimDetails(claimId);

        assertEq(storedUserId, userId);
        assertEq(walletAddress, user1);
        assertEq(claimAmount, amount);
        assertEq(txHash, bytes32(0)); // Belum diproses
    }

    function test_ProcessClaim() public {
        string memory userId = "user123";
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Buat klaim sebagai user1
        vm.prank(user1);
        bytes32 claimId = manager.createClaim(userId, user1, amount);

        // Proses klaim sebagai owner
        bool success = manager.processClaim(claimId);

        // Cek hasil
        assertTrue(success);

        // Cek saldo token user1
        assertEq(token.balanceOf(user1), amount);

        // Cek status klaim
        (,,,, bytes32 txHash) = manager.getClaimDetails(claimId);
        assertTrue(txHash != bytes32(0)); // Sudah diproses
    }

    function test_ProcessClaimOnlyOnce() public {
        string memory userId = "user123";
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Buat klaim sebagai user1
        vm.prank(user1);
        bytes32 claimId = manager.createClaim(userId, user1, amount);

        // Proses klaim pertama kali
        manager.processClaim(claimId);

        // Coba proses lagi, harusnya revert
        vm.expectRevert("Claim already processed");
        manager.processClaim(claimId);
    }

    function test_GetUserClaims() public {
        string memory userId = "user123";

        // Buat beberapa klaim untuk user yang sama
        vm.prank(user1);
        bytes32 claim1 = manager.createClaim(userId, user1, 100 * 10 ** 18);

        vm.prank(user1);
        bytes32 claim2 = manager.createClaim(userId, user1, 200 * 10 ** 18);

        // Ambil daftar klaim user
        bytes32[] memory claims = manager.getUserClaims(userId);

        // Cek hasil
        assertEq(claims.length, 2);
        assertEq(claims[0], claim1);
        assertEq(claims[1], claim2);
    }

    function test_GetUserIdByWallet() public {
        string memory userId = "user123";

        // Buat klaim sebagai user1
        vm.prank(user1);
        manager.createClaim(userId, user1, 100 * 10 ** 18);

        // Cek mapping wallet ke user ID
        string memory storedUserId = manager.getUserIdByWallet(user1);
        assertEq(storedUserId, userId);
    }
}
