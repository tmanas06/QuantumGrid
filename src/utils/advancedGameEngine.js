// Advanced Game Engine for Quantum Grid
// Enhanced with AI hints, power-ups, and dynamic difficulty

export class AdvancedGameEngine {
  constructor() {
    this.difficultyLevels = {
      beginner: { 
        probability: 0.15, 
        quantumFields: 6, 
        gridSize: 6,
        aiHintFrequency: 0.3,
        powerUpFrequency: 0.4
      },
      easy: { 
        probability: 0.25, 
        quantumFields: 8, 
        gridSize: 8,
        aiHintFrequency: 0.25,
        powerUpFrequency: 0.3
      },
      medium: { 
        probability: 0.4, 
        quantumFields: 12, 
        gridSize: 8,
        aiHintFrequency: 0.2,
        powerUpFrequency: 0.25
      },
      hard: { 
        probability: 0.6, 
        quantumFields: 16, 
        gridSize: 10,
        aiHintFrequency: 0.15,
        powerUpFrequency: 0.2
      },
      expert: { 
        probability: 0.75, 
        quantumFields: 20, 
        gridSize: 12,
        aiHintFrequency: 0.1,
        powerUpFrequency: 0.15
      },
      master: { 
        probability: 0.9, 
        quantumFields: 30, 
        gridSize: 16,
        aiHintFrequency: 0.05,
        powerUpFrequency: 0.1
      }
    }
    
    this.powerUps = {
      quantumScanner: {
        name: "Quantum Scanner",
        description: "Reveals probability of adjacent cells",
        cost: 50,
        effect: "scan_adjacent",
        duration: 1
      },
      fieldDetector: {
        name: "Field Detector",
        description: "Marks all quantum fields in a 3x3 area",
        cost: 100,
        effect: "detect_fields",
        duration: 1
      },
      timeFreeze: {
        name: "Time Freeze",
        description: "Gives you extra time to think",
        cost: 75,
        effect: "extend_time",
        duration: 30
      },
      safeReveal: {
        name: "Safe Reveal",
        description: "Automatically reveals a safe cell",
        cost: 200,
        effect: "reveal_safe",
        duration: 1
      },
      probabilityBoost: {
        name: "Probability Boost",
        description: "Increases score multiplier by 50%",
        cost: 150,
        effect: "boost_score",
        duration: 5
      }
    }
    
    this.aiHints = {
      safe: "This cell appears to be safe based on quantum field analysis",
      risky: "High probability of quantum field - proceed with caution",
      adjacent: "Adjacent cells contain quantum fields",
      pattern: "Following the quantum field pattern, this area is likely safe"
    }
  }

