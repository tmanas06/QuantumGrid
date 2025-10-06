import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getNetworkConfig, isAlchemyConfigured } from '../config/alchemy'

const WalletContext = createContext()

// Polygon Network Configuration
const POLYGON_NETWORK = {
  chainId: '0x89', // 137 in decimal
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
}

const POLYGON_AMOY = {
  chainId: '0x13882', // 80002 in decimal
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: [getNetworkConfig('amoy').rpcUrl],
  blockExplorerUrls: [getNetworkConfig('amoy').explorerUrl],
}

const POLYGON_MUMBAI = {
  chainId: '0x13881', // 80001 in decimal
  chainName: 'Polygon Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [chainId, setChainId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to play Quantum Grid!')
      return false
    }

    try {
      setIsConnecting(true)
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        const web3Signer = await web3Provider.getSigner()
        
        setProvider(web3Provider)
        setSigner(web3Signer)
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Get initial balance
        await updateBalance(web3Provider, accounts[0])
        
        // Get chain ID
        const network = await web3Provider.getNetwork()
        setChainId(network.chainId.toString())
        
        return true
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
      alert('Failed to connect to MetaMask. Please try again.')
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null)
    setBalance('0')
    setChainId(null)
    setIsConnected(false)
    setProvider(null)
    setSigner(null)
  }

  // Update balance
  const updateBalance = async (web3Provider, accountAddress) => {
    try {
      const balance = await web3Provider.getBalance(accountAddress)
      const balanceInMatic = ethers.formatEther(balance)
      setBalance(parseFloat(balanceInMatic).toFixed(4))
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  // Switch to a specific network
  const switchNetwork = async (chainId) => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
      return true
    } catch (error) {
      // If the network is not added, try to add it
      if (error.code === 4902) {
        return await addPolygonNetwork()
      }
      console.error('Error switching network:', error)
      return false
    }
  }

  // Add a new network
  const addNetwork = async (networkConfig) => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      })
      return true
    } catch (error) {
      console.error('Error adding network:', error)
      return false
    }
  }

  // Add Polygon network
  const addPolygonNetwork = async (network = 'amoy') => {
    let networkConfig
    switch (network) {
      case 'amoy':
        networkConfig = POLYGON_AMOY
        break
      case 'mumbai':
        networkConfig = POLYGON_MUMBAI
        break
      case 'mainnet':
        networkConfig = POLYGON_NETWORK
        break
      default:
        networkConfig = POLYGON_AMOY
    }
    return await addNetwork(networkConfig)
  }

  // Switch to supported network
  const switchToSupportedNetwork = async (network = 'localhost') => {
    let chainId
    switch (network) {
      case 'localhost':
        chainId = 1337
        break
      case 'amoy':
        chainId = 80002
        break
      case 'mumbai':
        chainId = 80001
        break
      case 'mainnet':
        chainId = 137
        break
      default:
        chainId = 1337 // Default to localhost for development
    }
    return await switchNetwork(chainId)
  }

  // Check if connected to supported network
  const isSupportedNetwork = (chainId) => {
    return chainId === '137' || chainId === '0x89' || // Polygon Mainnet
           chainId === '80001' || chainId === '0x13881' || // Mumbai
           chainId === '80002' || chainId === '0x13882' || // Amoy
           chainId === '1337' || chainId === '0x539' // Localhost
  }

  // Sign a message
  const signMessage = async (message) => {
    if (!signer) return null

    try {
      const signature = await signer.signMessage(message)
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      return null
    }
  }

  // Send transaction
  const sendTransaction = async (to, value, data = '0x') => {
    if (!signer) return null

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(value.toString()),
        data
      })
      return tx
    } catch (error) {
      console.error('Error sending transaction:', error)
      return null
    }
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else if (accounts[0] !== account) {
          setAccount(accounts[0])
          if (provider) {
            updateBalance(provider, accounts[0])
          }
        }
      }

      const handleChainChanged = (chainId) => {
        setChainId(chainId)
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [account, provider])

  // Check if already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          })
          
          if (accounts.length > 0) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum)
            const web3Signer = await web3Provider.getSigner()
            
            setProvider(web3Provider)
            setSigner(web3Signer)
            setAccount(accounts[0])
            setIsConnected(true)
            
            await updateBalance(web3Provider, accounts[0])
            
            const network = await web3Provider.getNetwork()
            setChainId(network.chainId.toString())
          }
        } catch (error) {
          console.error('Error checking connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  const value = {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    updateBalance,
    switchNetwork,
    addNetwork,
    addPolygonNetwork,
    switchToSupportedNetwork,
    isSupportedNetwork,
    signMessage,
    sendTransaction,
    isMetaMaskInstalled
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
