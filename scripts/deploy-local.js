import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Deploying Enhanced QuantumGrid contract to local network...");

  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // For local testing, we'll use mock addresses for Chainlink
  const mockVrfCoordinator = "0x0000000000000000000000000000000000000000";
  const mockLinkToken = "0x0000000000000000000000000000000000000000";
  const mockKeyHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const mockFee = ethers.parseEther("0.1");
  const mockPriceFeed = "0x0000000000000000000000000000000000000000";

  console.log("🔧 Using mock Chainlink addresses for local testing");

  // Get the contract factory
  const QuantumGrid = await ethers.getContractFactory("QuantumGridLocal");

  // Deploy the contract (simplified constructor for local testing)
  console.log("📝 Deploying contract...");
  const quantumGrid = await QuantumGrid.deploy();
  await quantumGrid.waitForDeployment();

  const contractAddress = await quantumGrid.getAddress();
  console.log("✅ Enhanced QuantumGrid deployed to:", contractAddress);

  // Get signer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  // Fund the house with some ETH (local network)
  console.log("💰 Funding house with 10 ETH...");
  const fundTx = await quantumGrid.fundHouse({ value: ethers.parseEther("10") });
  await fundTx.wait();
  console.log("✅ House funded with 10 ETH");

  // Get contract stats
  const stats = await quantumGrid.getStats();
  console.log("📊 Contract Stats:");
  console.log("   House Balance:", ethers.formatEther(stats._houseBalance), "ETH");
  console.log("   Total Games Played:", stats._totalGamesPlayed.toString());
  console.log("   Total Winnings Paid:", ethers.formatEther(stats._totalWinningsPaid), "ETH");
  console.log("   House Fee:", stats._houseFee.toString(), "basis points");
  console.log("   Min Bet:", ethers.formatEther(stats._minBet), "ETH");
  console.log("   Max Bet:", ethers.formatEther(stats._maxBet), "ETH");

  // Create test accounts for the testnet bank
  const testAccounts = [];
  for (let i = 0; i < 5; i++) {
    const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    testAccounts.push({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }

  console.log("\n🏦 Testnet Bank Accounts Created:");
  testAccounts.forEach((account, index) => {
    console.log(`   Account ${index + 1}: ${account.address}`);
  });

  // Fund test accounts with ETH
  console.log("\n💰 Funding test accounts...");
  for (const account of testAccounts) {
    const wallet = new ethers.Wallet(account.privateKey, ethers.provider);
    const tx = await deployer.sendTransaction({
      to: account.address,
      value: ethers.parseEther("5") // 5 ETH per account
    });
    await tx.wait();
    console.log(`   ✅ Funded ${account.address} with 5 ETH`);
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress,
    deployer: deployer.address,
    testAccounts: testAccounts.map(acc => ({
      address: acc.address,
      privateKey: acc.privateKey
    })),
    deploymentTime: new Date().toISOString(),
    rpcUrl: "http://127.0.0.1:8545"
  };

  console.log("\n📄 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎯 Next Steps:");
  console.log("1. Update your .env.local with the contract address:");
  console.log(`   VITE_QUANTUM_GRID_CONTRACT_LOCALHOST=${contractAddress}`);
  console.log("2. Start the frontend:");
  console.log("   npm run dev");
  console.log("3. Connect MetaMask to localhost:8545");
  console.log("4. Import test accounts into MetaMask using the private keys above");
  console.log("5. Test the game with the funded accounts!");

  console.log("\n🔧 MetaMask Configuration:");
  console.log("   Network Name: Localhost");
  console.log("   RPC URL: http://127.0.0.1:8545");
  console.log("   Chain ID: 31337");
  console.log("   Currency Symbol: ETH");

  return { contractAddress, testAccounts };
}

main()
  .then(({ contractAddress, testAccounts }) => {
    console.log("\n🎉 Local deployment completed successfully!");
    console.log("Contract Address:", contractAddress);
    console.log("Test Accounts:", testAccounts.length);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
