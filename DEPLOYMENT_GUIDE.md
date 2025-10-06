# 🚀 Enhanced Quantum Grid - Deployment Guide

This guide will help you deploy the enhanced Quantum Grid smart contract with Chainlink VRF integration.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MetaMask** wallet
4. **Alchemy API Key** (get from [Alchemy Dashboard](https://dashboard.alchemy.com/))
5. **Polygonscan API Key** (get from [Polygonscan](https://polygonscan.com/apis))
6. **Test MATIC** (get from [Polygon Faucet](https://faucet.polygon.technology/))
7. **Test LINK** (get from [Chainlink Faucet](https://faucets.chain.link/))

## 🔧 Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Alchemy API Key
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Private Key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Polygonscan API Key (for contract verification)
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Optional: Gas reporting
REPORT_GAS=true
```

### 3. Create Frontend Environment File
Create a `.env.local` file in the root directory:

```env
# Contract Addresses (will be filled after deployment)
VITE_QUANTUM_GRID_CONTRACT_AMOY=
VITE_QUANTUM_GRID_CONTRACT_MUMBAI=
VITE_QUANTUM_GRID_CONTRACT_POLYGON=

# Network Configuration
VITE_DEFAULT_NETWORK=amoy
VITE_CHAIN_ID=80002
```

## 🚀 Deployment Steps

### Step 1: Compile the Contract
```bash
npm run compile
```

### Step 2: Deploy to Polygon Amoy Testnet
```bash
npm run deploy:amoy
```

This will:
- Deploy the contract with Chainlink VRF integration
- Fund the house with 2 MATIC
- Display contract address and configuration

### Step 3: Fund Contract with LINK Tokens
After deployment, fund the contract with LINK tokens for VRF functionality:

```bash
node scripts/fund-contract.js <CONTRACT_ADDRESS>
```

### Step 4: Verify Contract on Polygonscan
```bash
npm run verify:amoy <CONTRACT_ADDRESS>
```

### Step 5: Update Frontend Configuration
Update your `.env.local` file with the deployed contract address:

```env
VITE_QUANTUM_GRID_CONTRACT_AMOY=0xYourDeployedContractAddress
```

## 🔗 Chainlink Configuration

The contract is configured with the following Chainlink services:

### Polygon Amoy Testnet
- **VRF Coordinator**: `0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2`
- **LINK Token**: `0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904`
- **Key Hash**: `0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899`
- **VRF Fee**: 0.1 LINK
- **Price Feed**: `0x12162c0038089Dd77aD5a6f25A148d6bd4e2D57F` (MATIC/USD)

### Polygon Mumbai Testnet
- **VRF Coordinator**: `0x7a1BaC17Ccc5b313516C5E16fb241f5D4c5C4c4c`
- **LINK Token**: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`
- **Key Hash**: `0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f`
- **VRF Fee**: 0.1 LINK
- **Price Feed**: `0xd0D5e3DB44DE05E9F294BB0a3cEEeB2A3C2C4C4C`

### Polygon Mainnet
- **VRF Coordinator**: `0xAE975071Be8F8eE67addBC1A82488F1C24858067`
- **LINK Token**: `0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39`
- **Key Hash**: `0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd`
- **VRF Fee**: 0.1 LINK
- **Price Feed**: `0xAB594600376Ec9fD91F8e885dADF0CE036862dE0`

## 🧪 Testing the Deployment

### 1. Start the Frontend
```bash
npm run dev
```

### 2. Connect MetaMask
- Switch to Polygon Amoy testnet
- Ensure you have test MATIC and LINK tokens

### 3. Test Game Features
- Start a new game
- Test quantum field generation
- Test power-up system
- Test AI hints
- Test leaderboard functionality

## 🔍 Contract Verification

### Manual Verification
If automatic verification fails, use manual verification on Polygonscan:

1. Go to [Polygonscan Amoy](https://amoy.polygonscan.com/)
2. Click "Verify and Publish"
3. Select "Solidity (Single file)"
4. Paste the contract source code
5. Enter constructor arguments:
   ```
   vrfCoordinator,linkToken,keyHash,fee,priceFeed
   ```

## 📊 Contract Functions

### Core Game Functions
- `startGame(gridSize, quantumFields, difficulty)` - Start a new game
- `submitGameResult(score, revealedCells, revealedPositions, gameHash)` - Submit game result
- `claimWinnings()` - Claim accumulated winnings

### View Functions
- `getPlayerStats(address)` - Get player statistics
- `getDailyLeaderboard()` - Get daily leaderboard
- `getWeeklyLeaderboard()` - Get weekly leaderboard
- `getAllTimeLeaderboard()` - Get all-time leaderboard
- `getMaticPrice()` - Get current MATIC price in USD
- `getStats()` - Get comprehensive contract statistics

### Admin Functions
- `fundHouse()` - Fund the house (owner only)
- `setBetLimits(minBet, maxBet)` - Set betting limits (owner only)
- `setHouseFee(newFee)` - Set house fee (owner only)
- `emergencyWithdraw()` - Emergency withdrawal (owner only)

## 🚨 Troubleshooting

### Common Issues

1. **"Insufficient LINK balance"**
   - Fund the contract with LINK tokens using the fund-contract script

2. **"VRF request failed"**
   - Ensure contract has sufficient LINK balance
   - Check VRF coordinator configuration

3. **"Price feed not available"**
   - Verify price feed address is correct for the network
   - Check if price feed is active

4. **"Contract not verified"**
   - Use manual verification on Polygonscan
   - Ensure constructor arguments are correct

### Debug Commands

```bash
# Check contract balance
npx hardhat run scripts/check-balance.js --network amoy

# Test VRF functionality
npx hardhat run scripts/test-vrf.js --network amoy

# Check contract state
npx hardhat run scripts/check-state.js --network amoy
```

## 📈 Monitoring

### Contract Events
Monitor these events for game activity:
- `GameStarted` - New game started
- `GameCompleted` - Game finished
- `WinningsClaimed` - Player claimed winnings
- `LeaderboardUpdated` - Leaderboard updated
- `PlayerStatsUpdated` - Player stats updated

### Key Metrics
- Total games played
- Total winnings paid
- House balance
- Player statistics
- Leaderboard rankings

## 🔄 Maintenance

### Regular Tasks
1. Monitor house balance
2. Check LINK token balance
3. Update leaderboards
4. Monitor gas costs
5. Check price feed status

### Emergency Procedures
1. Pause contract if needed
2. Emergency withdrawal
3. Update configuration
4. Handle disputes

## 📞 Support

For issues or questions:
1. Check this deployment guide
2. Review contract documentation
3. Check Polygonscan for transaction details
4. Monitor contract events

## 🎯 Next Steps

After successful deployment:
1. Test all game features
2. Monitor contract performance
3. Optimize gas usage
4. Plan for mainnet deployment
5. Implement additional features

---

**Happy Gaming! 🎮✨**