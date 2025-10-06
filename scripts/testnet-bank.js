import pkg from "hardhat";
const { ethers } = pkg;

// Testnet Bank Configuration
const TESTNET_BANK_CONFIG = {
  // Daily reward distribution
  dailyRewards: {
    topPlayer: ethers.parseEther("1.0"),    // 1 ETH for top player
    top10: ethers.parseEther("0.5"),        // 0.5 ETH for top 10
    top50: ethers.parseEther("0.1"),        // 0.1 ETH for top 50
    participation: ethers.parseEther("0.01") // 0.01 ETH for participation
  },
  
  // Weekly tournament rewards
  weeklyTournament: {
    first: ethers.parseEther("5.0"),        // 5 ETH for 1st place
    second: ethers.parseEther("3.0"),        // 3 ETH for 2nd place
    third: ethers.parseEther("2.0"),         // 2 ETH for 3rd place
    top10: ethers.parseEther("1.0"),        // 1 ETH for top 10
    top50: ethers.parseEther("0.5")          // 0.5 ETH for top 50
  },
  
  // Special achievements
  achievements: {
    quantumMaster: ethers.parseEther("2.0"),     // 2 ETH for Quantum Master
    perfectGame: ethers.parseEther("1.5"),       // 1.5 ETH for perfect game
    winStreak10: ethers.parseEther("1.0"),       // 1 ETH for 10 win streak
    winStreak25: ethers.parseEther("2.5"),       // 2.5 ETH for 25 win streak
    winStreak50: ethers.parseEther("5.0")        // 5 ETH for 50 win streak
  }
};

class TestnetBank {
  constructor(contractAddress, signer) {
    this.contractAddress = contractAddress;
    this.signer = signer;
    this.quantumGrid = null;
  }

  async initialize() {
    const QuantumGrid = await ethers.getContractFactory("QuantumGrid");
    this.quantumGrid = QuantumGrid.attach(this.contractAddress);
    console.log("🏦 Testnet Bank initialized");
  }

  // Distribute daily rewards based on leaderboard
  async distributeDailyRewards() {
    console.log("📅 Distributing daily rewards...");
    
    try {
      const leaderboard = await this.quantumGrid.getDailyLeaderboard();
      console.log(`📊 Daily leaderboard has ${leaderboard.length} entries`);

      if (leaderboard.length === 0) {
        console.log("❌ No players in daily leaderboard");
        return;
      }

      const rewards = [];
      
      // Top player gets highest reward
      if (leaderboard.length > 0) {
        const topPlayer = leaderboard[0];
        rewards.push({
          player: topPlayer.player,
          amount: TESTNET_BANK_CONFIG.dailyRewards.topPlayer,
          reason: "Daily Top Player"
        });
        console.log(`🥇 Top Player: ${topPlayer.player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.dailyRewards.topPlayer)} ETH`);
      }

      // Top 10 players
      for (let i = 1; i < Math.min(10, leaderboard.length); i++) {
        const player = leaderboard[i];
        rewards.push({
          player: player.player,
          amount: TESTNET_BANK_CONFIG.dailyRewards.top10,
          reason: "Daily Top 10"
        });
        console.log(`🏆 Top 10 Player ${i + 1}: ${player.player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.dailyRewards.top10)} ETH`);
      }

      // Top 50 players
      for (let i = 10; i < Math.min(50, leaderboard.length); i++) {
        const player = leaderboard[i];
        rewards.push({
          player: player.player,
          amount: TESTNET_BANK_CONFIG.dailyRewards.top50,
          reason: "Daily Top 50"
        });
        console.log(`🎯 Top 50 Player ${i + 1}: ${player.player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.dailyRewards.top50)} ETH`);
      }

      // Distribute rewards
      await this.distributeRewards(rewards);
      
    } catch (error) {
      console.error("❌ Error distributing daily rewards:", error.message);
    }
  }

