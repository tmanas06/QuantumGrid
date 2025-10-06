import { ethers } from 'ethers'

// Enhanced Contract ABI (Application Binary Interface)
const QUANTUM_GRID_ABI = [
  "function startGame(uint256 gridSize, uint256 quantumFields, uint256 difficulty) external payable",
  "function submitGameResult(uint256 score, uint256 revealedCells, uint256[] calldata revealedPositions, bytes32 gameHash) external",
  "function claimWinnings() external",
  "function getPlayerWinnings(address player) external view returns (uint256)",
  "function getHouseBalance() external view returns (uint256)",
  "function getPlayerStats(address player) external view returns (tuple(uint256 totalGamesPlayed, uint256 totalWinnings, uint256 bestScore, uint256 winStreak, uint256 longestWinStreak, uint256 lastGameTime))",
  "function getDailyLeaderboard() external view returns (tuple(address player, uint256 score, uint256 timestamp)[])",
  "function getWeeklyLeaderboard() external view returns (tuple(address player, uint256 score, uint256 timestamp)[])",
  "function getAllTimeLeaderboard() external view returns (tuple(address player, uint256 score, uint256 timestamp)[])",
  "function getMaticPrice() external view returns (int256)",
  "function getStats() external view returns (uint256 _houseBalance, uint256 _totalGamesPlayed, uint256 _totalWinningsPaid, uint256 _houseFee, uint256 _minBet, uint256 _maxBet, int256 _maticPrice)",
  "event GameStarted(address indexed player, uint256 betAmount, uint256 gridSize, uint256 quantumFields, uint256 difficulty)",
  "event GameCompleted(address indexed player, uint256 betAmount, uint256 score, uint256 winnings, bool won)",
  "event WinningsClaimed(address indexed player, uint256 amount)",
  "event LeaderboardUpdated(address indexed player, uint256 score, uint256 position)",
  "event PlayerStatsUpdated(address indexed player, uint256 totalGames, uint256 totalWinnings, uint256 bestScore)"
]

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  // Localhost (for local development)
  1337: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_LOCALHOST || "0x...",
  // Polygon Mainnet
  137: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_MAINNET || "0x...",
  // Polygon Amoy Testnet
  80002: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_AMOY || "0x...",
  // Polygon Mumbai Testnet
  80001: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_MUMBAI || "0x...",
  // Ethereum Mainnet
  1: "0x...",
  // Ethereum Sepolia Testnet
  11155111: "0x..."
}

export class QuantumGridContract {
  constructor(provider, signer, chainId) {
    this.provider = provider
    this.signer = signer
    this.chainId = chainId
    this.contractAddress = CONTRACT_ADDRESSES[chainId]
    
    if (!this.contractAddress) {
      throw new Error(`Contract not deployed on chain ${chainId}`)
    }
    
    this.contract = new ethers.Contract(
      this.contractAddress,
      QUANTUM_GRID_ABI,
      signer
    )
  }

  // Start a new game with enhanced parameters
  async startGame(gridSize, quantumFields, difficulty) {
    try {
      const tx = await this.contract.startGame(gridSize, quantumFields, difficulty, {
        value: ethers.parseEther("1") // Default bet amount, should be passed as parameter
      })
      await tx.wait()
      return { success: true, txHash: tx.hash }
    } catch (error) {
      console.error('Error starting game:', error)
      return { success: false, error: error.message }
    }
  }

  // Submit enhanced game result to blockchain
  async submitGameResult(gameData) {
    try {
      const {
        score,
        revealedCells,
        revealedPositions,
        gameHash
      } = gameData

      const tx = await this.contract.submitGameResult(
        score,
        revealedCells,
        revealedPositions,
        gameHash
      )
      
      await tx.wait()
      return { success: true, txHash: tx.hash }
    } catch (error) {
      console.error('Error submitting game result:', error)
      return { success: false, error: error.message }
    }
  }

  // Claim winnings from the contract
  async claimWinnings() {
    try {
      const tx = await this.contract.claimWinnings()
      await tx.wait()
      return { success: true, txHash: tx.hash }
    } catch (error) {
      console.error('Error claiming winnings:', error)
      return { success: false, error: error.message }
    }
  }

