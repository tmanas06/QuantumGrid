# 🚀 Quantum Grid - Quick Start Guide

## 📁 **Files Created for You**

I've created these files to help you get started quickly:

- ✅ `env.local.example` - Example environment configuration
- ✅ `.gitignore` - Git ignore file to protect your secrets
- ✅ `setup.js` - Automatic setup script
- ✅ `ALCHEMY_SETUP.md` - Detailed Alchemy setup guide

## 🎯 **Super Quick Setup (3 Steps)**

### **Step 1: Run Setup Script**
```bash
npm run setup
```
This will automatically create your `.env.local` file!

### **Step 2: Get Alchemy API Key**
1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Sign up for free
3. Create new app → Select "Polygon" → Select "Amoy"
4. Copy your API key

### **Step 3: Update Environment File**
Edit `.env.local` and replace `your_alchemy_api_key_here` with your actual API key:
```bash
VITE_ALCHEMY_API_KEY=alcht_your_actual_api_key_here
```

## 🎮 **Start Playing**

```bash
npm run dev
```

Then:
1. Open http://localhost:5173
2. Connect MetaMask wallet
3. Switch to Polygon Amoy testnet
4. Get testnet MATIC from [faucet](https://faucet.polygon.technology/)
5. Start playing!

## 📋 **What Each File Does**

### **env.local.example**
- Template for your environment variables
- Contains all the settings you need
- Copy this to `.env.local` and customize

### **.gitignore**
- Protects your API keys from being committed
- Ignores build files and dependencies
- Keeps your repository clean

### **setup.js**
- Automatically creates `.env.local` from example
- Runs after `npm install`
- Provides helpful setup instructions

## 🔧 **Environment Variables Explained**

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_ALCHEMY_API_KEY` | Your Alchemy API key | `alcht_1234...` |
| `VITE_DEFAULT_NETWORK` | Which network to use | `amoy` |
| `VITE_QUANTUM_GRID_CONTRACT_AMOY` | Smart contract address | `0x1234...` |
| `VITE_HOUSE_BALANCE` | Starting house balance | `100` |
| `VITE_HOUSE_FEE` | House fee percentage | `0.05` |

## 🆘 **Troubleshooting**

### **"Failed to resolve import ethers"**
- Run `npm install` to install dependencies
- Restart the dev server

### **"Invalid API key"**
- Check your Alchemy API key in `.env.local`
- Make sure there are no extra spaces
- Restart the dev server after changes

### **"Network not found"**
- The app will automatically add Amoy network to MetaMask
- Or add it manually using the network details

### **"Insufficient funds"**
- Get testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)
- Select "Amoy Testnet"
- Wait a few minutes for confirmation

## 🎯 **What's Next?**

1. ✅ **Setup Complete** - You're ready to play!
2. 🔄 **Test the Game** - Play a few rounds
3. 🔗 **Deploy Contracts** - When ready for production
4. 🚀 **Go Live** - Deploy to mainnet

## 📚 **Need More Help?**

- **Alchemy Setup**: See `ALCHEMY_SETUP.md`
- **Token Distribution**: See `TOKEN_DISTRIBUTION.md`
- **Game Rules**: See `README.md`

## 🎮 **Ready to Play!**

Your Quantum Grid game is now set up and ready to go! Enjoy the quantum puzzle experience with real MATIC rewards! 🌌💰✨
