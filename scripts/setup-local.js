import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

console.log("🚀 Setting up Enhanced Quantum Grid for local development...");

// Create .env.local file
const envContent = `# Enhanced Quantum Grid - Local Development Environment
# This file is for local development only

# Alchemy API Key (optional for local development)
# Get from https://dashboard.alchemy.com/
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here

# Default Network (localhost for local development)
VITE_DEFAULT_NETWORK=localhost

# Contract Addresses (will be filled after deployment)
VITE_QUANTUM_GRID_CONTRACT_LOCALHOST=
VITE_QUANTUM_GRID_CONTRACT_AMOY=
VITE_QUANTUM_GRID_CONTRACT_MUMBAI=
VITE_QUANTUM_GRID_CONTRACT_MAINNET=

# Local Development Settings
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545

# House Configuration
VITE_HOUSE_BALANCE=100
VITE_HOUSE_FEE=0.05

# Development Flags
VITE_DEBUG_MODE=true
VITE_ENABLE_LOGGING=true
`;

try {
  writeFileSync('.env.local', envContent);
  console.log("✅ Created .env.local file");
} catch (error) {
  console.log("⚠️  Could not create .env.local file:", error.message);
}

console.log("\n📋 Next Steps:");
console.log("1. Start Hardhat node: npm run node");
console.log("2. Deploy contract: npm run deploy:local");
console.log("3. Update .env.local with contract address");
console.log("4. Start frontend: npm run dev");
console.log("\n🎯 Or use the automated setup:");
console.log("   npm run start:local");
console.log("\n📚 Documentation:");
console.log("   - LOCAL_SETUP_README.md");
console.log("   - LOCAL_TESTING_GUIDE.md");
