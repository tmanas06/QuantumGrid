# 🔧 Update Your .env File

## 📝 **Current Issue:**
Your `.env` file needs to be updated to use the new format and your actual private key.

## 🎯 **What to Update:**

### **1. Change Variable Names**
Update your `.env` file to use these variable names:

```bash
# OLD FORMAT (remove these):
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/sPQ5G7F4BlKm17Y-DcCo0TURuWgDpRjS
ALCHEMY_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# NEW FORMAT (use these):
ALCHEMY_API_KEY=sPQ5G7F4BlKm17Y-DcCo0TURuWgDpRjS
```

### **2. Update Private Key**
Replace the placeholder with your actual private key:

```bash
# OLD (incorrect):
PRIVATE_KEY=your_private_key_here

# NEW (with your actual 64-character private key):
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12
```

## 🎯 **Your Complete .env File Should Look Like:**

```bash
# Hardhat Environment Configuration
ALCHEMY_API_KEY=sPQ5G7F4BlKm17Y-DcCo0TURuWgDpRjS
PRIVATE_KEY=your_actual_64_character_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
REPORT_GAS=false
```

## 🔍 **Steps to Update:**

1. **Open your `.env` file** in a text editor
2. **Replace** `ALCHEMY_AMOY_URL=...` with `ALCHEMY_API_KEY=sPQ5G7F4BlKm17Y-DcCo0TURuWgDpRjS`
3. **Replace** `PRIVATE_KEY=your_private_key_here` with your actual private key from MetaMask
4. **Save** the file
5. **Test** with: `node scripts/check-env.cjs`

## ✅ **After Update, Test:**
```bash
node scripts/check-env.cjs
```

You should see:
- ✅ ALCHEMY_API_KEY: Set
- ✅ Private key format looks correct!
- Length: 64 characters

## 🚀 **Then Deploy:**
```bash
npm run deploy:amoy
```

## 🎯 **Your Private Key Should Be:**
- **64 characters long** (without 0x prefix)
- **Only hexadecimal characters** (0-9, a-f)
- **From MetaMask** (Account Details > Export Private Key)