  // Generate advanced probability matrix with AI analysis
  generateAdvancedProbabilityMatrix(grid, quantumFields, gridSize) {
    const matrix = Array(gridSize).fill().map(() => Array(gridSize).fill(0))
    
    // Calculate base probabilities
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (grid[row][col] === 1) {
          matrix[row][col] = 1.0
        } else {
          let probability = 0
          let adjacentFields = 0
          
          // Count adjacent quantum fields
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr
              const newCol = col + dc
              if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                if (grid[newRow][newCol] === 1) {
                  adjacentFields++
                  probability += 0.15 // Each adjacent field adds 15% probability
                }
              }
            }
          }
          
          // Apply AI pattern recognition
          const patternBonus = this.analyzeQuantumPattern(grid, row, col, gridSize)
          probability += patternBonus
          
          // Apply distance-based probability
          const distanceProbability = this.calculateDistanceProbability(row, col, quantumFields, gridSize)
          probability += distanceProbability
          
          matrix[row][col] = Math.min(probability, 0.95) // Cap at 95%
        }
      }
    }
    
    return matrix
  }

  // AI pattern recognition for quantum fields
  analyzeQuantumPattern(grid, row, col, gridSize) {
    let patternBonus = 0
    
    // Check for clustering patterns
    const clusterScore = this.detectQuantumClusters(grid, row, col, gridSize)
    patternBonus += clusterScore * 0.1
    
    // Check for edge patterns
    const edgeScore = this.analyzeEdgePatterns(grid, row, col, gridSize)
    patternBonus += edgeScore * 0.05
    
    // Check for corner patterns
    const cornerScore = this.analyzeCornerPatterns(grid, row, col, gridSize)
    patternBonus += cornerScore * 0.08
    
    return Math.min(patternBonus, 0.3) // Cap pattern bonus at 30%
  }

  // Detect quantum field clusters
  detectQuantumClusters(grid, row, col, gridSize) {
    let clusterScore = 0
    const clusterRadius = 2
    
    for (let dr = -clusterRadius; dr <= clusterRadius; dr++) {
      for (let dc = -clusterRadius; dc <= clusterRadius; dc++) {
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
          if (grid[newRow][newCol] === 1) {
            const distance = Math.sqrt(dr * dr + dc * dc)
            clusterScore += Math.max(0, 1 - distance / clusterRadius)
          }
        }
      }
    }
    
    return clusterScore
  }

  // Analyze edge patterns
  analyzeEdgePatterns(grid, row, col, gridSize) {
    if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
      // Edge cells have different quantum field distribution
      let edgeFields = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr
          const newCol = col + dc
          if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            if (grid[newRow][newCol] === 1) edgeFields++
          }
        }
      }
      return edgeFields * 0.1
    }
    return 0
  }

  // Analyze corner patterns
  analyzeCornerPatterns(grid, row, col, gridSize) {
    const isCorner = (row === 0 || row === gridSize - 1) && (col === 0 || col === gridSize - 1)
    if (isCorner) {
      // Corners tend to have fewer quantum fields
      return -0.1
    }
    return 0
  }

  // Calculate distance-based probability
  calculateDistanceProbability(row, col, quantumFields, gridSize) {
    let minDistance = Infinity
    let totalDistance = 0
    
    quantumFields.forEach(field => {
      const distance = Math.sqrt(
        Math.pow(row - field.row, 2) + Math.pow(col - field.col, 2)
      )
      minDistance = Math.min(minDistance, distance)
      totalDistance += distance
    })
    
    // Closer to quantum fields = higher probability
    const distanceProbability = Math.max(0, 0.3 - minDistance * 0.05)
    const averageDistance = totalDistance / quantumFields.length
    const averageDistanceProbability = Math.max(0, 0.1 - averageDistance * 0.02)
    
    return distanceProbability + averageDistanceProbability
  }

  // Generate AI hint based on current game state
  generateAIHint(grid, revealed, flagged, probabilityMatrix, row, col, difficulty) {
    const hintChance = this.difficultyLevels[difficulty].aiHintFrequency
    
    if (Math.random() > hintChance) return null
    
    const probability = probabilityMatrix[row][col]
    const adjacentFields = this.countAdjacentFields(grid, row, col)
    
    if (probability < 0.2) {
      return {
        type: 'safe',
        message: this.aiHints.safe,
        confidence: 0.8
      }
    } else if (probability > 0.7) {
      return {
        type: 'risky',
        message: this.aiHints.risky,
        confidence: 0.9
      }
    } else if (adjacentFields > 0) {
      return {
        type: 'adjacent',
        message: this.aiHints.adjacent,
        confidence: 0.7
      }
    } else {
      return {
        type: 'pattern',
        message: this.aiHints.pattern,
        confidence: 0.6
      }
    }
  }

  // Count adjacent quantum fields
  countAdjacentFields(grid, row, col) {
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = row + dr
        const newCol = col + dc
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
          if (grid[newRow][newCol] === 1) count++
        }
      }
    }
    return count
  }

  // Calculate advanced score with power-ups and bonuses
  calculateAdvancedScore(baseScore, revealedCells, totalSafeCells, powerUps, difficulty) {
    let finalScore = baseScore
    
    // Progress bonus
    const progressBonus = (revealedCells / totalSafeCells) * 500
    finalScore += progressBonus
    
    // Difficulty multiplier
    const difficultyMultiplier = this.difficultyLevels[difficulty].probability * 2
    finalScore *= (1 + difficultyMultiplier)
    
    // Power-up bonuses
    powerUps.forEach(powerUp => {
      if (powerUp.effect === 'boost_score') {
        finalScore *= 1.5
      }
    })
    
    // Combo bonus for consecutive safe reveals
    const comboBonus = this.calculateComboBonus(revealedCells)
    finalScore += comboBonus
    
    return Math.round(finalScore)
  }

  // Calculate combo bonus
  calculateComboBonus(revealedCells) {
    if (revealedCells >= 10) return 200
    if (revealedCells >= 5) return 100
    if (revealedCells >= 3) return 50
    return 0
  }

  // Generate power-up based on game state
  generatePowerUp(gameState, difficulty) {
    const powerUpChance = this.difficultyLevels[difficulty].powerUpFrequency
    
    if (Math.random() > powerUpChance) return null
    
    const availablePowerUps = Object.keys(this.powerUps)
    const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)]
    
    return {
      ...this.powerUps[randomPowerUp],
      id: randomPowerUp,
      expiresAt: Date.now() + (this.powerUps[randomPowerUp].duration * 1000)
    }
  }

  // Apply power-up effect
  applyPowerUp(powerUp, gameState) {
    switch (powerUp.effect) {
      case 'scan_adjacent':
        return this.scanAdjacentCells(gameState)
      case 'detect_fields':
        return this.detectQuantumFields(gameState)
      case 'extend_time':
        return { timeBonus: 30 }
      case 'reveal_safe':
        return this.revealSafeCell(gameState)
      case 'boost_score':
        return { scoreMultiplier: 1.5 }
      default:
        return null
    }
  }

  // Scan adjacent cells for quantum fields
  scanAdjacentCells(gameState) {
    const { grid, revealed } = gameState
    const scannedCells = []
    
    revealed.forEach(cell => {
      const [row, col] = cell.split('-').map(Number)
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr
          const newCol = col + dc
          if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            if (!revealed.has(`${newRow}-${newCol}`)) {
              scannedCells.push({
                row: newRow,
                col: newCol,
                isQuantum: grid[newRow][newCol] === 1
              })
            }
          }
        }
      }
    })
    
    return { scannedCells }
  }

  // Detect quantum fields in 3x3 area
  detectQuantumFields(gameState) {
    const { grid } = gameState
    const detectedFields = []
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] === 1) {
          detectedFields.push({ row, col })
        }
      }
    }
    
    return { detectedFields }
  }

  // Reveal a safe cell
  revealSafeCell(gameState) {
    const { grid, revealed } = gameState
    const safeCells = []
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] === 0 && !revealed.has(`${row}-${col}`)) {
          safeCells.push({ row, col })
        }
      }
    }
    
    if (safeCells.length > 0) {
      const randomCell = safeCells[Math.floor(Math.random() * safeCells.length)]
      return { revealedCell: randomCell }
    }
    
    return null
  }

  // Dynamic difficulty adjustment
  adjustDifficulty(currentDifficulty, playerStats) {
    const { winRate, averageScore, gamesPlayed } = playerStats
    
    if (gamesPlayed < 5) return currentDifficulty
    
    if (winRate > 0.8 && averageScore > 1000) {
      // Player is doing well, increase difficulty
      const difficultyOrder = ['beginner', 'easy', 'medium', 'hard', 'expert', 'master']
      const currentIndex = difficultyOrder.indexOf(currentDifficulty)
      if (currentIndex < difficultyOrder.length - 1) {
        return difficultyOrder[currentIndex + 1]
      }
    } else if (winRate < 0.3 && averageScore < 500) {
      // Player is struggling, decrease difficulty
      const difficultyOrder = ['beginner', 'easy', 'medium', 'hard', 'expert', 'master']
      const currentIndex = difficultyOrder.indexOf(currentDifficulty)
      if (currentIndex > 0) {
        return difficultyOrder[currentIndex - 1]
      }
    }
    
    return currentDifficulty
  }

  // Calculate advanced winnings with all bonuses
  calculateAdvancedWinnings(betAmount, score, revealedCells, totalSafeCells, difficulty, powerUps = []) {
    if (revealedCells === 0) return 0
    
    // Base calculation
    const baseMultiplier = Math.max(0.1, score / 1000)
    const progressMultiplier = Math.max(0.1, revealedCells / totalSafeCells)
    const difficultyMultiplier = this.difficultyLevels[difficulty].probability + 0.5
    
    // Power-up bonuses
    let powerUpMultiplier = 1
    powerUps.forEach(powerUp => {
      if (powerUp.effect === 'boost_score') {
        powerUpMultiplier *= 1.5
      }
    })
    
    // Combo bonus
    const comboMultiplier = revealedCells >= 10 ? 1.2 : 1.0
    
    // Final calculation
    const finalMultiplier = baseMultiplier * progressMultiplier * difficultyMultiplier * powerUpMultiplier * comboMultiplier
    const winnings = betAmount * finalMultiplier
    
    return Math.max(0, winnings)
  }
}

// Export singleton instance
export const advancedGameEngine = new AdvancedGameEngine()
