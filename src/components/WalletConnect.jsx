import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, LogOut, Copy, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

const WalletConnect = () => {
  const {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    isPolygonNetwork,
    isMetaMaskInstalled
  } = useWallet()

  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openExplorer = () => {
    if (account) {
      let explorerUrl
      if (isPolygonNetwork(chainId)) {
        if (chainId === '80002' || chainId === '0x13882') {
          explorerUrl = `https://amoy.polygonscan.com/address/${account}`
        } else if (chainId === '80001' || chainId === '0x13881') {
          explorerUrl = `https://mumbai.polygonscan.com/address/${account}`
        } else {
          explorerUrl = `https://polygonscan.com/address/${account}`
        }
      } else {
        explorerUrl = chainId === '1' 
          ? `https://etherscan.io/address/${account}`
          : chainId === '11155111'
          ? `https://sepolia.etherscan.io/address/${account}`
          : `https://etherscan.io/address/${account}`
      }
      window.open(explorerUrl, '_blank')
    }
  }

  const handleSwitchToPolygon = async () => {
    const success = await switchToPolygon('amoy') // Switch to Amoy testnet
    if (success) {
      setShowDetails(false)
    }
  }

  if (!isMetaMaskInstalled()) {
    return (
      <motion.div
        className="wallet-connect-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wallet-error">
          <AlertCircle size={20} />
          <span>MetaMask not detected</span>
        </div>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="quantum-button btn-primary"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <ExternalLink size={16} />
          Install MetaMask
        </a>
      </motion.div>
    )
  }

  if (!isConnected) {
    return (
      <motion.div
        className="wallet-connect-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="quantum-button btn-primary"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          <Wallet size={20} style={{ marginRight: '8px' }} />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="wallet-connect-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="wallet-info">
        <div className="wallet-balance">
          <span className="balance-label">Balance:</span>
          <span className="balance-value">{balance} MATIC</span>
        </div>
        
        <div className="wallet-address" onClick={() => setShowDetails(!showDetails)}>
          <Wallet size={16} />
          <span>{formatAddress(account)}</span>
        </div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="wallet-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <div className="detail-value">
                <span>{account}</span>
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(account)}
                  title="Copy address"
                >
                  <Copy size={14} />
                  {copied && <span className="copied-text">Copied!</span>}
                </button>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Network:</span>
              <span className="detail-value">
                {isPolygonNetwork(chainId) 
                  ? (chainId === '80002' || chainId === '0x13882' ? 'Polygon Amoy Testnet' :
                     chainId === '80001' || chainId === '0x13881' ? 'Polygon Mumbai Testnet' : 'Polygon Mainnet')
                  : chainId === '1' ? 'Ethereum Mainnet' : 
                   chainId === '11155111' ? 'Sepolia Testnet' : 
                   `Chain ID: ${chainId}`}
              </span>
            </div>

            <div className="wallet-actions">
              <button
                className="action-button"
                onClick={openExplorer}
                title="View on Explorer"
              >
                <ExternalLink size={14} />
                View on Explorer
              </button>
              
              {!isPolygonNetwork(chainId) && (
                <button
                  className="action-button"
                  onClick={handleSwitchToPolygon}
                  title="Switch to Polygon"
                >
                  <RefreshCw size={14} />
                  Switch to Polygon
                </button>
              )}
              
              <button
                className="action-button danger"
                onClick={disconnectWallet}
                title="Disconnect wallet"
              >
                <LogOut size={14} />
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default WalletConnect
