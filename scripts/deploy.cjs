const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying QuantumGrid contract...");

  // Get the contract factory
  const QuantumGrid = await ethers.getContractFactory("QuantumGrid");

  // Deploy the contract
  console.log("📝 Deploying contract...");
  const quantumGrid = await QuantumGrid.deploy();
  await quantumGrid.waitForDeployment();

  const contractAddress = await quantumGrid.getAddress();
  console.log("✅ QuantumGrid deployed to:", contractAddress);

  // Fund the house with some MATIC
  console.log("💰 Funding house with 1 MATIC...");
  const fundTx = await quantumGrid.fundHouse({ value: ethers.parseEther("1") });
  await fundTx.wait();
  console.log("✅ House funded with 1 MATIC");

  // Get contract stats
  const stats = await quantumGrid.getStats();
  console.log("📊 Contract Stats:");
  console.log("   House Balance:", ethers.formatEther(stats[0]), "MATIC");
  console.log("   Total Games Played:", stats[1].toString());
  console.log("   Total Winnings Paid:", ethers.formatEther(stats[2]), "MATIC");
  console.log("   House Fee:", stats[3].toString(), "basis points");

  console.log("\n🎯 Next Steps:");
  console.log("1. Update your .env.local with the contract address:");
  console.log(`   VITE_QUANTUM_GRID_CONTRACT_AMOY=${contractAddress}`);
  console.log("2. Verify the contract on Polygonscan:");
  console.log(`   npx hardhat verify --network amoy ${contractAddress}`);
  console.log("3. Test the contract with your frontend!");

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });