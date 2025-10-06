import { spawn } from 'child_process';
import { ethers } from 'hardhat';

async function main() {
  console.log("🚀 Starting Enhanced Quantum Grid Local Development Environment...");
  
  // Start Hardhat node in background
  console.log("📡 Starting Hardhat node...");
  const nodeProcess = spawn('npx', ['hardhat', 'node'], {
    stdio: 'pipe',
    detached: false
  });

  // Wait for node to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log("✅ Hardhat node started on http://127.0.0.1:8545");

  // Deploy contract
  console.log("📝 Deploying contract...");
  try {
    const deployProcess = spawn('npx', ['hardhat', 'run', 'scripts/deploy-local.js', '--network', 'localhost'], {
      stdio: 'inherit',
      detached: false
    });

    deployProcess.on('close', (code) => {
      if (code === 0) {
        console.log("✅ Contract deployed successfully!");
        console.log("\n🎯 Next Steps:");
        console.log("1. Start the frontend: npm run dev");
        console.log("2. Configure MetaMask:");
        console.log("   - Network: Localhost");
        console.log("   - RPC URL: http://127.0.0.1:8545");
        console.log("   - Chain ID: 31337");
        console.log("3. Import test accounts from deployment output");
        console.log("4. Start playing!");
        
        console.log("\n🏦 Testnet Bank Commands:");
        console.log("   npm run bank:stats <CONTRACT_ADDRESS>");
        console.log("   npm run bank:daily <CONTRACT_ADDRESS>");
        console.log("   npm run bank:weekly <CONTRACT_ADDRESS>");
        
        console.log("\n🧪 Testing Commands:");
        console.log("   npm run test:local <CONTRACT_ADDRESS>");
        
        console.log("\n📚 Documentation:");
        console.log("   - LOCAL_TESTING_GUIDE.md");
        console.log("   - DEPLOYMENT_GUIDE.md");
      } else {
        console.error("❌ Contract deployment failed!");
      }
    });

  } catch (error) {
    console.error("❌ Error deploying contract:", error);
  }

  // Handle process termination
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
}

main()
  .catch((error) => {
    console.error("❌ Failed to start local environment:", error);
    process.exit(1);
  });
