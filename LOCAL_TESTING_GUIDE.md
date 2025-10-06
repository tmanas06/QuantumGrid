# 🧪 Local Testing Guide - Enhanced Quantum Grid

This guide will help you set up and test the Enhanced Quantum Grid game on a local Hardhat network with a testnet bank system for distributing rewards.

## 🚀 Quick Start

### 1. Start Local Hardhat Node
```bash
# Terminal 1: Start the local node
npm run node
```

This will start a local blockchain with:
- 20 pre-funded accounts
- Instant block mining (1 second intervals)
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`

### 2. Deploy Contract Locally
```bash
# Terminal 2: Deploy to local network
npm run deploy:local
```

This will:
- Deploy the Enhanced QuantumGrid contract
- Fund the house with 10 ETH
- Create 5 test accounts with 5 ETH each
- Display contract address and test account details

### 3. Start Frontend
```bash
# Terminal 3: Start the frontend
npm run dev
```

### 4. Configure MetaMask
Add a new network in MetaMask:
- **Network Name**: Localhost
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency Symbol**: ETH

Import test accounts using the private keys from the deployment output.

## 🏦 Testnet Bank System

The testnet bank automatically distributes rewards to players based on their performance.

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

#### Daily Rewards
- **Top Player**: 1.0 ETH
- **Top 10**: 0.5 ETH each
- **Top 50**: 0.1 ETH each
- **Participation**: 0.01 ETH

#### Weekly Tournament
- **1st Place**: 5.0 ETH
- **2nd Place**: 3.0 ETH
- **3rd Place**: 2.0 ETH
- **Top 10**: 1.0 ETH each
- **Top 50**: 0.5 ETH each

#### Achievements
- **Quantum Master** (Score > 5000): 2.0 ETH
- **Perfect Game**: 1.5 ETH
- **10 Win Streak**: 1.0 ETH
- **25 Win Streak**: 2.5 ETH
- **50 Win Streak**: 5.0 ETH

## 🧪 Testing Commands

### Test Contract Functionality
```bash
# Test all contract functions
npm run test:local <CONTRACT_ADDRESS>
```

### Test Individual Features
```bash
# Test game mechanics
node scripts/test-game.js <CONTRACT_ADDRESS>

# Test leaderboard system
node scripts/test-leaderboard.js <CONTRACT_ADDRESS>

# Test power-up system
node scripts/test-powerups.js <CONTRACT_ADDRESS>
```

## 📊 Monitoring and Analytics

### Contract Events
Monitor these events for game activity:
```javascript
// Game events
quantumGrid.on("GameStarted", (player, betAmount, gridSize, quantumFields, difficulty) => {
  console.log(`Game started by ${player}`);
});

quantumGrid.on("GameCompleted", (player, betAmount, score, winnings, won) => {
  console.log(`Game completed: Score ${score}, Won: ${won}`);
});

quantumGrid.on("WinningsClaimed", (player, amount) => {
  console.log(`Winnings claimed: ${ethers.formatEther(amount)} ETH`);
});
```

### Key Metrics
- Total games played
- House balance
- Player statistics
- Leaderboard rankings
- Reward distributions

## 🔧 Development Workflow

### 1. Code Changes
```bash
# Make changes to contract
# Recompile
npm run compile

# Redeploy
npm run deploy:local
```

### 2. Frontend Changes
```bash
# Make changes to frontend
# Hot reload is automatic with Vite
```

### 3. Testing Changes
```bash
# Test contract changes
npm run test:local <NEW_CONTRACT_ADDRESS>

# Update frontend config
# Update .env.local with new contract address
```

## 🎮 Game Testing Scenarios

### Scenario 1: Basic Gameplay
1. Connect MetaMask to localhost
2. Import test account
3. Start a new game
4. Play through the game
5. Check leaderboard position
6. Claim winnings

### Scenario 2: Power-up Testing
1. Start multiple games
2. Collect power-ups
3. Use different power-ups
4. Test power-up effects
5. Verify score multipliers

### Scenario 3: AI Hint Testing
1. Enable quantum mode
2. Request AI hints
3. Test different hint types
4. Verify hint accuracy
5. Test hint confidence levels

### Scenario 4: Leaderboard Competition
1. Play games with multiple accounts
2. Achieve different scores
3. Check daily/weekly/all-time leaderboards
4. Test reward distribution
5. Verify ranking updates

## 🐛 Debugging

### Common Issues

1. **"Contract not found"**
   - Ensure local node is running
   - Check contract address
   - Verify network configuration

2. **"Insufficient funds"**
   - Check account balance
   - Use test accounts with pre-funded ETH
   - Fund accounts manually if needed

3. **"Transaction failed"**
   - Check gas limits
   - Verify contract state
   - Check for revert conditions

4. **"Frontend not connecting"**
   - Verify MetaMask network
   - Check RPC URL
   - Ensure contract address is correct

### Debug Commands

```bash
# Check account balances
npx hardhat run scripts/check-balances.js --network localhost

# Check contract state
npx hardhat run scripts/check-contract.js --network localhost

# Monitor transactions
npx hardhat run scripts/monitor-tx.js --network localhost
```

## 📈 Performance Testing

### Load Testing
```bash
# Simulate multiple players
node scripts/load-test.js <CONTRACT_ADDRESS> <NUM_PLAYERS>

# Test concurrent games
node scripts/concurrent-test.js <CONTRACT_ADDRESS>

# Test gas usage
npm run test:gas
```

### Stress Testing
```bash
# Test high-frequency transactions
node scripts/stress-test.js <CONTRACT_ADDRESS>

# Test large leaderboards
node scripts/leaderboard-stress.js <CONTRACT_ADDRESS>
```

## 🔄 Continuous Integration

### Automated Testing
```bash
# Run full test suite
npm run test:all

# Run contract tests
npm run test:contract

# Run frontend tests
npm run test:frontend

# Run integration tests
npm run test:integration
```

### Test Coverage
```bash
# Generate coverage report
npm run coverage

# View coverage report
open coverage/index.html
```

## 📝 Best Practices

### Development
1. Always test on local network first
2. Use test accounts for development
3. Monitor gas usage
4. Test edge cases
5. Verify event emissions

### Testing
1. Test all game scenarios
2. Verify reward distributions
3. Check leaderboard accuracy
4. Test error conditions
5. Validate user experience

### Deployment
1. Test on testnet before mainnet
2. Verify contract verification
3. Update frontend configuration
4. Monitor contract performance
5. Plan for upgrades

## 🎯 Next Steps

After local testing:
1. Deploy to Polygon Amoy testnet
2. Test with real Chainlink VRF
3. Test with real users
4. Optimize gas usage
5. Plan mainnet deployment

---

**Happy Testing! 🧪✨**
