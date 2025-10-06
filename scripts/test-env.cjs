require('dotenv').config();

console.log("🔍 Testing environment variables...");
console.log("ALCHEMY_AMOY_URL:", process.env.ALCHEMY_AMOY_URL ? "✅ Set" : "❌ Not set");
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "✅ Set" : "❌ Not set");
console.log("POLYGONSCAN_API_KEY:", process.env.POLYGONSCAN_API_KEY ? "✅ Set" : "❌ Not set");

if (process.env.ALCHEMY_AMOY_URL && process.env.PRIVATE_KEY) {
  console.log("✅ Environment looks good for deployment!");
} else {
  console.log("❌ Missing required environment variables!");
}
