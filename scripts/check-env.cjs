require('dotenv').config();

console.log("🔍 Checking environment variables...");
console.log("ALCHEMY_API_KEY:", process.env.ALCHEMY_API_KEY ? "✅ Set" : "❌ Not set");
console.log("PRIVATE_KEY length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : "❌ Not set");
console.log("PRIVATE_KEY starts with 0x:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.startsWith('0x') : "❌ Not set");

if (process.env.PRIVATE_KEY) {
  console.log("PRIVATE_KEY first 10 chars:", process.env.PRIVATE_KEY.substring(0, 10) + "...");
  
  // Check if it's 64 characters (without 0x) or 66 characters (with 0x)
  const is64Chars = process.env.PRIVATE_KEY.length === 64 && !process.env.PRIVATE_KEY.startsWith('0x');
  const is66Chars = process.env.PRIVATE_KEY.length === 66 && process.env.PRIVATE_KEY.startsWith('0x');
  
  console.log("Expected length: 64 characters (without 0x) OR 66 characters (with 0x)");
  console.log("Your length:", process.env.PRIVATE_KEY.length);
  
  if (is64Chars || is66Chars) {
    console.log("✅ Private key format looks correct!");
    if (is64Chars) {
      console.log("   - 64 characters without 0x prefix (MetaMask format)");
    } else {
      console.log("   - 66 characters with 0x prefix");
    }
  } else {
    console.log("❌ Private key format is incorrect!");
    console.log("   - Should be 64 characters (without 0x) OR 66 characters (with 0x)");
    console.log("   - Should contain only hexadecimal characters (0-9, a-f)");
  }
} else {
  console.log("❌ PRIVATE_KEY is not set!");
}
