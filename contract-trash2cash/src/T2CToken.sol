// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title Trash2Cash Token
 * @dev ERC20 token for the Trash2Cash recycling platform
 */
contract T2CToken is ERC20, Ownable {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor that initializes the token with name and symbol
     * @param initialOwner The address that will own the contract and be able to mint tokens
     */
    constructor(address initialOwner) ERC20("Trash2Cash Token", "T2C") Ownable(initialOwner) {
        // No initial supply is minted at deployment
    }

    /**
     * @dev Mints new tokens, can only be called by the contract owner
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burns tokens from the caller's balance
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Returns the number of decimals used for token - overridden to use 18 decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
