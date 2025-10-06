// Environment Configuration
// Copy this file to .env.local and update with your values

export const ENV_CONFIG = {
  // Alchemy API Key - Get from https://dashboard.alchemy.com/
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || 'YOUR_ALCHEMY_API_KEY',
  
  // Default Network
  DEFAULT_NETWORK: import.meta.env.VITE_DEFAULT_NETWORK || 'amoy',
  
  // Contract Addresses (update after deployment)
  CONTRACT_ADDRESSES: {
    amoy: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_AMOY || '0x...',
    mumbai: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_MUMBAI || '0x...',
    mainnet: import.meta.env.VITE_QUANTUM_GRID_CONTRACT_MAINNET || '0x...'
  },
  
  // House Configuration
  HOUSE_BALANCE: parseFloat(import.meta.env.VITE_HOUSE_BALANCE || '100'),
  HOUSE_FEE: parseFloat(import.meta.env.VITE_HOUSE_FEE || '0.05'),
  
  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD
}

// Validate configuration
export const validateConfig = () => {
  const errors = []
  
  if (ENV_CONFIG.ALCHEMY_API_KEY === 'YOUR_ALCHEMY_API_KEY') {
    errors.push('Please set your Alchemy API key in environment variables')
  }
  
  if (!ENV_CONFIG.CONTRACT_ADDRESSES[ENV_CONFIG.DEFAULT_NETWORK] || 
      ENV_CONFIG.CONTRACT_ADDRESSES[ENV_CONFIG.DEFAULT_NETWORK] === '0x...') {
    errors.push('Please set contract address for the default network')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default ENV_CONFIG
