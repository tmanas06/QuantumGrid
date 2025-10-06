import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
dotenv.config();

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

// Validate environment variables
if (!ALCHEMY_API_KEY || ALCHEMY_API_KEY === 'your_alchemy_api_key_here') {
  console.warn('⚠️  ALCHEMY_API_KEY not set. Some networks may not work.');
}

if (!PRIVATE_KEY || PRIVATE_KEY === 'your_private_key_here') {
  console.warn('⚠️  PRIVATE_KEY not set. Some networks may not work.');
}

export default {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 1000, // Mine a new block every 1 second
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      // Use default Hardhat accounts for localhost
    },
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY || 'demo'}`,
      accounts: (PRIVATE_KEY && PRIVATE_KEY !== 'your_private_key_here' && PRIVATE_KEY.length === 64) 
        ? [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`] 
        : [],
      chainId: 80002,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY || 'demo'}`,
      accounts: (PRIVATE_KEY && PRIVATE_KEY !== 'your_private_key_here' && PRIVATE_KEY.length === 64) 
        ? [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`] 
        : [],
      chainId: 80001,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY || 'demo'}`,
      accounts: (PRIVATE_KEY && PRIVATE_KEY !== 'your_private_key_here' && PRIVATE_KEY.length === 64) 
        ? [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`] 
        : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
