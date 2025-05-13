// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {T2CToken} from "./T2CToken.sol";

/**
 * @title Trash2Cash Token Manager
 * @dev Manages the minting process for T2CToken and records user data
 */
contract T2CManager is Ownable {
    // Reference to the T2CToken contract
    T2CToken public t2cToken;

    // Struct to store claim information
    struct Claim {
        string userId;
        address walletAddress;
        uint256 amount;
        uint256 timestamp;
        bytes32 txHash;
    }

    // Mapping from claim ID to Claim data
    mapping(bytes32 => Claim) public claims;

    // Mapping from user ID to their claims
    mapping(string => bytes32[]) public userClaims;

    // Mapping from wallet address to user ID
    mapping(address => string) public walletToUser;

    // Events
    event ClaimCreated(bytes32 indexed claimId, string indexed userId, address walletAddress, uint256 amount);
    event ClaimProcessed(bytes32 indexed claimId, bytes32 txHash);

    /**
     * @dev Constructor that sets the token contract address
     * @param tokenAddress The address of the T2CToken contract
     * @param initialOwner The address that will own this manager contract
     */
    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        t2cToken = T2CToken(tokenAddress);
    }

    /**
     * @dev Creates a new claim for tokens
     * @param userId The ID of the user making the claim
     * @param walletAddress The wallet address to receive tokens
     * @param amount The amount of tokens to mint
     * @return claimId The ID of the created claim
     */
    function createClaim(string calldata userId, address walletAddress, uint256 amount)
        external
        returns (bytes32 claimId)
    {
        // Generate a unique claim ID
        claimId = keccak256(abi.encodePacked(userId, walletAddress, amount, block.timestamp, msg.sender));

        // Store the claim data
        claims[claimId] = Claim({
            userId: userId,
            walletAddress: walletAddress,
            amount: amount,
            timestamp: block.timestamp,
            txHash: bytes32(0)
        });

        // Add the claim to the user's claims
        userClaims[userId].push(claimId);

        // Map the wallet address to the user ID
        if (bytes(walletToUser[walletAddress]).length == 0) {
            walletToUser[walletAddress] = userId;
        }

        emit ClaimCreated(claimId, userId, walletAddress, amount);
        return claimId;
    }

    /**
     * @dev Processes a claim by minting tokens to the user's wallet
     * @param claimId The ID of the claim to process
     * @return success Whether the claim was processed successfully
     */
    function processClaim(bytes32 claimId) external returns (bool success) {
        Claim storage claim = claims[claimId];

        // Ensure claim exists and hasn't been processed
        require(claim.timestamp > 0, "Claim does not exist");
        require(claim.txHash == bytes32(0), "Claim already processed");

        // Mint tokens to the user's wallet
        t2cToken.mint(claim.walletAddress, claim.amount);

        // Record the transaction hash
        claim.txHash = blockhash(block.number - 1);

        emit ClaimProcessed(claimId, claim.txHash);
        return true;
    }

    /**
     * @dev Gets all claims for a user
     * @param userId The ID of the user
     * @return claimIds Array of claim IDs for the user
     */
    function getUserClaims(string calldata userId) external view returns (bytes32[] memory) {
        return userClaims[userId];
    }

    /**
     * @dev Gets claim details
     * @param claimId The ID of the claim
     * @return userId The ID of the user
     * @return walletAddress The wallet address
     * @return amount The amount of tokens
     * @return timestamp The timestamp when the claim was created
     * @return txHash The transaction hash (if processed)
     */
    function getClaimDetails(bytes32 claimId)
        external
        view
        returns (string memory userId, address walletAddress, uint256 amount, uint256 timestamp, bytes32 txHash)
    {
        Claim memory claim = claims[claimId];
        return (claim.userId, claim.walletAddress, claim.amount, claim.timestamp, claim.txHash);
    }

    /**
     * @dev Gets the user ID associated with a wallet address
     * @param walletAddress The wallet address
     * @return userId The ID of the user
     */
    function getUserIdByWallet(address walletAddress) external view returns (string memory) {
        return walletToUser[walletAddress];
    }

    /**
     * @dev Allows the owner to update the token contract address
     * @param newTokenAddress The new token contract address
     */
    function setTokenAddress(address newTokenAddress) external onlyOwner {
        t2cToken = T2CToken(newTokenAddress);
    }
}
