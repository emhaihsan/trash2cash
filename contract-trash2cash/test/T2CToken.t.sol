// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {T2CToken} from "../src/T2CToken.sol";

contract T2CTokenTest is Test {
    T2CToken public token;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy token dengan owner adalah address(this)
        token = new T2CToken(owner);

        // Berikan ETH ke user untuk testing
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function test_Deployment() public {
        assertEq(token.name(), "Trash2Cash Token");
        assertEq(token.symbol(), "T2C");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), 0);
        assertEq(token.owner(), owner);
    }

    function test_Mint() public {
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Mint token ke user1
        token.mint(user1, amount);

        // Cek saldo user1
        assertEq(token.balanceOf(user1), amount);
        assertEq(token.totalSupply(), amount);
    }

    function test_MintOnlyOwner() public {
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Coba mint dari user1 (bukan owner)
        vm.prank(user1);
        vm.expectRevert(); // Harusnya revert karena bukan owner
        token.mint(user2, amount);
    }

    function test_Burn() public {
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Mint token ke user1
        token.mint(user1, amount);

        // Burn token dari user1
        vm.prank(user1);
        token.burn(amount / 2);

        // Cek saldo user1
        assertEq(token.balanceOf(user1), amount / 2);
        assertEq(token.totalSupply(), amount / 2);
    }

    function test_Transfer() public {
        uint256 amount = 100 * 10 ** 18; // 100 tokens

        // Mint token ke user1
        token.mint(user1, amount);

        // Transfer token dari user1 ke user2
        vm.prank(user1);
        token.transfer(user2, amount / 2);

        // Cek saldo user1 dan user2
        assertEq(token.balanceOf(user1), amount / 2);
        assertEq(token.balanceOf(user2), amount / 2);
        assertEq(token.totalSupply(), amount);
    }
}
