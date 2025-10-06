// Game Economy Management
// This handles the token distribution logic

export class GameEconomy {
  constructor() {
    this.houseBalance = 0
    this.totalWinningsPaid = 0
    this.gamePool = 0 // Pool of MATIC from all bets
    this.houseFee = 0.05 // 5% house fee
  }

  // Initialize house with MATIC (admin function)
  fundHouse(amount) {
    this.houseBalance += amount
    console.log(`House funded with ${amount} MATIC. New balance: ${this.houseBalance}`)
  }

  // Process a bet - takes MATIC from player
  processBet(betAmount) {
    if (betAmount <= 0) return { success: false, error: "Invalid bet amount" }
    
    // Add to game pool
    this.gamePool += betAmount
    return { success: true, gamePool: this.gamePool }
  }

  // Calculate winnings with house edge
  calculateWinnings(betAmount, score, revealedCells, totalSafeCells, difficulty) {
    if (revealedCells === 0) return 0

    // Base calculation (same as before)
    const scoreMultiplier = Math.max(0.1, score / 1000)
    const progressMultiplier = Math.max(0.1, revealedCells / totalSafeCells)
    const difficultyMultiplier = difficulty + 0.5

    // Apply house edge (reduce winnings by house fee)
    const baseWinnings = betAmount * scoreMultiplier * progressMultiplier * difficultyMultiplier
    const houseFeeAmount = baseWinnings * this.houseFee
    const netWinnings = baseWinnings - houseFeeAmount

    // Ensure house can pay (max 90% of house balance)
    const maxPayout = this.houseBalance * 0.9
    const finalWinnings = Math.min(netWinnings, maxPayout)

    return Math.max(0, finalWinnings)
  }

  // Process a win - pays out MATIC to player
  processWin(winnings) {
    if (winnings <= 0) return { success: false, error: "Invalid winnings" }
    if (winnings > this.houseBalance) {
      return { success: false, error: "Insufficient house balance" }
    }

    // Deduct from house balance
    this.houseBalance -= winnings
    this.totalWinningsPaid += winnings

    return { 
      success: true, 
      winnings: winnings,
      newHouseBalance: this.houseBalance 
    }
  }

  // Process a loss - keeps the bet
  processLoss(betAmount) {
    // The bet amount stays in the game pool
    // House fee is taken from the pool
    const houseFeeAmount = betAmount * this.houseFee
    this.houseBalance += houseFeeAmount
    
    return { 
      success: true, 
      houseFee: houseFeeAmount,
      newHouseBalance: this.houseBalance 
    }
  }

  // Get house statistics
  getHouseStats() {
    return {
      houseBalance: this.houseBalance,
      totalWinningsPaid: this.totalWinningsPaid,
      gamePool: this.gamePool,
      houseFee: this.houseFee,
      profit: this.houseBalance - this.gamePool
    }
  }

  // Reset house (admin function)
  resetHouse() {
    this.houseBalance = 0
    this.totalWinningsPaid = 0
    this.gamePool = 0
  }
}

// Singleton instance
export const gameEconomy = new GameEconomy()

// Initialize with some MATIC (in a real app, this would come from admin funding)
gameEconomy.fundHouse(100) // 100 MATIC house balance
