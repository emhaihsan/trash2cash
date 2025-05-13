// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {T2CToken} from "../src/T2CToken.sol";

contract T2CTokenTest is Test {
    T2CToken public token;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = address(0x1);
        token = new T2CToken(owner);
    }

    function testMetadata() public {
        assertEq(token.name(), "Trash2Cash Token");
        assertEq(token.symbol(), "T2C");
        assertEq(token.decimals(), 18);
    }

    function testMint() public {
        uint256 amount = 100 * 10 ** 18; // 100 tokens
        token.mint(user, amount);
        assertEq(token.balanceOf(user), amount);
        assertEq(token.totalSupply(), amount);
    }

    function testMintOnlyOwner() public {
        uint256 amount = 100 * 10 ** 18; // 100 tokens
        vm.prank(user);
        vm.expectRevert();
        token.mint(user, amount);
    }

    function testBurn() public {
        uint256 mintAmount = 100 * 10 ** 18; // 100 tokens
        uint256 burnAmount = 30 * 10 ** 18; // 30 tokens

        // Mint tokens to user
        token.mint(user, mintAmount);

        // Burn tokens as user
        vm.prank(user);
        token.burn(burnAmount);

        assertEq(token.balanceOf(user), mintAmount - burnAmount);
        assertEq(token.totalSupply(), mintAmount - burnAmount);
    }

    function testTransfer() public {
        address recipient = address(0x2);
        uint256 mintAmount = 100 * 10 ** 18; // 100 tokens
        uint256 transferAmount = 50 * 10 ** 18; // 50 tokens

        // Mint tokens to user
        token.mint(user, mintAmount);

        // Transfer tokens from user to recipient
        vm.prank(user);
        token.transfer(recipient, transferAmount);

        assertEq(token.balanceOf(user), mintAmount - transferAmount);
        assertEq(token.balanceOf(recipient), transferAmount);
    }
}
