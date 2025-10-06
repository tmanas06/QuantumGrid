# 🚀 Real Polygon Amoy Deployment Guide

## ⚠️ **Important: Previous Deployment Was Local Only**

The contract address `0x5FbDB2315678afecb367f032d93F642f64180aa3` was deployed to **local Hardhat network only** - this is NOT a real blockchain deployment!

## 🎯 **To Deploy to Real Polygon Amoy Testnet:**

### **Step 1: Get Your Alchemy API Key**
1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Sign up for free
3. Create a new app:
   - **Chain**: Polygon
   - **Network**: Amoy (Testnet)
   - **Name**: Quantum Grid Game
4. Copy your API key

### **Step 2: Get Your Private Key**
1. Open MetaMask
2. Click on your account (top right)
3. Go to "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key

### **Step 3: Get Testnet MATIC**
1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy Testnet"
3. Enter your wallet address
4. Request testnet MATIC

### **Step 4: Configure Environment**
Edit the `.env` file with your real values:

```bash
# Replace with your actual Alchemy API key
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_ACTUAL_API_KEY

# Replace with your actual private key (NEVER share this!)
PRIVATE_KEY=your_actual_private_key_here

# Optional: Get from https://polygonscan.com/apis
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### **Step 5: Deploy to Real Blockchain**
```bash
# Deploy to Polygon Amoy testnet
npm run deploy:amoy
```

### **Step 6: Expected Real Output**
```
🚀 Deploying QuantumGrid contract...
📝 Deploying contract...
✅ QuantumGrid deployed to: 0x1234567890abcdef1234567890abcdef12345678
💰 Funding house with 1 MATIC...
✅ House funded with 1 MATIC
📊 Contract Stats:
   House Balance: 1.0 MATIC
   Total Games Played: 0
   Total Winnings Paid: 0.0 MATIC
   House Fee: 5 basis points
```

### **Step 7: Verify on Polygonscan**
1. Go to [Amoy Polygonscan](https://amoy.polygonscan.com/)
2. Search for your contract address
3. Verify the contract is deployed

### **Step 8: Update Frontend**
Add the real contract address to `.env.local`:
```bash
VITE_QUANTUM_GRID_CONTRACT_AMOY=0x1234567890abcdef1234567890abcdef12345678
```

## 🔍 **How to Tell if It's Real:**

### **Local Hardhat (What We Did)**
- ❌ Address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- ❌ Only exists on your computer
- ❌ No real MATIC tokens
- ❌ Not on any blockchain

### **Real Polygon Amoy (What We Need)**
- ✅ Address: `0x1234567890abcdef1234567890abcdef12345678` (example)
- ✅ Exists on real blockchain
- ✅ Uses real testnet MATIC
- ✅ Visible on Polygonscan

## 🚨 **Security Reminders:**

- **NEVER** share your private key
- **NEVER** commit `.env` file to git
- **ONLY** use testnet for testing
- **ALWAYS** verify contract addresses

## 🎯 **Ready to Deploy for Real?**

1. Get your Alchemy API key
2. Get your private key
3. Get testnet MATIC
4. Update `.env` file
5. Run `npm run deploy:amoy`
6. Get your real contract address!

Your contract will then be deployed to the real Polygon Amoy testnet and players can use real MATIC tokens! 🌌💰✨
