import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Flag, 
  Brain, 
  Target, 
  Shield, 
  Clock, 
  Star,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

const EnhancedGameBoard = ({ 
  grid, 
  revealed, 
  flagged, 
  probabilityMatrix, 
  quantumMode, 
  onCellClick, 
  onCellRightClick,
  gameState,
  score,
  moves,
  powerUps = [],
  aiHints = [],
  onPowerUpUse,
  onHintRequest
}) => {
  const [particles, setParticles] = useState([])
  const [animatingCells, setAnimatingCells] = useState(new Set())
  const [showParticles, setShowParticles] = useState(false)
  const boardRef = useRef(null)

  // Particle system for visual effects
  const createParticles = (x, y, type = 'reveal') => {
    const newParticles = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        type,
        color: type === 'quantum' ? '#ec4899' : '#10b981'
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02,
          vy: particle.vy + 0.1 // gravity
        })).filter(particle => particle.life > 0)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  // Enhanced cell click handler with animations
  const handleCellClick = (row, col) => {
    const cellKey = `${row}-${col}`
    
    if (gameState !== 'playing' || revealed.has(cellKey) || flagged.has(cellKey)) {
      return
    }

    // Add animation
    setAnimatingCells(prev => new Set([...prev, cellKey]))
    setTimeout(() => {
      setAnimatingCells(prev => {
        const newSet = new Set(prev)
        newSet.delete(cellKey)
        return newSet
      })
    }, 300)

    // Create particles
    const cellElement = document.querySelector(`[data-cell="${cellKey}"]`)
    if (cellElement) {
      const rect = cellElement.getBoundingClientRect()
      const boardRect = boardRef.current.getBoundingClientRect()
      createParticles(
        rect.left - boardRect.left + rect.width / 2,
        rect.top - boardRect.top + rect.height / 2,
        grid[row][col] === 1 ? 'quantum' : 'safe'
      )
    }

    onCellClick(row, col)
  }

  // Enhanced cell right click handler
  const handleCellRightClick = (e, row, col) => {
    e.preventDefault()
    if (gameState !== 'playing' || revealed.has(`${row}-${col}`)) {
      return
    }

    onCellRightClick(e, row, col)
  }

  // Get enhanced cell class with animations
  const getCellClass = (row, col) => {
    const cellKey = `${row}-${col}`
    const classes = ['quantum-cell']
    
    if (revealed.has(cellKey)) {
      classes.push(grid[row][col] === 1 ? 'cell-danger' : 'cell-safe')
    } else if (flagged.has(cellKey)) {
      classes.push('cell-flagged')
    } else if (quantumMode && probabilityMatrix[row][col] > 0.3) {
      classes.push('cell-probability')
    } else {
      classes.push('cell-unknown')
    }

    if (animatingCells.has(cellKey)) {
      classes.push('cell-animating')
    }

    return classes.join(' ')
  }

  // Get enhanced cell content with icons
  const getCellContent = (row, col) => {
    const cellKey = `${row}-${col}`
    
    if (flagged.has(cellKey)) {
      return <Flag size={20} className="cell-icon" />
    }
    
    if (revealed.has(cellKey)) {
      if (grid[row][col] === 1) {
        return <Zap size={20} className="cell-icon danger-icon" />
      }
      
      const probability = probabilityMatrix[row][col]
      if (probability > 0) {
        return (
          <div className="probability-number">
            {Math.round(probability * 100)}
          </div>
        )
      }
      
      return <CheckCircle size={16} className="cell-icon safe-icon" />
    }
    
    if (quantumMode && probabilityMatrix[row][col] > 0.3) {
      return (
        <div className="probability-preview">
          {Math.round(probabilityMatrix[row][col] * 100)}
        </div>
      )
    }
    
    return null
  }

  // Get AI hint for cell
  const getCellHint = (row, col) => {
    return aiHints.find(hint => hint.row === row && hint.col === col)
  }

  // Power-up effects
  const renderPowerUpEffects = () => {
    return powerUps.map(powerUp => (
      <motion.div
        key={powerUp.id}
        className="power-up-indicator"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={() => onPowerUpUse(powerUp)}
      >
        <div className="power-up-icon">
          {powerUp.effect === 'scan_adjacent' && <Target size={16} />}
          {powerUp.effect === 'detect_fields' && <Zap size={16} />}
          {powerUp.effect === 'extend_time' && <Clock size={16} />}
          {powerUp.effect === 'reveal_safe' && <Shield size={16} />}
          {powerUp.effect === 'boost_score' && <Star size={16} />}
        </div>
        <div className="power-up-name">{powerUp.name}</div>
      </motion.div>
    ))
  }

  return (
    <div className="enhanced-game-board" ref={boardRef}>
      {/* Particle System */}
      <div className="particle-container">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
              opacity: particle.life
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        ))}
      </div>

      {/* Power-ups Display */}
      <div className="power-ups-container">
        {renderPowerUpEffects()}
      </div>

      {/* Game Grid */}
      <div 
        className="quantum-grid enhanced-grid" 
        style={{ 
          gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
          gap: '3px'
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellKey = `${rowIndex}-${colIndex}`
            const hint = getCellHint(rowIndex, colIndex)
            const isAnimating = animatingCells.has(cellKey)
            
            return (
              <motion.div
                key={cellKey}
                data-cell={cellKey}
                className={getCellClass(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: isAnimating ? 1.1 : 1,
                  rotate: isAnimating ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  delay: (rowIndex * grid.length + colIndex) * 0.02,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {/* Cell Content */}
                <div className="cell-content">
                  {getCellContent(rowIndex, colIndex)}
                </div>

                {/* AI Hint Indicator */}
                {hint && (
                  <motion.div
                    className="ai-hint-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Brain size={12} />
                  </motion.div>
                )}

                {/* Quantum Field Indicator */}
                {quantumMode && grid[rowIndex][colIndex] === 1 && !revealed.has(cellKey) && (
                  <motion.div
                    className="quantum-field-indicator"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles size={16} />
                  </motion.div>
                )}

                {/* Probability Wave Effect */}
                {quantumMode && probabilityMatrix[rowIndex][colIndex] > 0.5 && (
                  <motion.div
                    className="probability-wave"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            )
          })
        )}
      </div>

      {/* AI Hints Panel */}
      {aiHints.length > 0 && (
        <motion.div
          className="ai-hints-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4>AI Analysis</h4>
          {aiHints.map((hint, index) => (
            <motion.div
              key={index}
              className="ai-hint-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="hint-icon">
                {hint.type === 'safe' && <CheckCircle size={16} />}
                {hint.type === 'risky' && <AlertTriangle size={16} />}
                {hint.type === 'adjacent' && <Target size={16} />}
                {hint.type === 'pattern' && <Brain size={16} />}
              </div>
              <div className="hint-content">
                <div className="hint-message">{hint.message}</div>
                <div className="hint-confidence">
                  Confidence: {Math.round(hint.confidence * 100)}%
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Game Statistics */}
      <motion.div
        className="game-stats-enhanced"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{score}</div>
            <div className="stat-label">Score</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{moves}</div>
            <div className="stat-label">Moves</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Star size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{powerUps.length}</div>
            <div className="stat-label">Power-ups</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EnhancedGameBoard
