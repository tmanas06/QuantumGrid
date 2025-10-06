// Alchemy Configuration for Polygon Amoy Testnet

// Replace 'YOUR_ALCHEMY_API_KEY' with your actual Alchemy API key
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || 'YOUR_ALCHEMY_API_KEY'

// Network configurations
export const NETWORK_CONFIGS = {
  // Polygon Amoy Testnet (Recommended)
  amoy: {
    chainId: 80002,
    chainIdHex: '0x13882',
    name: 'Polygon Amoy Testnet',
    rpcUrl: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://amoy.polygonscan.com',
    faucetUrl: 'https://faucet.polygon.technology/',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    }
  },
  
  // Polygon Mumbai Testnet (Legacy)
  mumbai: {
    chainId: 80001,
    chainIdHex: '0x13881',
    name: 'Polygon Mumbai Testnet',
    rpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://mumbai.polygonscan.com',
    faucetUrl: 'https://faucet.polygon.technology/',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    }
  },
  
  // Polygon Mainnet
  mainnet: {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon Mainnet',
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    }
  }
}

// Default network (Amoy for testing)
export const DEFAULT_NETWORK = 'amoy'

// Get network configuration
export const getNetworkConfig = (network = DEFAULT_NETWORK) => {
  return NETWORK_CONFIGS[network] || NETWORK_CONFIGS[DEFAULT_NETWORK]
}

// Check if Alchemy API key is configured
export const isAlchemyConfigured = () => {
  return ALCHEMY_API_KEY !== 'YOUR_ALCHEMY_API_KEY' && ALCHEMY_API_KEY.length > 0
}

// Get RPC URL for a specific network
export const getRpcUrl = (network = DEFAULT_NETWORK) => {
  const config = getNetworkConfig(network)
  return config.rpcUrl
}

// Get explorer URL for a specific network
export const getExplorerUrl = (network = DEFAULT_NETWORK) => {
  const config = getNetworkConfig(network)
  return config.explorerUrl
}

// Get faucet URL for testnets
export const getFaucetUrl = (network = DEFAULT_NETWORK) => {
  const config = getNetworkConfig(network)
  return config.faucetUrl
}
