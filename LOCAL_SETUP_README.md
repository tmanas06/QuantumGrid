# 🚀 Local Development Setup - Enhanced Quantum Grid

This guide provides multiple ways to start the local development environment for the Enhanced Quantum Grid game.

## 🎯 Quick Start Options

### Option 1: Node.js Script (Recommended)
```bash
npm run start:local
```

### Option 2: Batch File (Windows)
```bash
start-local.bat
```

### Option 3: Shell Script (Unix/Linux/Mac)
```bash
./start-local.sh
```

### Option 4: Manual Setup
```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contract
npm run deploy:local

# Terminal 3: Start frontend
npm run dev
```

## 🔧 What Each Option Does

### Node.js Script (`npm run start:local`)
- Starts Hardhat node in background
- Waits for node to be ready
- Deploys the contract automatically
- Provides setup instructions
- Keeps the environment running

### Batch File (`start-local.bat`)
- Windows-specific batch script
- Starts Hardhat node in background
- Deploys contract automatically
- Shows setup instructions
- Pauses for user interaction

### Shell Script (`./start-local.sh`)
- Unix/Linux/Mac shell script
- Starts Hardhat node in background
- Deploys contract automatically
- Shows setup instructions
- Handles cleanup on exit

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MetaMask** browser extension
4. **Git** (for cloning the repository)

## 🚀 Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Environment
Choose one of the following:

#### Option A: Node.js Script
```bash
npm run start:local
```

#### Option B: Batch File (Windows)
```bash
start-local.bat
```

#### Option C: Shell Script (Unix/Linux/Mac)
```bash
./start-local.sh
```

### 3. Configure MetaMask
1. Open MetaMask
2. Click on network dropdown
3. Select "Add Network"
4. Enter the following details:
   - **Network Name**: Localhost
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: ETH

### 4. Import Test Accounts
From the deployment output, copy the private keys of test accounts and import them into MetaMask.

### 5. Start Frontend
```bash
npm run dev
```

### 6. Start Playing!
Open your browser and navigate to `http://localhost:5173`

## 🏦 Testnet Bank System

The local environment includes an automated testnet bank that distributes rewards to players.

### Bank Commands
```bash
# Check bank statistics
npm run bank:stats <CONTRACT_ADDRESS>

# Distribute daily rewards
npm run bank:daily <CONTRACT_ADDRESS>

# Distribute weekly tournament rewards
npm run bank:weekly <CONTRACT_ADDRESS>

# Check player achievements
npm run bank:achievements <CONTRACT_ADDRESS> <PLAYER_ADDRESS>
```

### Reward Structure
- **Daily Top Player**: 1.0 ETH
- **Daily Top 10**: 0.5 ETH each
- **Daily Top 50**: 0.1 ETH each
- **Weekly 1st Place**: 5.0 ETH
- **Weekly 2nd Place**: 3.0 ETH
- **Weekly 3rd Place**: 2.0 ETH
- **Achievement Bonuses**: Up to 5.0 ETH

## 🧪 Testing Commands

### Contract Testing
```bash
# Test all contract functions
npm run test:local <CONTRACT_ADDRESS>

# Test specific features
node scripts/test-game.js <CONTRACT_ADDRESS>
node scripts/test-leaderboard.js <CONTRACT_ADDRESS>
node scripts/test-powerups.js <CONTRACT_ADDRESS>
```

### Frontend Testing
```bash
# Start frontend in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔍 Troubleshooting

### Common Issues

1. **"require is not defined"**
   - The project uses ES modules
   - Use the provided scripts instead of running files directly

2. **"Port 8545 already in use"**
   - Stop any existing Hardhat nodes
   - Use `npx hardhat node --port 8546` to use a different port

3. **"Contract deployment failed"**
   - Ensure Hardhat node is running
   - Check that port 8545 is available
   - Verify network configuration

4. **"MetaMask connection failed"**
   - Check network configuration
   - Ensure RPC URL is correct
   - Verify Chain ID is 31337

### Debug Commands

```bash
# Check if Hardhat node is running
curl http://127.0.0.1:8545

# Check account balances
npx hardhat run scripts/check-balances.js --network localhost

# Check contract state
npx hardhat run scripts/check-contract.js --network localhost
```

## 📊 Monitoring

### Contract Events
Monitor these events for game activity:
- `GameStarted` - New game started
- `GameCompleted` - Game finished
- `WinningsClaimed` - Player claimed winnings
- `LeaderboardUpdated` - Leaderboard updated
- `PlayerStatsUpdated` - Player stats updated

### Key Metrics
- Total games played
- House balance
- Player statistics
- Leaderboard rankings
- Reward distributions

## 🎮 Game Features

### Enhanced Gameplay
- **AI Hints**: Intelligent assistance based on quantum field analysis
- **Power-ups**: 5 different power-ups with unique effects
- **Dynamic Difficulty**: 6 difficulty levels from Beginner to Master
- **Advanced Scoring**: Multi-factor scoring with bonuses

### Blockchain Integration
- **Real MATIC Rewards**: Earn actual cryptocurrency
- **Leaderboards**: Competitive rankings with rewards
- **Player Statistics**: Comprehensive performance tracking
- **Achievement System**: Milestone rewards and recognition

## 📚 Documentation

- **LOCAL_TESTING_GUIDE.md**: Comprehensive testing guide
- **DEPLOYMENT_GUIDE.md**: Production deployment guide
- **README.md**: Main project documentation

## 🎯 Next Steps

After local testing:
1. Deploy to Polygon Amoy testnet
2. Test with real Chainlink VRF
3. Test with real users
4. Optimize gas usage
5. Plan mainnet deployment

## 💡 Tips

- Use test accounts for development
- Monitor gas usage during testing
- Test all game scenarios
- Verify reward distributions
- Check leaderboard accuracy

---

**Happy Development! 🚀✨**
