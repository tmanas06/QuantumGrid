#!/bin/bash

echo "🚀 Starting Enhanced Quantum Grid Local Development Environment..."
echo

echo "📡 Starting Hardhat node in background..."
npx hardhat node &
NODE_PID=$!

echo "⏳ Waiting for Hardhat node to start..."
sleep 8

echo "✅ Hardhat node started on http://127.0.0.1:8545"
echo

echo "📝 Deploying Enhanced QuantumGrid contract..."
npx hardhat run scripts/deploy-local.js --network localhost

echo
echo "🎉 Local development environment is ready!"
echo
echo "📋 Next Steps:"
echo "1. Start the frontend: npm run dev"
echo "2. Configure MetaMask:"
echo "   - Network Name: Localhost"
echo "   - RPC URL: http://127.0.0.1:8545"
echo "   - Chain ID: 31337"
echo "   - Currency Symbol: ETH"
echo "3. Import test accounts from the deployment output above"
echo "4. Start playing the Enhanced Quantum Grid game!"
echo
echo "🏦 Testnet Bank Commands:"
echo "   npm run bank:stats <CONTRACT_ADDRESS>"
echo "   npm run bank:daily <CONTRACT_ADDRESS>"
echo "   npm run bank:weekly <CONTRACT_ADDRESS>"
echo
echo "🧪 Testing Commands:"
echo "   npm run test:local <CONTRACT_ADDRESS>"
echo
echo "📚 Documentation:"
echo "   - LOCAL_TESTING_GUIDE.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo
echo "💡 Tips:"
echo "   - The Hardhat node will continue running in the background"
echo "   - Press Ctrl+C to stop the local environment"
echo "   - Check the deployment output above for contract address and test accounts"
echo

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Shutting down local development environment..."
    kill $NODE_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running
wait
