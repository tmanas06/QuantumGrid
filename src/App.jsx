import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Flag, Zap, Brain, Target, Coins, Trophy } from 'lucide-react'
import { WalletProvider, useWallet } from './contexts/WalletContext'
import WalletConnect from './components/WalletConnect'
import { gameEconomy } from './utils/gameEconomy'
import './index.css'

const GRID_SIZE = 8
const QUANTUM_FIELDS = 12
const DIFFICULTY_LEVELS = {
  easy: { probability: 0.3, quantumFields: 8 },
  medium: { probability: 0.5, quantumFields: 12 },
  hard: { probability: 0.7, quantumFields: 16 }
}

const Game = () => {
  const { isConnected, signMessage, sendTransaction } = useWallet()
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'won', 'lost'
  const [grid, setGrid] = useState([])
  const [quantumFields, setQuantumFields] = useState([])
  const [revealed, setRevealed] = useState(new Set())
  const [flagged, setFlagged] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState('medium')
  const [quantumMode, setQuantumMode] = useState(false)
  const [probabilityMatrix, setProbabilityMatrix] = useState([])
  const [betAmount, setBetAmount] = useState(1) // 1 MATIC default bet
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [gameHistory, setGameHistory] = useState([])
  const [currentWinnings, setCurrentWinnings] = useState(0)
  const [canCashOut, setCanCashOut] = useState(false)

  // Calculate current winnings based on score and bet
  const calculateCurrentWinnings = useCallback((currentScore, currentBet, totalSafeCells, revealedCount) => {
    if (revealedCount === 0) return 0
    
    // Base multiplier from score (higher score = higher multiplier)
    const scoreMultiplier = Math.max(0.1, currentScore / 1000) // Minimum 0.1x, scales with score
    
    // Progress multiplier (more cells revealed = higher multiplier)
    const progressMultiplier = Math.max(0.1, revealedCount / totalSafeCells) // Scales with progress
    
    // Risk multiplier (higher difficulty = higher potential rewards)
    const difficultyMultiplier = DIFFICULTY_LEVELS[difficulty].probability + 0.5 // 0.8 to 1.2x
    
    // Final calculation
    const finalMultiplier = scoreMultiplier * progressMultiplier * difficultyMultiplier
    const winnings = currentBet * finalMultiplier
    
    return Math.max(0, winnings) // Ensure non-negative
  }, [difficulty])

  // Initialize the quantum grid
  const initializeGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
    const newQuantumFields = []
    const newProbabilityMatrix = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
    
    // Place quantum fields randomly
    const totalFields = DIFFICULTY_LEVELS[difficulty].quantumFields
    let placedFields = 0
    
    while (placedFields < totalFields) {
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      
      if (newGrid[row][col] === 0) {
        newGrid[row][col] = 1 // 1 = quantum field
        newQuantumFields.push({ row, col })
        placedFields++
      }
    }
    
    // Calculate probability matrix
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col] === 1) {
          newProbabilityMatrix[row][col] = 1.0
        } else {
          // Calculate probability based on nearby quantum fields
          let probability = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr
              const newCol = col + dc
              if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                if (newGrid[newRow][newCol] === 1) {
                  probability += 0.125 // Each adjacent field adds 12.5% probability
                }
              }
            }
          }
          newProbabilityMatrix[row][col] = Math.min(probability, 0.8) // Cap at 80%
        }
      }
    }
    
    setGrid(newGrid)
    setQuantumFields(newQuantumFields)
    setProbabilityMatrix(newProbabilityMatrix)
    setRevealed(new Set())
    setFlagged(new Set())
    setMoves(0)
    setScore(0)
    setCurrentWinnings(0)
    setCanCashOut(false)
  }, [difficulty])

  // Start new game
  const startGame = async () => {
    if (isConnected && betAmount > 0) {
      // Process the bet through game economy
      const betResult = gameEconomy.processBet(betAmount)
      if (!betResult.success) {
        alert(`Bet failed: ${betResult.error}`)
        return
      }

      // Sign a message to prove ownership
      const message = `Starting Quantum Grid game with bet: ${betAmount} MATIC`
      const signature = await signMessage(message)
      
      if (!signature) {
        alert('Failed to sign transaction. Please try again.')
        return
      }
    }
    
    setGameState('playing')
    initializeGrid()
  }

  // Cash out current winnings
  const cashOut = async () => {
    if (!canCashOut || currentWinnings <= 0) return

    if (isConnected) {
      // Process the win through game economy
      const winResult = gameEconomy.processWin(currentWinnings)
      if (!winResult.success) {
        alert(`Cash-out failed: ${winResult.error}`)
        return
      }

      // Sign a message to prove the cash-out
      const message = `Cashing out ${currentWinnings.toFixed(4)} MATIC from Quantum Grid`
      const signature = await signMessage(message)
      
      if (!signature) {
        alert('Failed to sign cash-out transaction. Please try again.')
        return
      }
    }

    // Add to total winnings
    setTotalWinnings(prev => prev + currentWinnings)
    
    // Record cash-out in game history
    setGameHistory(prev => [...prev, {
      result: 'cashed_out',
      score: score,
      bet: betAmount,
      winnings: currentWinnings,
      timestamp: Date.now()
    }])

    // End the game
    setGameState('cashed_out')
  }

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameState !== 'playing' || revealed.has(`${row}-${col}`) || flagged.has(`${row}-${col}`)) {
      return
    }

    const newRevealed = new Set(revealed)
    newRevealed.add(`${row}-${col}`)
    setRevealed(newRevealed)
    setMoves(moves + 1)

    if (grid[row][col] === 1) {
      // Hit a quantum field
      setGameState('lost')
      setScore(Math.max(0, score - 100))
      
      // Record game result
      setGameHistory(prev => [...prev, {
        result: 'lost',
        score: Math.max(0, score - 100),
        bet: betAmount,
        timestamp: Date.now()
      }])
    } else {
      // Safe cell - calculate score based on probability
      const probability = probabilityMatrix[row][col]
      const points = Math.round(100 * (1 - probability) + 50)
      const newScore = score + points
      setScore(newScore)
      
      // Calculate current winnings and update cash-out availability
      const totalSafeCells = GRID_SIZE * GRID_SIZE - DIFFICULTY_LEVELS[difficulty].quantumFields
      const newCurrentWinnings = calculateCurrentWinnings(newScore, betAmount, totalSafeCells, newRevealed.size)
      setCurrentWinnings(newCurrentWinnings)
      setCanCashOut(newRevealed.size > 0 && newCurrentWinnings > 0)
      
      // Check win condition
      if (newRevealed.size === totalSafeCells) {
        const finalScore = newScore + 1000 // Bonus for winning
        setScore(finalScore)
        setGameState('won')
        
        // Calculate final winnings
        const finalWinnings = calculateCurrentWinnings(finalScore, betAmount, totalSafeCells, newRevealed.size)
        setCurrentWinnings(finalWinnings)
        setTotalWinnings(prev => prev + finalWinnings)
        
        // Record game result
        setGameHistory(prev => [...prev, {
          result: 'won',
          score: finalScore,
          bet: betAmount,
          winnings: finalWinnings,
          timestamp: Date.now()
        }])
      }
    }
  }

  // Handle right click (flag)
  const handleCellRightClick = (e, row, col) => {
    e.preventDefault()
    if (gameState !== 'playing' || revealed.has(`${row}-${col}`)) {
      return
    }

    const newFlagged = new Set(flagged)
    if (flagged.has(`${row}-${col}`)) {
      newFlagged.delete(`${row}-${col}`)
    } else {
      newFlagged.add(`${row}-${col}`)
    }
    setFlagged(newFlagged)
  }

  // Get cell class based on state
  const getCellClass = (row, col) => {
    const cellKey = `${row}-${col}`
    if (revealed.has(cellKey)) {
      return grid[row][col] === 1 ? 'cell-danger' : 'cell-safe'
    }
    if (flagged.has(cellKey)) {
      return 'cell-flagged'
    }
    if (quantumMode && probabilityMatrix[row][col] > 0.3) {
      return 'cell-probability'
    }
    return 'cell-unknown'
  }

  // Get cell content
  const getCellContent = (row, col) => {
    const cellKey = `${row}-${col}`
    if (flagged.has(cellKey)) {
      return <Flag size={20} />
    }
    if (revealed.has(cellKey)) {
      if (grid[row][col] === 1) {
        return <Zap size={20} />
      }
      return probabilityMatrix[row][col] > 0 ? Math.round(probabilityMatrix[row][col] * 100) : ''
    }
    if (quantumMode && probabilityMatrix[row][col] > 0.3) {
      return Math.round(probabilityMatrix[row][col] * 100)
    }
    return ''
  }

  // Reset game
  const resetGame = () => {
    setGameState('menu')
    initializeGrid()
  }

  return (
    <div className="app">
      <WalletConnect />
      
      <motion.div 
        className="game-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="game-title">Quantum Grid</h1>
        <p className="game-subtitle">Navigate through probability waves and avoid quantum fields</p>
        
        {gameState === 'menu' && (
          <motion.div 
            className="game-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="difficulty-selector" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--quantum-blue)' }}>Select Difficulty</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {Object.keys(DIFFICULTY_LEVELS).map(level => (
                  <button
                    key={level}
                    className={`quantum-button ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty(level)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            {isConnected && (
              <div className="betting-interface">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={20} />
                  <span>Bet Amount (MATIC):</span>
                  <input
                    type="number"
                    className="bet-input"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    placeholder="1"
                  />
                </div>
              </div>
            )}
            
            <button className="quantum-button btn-primary" onClick={startGame}>
              <Play size={20} style={{ marginRight: '8px' }} />
              {isConnected ? `Start Game (${betAmount} MATIC)` : 'Start Quantum Journey'}
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            className="game-stats"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="stat-item">
              <div className="stat-value">{moves}</div>
              <div className="stat-label">Moves</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{score}</div>
              <div className="stat-label">Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{DIFFICULTY_LEVELS[difficulty].quantumFields}</div>
              <div className="stat-label">Quantum Fields</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{GRID_SIZE * GRID_SIZE - DIFFICULTY_LEVELS[difficulty].quantumFields - revealed.size}</div>
              <div className="stat-label">Safe Cells Left</div>
            </div>
          </motion.div>
        )}

        {isConnected && gameState === 'playing' && (
          <motion.div 
            className="blockchain-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="blockchain-stat">
              <div className="blockchain-stat-value">{betAmount}</div>
              <div className="blockchain-stat-label">Current Bet (MATIC)</div>
            </div>
            <div className="blockchain-stat">
              <div className="blockchain-stat-value">{totalWinnings.toFixed(4)}</div>
              <div className="blockchain-stat-label">Total Winnings (MATIC)</div>
            </div>
            <div className="blockchain-stat">
              <div className="blockchain-stat-value">{currentWinnings.toFixed(4)}</div>
              <div className="blockchain-stat-label">Current Winnings (MATIC)</div>
            </div>
            <div className="blockchain-stat">
              <div className="blockchain-stat-value">{gameHistory.length}</div>
              <div className="blockchain-stat-label">Games Played</div>
            </div>
            <div className="blockchain-stat">
              <div className="blockchain-stat-value">{gameEconomy.getHouseStats().houseBalance.toFixed(2)}</div>
              <div className="blockchain-stat-label">House Balance (MATIC)</div>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            className="game-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button 
              className={`quantum-button ${quantumMode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQuantumMode(!quantumMode)}
            >
              <Brain size={20} style={{ marginRight: '8px' }} />
              {quantumMode ? 'Quantum Mode ON' : 'Quantum Mode OFF'}
            </button>
            
            {canCashOut && (
              <button 
                className="quantum-button btn-primary cash-out-button"
                onClick={cashOut}
                style={{ background: 'linear-gradient(135deg, var(--quantum-green), #059669)' }}
              >
                <Coins size={20} style={{ marginRight: '8px' }} />
                Cash Out ({currentWinnings.toFixed(4)} MATIC)
              </button>
            )}
            
            <button className="quantum-button btn-secondary" onClick={resetGame}>
              <RotateCcw size={20} style={{ marginRight: '8px' }} />
              Reset
            </button>
          </motion.div>
        )}

        {(gameState === 'won' || gameState === 'lost' || gameState === 'cashed_out') && (
          <motion.div 
            className="game-controls"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 style={{ 
              color: gameState === 'won' ? 'var(--quantum-green)' : 
                     gameState === 'cashed_out' ? 'var(--quantum-blue)' : 'var(--quantum-red)',
              marginBottom: '1rem',
              fontSize: '2rem'
            }}>
              {gameState === 'won' ? '🎉 Quantum Master!' : 
               gameState === 'cashed_out' ? '💰 Smart Cash-Out!' : '💥 Quantum Collapse!'}
            </h2>
            <p style={{ marginBottom: '2rem', color: 'var(--quantum-gray)' }}>
              {gameState === 'won' 
                ? `You successfully navigated the quantum field! Final Score: ${score}`
                : gameState === 'cashed_out'
                ? `You cashed out with ${currentWinnings.toFixed(4)} MATIC! Score: ${score}`
                : `You hit a quantum field! Final Score: ${score}`
              }
            </p>
            <button className="quantum-button btn-primary" onClick={startGame}>
              <Play size={20} style={{ marginRight: '8px' }} />
              Play Again
            </button>
            <button className="quantum-button btn-secondary" onClick={resetGame}>
              <RotateCcw size={20} style={{ marginRight: '8px' }} />
              Main Menu
            </button>
          </motion.div>
        )}
      </motion.div>

      {gameState === 'playing' && (
        <motion.div 
          className="game-board-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="quantum-grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`quantum-cell ${getCellClass(rowIndex, colIndex)}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: (rowIndex * GRID_SIZE + colIndex) * 0.02,
                    duration: 0.3
                  }}
                >
                  {getCellContent(rowIndex, colIndex)}
                  {quantumMode && probabilityMatrix[rowIndex][colIndex] > 0.3 && (
                    <div className="probability-display">
                      {Math.round(probabilityMatrix[rowIndex][colIndex] * 100)}%
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {gameState === 'menu' && (
        <motion.div 
          className="game-board-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '600px', 
            padding: '2rem',
            background: 'rgba(0, 212, 255, 0.05)',
            borderRadius: '20px',
            border: '2px solid rgba(0, 212, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem', 
              color: 'var(--quantum-blue)' 
            }}>
              How to Play Quantum Grid
            </h3>
            <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '1rem' }}>
                🎯 <strong>Objective:</strong> Reveal all safe cells while avoiding quantum fields
              </p>
              <p style={{ marginBottom: '1rem' }}>
                🧠 <strong>Quantum Mode:</strong> Toggle to see probability percentages
              </p>
              <p style={{ marginBottom: '1rem' }}>
                🚩 <strong>Flagging:</strong> Right-click to mark suspicious cells
              </p>
              <p style={{ marginBottom: '1rem' }}>
                ⚡ <strong>Scoring:</strong> Higher scores for cells with lower probability
              </p>
              <p>
                🎮 <strong>Controls:</strong> Left-click to reveal, right-click to flag
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

const App = () => {
  return (
    <WalletProvider>
      <Game />
    </WalletProvider>
  )
}

export default App
