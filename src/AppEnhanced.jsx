import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  RotateCcw, 
  Flag, 
  Zap, 
  Brain, 
  Target, 
  Coins, 
  Trophy, 
  Settings,
  Crown,
  Star,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Medal
} from 'lucide-react'
import { WalletProvider, useWallet } from './contexts/WalletContext'
import WalletConnect from './components/WalletConnect'
import EnhancedGameBoard from './components/EnhancedGameBoard'
import Leaderboard from './components/Leaderboard'
import { advancedGameEngine } from './utils/advancedGameEngine'
import { gameEconomy } from './utils/gameEconomy'
import './index.css'

const GRID_SIZE = 8
const DIFFICULTY_LEVELS = {
  beginner: { probability: 0.15, quantumFields: 6, gridSize: 6, aiHintFrequency: 0.3, powerUpFrequency: 0.4 },
  easy: { probability: 0.25, quantumFields: 8, gridSize: 8, aiHintFrequency: 0.25, powerUpFrequency: 0.3 },
  medium: { probability: 0.4, quantumFields: 12, gridSize: 8, aiHintFrequency: 0.2, powerUpFrequency: 0.25 },
  hard: { probability: 0.6, quantumFields: 16, gridSize: 10, aiHintFrequency: 0.15, powerUpFrequency: 0.2 },
  expert: { probability: 0.75, quantumFields: 20, gridSize: 12, aiHintFrequency: 0.1, powerUpFrequency: 0.15 },
  master: { probability: 0.9, quantumFields: 30, gridSize: 16, aiHintFrequency: 0.05, powerUpFrequency: 0.1 }
}