  // Get player's total winnings
  async getPlayerWinnings(playerAddress) {
    try {
      const winnings = await this.contract.getPlayerWinnings(playerAddress)
      return ethers.formatEther(winnings)
    } catch (error) {
      console.error('Error getting player winnings:', error)
      return "0"
    }
  }

  // Get house balance
  async getHouseBalance() {
    try {
      const balance = await this.contract.getHouseBalance()
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting house balance:', error)
      return "0"
    }
  }

  // Get player statistics
  async getPlayerStats(playerAddress) {
    try {
      const stats = await this.contract.getPlayerStats(playerAddress)
      return {
        totalGamesPlayed: stats.totalGamesPlayed.toString(),
        totalWinnings: ethers.formatEther(stats.totalWinnings),
        bestScore: stats.bestScore.toString(),
        winStreak: stats.winStreak.toString(),
        longestWinStreak: stats.longestWinStreak.toString(),
        lastGameTime: stats.lastGameTime.toString()
      }
    } catch (error) {
      console.error('Error getting player stats:', error)
      return null
    }
  }

  // Get leaderboard data
  async getDailyLeaderboard() {
    try {
      const leaderboard = await this.contract.getDailyLeaderboard()
      return leaderboard.map(entry => ({
        player: entry.player,
        score: entry.score.toString(),
        timestamp: entry.timestamp.toString()
      }))
    } catch (error) {
      console.error('Error getting daily leaderboard:', error)
      return []
    }
  }

  async getWeeklyLeaderboard() {
    try {
      const leaderboard = await this.contract.getWeeklyLeaderboard()
      return leaderboard.map(entry => ({
        player: entry.player,
        score: entry.score.toString(),
        timestamp: entry.timestamp.toString()
      }))
    } catch (error) {
      console.error('Error getting weekly leaderboard:', error)
      return []
    }
  }

  async getAllTimeLeaderboard() {
    try {
      const leaderboard = await this.contract.getAllTimeLeaderboard()
      return leaderboard.map(entry => ({
        player: entry.player,
        score: entry.score.toString(),
        timestamp: entry.timestamp.toString()
      }))
    } catch (error) {
      console.error('Error getting all-time leaderboard:', error)
      return []
    }
  }

  // Get MATIC price
  async getMaticPrice() {
    try {
      const price = await this.contract.getMaticPrice()
      return price.toString()
    } catch (error) {
      console.error('Error getting MATIC price:', error)
      return "0"
    }
  }

  // Get comprehensive contract statistics
  async getContractStats() {
    try {
      const stats = await this.contract.getStats()
      return {
        houseBalance: ethers.formatEther(stats._houseBalance),
        totalGamesPlayed: stats._totalGamesPlayed.toString(),
        totalWinningsPaid: ethers.formatEther(stats._totalWinningsPaid),
        houseFee: stats._houseFee.toString(),
        minBet: ethers.formatEther(stats._minBet),
        maxBet: ethers.formatEther(stats._maxBet),
        maticPrice: stats._maticPrice.toString()
      }
    } catch (error) {
      console.error('Error getting contract stats:', error)
      return null
    }
  }

  // Listen for enhanced game events
  onGameStarted(callback) {
    this.contract.on("GameStarted", callback)
  }

  onGameCompleted(callback) {
    this.contract.on("GameCompleted", callback)
  }

  onWinningsClaimed(callback) {
    this.contract.on("WinningsClaimed", callback)
  }

  onLeaderboardUpdated(callback) {
    this.contract.on("LeaderboardUpdated", callback)
  }

  onPlayerStatsUpdated(callback) {
    this.contract.on("PlayerStatsUpdated", callback)
  }

  // Remove event listeners
  removeAllListeners() {
    this.contract.removeAllListeners()
  }
}

// Utility function to create game hash for verification
export function createGameHash(gameData) {
  const { grid, quantumFields, difficulty, timestamp } = gameData
  const dataString = JSON.stringify({ grid, quantumFields, difficulty, timestamp })
  return ethers.keccak256(ethers.toUtf8Bytes(dataString))
}

// Utility function to get difficulty value
export function getDifficultyValue(difficulty) {
  const difficultyMap = {
    'easy': 30,    // 30% probability
    'medium': 50,  // 50% probability  
    'hard': 70     // 70% probability
  }
  return difficultyMap[difficulty] || 50
}
