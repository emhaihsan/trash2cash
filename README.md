# Trash2Cash

![Trash2Cash Logo](frontend-trash2cash/public/favicon.svg)

Trash2Cash is an AI and blockchain-based Trash2Earn platform that transforms waste management into digital assets and real-world incentives.

## 🌟 Live Demo

Visit our live application: [https://trash2cash-eight.vercel.app/](https://trash2cash-eight.vercel.app/)

## 🚀 Project Overview

Trash2Cash revolutionizes waste management by combining AI technology with blockchain rewards. Our platform allows users to:

- **Scan and classify waste** using AI image recognition
- **Earn T2C tokens** for proper waste disposal and recycling
- **Track environmental impact** through a personalized dashboard
- **Exchange tokens** for real-world rewards

## 🏗️ Project Structure

The project consists of two main components:

### 1. Smart Contracts (`/contract-trash2cash`)

- **T2CToken.sol**: ERC20 token implementation for the T2C token
- **T2CManager.sol**: Management contract that handles token minting and user claims

### 2. Frontend Application (`/frontend-trash2cash`)

- Built with Next.js, Tailwind CSS, and TypeScript
- Integrates with Supabase for database functionality
- Uses RainbowKit and Wagmi for wallet connections
- Implements NextAuth for authentication

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, TypeScript
- **Backend**: Supabase, NextAuth
- **Blockchain**: Ethereum (Sepolia Testnet), Solidity
- **AI**: Custom image classification model
- **Deployment**: Vercel (Frontend), Sepolia Testnet (Smart Contracts)

## 🔧 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Metamask or another Ethereum wallet
- Supabase account
- Google OAuth credentials

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/emhaihsan/trash2cash.git
   cd trash2cash
   ```

2. Set up environment variables:
   Create a `.env` file in the `/frontend-trash2cash` directory with the following variables:
   ```
   NEXT_PUBLIC_REOWN_PROJECT_ID=YOUR_PROJECT_ID
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
   NEXTAUTH_URL=YOUR_NEXTAUTH_URL
   NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
   NEXT_PUBLIC_SEPOLIA_RPC=YOUR_SEPOLIA_RPC
   NEXT_PUBLIC_OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

### Frontend Setup

1. Install dependencies:

   ```bash
   cd frontend-trash2cash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

### Smart Contract Deployment

1. Install Foundry:

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Deploy contracts:
   ```bash
   cd contract-trash2cash
   forge script script/DeploySimplifiedT2C.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

## 📦 Deployment

### Frontend Deployment

The frontend can be deployed to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Contract Addresses (Sepolia Testnet)

- T2CToken: `0xdbAf9313dcDe35E83B4f1822A4010A6f45BA7243`
- T2CManager: `0xFC0A527bF85cF36BF879e4f6C814cB1e60198b0b`

## 👥 Team

- Muhammad Ihsan - Developer