const Game = () => {
  const { isConnected, signMessage, sendTransaction, account } = useWallet()
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
  const [betAmount, setBetAmount] = useState(1)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [gameHistory, setGameHistory] = useState([])
  const [currentWinnings, setCurrentWinnings] = useState(0)
  const [canCashOut, setCanCashOut] = useState(false)
  
  // Enhanced features
  const [powerUps, setPowerUps] = useState([])
  const [aiHints, setAiHints] = useState([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerStats, setPlayerStats] = useState({
    totalGamesPlayed: 0,
    totalWinnings: 0,
    bestScore: 0,
    winStreak: 0,
    longestWinStreak: 0
  })
  const [leaderboardData, setLeaderboardData] = useState({
    daily: [],
    weekly: [],
    allTime: []
  })
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Initialize enhanced game engine
  useEffect(() => {
    // Load player stats from localStorage
    const savedStats = localStorage.getItem('quantumGridPlayerStats')
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats))
    }
  }, [])

  // Save player stats to localStorage
  useEffect(() => {
    localStorage.setItem('quantumGridPlayerStats', JSON.stringify(playerStats))
  }, [playerStats])

  // Calculate current winnings with enhanced algorithm
  const calculateCurrentWinnings = useCallback((currentScore, currentBet, totalSafeCells, revealedCount) => {
    if (revealedCount === 0) return 0
    
    const baseMultiplier = Math.max(0.1, currentScore / 1000)
    const progressMultiplier = Math.max(0.1, revealedCount / totalSafeCells)
    const difficultyMultiplier = DIFFICULTY_LEVELS[difficulty].probability + 0.5
    
    // Power-up bonuses
    let powerUpMultiplier = 1
    powerUps.forEach(powerUp => {
      if (powerUp.effect === 'boost_score') {
        powerUpMultiplier *= 1.5
      }
    })
    
    // Combo bonus
    const comboMultiplier = revealedCount >= 10 ? 1.2 : 1.0
    
    const finalMultiplier = baseMultiplier * progressMultiplier * difficultyMultiplier * powerUpMultiplier * comboMultiplier
    const winnings = currentBet * finalMultiplier
    
    return Math.max(0, winnings)
  }, [difficulty, powerUps])

  // Initialize the enhanced quantum grid
  const initializeGrid = useCallback(() => {
    const config = DIFFICULTY_LEVELS[difficulty]
    const newGridSize = config.gridSize
    const newGrid = Array(newGridSize).fill().map(() => Array(newGridSize).fill(0))
    const newQuantumFields = []
    
    // Place quantum fields with enhanced algorithm
    const totalFields = config.quantumFields
    let placedFields = 0
    
    while (placedFields < totalFields) {
      const row = Math.floor(Math.random() * newGridSize)
      const col = Math.floor(Math.random() * newGridSize)
      
      if (newGrid[row][col] === 0) {
        newGrid[row][col] = 1
        newQuantumFields.push({ row, col })
        placedFields++
      }
    }
    
    // Generate advanced probability matrix
    const newProbabilityMatrix = advancedGameEngine.generateAdvancedProbabilityMatrix(
      newGrid, 
      newQuantumFields, 
      newGridSize
    )
    
    setGrid(newGrid)
    setQuantumFields(newQuantumFields)
    setProbabilityMatrix(newProbabilityMatrix)
    setRevealed(new Set())
    setFlagged(new Set())
    setMoves(0)
    setScore(0)
    setCurrentWinnings(0)
    setCanCashOut(false)
    setPowerUps([])
    setAiHints([])
  }, [difficulty])

  // Start new game with enhanced features
  const startGame = async () => {
    if (isConnected && betAmount > 0) {
      const betResult = gameEconomy.processBet(betAmount)
      if (!betResult.success) {
        alert(`Bet failed: ${betResult.error}`)
        return
      }

      const message = `Starting Enhanced Quantum Grid game with bet: ${betAmount} MATIC`
      const signature = await signMessage(message)
      
      if (!signature) {
        alert('Failed to sign transaction. Please try again.')
        return
      }
    }
    
    setGameState('playing')
    initializeGrid()
    
    // Generate initial power-up
    const initialPowerUp = advancedGameEngine.generatePowerUp({}, difficulty)
    if (initialPowerUp) {
      setPowerUps([initialPowerUp])
    }
  }

  // Enhanced cell click handler
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
      
      // Update player stats
      setPlayerStats(prev => ({
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        winStreak: 0
      }))
      
      setGameHistory(prev => [...prev, {
        result: 'lost',
        score: Math.max(0, score - 100),
        bet: betAmount,
        timestamp: Date.now()
      }])
    } else {
      // Safe cell - calculate enhanced score
      const probability = probabilityMatrix[row][col]
      const basePoints = Math.round(100 * (1 - probability) + 50)
      const enhancedScore = advancedGameEngine.calculateAdvancedScore(
        basePoints, 
        newRevealed.size, 
        grid.length * grid[0].length - DIFFICULTY_LEVELS[difficulty].quantumFields,
        powerUps,
        difficulty
      )
      const newScore = score + enhancedScore
      setScore(newScore)
      
      // Generate AI hint
      const hint = advancedGameEngine.generateAIHint(
        grid, 
        newRevealed, 
        flagged, 
        probabilityMatrix, 
        row, 
        col, 
        difficulty
      )
      if (hint) {
        setAiHints(prev => [...prev, { ...hint, row, col }])
      }
      
      // Generate power-up
      if (Math.random() < DIFFICULTY_LEVELS[difficulty].powerUpFrequency) {
        const newPowerUp = advancedGameEngine.generatePowerUp({}, difficulty)
        if (newPowerUp) {
          setPowerUps(prev => [...prev, newPowerUp])
        }
      }
      
      // Calculate current winnings
      const totalSafeCells = grid.length * grid[0].length - DIFFICULTY_LEVELS[difficulty].quantumFields
      const newCurrentWinnings = calculateCurrentWinnings(newScore, betAmount, totalSafeCells, newRevealed.size)
      setCurrentWinnings(newCurrentWinnings)
      setCanCashOut(newRevealed.size > 0 && newCurrentWinnings > 0)
      
      // Check win condition
      if (newRevealed.size === totalSafeCells) {
        const finalScore = newScore + 1000
        setScore(finalScore)
        setGameState('won')
        
        const finalWinnings = calculateCurrentWinnings(finalScore, betAmount, totalSafeCells, newRevealed.size)
        setCurrentWinnings(finalWinnings)
        setTotalWinnings(prev => prev + finalWinnings)
        
        // Update player stats
        setPlayerStats(prev => ({
          ...prev,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          totalWinnings: prev.totalWinnings + finalWinnings,
          bestScore: Math.max(prev.bestScore, finalScore),
          winStreak: prev.winStreak + 1,
          longestWinStreak: Math.max(prev.longestWinStreak, prev.winStreak + 1)
        }))
        
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

  // Enhanced cell right click handler
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

  // Use power-up
  const handlePowerUpUse = (powerUp) => {
    const effect = advancedGameEngine.applyPowerUp(powerUp, { grid, revealed, flagged })
    
    if (effect) {
      // Apply power-up effect
      switch (powerUp.effect) {
        case 'scan_adjacent':
          // Show scanned cells
          console.log('Scanned cells:', effect.scannedCells)
          break
        case 'detect_fields':
          // Show detected quantum fields
          console.log('Detected fields:', effect.detectedFields)
          break
        case 'extend_time':
          // Add time bonus
          console.log('Time extended by', effect.timeBonus, 'seconds')
          break
        case 'reveal_safe':
          if (effect.revealedCell) {
            handleCellClick(effect.revealedCell.row, effect.revealedCell.col)
          }
          break
        case 'boost_score':
          // Score multiplier is already applied in calculation
          break
      }
    }
    
    // Remove used power-up
    setPowerUps(prev => prev.filter(p => p.id !== powerUp.id))
  }

  // Request AI hint
  const handleHintRequest = () => {
    // Generate hint for a random unrevealed cell
    const unrevealedCells = []
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (!revealed.has(`${row}-${col}`) && !flagged.has(`${row}-${col}`)) {
          unrevealedCells.push({ row, col })
        }
      }
    }
    
    if (unrevealedCells.length > 0) {
      const randomCell = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)]
      const hint = advancedGameEngine.generateAIHint(
        grid, 
        revealed, 
        flagged, 
        probabilityMatrix, 
        randomCell.row, 
        randomCell.col, 
        difficulty
      )
      if (hint) {
        setAiHints(prev => [...prev, { ...hint, row: randomCell.row, col: randomCell.col }])
      }
    }
  }

  // Cash out current winnings
  const cashOut = async () => {
    if (!canCashOut || currentWinnings <= 0) return

    if (isConnected) {
      const winResult = gameEconomy.processWin(currentWinnings)
      if (!winResult.success) {
        alert(`Cash-out failed: ${winResult.error}`)
        return
      }

      const message = `Cashing out ${currentWinnings.toFixed(4)} MATIC from Enhanced Quantum Grid`
      const signature = await signMessage(message)
      
      if (!signature) {
        alert('Failed to sign cash-out transaction. Please try again.')
        return
      }
    }

    setTotalWinnings(prev => prev + currentWinnings)
    setGameHistory(prev => [...prev, {
      result: 'cashed_out',
      score: score,
      bet: betAmount,
      winnings: currentWinnings,
      timestamp: Date.now()
    }])

    setGameState('cashed_out')
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
        <div className="header-top">
          <h1 className="game-title">Enhanced Quantum Grid</h1>
          <div className="header-actions">
            <button 
              className="quantum-button btn-secondary"
              onClick={() => setShowLeaderboard(true)}
            >
              <Trophy size={20} />
              Leaderboard
            </button>
            <button 
              className="quantum-button btn-secondary"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>
        
        <p className="game-subtitle">Navigate through probability waves with AI assistance and power-ups</p>
        
        {gameState === 'menu' && (
          <motion.div 
            className="game-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="difficulty-selector">
              <h3>Select Difficulty</h3>
              <div className="difficulty-grid">
                {Object.keys(DIFFICULTY_LEVELS).map(level => (
                  <button
                    key={level}
                    className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                    onClick={() => setDifficulty(level)}
                  >
                    <div className="difficulty-name">{level}</div>
                    <div className="difficulty-stats">
                      {DIFFICULTY_LEVELS[level].quantumFields} fields • {DIFFICULTY_LEVELS[level].gridSize}×{DIFFICULTY_LEVELS[level].gridSize}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {isConnected && (
              <div className="betting-interface">
                <div className="bet-input-group">
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
              <Play size={20} />
              {isConnected ? `Start Enhanced Game (${betAmount} MATIC)` : 'Start Quantum Journey'}
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <>
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
                <div className="stat-value">{grid.length * grid[0].length - DIFFICULTY_LEVELS[difficulty].quantumFields - revealed.size}</div>
                <div className="stat-label">Safe Cells Left</div>
              </div>
            </motion.div>

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
                <Brain size={20} />
                {quantumMode ? 'Quantum Mode ON' : 'Quantum Mode OFF'}
              </button>
              
              <button 
                className="quantum-button btn-secondary"
                onClick={handleHintRequest}
              >
                <Target size={20} />
                AI Hint
              </button>
              
              {canCashOut && (
                <button 
                  className="quantum-button btn-primary cash-out-button"
                  onClick={cashOut}
                >
                  <Coins size={20} />
                  Cash Out ({currentWinnings.toFixed(4)} MATIC)
                </button>
              )}
              
              <button className="quantum-button btn-secondary" onClick={resetGame}>
                <RotateCcw size={20} />
                Reset
              </button>
            </motion.div>
          </>
        )}

        {(gameState === 'won' || gameState === 'lost' || gameState === 'cashed_out') && (
          <motion.div 
            className="game-controls"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className={`game-result ${gameState === 'won' ? 'won' : gameState === 'cashed_out' ? 'cashed' : 'lost'}`}>
              {gameState === 'won' ? '🎉 Quantum Master!' : 
               gameState === 'cashed_out' ? '💰 Smart Cash-Out!' : '💥 Quantum Collapse!'}
            </h2>
            <p className="game-result-text">
              {gameState === 'won' 
                ? `You successfully navigated the quantum field! Final Score: ${score}`
                : gameState === 'cashed_out'
                ? `You cashed out with ${currentWinnings.toFixed(4)} MATIC! Score: ${score}`
                : `You hit a quantum field! Final Score: ${score}`
              }
            </p>
            <div className="result-actions">
              <button className="quantum-button btn-primary" onClick={startGame}>
                <Play size={20} />
                Play Again
              </button>
              <button className="quantum-button btn-secondary" onClick={resetGame}>
                <RotateCcw size={20} />
                Main Menu
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {gameState === 'playing' && (
        <EnhancedGameBoard
          grid={grid}
          revealed={revealed}
          flagged={flagged}
          probabilityMatrix={probabilityMatrix}
          quantumMode={quantumMode}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
          gameState={gameState}
          score={score}
          moves={moves}
          powerUps={powerUps}
          aiHints={aiHints}
          onPowerUpUse={handlePowerUpUse}
          onHintRequest={handleHintRequest}
        />
      )}

      {gameState === 'menu' && (
        <motion.div 
          className="game-board-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="game-info">
            <h3>Enhanced Quantum Grid Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <Brain size={24} />
                <h4>AI Assistance</h4>
                <p>Get intelligent hints based on quantum field analysis</p>
              </div>
              <div className="feature-card">
                <Sparkles size={24} />
                <h4>Power-ups</h4>
                <p>Use special abilities to enhance your gameplay</p>
              </div>
              <div className="feature-card">
                <Trophy size={24} />
                <h4>Leaderboards</h4>
                <p>Compete with players worldwide for the top scores</p>
              </div>
              <div className="feature-card">
                <Target size={24} />
                <h4>Advanced Scoring</h4>
                <p>Earn bonus points for strategic gameplay</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <Leaderboard
            dailyLeaderboard={leaderboardData.daily}
            weeklyLeaderboard={leaderboardData.weekly}
            allTimeLeaderboard={leaderboardData.allTime}
            playerAddress={account}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const App = () => {
  const Game = () => {
    const { isConnected, signMessage, sendTransaction, account } = useWallet()
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
    const [betAmount, setBetAmount] = useState(1)
    const [totalWinnings, setTotalWinnings] = useState(0)
    const [gameHistory, setGameHistory] = useState([])
    const [currentWinnings, setCurrentWinnings] = useState(0)
    const [canCashOut, setCanCashOut] = useState(false)
    
    // Enhanced features
    const [powerUps, setPowerUps] = useState([])
    const [aiHints, setAiHints] = useState([])
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const [playerStats, setPlayerStats] = useState({
      totalGamesPlayed: 0,
      totalWinnings: 0,
      bestScore: 0,
      winStreak: 0,
      longestWinStreak: 0
    })
    const [leaderboardData, setLeaderboardData] = useState({
      daily: [],
      weekly: [],
      allTime: []
    })
    const [showSettings, setShowSettings] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [animationsEnabled, setAnimationsEnabled] = useState(true)

    // Initialize enhanced game engine
    useEffect(() => {
      // Load player stats from localStorage
      const savedStats = localStorage.getItem('quantumGridPlayerStats')
      if (savedStats) {
        setPlayerStats(JSON.parse(savedStats))
      }
    }, [])

    // Save player stats to localStorage
    useEffect(() => {
      localStorage.setItem('quantumGridPlayerStats', JSON.stringify(playerStats))
    }, [playerStats])

    // Calculate current winnings with enhanced algorithm
    const calculateCurrentWinnings = useCallback((currentScore, currentBet, totalSafeCells, revealedCount) => {
      if (revealedCount === 0) return 0
      
      const baseMultiplier = Math.max(0.1, currentScore / 1000)
      const progressMultiplier = Math.max(0.1, revealedCount / totalSafeCells)
      const difficultyMultiplier = DIFFICULTY_LEVELS[difficulty].probability + 0.5
      
      // Power-up bonuses
      let powerUpMultiplier = 1
      powerUps.forEach(powerUp => {
        if (powerUp.effect === 'boost_score') {
          powerUpMultiplier *= 1.5
        }
      })
      
      // Combo bonus
      const comboMultiplier = revealedCount >= 10 ? 1.2 : 1.0
      
      const finalMultiplier = baseMultiplier * progressMultiplier * difficultyMultiplier * powerUpMultiplier * comboMultiplier
      const winnings = currentBet * finalMultiplier
      
      return Math.max(0, winnings)
    }, [difficulty, powerUps])

    // Initialize the enhanced quantum grid
    const initializeGrid = useCallback(() => {
      const config = DIFFICULTY_LEVELS[difficulty]
      const newGridSize = config.gridSize
      const newGrid = Array(newGridSize).fill().map(() => Array(newGridSize).fill(0))
      const newQuantumFields = []
      
      // Place quantum fields with enhanced algorithm
      const totalFields = config.quantumFields
      let placedFields = 0
      
      while (placedFields < totalFields) {
        const row = Math.floor(Math.random() * newGridSize)
        const col = Math.floor(Math.random() * newGridSize)
        
        if (newGrid[row][col] === 0) {
          newGrid[row][col] = 1
          newQuantumFields.push({ row, col })
          placedFields++
        }
      }
      
      // Generate advanced probability matrix
      const newProbabilityMatrix = advancedGameEngine.generateAdvancedProbabilityMatrix(
        newGrid, 
        newQuantumFields, 
        newGridSize
      )
      
      setGrid(newGrid)
      setQuantumFields(newQuantumFields)
      setProbabilityMatrix(newProbabilityMatrix)
      setRevealed(new Set())
      setFlagged(new Set())
      setMoves(0)
      setScore(0)
      setCurrentWinnings(0)
      setCanCashOut(false)
      setPowerUps([])
      setAiHints([])
    }, [difficulty])

    // Start new game with enhanced features
    const startGame = async () => {
      if (isConnected && betAmount > 0) {
        const betResult = gameEconomy.processBet(betAmount)
        if (!betResult.success) {
          alert(`Bet failed: ${betResult.error}`)
          return
        }

        const message = `Starting Enhanced Quantum Grid game with bet: ${betAmount} MATIC`
        const signature = await signMessage(message)
        
        if (!signature) {
          alert('Failed to sign transaction. Please try again.')
          return
        }
      }
      
      setGameState('playing')
      initializeGrid()
      
      // Generate initial power-up
      const initialPowerUp = advancedGameEngine.generatePowerUp({}, difficulty)
      if (initialPowerUp) {
        setPowerUps([initialPowerUp])
      }
    }

    // Enhanced cell click handler
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
        
        // Update player stats
        setPlayerStats(prev => ({
          ...prev,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          winStreak: 0
        }))
        
        setGameHistory(prev => [...prev, {
          result: 'lost',
          score: Math.max(0, score - 100),
          bet: betAmount,
          timestamp: Date.now()
        }])
      } else {
        // Safe cell - calculate enhanced score
        const probability = probabilityMatrix[row][col]
        const basePoints = Math.round(100 * (1 - probability) + 50)
        const enhancedScore = advancedGameEngine.calculateAdvancedScore(
          basePoints, 
          newRevealed.size, 
          grid.length * grid[0].length - DIFFICULTY_LEVELS[difficulty].quantumFields,
          powerUps,
          difficulty
        )
        const newScore = score + enhancedScore
        setScore(newScore)
        
        // Generate AI hint
        const hint = advancedGameEngine.generateAIHint(
          grid, 
          newRevealed, 
          flagged, 
          probabilityMatrix, 
          row, 
          col, 
          difficulty
        )
        if (hint) {
          setAiHints(prev => [...prev, { ...hint, row, col }])
        }
        
        // Generate power-up
        if (Math.random() < DIFFICULTY_LEVELS[difficulty].powerUpFrequency) {
          const newPowerUp = advancedGameEngine.generatePowerUp({}, difficulty)
          if (newPowerUp) {
            setPowerUps(prev => [...prev, newPowerUp])
          }
        }
        
        // Calculate current winnings
        const totalSafeCells = grid.length * grid[0].length - DIFFICULTY_LEVELS[difficulty].quantumFields
        const newCurrentWinnings = calculateCurrentWinnings(newScore, betAmount, totalSafeCells, newRevealed.size)
        setCurrentWinnings(newCurrentWinnings)
        setCanCashOut(newRevealed.size > 0 && newCurrentWinnings > 0)
        
        // Check win condition
        if (newRevealed.size === totalSafeCells) {
          const finalScore = newScore + 1000
          setScore(finalScore)
          setGameState('won')
          
          const finalWinnings = calculateCurrentWinnings(finalScore, betAmount, totalSafeCells, newRevealed.size)
          setCurrentWinnings(finalWinnings)
          setTotalWinnings(prev => prev + finalWinnings)
          
          // Update player stats
          setPlayerStats(prev => ({
            ...prev,
            totalGamesPlayed: prev.totalGamesPlayed + 1,
            totalWinnings: prev.totalWinnings + finalWinnings,
            bestScore: Math.max(prev.bestScore, finalScore),
            winStreak: prev.winStreak + 1,
            longestWinStreak: Math.max(prev.longestWinStreak, prev.winStreak + 1)
          }))
          
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

    // Enhanced cell right click handler
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

    // Use power-up
    const handlePowerUpUse = (powerUp) => {
      const effect = advancedGameEngine.applyPowerUp(powerUp, { grid, revealed, flagged })
      
      if (effect) {
        // Apply power-up effect
        switch (powerUp.effect) {
          case 'scan_adjacent':
            // Show scanned cells
            console.log('Scanned cells:', effect.scannedCells)
            break
          case 'detect_fields':
            // Show detected quantum fields
            console.log('Detected fields:', effect.detectedFields)
            break
          case 'extend_time':
            // Add time bonus
            console.log('Time extended by', effect.timeBonus, 'seconds')
            break
          case 'reveal_safe':
            if (effect.revealedCell) {
              handleCellClick(effect.revealedCell.row, effect.revealedCell.col)
            }
            break
          case 'boost_score':
            // Score multiplier is already applied in calculation
            break
        }
      }
      
      // Remove used power-up
      setPowerUps(prev => prev.filter(p => p.id !== powerUp.id))
    }

    // Request AI hint
    const handleHintRequest = () => {
      // Generate hint for a random unrevealed cell
      const unrevealedCells = []
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          if (!revealed.has(`${row}-${col}`) && !flagged.has(`${row}-${col}`)) {
            unrevealedCells.push({ row, col })
          }
        }
      }
      
      if (unrevealedCells.length > 0) {
        const randomCell = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)]
        const hint = advancedGameEngine.generateAIHint(
          grid, 
          revealed, 
          flagged, 
          probabilityMatrix, 
          randomCell.row, 
          randomCell.col, 
          difficulty
        )
        if (hint) {
          setAiHints(prev => [...prev, { ...hint, row: randomCell.row, col: randomCell.col }])
        }
      }
    }

    // Cash out current winnings
    const cashOut = async () => {
      if (!canCashOut || currentWinnings <= 0) return

      if (isConnected) {
        const winResult = gameEconomy.processWin(currentWinnings)
        if (!winResult.success) {
          alert(`Cash-out failed: ${winResult.error}`)
          return
        }

        const message = `Cashing out ${currentWinnings.toFixed(4)} MATIC from Enhanced Quantum Grid`
        const signature = await signMessage(message)
        
        if (!signature) {
          alert('Failed to sign cash-out transaction. Please try again.')
          return
        }
      }

      setTotalWinnings(prev => prev + currentWinnings)
      setGameHistory(prev => [...prev, {
        result: 'cashed_out',
        score: score,
        bet: betAmount,
        winnings: currentWinnings,
        timestamp: Date.now()
      }])

      setGameState('cashed_out')
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
          <div className="header-top">
            <h1 className="game-title">Enhanced Quantum Grid</h1>
            <div className="header-actions">
              <button 
                className="quantum-button btn-secondary"
                onClick={() => setShowLeaderboard(true)}
              >
                <Trophy size={20} />
                Leaderboard
              </button>
              <button 
                className="quantum-button btn-secondary"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>
          
          <p className="game-subtitle">Navigate through probability waves with AI assistance and power-ups</p>
          
          {gameState === 'menu' && (
            <motion.div 
              className="game-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="difficulty-selector">
                <h3>Select Difficulty</h3>
                <div className="difficulty-grid">
                  {Object.keys(DIFFICULTY_LEVELS).map(level => (
                    <button
                      key={level}
                      className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                      onClick={() => setDifficulty(level)}
                    >
                      <div className="difficulty-name">{level}</div>
                      <div className="difficulty-stats">
                        {DIFFICULTY_LEVELS[level].quantumFields} fields • {DIFFICULTY_LEVELS[level].gridSize}×{DIFFICULTY_LEVELS[level].gridSize}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {isConnected && (
                <div className="betting-interface">
                  <div className="bet-input-group">
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
                <Play size={20} />
                {isConnected ? `Start Enhanced Game (${betAmount} MATIC)` : 'Start Quantum Journey'}
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <>
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
                  <div className="stat-value">{grid.length * grid[0].length - DIFFICULTY_LEVELS[difficulty].quantumFields - revealed.size}</div>
                  <div className="stat-label">Safe Cells Left</div>
                </div>
              </motion.div>

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
                  <Brain size={20} />
                  {quantumMode ? 'Quantum Mode ON' : 'Quantum Mode OFF'}
                </button>
                
                <button 
                  className="quantum-button btn-secondary"
                  onClick={handleHintRequest}
                >
                  <Target size={20} />
                  AI Hint
                </button>
                
                {canCashOut && (
                  <button 
                    className="quantum-button btn-primary cash-out-button"
                    onClick={cashOut}
                  >
                    <Coins size={20} />
                    Cash Out ({currentWinnings.toFixed(4)} MATIC)
                  </button>
                )}
                
                <button className="quantum-button btn-secondary" onClick={resetGame}>
                  <RotateCcw size={20} />
                  Reset
                </button>
              </motion.div>
            </>
          )}

          {(gameState === 'won' || gameState === 'lost' || gameState === 'cashed_out') && (
            <motion.div 
              className="game-controls"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className={`game-result ${gameState === 'won' ? 'won' : gameState === 'cashed_out' ? 'cashed' : 'lost'}`}>
                {gameState === 'won' ? '🎉 Quantum Master!' : 
                 gameState === 'cashed_out' ? '💰 Smart Cash-Out!' : '💥 Quantum Collapse!'}
              </h2>
              <p className="game-result-text">
                {gameState === 'won' 
                  ? `You successfully navigated the quantum field! Final Score: ${score}`
                  : gameState === 'cashed_out'
                  ? `You cashed out with ${currentWinnings.toFixed(4)} MATIC! Score: ${score}`
                  : `You hit a quantum field! Final Score: ${score}`
                }
              </p>
              <div className="result-actions">
                <button className="quantum-button btn-primary" onClick={startGame}>
                  <Play size={20} />
                  Play Again
                </button>
                <button className="quantum-button btn-secondary" onClick={resetGame}>
                  <RotateCcw size={20} />
                  Main Menu
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {gameState === 'playing' && (
          <EnhancedGameBoard
            grid={grid}
            revealed={revealed}
            flagged={flagged}
            probabilityMatrix={probabilityMatrix}
            quantumMode={quantumMode}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
            gameState={gameState}
            score={score}
            moves={moves}
            powerUps={powerUps}
            aiHints={aiHints}
            onPowerUpUse={handlePowerUpUse}
            onHintRequest={handleHintRequest}
          />
        )}

        {gameState === 'menu' && (
          <motion.div 
            className="game-board-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="game-info">
              <h3>Enhanced Quantum Grid Features</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <Brain size={24} />
                  <h4>AI Assistance</h4>
                  <p>Get intelligent hints based on quantum field analysis</p>
                </div>
                <div className="feature-card">
                  <Sparkles size={24} />
                  <h4>Power-ups</h4>
                  <p>Use special abilities to enhance your gameplay</p>
                </div>
                <div className="feature-card">
                  <Trophy size={24} />
                  <h4>Leaderboards</h4>
                  <p>Compete with players worldwide for the top scores</p>
                </div>
                <div className="feature-card">
                  <Target size={24} />
                  <h4>Advanced Scoring</h4>
                  <p>Earn bonus points for strategic gameplay</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Modal */}
        <AnimatePresence>
          {showLeaderboard && (
            <Leaderboard
              dailyLeaderboard={leaderboardData.daily}
              weeklyLeaderboard={leaderboardData.weekly}
              allTimeLeaderboard={leaderboardData.allTime}
              playerAddress={account}
              onClose={() => setShowLeaderboard(false)}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <WalletProvider>
      <Game />
    </WalletProvider>
  )
}

export default App
