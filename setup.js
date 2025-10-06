#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Quantum Grid Setup Script');
console.log('============================\n');

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.local.example');

if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('   If you want to recreate it, delete the existing file first.\n');
} else {
  try {
    // Copy example to .env.local
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envLocalPath);
      console.log('✅ Created .env.local from example file');
    } else {
      // Create basic .env.local
      const basicEnv = `# Quantum Grid Environment Configuration
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
VITE_DEFAULT_NETWORK=amoy
VITE_QUANTUM_GRID_CONTRACT_AMOY=0x...
VITE_HOUSE_BALANCE=100
VITE_HOUSE_FEE=0.05
`;
      fs.writeFileSync(envLocalPath, basicEnv);
      console.log('✅ Created basic .env.local file');
    }
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Get your Alchemy API key from: https://dashboard.alchemy.com/');
console.log('2. Edit .env.local and add your API key');
console.log('3. Run: npm run dev');
console.log('4. Connect your MetaMask wallet');
console.log('5. Switch to Polygon Amoy testnet');
console.log('6. Get testnet MATIC from: https://faucet.polygon.technology/');
console.log('\n🎮 Happy gaming!');
