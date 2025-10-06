# 🔗 Alchemy Setup for Polygon Amoy Testnet

## 🚀 **Quick Setup Guide**

### **Step 1: Get Alchemy API Key**

1. Go to [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Sign up or log in to your account
3. Create a new app:
   - **Chain**: Polygon
   - **Network**: Amoy (Testnet)
   - **Name**: Quantum Grid Game
4. Copy your API key from the dashboard

### **Step 2: Configure Environment Variables**

Create a `.env.local` file in your project root:

```bash
# Alchemy API Key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here

# Default Network
VITE_DEFAULT_NETWORK=amoy

# Contract Addresses (update after deployment)
VITE_QUANTUM_GRID_CONTRACT_AMOY=0x...
VITE_QUANTUM_GRID_CONTRACT_MUMBAI=0x...
VITE_QUANTUM_GRID_CONTRACT_MAINNET=0x...

# House Configuration
VITE_HOUSE_BALANCE=100
VITE_HOUSE_FEE=0.05
```

### **Step 3: Get Testnet MATIC**

1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy Testnet"
3. Enter your wallet address
4. Request testnet MATIC (you'll get ~1 MATIC)

### **Step 4: Add Amoy Network to MetaMask**

The app will automatically prompt you to add the network, or you can add it manually:

**Network Details:**
- **Network Name**: Polygon Amoy Testnet
- **RPC URL**: `https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY`
- **Chain ID**: 80002
- **Currency Symbol**: MATIC
- **Block Explorer**: https://amoy.polygonscan.com

## 🔧 **Configuration Details**

### **Network Configurations**

| Network | Chain ID | RPC URL | Explorer |
|---------|----------|---------|----------|
| Amoy Testnet | 80002 | `https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY` | https://amoy.polygonscan.com |
| Mumbai Testnet | 80001 | `https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY` | https://mumbai.polygonscan.com |
| Polygon Mainnet | 137 | `https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY` | https://polygonscan.com |

### **Alchemy Benefits**

- ✅ **Reliable RPC**: 99.9% uptime
- ✅ **Fast Response**: Optimized for speed
- ✅ **Rate Limits**: Higher limits than public RPCs
- ✅ **Analytics**: Track usage and performance
- ✅ **Support**: 24/7 technical support

## 🎮 **Testing the Integration**

### **1. Start the Development Server**
```bash
npm run dev
```

### **2. Connect MetaMask**
- Click "Connect Wallet"
- Select your account
- Approve network addition if prompted

### **3. Switch to Amoy Network**
- Click on your wallet address
- Click "Switch to Polygon" (will switch to Amoy)
- Verify you're on Amoy Testnet

### **4. Get Testnet MATIC**
- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Select Amoy Testnet
- Enter your wallet address
- Request testnet MATIC

### **5. Test the Game**
- Place a small bet (0.1 MATIC)
- Play the game
- Test cash-out functionality
- Check transactions on [Amoy Explorer](https://amoy.polygonscan.com)

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Failed to connect to network"**
   - Check your Alchemy API key
   - Verify the RPC URL is correct
   - Ensure you're using the right network

2. **"Insufficient funds"**
   - Get testnet MATIC from the faucet
   - Wait a few minutes for the transaction to confirm

3. **"Network not found"**
   - Add the Amoy network manually to MetaMask
   - Use the network details provided above

4. **"Transaction failed"**
   - Check your gas settings
   - Ensure you have enough MATIC for gas
   - Try increasing gas limit

### **Debug Information:**

Check the browser console for detailed error messages. The app will log:
- Network connection status
- Transaction details
- Error messages with suggestions

## 🚀 **Production Deployment**

### **For Production:**

1. **Use Mainnet**: Switch to Polygon Mainnet
2. **Real MATIC**: Use real MATIC tokens
3. **Contract Deployment**: Deploy smart contracts
4. **Monitoring**: Set up Alchemy monitoring
5. **Security**: Implement proper security measures

### **Environment Variables for Production:**

```bash
VITE_DEFAULT_NETWORK=mainnet
VITE_ALCHEMY_API_KEY=your_production_key
VITE_QUANTUM_GRID_CONTRACT_MAINNET=0x...
```

## 📊 **Alchemy Dashboard Features**

- **Request Logs**: See all RPC requests
- **Error Tracking**: Monitor failed requests
- **Usage Analytics**: Track API usage
- **Performance Metrics**: Monitor response times
- **Rate Limit Monitoring**: Track rate limit usage

## 🎯 **Next Steps**

1. ✅ Set up Alchemy account
2. ✅ Configure environment variables
3. ✅ Test with Amoy testnet
4. 🔄 Deploy smart contracts
5. 🔄 Test contract integration
6. 🔄 Deploy to production

Your Quantum Grid game is now ready to work with Polygon Amoy testnet through Alchemy! 🌌💰✨
