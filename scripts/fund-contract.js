import pkg from "hardhat";
const { ethers } = pkg;

// Chainlink LINK token addresses
const LINK_TOKEN_ADDRESSES = {
  amoy: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
  mumbai: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  polygon: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39"
};

async function main() {
  console.log("🔗 Funding QuantumGrid contract with LINK tokens...");

  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(`📡 Network: ${networkName} (Chain ID: ${network.chainId})`);

  // Get contract address from command line argument
  const contractAddress = process.argv[2];
  if (!contractAddress) {
    console.error("❌ Please provide contract address as argument:");
    console.error("   node scripts/fund-contract.js <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log(`📝 Contract Address: ${contractAddress}`);

  // Get LINK token address for current network
  const linkTokenAddress = LINK_TOKEN_ADDRESSES[networkName];
  if (!linkTokenAddress) {
    console.error(`❌ LINK token address not found for network: ${networkName}`);
    process.exit(1);
  }

  console.log(`🔗 LINK Token Address: ${linkTokenAddress}`);

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log(`👤 Signer: ${signer.address}`);

  // Get LINK token contract
  const linkTokenABI = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
  ];

  const linkToken = new ethers.Contract(linkTokenAddress, linkTokenABI, signer);

  // Check LINK balance
  const linkBalance = await linkToken.balanceOf(signer.address);
  console.log(`💰 Your LINK Balance: ${ethers.formatEther(linkBalance)} LINK`);

  if (linkBalance === 0n) {
    console.log("❌ You don't have any LINK tokens!");
    console.log("🔗 Get LINK tokens from:");
    console.log("   - Polygon Amoy Faucet: https://faucet.polygon.technology/");
    console.log("   - Chainlink Faucet: https://faucets.chain.link/");
    process.exit(1);
  }

  // Amount to transfer (1 LINK)
  const transferAmount = ethers.parseEther("1");
  console.log(`📤 Transferring ${ethers.formatEther(transferAmount)} LINK to contract...`);

  if (linkBalance < transferAmount) {
    console.log("❌ Insufficient LINK balance!");
    console.log(`   Required: ${ethers.formatEther(transferAmount)} LINK`);
    console.log(`   Available: ${ethers.formatEther(linkBalance)} LINK`);
    process.exit(1);
  }

  // Transfer LINK to contract
  try {
    const tx = await linkToken.transfer(contractAddress, transferAmount);
    console.log(`📝 Transaction Hash: ${tx.hash}`);
    
    await tx.wait();
    console.log("✅ LINK tokens transferred successfully!");

    // Verify transfer
    const contractLinkBalance = await linkToken.balanceOf(contractAddress);
    console.log(`🔗 Contract LINK Balance: ${ethers.formatEther(contractLinkBalance)} LINK`);

    console.log("\n🎯 Contract is now ready for VRF requests!");
    console.log("   The contract can now generate random quantum field positions.");

  } catch (error) {
    console.error("❌ Transfer failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n🎉 Contract funding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Funding failed:", error);
    process.exit(1);
  });