  // Distribute weekly tournament rewards
  async distributeWeeklyRewards() {
    console.log("🏆 Distributing weekly tournament rewards...");
    
    try {
      const leaderboard = await this.quantumGrid.getWeeklyLeaderboard();
      console.log(`📊 Weekly leaderboard has ${leaderboard.length} entries`);

      if (leaderboard.length === 0) {
        console.log("❌ No players in weekly leaderboard");
        return;
      }

      const rewards = [];
      
      // Tournament winners
      if (leaderboard.length > 0) {
        rewards.push({
          player: leaderboard[0].player,
          amount: TESTNET_BANK_CONFIG.weeklyTournament.first,
          reason: "Weekly Tournament 1st Place"
        });
        console.log(`🥇 1st Place: ${leaderboard[0].player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.weeklyTournament.first)} ETH`);
      }

      if (leaderboard.length > 1) {
        rewards.push({
          player: leaderboard[1].player,
          amount: TESTNET_BANK_CONFIG.weeklyTournament.second,
          reason: "Weekly Tournament 2nd Place"
        });
        console.log(`🥈 2nd Place: ${leaderboard[1].player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.weeklyTournament.second)} ETH`);
      }

      if (leaderboard.length > 2) {
        rewards.push({
          player: leaderboard[2].player,
          amount: TESTNET_BANK_CONFIG.weeklyTournament.third,
          reason: "Weekly Tournament 3rd Place"
        });
        console.log(`🥉 3rd Place: ${leaderboard[2].player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.weeklyTournament.third)} ETH`);
      }

      // Top 10 tournament participants
      for (let i = 3; i < Math.min(10, leaderboard.length); i++) {
        const player = leaderboard[i];
        rewards.push({
          player: player.player,
          amount: TESTNET_BANK_CONFIG.weeklyTournament.top10,
          reason: "Weekly Tournament Top 10"
        });
        console.log(`🏆 Top 10 Participant ${i + 1}: ${player.player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.weeklyTournament.top10)} ETH`);
      }

      // Top 50 tournament participants
      for (let i = 10; i < Math.min(50, leaderboard.length); i++) {
        const player = leaderboard[i];
        rewards.push({
          player: player.player,
          amount: TESTNET_BANK_CONFIG.weeklyTournament.top50,
          reason: "Weekly Tournament Top 50"
        });
        console.log(`🎯 Top 50 Participant ${i + 1}: ${player.player} - ${ethers.formatEther(TESTNET_BANK_CONFIG.weeklyTournament.top50)} ETH`);
      }

      // Distribute rewards
      await this.distributeRewards(rewards);
      
    } catch (error) {
      console.error("❌ Error distributing weekly rewards:", error.message);
    }
  }

  // Check and distribute achievement rewards
  async checkAchievements(playerAddress) {
    console.log(`🏅 Checking achievements for ${playerAddress}...`);
    
    try {
      const stats = await this.quantumGrid.getPlayerStats(playerAddress);
      const rewards = [];

      // Check for Quantum Master (best score > 5000)
      if (parseInt(stats.bestScore) > 5000) {
        rewards.push({
          player: playerAddress,
          amount: TESTNET_BANK_CONFIG.achievements.quantumMaster,
          reason: "Quantum Master Achievement"
        });
        console.log(`🌟 Quantum Master: ${ethers.formatEther(TESTNET_BANK_CONFIG.achievements.quantumMaster)} ETH`);
      }

      // Check for win streaks
      const winStreak = parseInt(stats.winStreak);
      if (winStreak >= 50) {
        rewards.push({
          player: playerAddress,
          amount: TESTNET_BANK_CONFIG.achievements.winStreak50,
          reason: "50 Win Streak Achievement"
        });
        console.log(`🔥 50 Win Streak: ${ethers.formatEther(TESTNET_BANK_CONFIG.achievements.winStreak50)} ETH`);
      } else if (winStreak >= 25) {
        rewards.push({
          player: playerAddress,
          amount: TESTNET_BANK_CONFIG.achievements.winStreak25,
          reason: "25 Win Streak Achievement"
        });
        console.log(`🔥 25 Win Streak: ${ethers.formatEther(TESTNET_BANK_CONFIG.achievements.winStreak25)} ETH`);
      } else if (winStreak >= 10) {
        rewards.push({
          player: playerAddress,
          amount: TESTNET_BANK_CONFIG.achievements.winStreak10,
          reason: "10 Win Streak Achievement"
        });
        console.log(`🔥 10 Win Streak: ${ethers.formatEther(TESTNET_BANK_CONFIG.achievements.winStreak10)} ETH`);
      }

      // Distribute achievement rewards
      if (rewards.length > 0) {
        await this.distributeRewards(rewards);
      } else {
        console.log("❌ No achievements unlocked");
      }
      
    } catch (error) {
      console.error("❌ Error checking achievements:", error.message);
    }
  }

