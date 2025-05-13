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

    // Struct to store mint information
    struct MintRecord {
        string userId;
        address walletAddress;
        uint256 amount;
        uint256 timestamp;
        bytes32 txHash;
    }

    // Mapping from mint ID to MintRecord data
    mapping(bytes32 => MintRecord) public mintRecords;

    // Mapping from user ID to their mint records
    mapping(string => bytes32[]) public userMintRecords;

    // Mapping from wallet address to user ID
    mapping(address => string) public walletToUser;

    // Events
    event TokensMinted(
        bytes32 indexed mintId, string indexed userId, address walletAddress, uint256 amount, bytes32 txHash
    );

    /**
     * @dev Constructor that sets the token contract address
     * @param tokenAddress The address of the T2CToken contract
     * @param initialOwner The address that will own this manager contract
     */
    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        t2cToken = T2CToken(tokenAddress);
    }

    /**
     * @dev Mints tokens directly to the user's wallet and records the transaction
     * @param userId The ID of the user
     * @param walletAddress The wallet address to receive tokens
     * @param amount The amount of tokens to mint
     * @return mintId The ID of the mint record
     */
    function mintTokens(string calldata userId, address walletAddress, uint256 amount)
        external
        returns (bytes32 mintId)
    {
        // Generate a unique mint ID
        mintId = keccak256(abi.encodePacked(userId, walletAddress, amount, block.timestamp, msg.sender));

        // Mint tokens directly to the user's wallet
        t2cToken.mint(walletAddress, amount);

        // Store the mint record
        mintRecords[mintId] = MintRecord({
            userId: userId,
            walletAddress: walletAddress,
            amount: amount,
            timestamp: block.timestamp,
            txHash: blockhash(block.number - 1)
        });

        // Add the mint record to the user's records
        userMintRecords[userId].push(mintId);

        // Map the wallet address to the user ID if not already mapped
        if (bytes(walletToUser[walletAddress]).length == 0) {
            walletToUser[walletAddress] = userId;
        }

        // Emit event with all information
        emit TokensMinted(mintId, userId, walletAddress, amount, mintRecords[mintId].txHash);

        return mintId;
    }

    /**
     * @dev Gets all mint records for a user
     * @param userId The ID of the user
     * @return mintIds Array of mint record IDs for the user
     */
    function getUserMintRecords(string calldata userId) external view returns (bytes32[] memory) {
        return userMintRecords[userId];
    }

    /**
     * @dev Gets mint record details
     * @param mintId The ID of the mint record
     * @return userId The ID of the user
     * @return walletAddress The wallet address
     * @return amount The amount of tokens
     * @return timestamp The timestamp when the tokens were minted
     * @return txHash The transaction hash
     */
    function getMintRecordDetails(bytes32 mintId)
        external
        view
        returns (string memory userId, address walletAddress, uint256 amount, uint256 timestamp, bytes32 txHash)
    {
        MintRecord memory record = mintRecords[mintId];
        return (record.userId, record.walletAddress, record.amount, record.timestamp, record.txHash);
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
