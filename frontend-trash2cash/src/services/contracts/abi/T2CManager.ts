export const T2CManagerABI = [{
  "type": "constructor",
  "inputs": [{
    "name": "tokenAddress",
    "type": "address",
    "internalType": "address"
  }, {
    "name": "initialOwner",
    "type": "address",
    "internalType": "address"
  }],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "getMintRecordDetails",
  "inputs": [{
    "name": "mintId",
    "type": "bytes32",
    "internalType": "bytes32"
  }],
  "outputs": [{
    "name": "userId",
    "type": "string",
    "internalType": "string"
  }, {
    "name": "walletAddress",
    "type": "address",
    "internalType": "address"
  }, {
    "name": "amount",
    "type": "uint256",
    "internalType": "uint256"
  }, {
    "name": "timestamp",
    "type": "uint256",
    "internalType": "uint256"
  }, {
    "name": "txHash",
    "type": "bytes32",
    "internalType": "bytes32"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "getUserIdByWallet",
  "inputs": [{
    "name": "walletAddress",
    "type": "address",
    "internalType": "address"
  }],
  "outputs": [{
    "name": "",
    "type": "string",
    "internalType": "string"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "getUserMintRecords",
  "inputs": [{
    "name": "userId",
    "type": "string",
    "internalType": "string"
  }],
  "outputs": [{
    "name": "",
    "type": "bytes32[]",
    "internalType": "bytes32[]"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "mintRecords",
  "inputs": [{
    "name": "",
    "type": "bytes32",
    "internalType": "bytes32"
  }],
  "outputs": [{
    "name": "userId",
    "type": "string",
    "internalType": "string"
  }, {
    "name": "walletAddress",
    "type": "address",
    "internalType": "address"
  }, {
    "name": "amount",
    "type": "uint256",
    "internalType": "uint256"
  }, {
    "name": "timestamp",
    "type": "uint256",
    "internalType": "uint256"
  }, {
    "name": "txHash",
    "type": "bytes32",
    "internalType": "bytes32"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "mintTokens",
  "inputs": [{
    "name": "userId",
    "type": "string",
    "internalType": "string"
  }, {
    "name": "walletAddress",
    "type": "address",
    "internalType": "address"
  }, {
    "name": "amount",
    "type": "uint256",
    "internalType": "uint256"
  }],
  "outputs": [{
    "name": "mintId",
    "type": "bytes32",
    "internalType": "bytes32"
  }],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "owner",
  "inputs": [],
  "outputs": [{
    "name": "",
    "type": "address",
    "internalType": "address"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "renounceOwnership",
  "inputs": [],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "setTokenAddress",
  "inputs": [{
    "name": "newTokenAddress",
    "type": "address",
    "internalType": "address"
  }],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "t2cToken",
  "inputs": [],
  "outputs": [{
    "name": "",
    "type": "address",
    "internalType": "contract T2CToken"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "transferOwnership",
  "inputs": [{
    "name": "newOwner",
    "type": "address",
    "internalType": "address"
  }],
  "outputs": [],
  "stateMutability": "nonpayable"
}, {
  "type": "function",
  "name": "userMintRecords",
  "inputs": [{
    "name": "",
    "type": "string",
    "internalType": "string"
  }, {
    "name": "",
    "type": "uint256",
    "internalType": "uint256"
  }],
  "outputs": [{
    "name": "",
    "type": "bytes32",
    "internalType": "bytes32"
  }],
  "stateMutability": "view"
}, {
  "type": "function",
  "name": "walletToUser",
  "inputs": [{
    "name": "",
    "type": "address",
    "internalType": "address"
  }],
  "outputs": [{
    "name": "",
    "type": "string",
    "internalType": "string"
  }],
  "stateMutability": "view"
}, {
  "type": "event",
  "name": "OwnershipTransferred",
  "inputs": [{
    "name": "previousOwner",
    "type": "address",
    "indexed": true,
    "internalType": "address"
  }, {
    "name": "newOwner",
    "type": "address",
    "indexed": true,
    "internalType": "address"
  }],
  "anonymous": false
}, {
  "type": "event",
  "name": "TokensMinted",
  "inputs": [{
    "name": "mintId",
    "type": "bytes32",
    "indexed": true,
    "internalType": "bytes32"
  }, {
    "name": "userId",
    "type": "string",
    "indexed": true,
    "internalType": "string"
  }, {
    "name": "walletAddress",
    "type": "address",
    "indexed": false,
    "internalType": "address"
  }, {
    "name": "amount",
    "type": "uint256",
    "indexed": false,
    "internalType": "uint256"
  }, {
    "name": "txHash",
    "type": "bytes32",
    "indexed": false,
    "internalType": "bytes32"
  }],
  "anonymous": false
}, {
  "type": "error",
  "name": "OwnableInvalidOwner",
  "inputs": [{
    "name": "owner",
    "type": "address",
    "internalType": "address"
  }]
}, {
  "type": "error",
  "name": "OwnableUnauthorizedAccount",
  "inputs": [{
    "name": "account",
    "type": "address",
    "internalType": "address"
  }]
}]