  // Distribute rewards to players
  async distributeRewards(rewards) {
    if (rewards.length === 0) {
      console.log("❌ No rewards to distribute");
      return;
    }

    console.log(`💰 Distributing ${rewards.length} rewards...`);
    
    for (const reward of rewards) {
      try {
        // Send ETH directly to player
        const tx = await this.signer.sendTransaction({
          to: reward.player,
          value: reward.amount
        });
        await tx.wait();
        
        console.log(`✅ Sent ${ethers.formatEther(reward.amount)} ETH to ${reward.player} (${reward.reason})`);
      } catch (error) {
        console.error(`❌ Failed to send reward to ${reward.player}:`, error.message);
      }
    }

    // Calculate total distributed
    const totalDistributed = rewards.reduce((sum, reward) => sum + reward.amount, 0n);
    console.log(`🎉 Total distributed: ${ethers.formatEther(totalDistributed)} ETH`);
  }

  // Get bank statistics
  async getBankStats() {
    try {
      const balance = await ethers.provider.getBalance(this.signer.address);
      const contractStats = await this.quantumGrid.getStats();
      
      console.log("🏦 Testnet Bank Statistics:");
      console.log(`   Bank Balance: ${ethers.formatEther(balance)} ETH`);
      console.log(`   Contract House Balance: ${ethers.formatEther(contractStats._houseBalance)} ETH`);
      console.log(`   Total Games Played: ${contractStats._totalGamesPlayed}`);
      console.log(`   Total Winnings Paid: ${ethers.formatEther(contractStats._totalWinningsPaid)} ETH`);
      
      return {
        bankBalance: balance,
        houseBalance: contractStats._houseBalance,
        totalGames: contractStats._totalGamesPlayed,
        totalWinnings: contractStats._totalWinningsPaid
      };
    } catch (error) {
      console.error("❌ Error getting bank stats:", error.message);
      return null;
    }
  }
}

async function main() {
  const contractAddress = process.argv[2];
  const action = process.argv[3] || "stats";
  const playerAddress = process.argv[4];

  if (!contractAddress) {
    console.error("❌ Please provide contract address:");
    console.error("   node scripts/testnet-bank.js <CONTRACT_ADDRESS> [action] [playerAddress]");
    console.error("   Actions: stats, daily, weekly, achievements");
    process.exit(1);
  }

  console.log("🏦 Testnet Bank for Quantum Grid");
  console.log(`📝 Contract: ${contractAddress}`);
  console.log(`🎯 Action: ${action}`);

  const [signer] = await ethers.getSigners();
  const bank = new TestnetBank(contractAddress, signer);
  await bank.initialize();

  switch (action) {
    case "stats":
      await bank.getBankStats();
      break;
    case "daily":
      await bank.distributeDailyRewards();
      break;
    case "weekly":
      await bank.distributeWeeklyRewards();
      break;
    case "achievements":
      if (!playerAddress) {
        console.error("❌ Please provide player address for achievements check");
        process.exit(1);
      }
      await bank.checkAchievements(playerAddress);
      break;
    default:
      console.error("❌ Unknown action. Available: stats, daily, weekly, achievements");
      process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n🎉 Testnet Bank operation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Testnet Bank failed:", error);
    process.exit(1);
  });
