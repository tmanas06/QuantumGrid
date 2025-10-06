import pkg from "hardhat";
const { ethers } = pkg;

// Chainlink VRF and Price Feed addresses for Polygon Amoy testnet
const CHAINLINK_CONFIG = {
  amoy: {
    vrfCoordinator: "0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2",
    linkToken: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
    keyHash: "0x816bedba8a50b294e5cbd47842baf240c2385f2eaf719edbd4f250a137a8c899",
    fee: ethers.parseEther("0.1"), // 0.1 LINK
    priceFeed: "0x12162c0038089Dd77aD5a6f25A148d6bd4e2D57F" // MATIC/USD price feed
  },
  mumbai: {
    vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb241f5D4c5C4c4c",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    keyHash: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    fee: ethers.parseEther("0.1"),
    priceFeed: "0xd0D5e3DB44DE05E9F294BB0a3cEEeB2A3C2C4C4C"
  },
  polygon: {
    vrfCoordinator: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
    linkToken: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    keyHash: "0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd",
    fee: ethers.parseEther("0.1"),
    priceFeed: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
  }
};

async function main() {
  console.log("🚀 Deploying Enhanced QuantumGrid contract...");

  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(`📡 Deploying to network: ${networkName} (Chain ID: ${network.chainId})`);

  // Get Chainlink configuration for the current network
  const chainlinkConfig = CHAINLINK_CONFIG[networkName] || CHAINLINK_CONFIG.amoy;
  console.log("🔗 Using Chainlink configuration:", chainlinkConfig);

  // Get the contract factory
  const QuantumGrid = await ethers.getContractFactory("QuantumGridSimple");

  // Deploy the contract (simplified constructor for testnet)
  console.log("📝 Deploying contract to Polygon Amoy testnet...");
  const quantumGrid = await QuantumGrid.deploy();
  await quantumGrid.waitForDeployment();

  const contractAddress = await quantumGrid.getAddress();
  console.log("✅ Enhanced QuantumGrid deployed to:", contractAddress);

  // Fund the house with some MATIC
  console.log("💰 Funding house with 2 MATIC...");
  const fundTx = await quantumGrid.fundHouse({ value: ethers.parseEther("2") });
  await fundTx.wait();
  console.log("✅ House funded with 2 MATIC");

  // Get contract stats
  const stats = await quantumGrid.getStats();
  console.log("📊 Contract Stats:");
  console.log("   House Balance:", ethers.formatEther(stats._houseBalance), "MATIC");
  console.log("   Total Games Played:", stats._totalGamesPlayed.toString());
  console.log("   Total Winnings Paid:", ethers.formatEther(stats._totalWinningsPaid), "MATIC");
  console.log("   House Fee:", stats._houseFee.toString(), "basis points");
  console.log("   Min Bet:", ethers.formatEther(stats._minBet), "MATIC");
  console.log("   Max Bet:", ethers.formatEther(stats._maxBet), "MATIC");
  console.log("   MATIC Price:", ethers.formatUnits(stats._maticPrice, 8), "USD");

  // Check LINK balance for VRF
  const linkBalance = await ethers.provider.getBalance(contractAddress);
  console.log("🔗 LINK Balance:", ethers.formatEther(linkBalance), "LINK");

  console.log("\n🎯 Next Steps:");
  console.log("1. Update your .env.local with the contract address:");
  console.log(`   VITE_QUANTUM_GRID_CONTRACT_${networkName.toUpperCase()}=${contractAddress}`);
  console.log("2. Fund the contract with LINK tokens for VRF:");
  console.log(`   Send LINK tokens to: ${contractAddress}`);
  console.log("3. Verify the contract on Polygonscan:");
  console.log(`   npx hardhat verify --network ${networkName} ${contractAddress} "${chainlinkConfig.vrfCoordinator}" "${chainlinkConfig.linkToken}" "${chainlinkConfig.keyHash}" "${chainlinkConfig.fee}" "${chainlinkConfig.priceFeed}"`);
  console.log("4. Test the contract with your frontend!");

  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    chainId: network.chainId.toString(),
    contractAddress,
    vrfCoordinator: chainlinkConfig.vrfCoordinator,
    linkToken: chainlinkConfig.linkToken,
    keyHash: chainlinkConfig.keyHash,
    fee: chainlinkConfig.fee,
    priceFeed: chainlinkConfig.priceFeed,
    deploymentTime: new Date().toISOString()
  };

  console.log("\n📄 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

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