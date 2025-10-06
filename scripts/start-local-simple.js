#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 Starting Enhanced Quantum Grid Local Development Environment...");
console.log("📡 This will start a Hardhat node and deploy the contract automatically.");
console.log("⏳ Please wait for the setup to complete...\n");

// Function to run a command and wait for it to complete
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    // Step 1: Start Hardhat node in background
    console.log("📡 Starting Hardhat node...");
    const nodeProcess = spawn('npx', ['hardhat', 'node'], {
      stdio: 'pipe',
      detached: false,
      shell: true
    });

    // Wait for node to be ready
    console.log("⏳ Waiting for Hardhat node to start...");
    await new Promise(resolve => setTimeout(resolve, 8000));

    console.log("✅ Hardhat node started on http://127.0.0.1:8545");

    // Step 2: Deploy contract
    console.log("\n📝 Deploying Enhanced QuantumGrid contract...");
    await runCommand('npx', ['hardhat', 'run', 'scripts/deploy-local.js', '--network', 'localhost']);

    console.log("\n🎉 Local development environment is ready!");
    console.log("\n📋 Next Steps:");
    console.log("1. Start the frontend: npm run dev");
    console.log("2. Configure MetaMask:");
    console.log("   - Network Name: Localhost");
    console.log("   - RPC URL: http://127.0.0.1:8545");
    console.log("   - Chain ID: 31337");
    console.log("   - Currency Symbol: ETH");
    console.log("3. Import test accounts from the deployment output above");
    console.log("4. Start playing the Enhanced Quantum Grid game!");
    
    console.log("\n🏦 Testnet Bank Commands:");
    console.log("   npm run bank:stats <CONTRACT_ADDRESS>");
    console.log("   npm run bank:daily <CONTRACT_ADDRESS>");
    console.log("   npm run bank:weekly <CONTRACT_ADDRESS>");
    
    console.log("\n🧪 Testing Commands:");
    console.log("   npm run test:local <CONTRACT_ADDRESS>");
    
    console.log("\n📚 Documentation:");
    console.log("   - LOCAL_TESTING_GUIDE.md");
    console.log("   - DEPLOYMENT_GUIDE.md");
    
    console.log("\n💡 Tips:");
    console.log("   - The Hardhat node will continue running in the background");
    console.log("   - Press Ctrl+C to stop the local environment");
    console.log("   - Check the deployment output above for contract address and test accounts");

    // Keep the process alive
    process.on('SIGINT', () => {
      console.log("\n🛑 Shutting down local development environment...");
      nodeProcess.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log("\n🛑 Shutting down local development environment...");
      nodeProcess.kill();
      process.exit(0);
    });

    // Keep the script running
    await new Promise(() => {});

  } catch (error) {
    console.error("❌ Failed to start local environment:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
