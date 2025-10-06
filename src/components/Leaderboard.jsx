import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Star, Crown, Award, TrendingUp } from 'lucide-react'

const Leaderboard = ({ 
  dailyLeaderboard = [], 
  weeklyLeaderboard = [], 
  allTimeLeaderboard = [],
  playerAddress,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('daily')
  const [leaderboardData, setLeaderboardData] = useState(dailyLeaderboard)

  useEffect(() => {
    switch (activeTab) {
      case 'daily':
        setLeaderboardData(dailyLeaderboard)
        break
      case 'weekly':
        setLeaderboardData(weeklyLeaderboard)
        break
      case 'allTime':
        setLeaderboardData(allTimeLeaderboard)
        break
      default:
        setLeaderboardData(dailyLeaderboard)
    }
  }, [activeTab, dailyLeaderboard, weeklyLeaderboard, allTimeLeaderboard])

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown size={20} className="rank-icon gold" />
      case 2:
        return <Medal size={20} className="rank-icon silver" />
      case 3:
        return <Award size={20} className="rank-icon bronze" />
      default:
        return <span className="rank-number">{position}</span>
    }
  }

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'var(--quantum-orange)'
      case 2:
        return 'var(--quantum-gray)'
      case 3:
        return '#cd7f32'
      default:
        return 'var(--quantum-blue)'
    }
  }

  const formatAddress = (address) => {
    if (!address) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isCurrentPlayer = (address) => {
    return address && playerAddress && address.toLowerCase() === playerAddress.toLowerCase()
  }

  return (
    <motion.div
      className="leaderboard-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="leaderboard-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-title">
            <Trophy size={24} className="title-icon" />
            <h2>Quantum Grid Leaderboard</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="leaderboard-tabs">
          <button
            className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <TrendingUp size={16} />
            Daily
          </button>
          <button
            className={`tab-button ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            <Star size={16} />
            Weekly
          </button>
          <button
            className={`tab-button ${activeTab === 'allTime' ? 'active' : ''}`}
            onClick={() => setActiveTab('allTime')}
          >
            <Crown size={16} />
            All Time
          </button>
        </div>

        {/* Leaderboard Content */}
        <div className="leaderboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="leaderboard-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {leaderboardData.length === 0 ? (
                <div className="empty-leaderboard">
                  <Trophy size={48} className="empty-icon" />
                  <p>No scores yet. Be the first to play!</p>
                </div>
              ) : (
                leaderboardData.map((entry, index) => {
                  const position = index + 1
                  const isPlayer = isCurrentPlayer(entry.player)
                  
                  return (
                    <motion.div
                      key={`${entry.player}-${entry.timestamp}`}
                      className={`leaderboard-entry ${isPlayer ? 'current-player' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="entry-rank">
                        {getRankIcon(position)}
                      </div>
                      
                      <div className="entry-info">
                        <div className="entry-address">
                          {formatAddress(entry.player)}
                          {isPlayer && <span className="player-badge">You</span>}
                        </div>
                        <div className="entry-timestamp">
                          {new Date(entry.timestamp * 1000).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="entry-score">
                        <span className="score-value">{entry.score.toLocaleString()}</span>
                        <span className="score-label">points</span>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <div className="leaderboard-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-label">Total Players:</span>
              <span className="stat-value">{leaderboardData.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Highest Score:</span>
              <span className="stat-value">
                {leaderboardData.length > 0 ? leaderboardData[0].score.toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Leaderboard
