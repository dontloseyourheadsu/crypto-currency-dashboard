# 🧭 Angular Real-Time Cryptocurrency Dashboard

A modern real-time cryptocurrency dashboard built with Angular and RxJS. This project fetches live market data from the CoinGecko API and displays it using interactive charts and tables. Perfect for practicing real-world Angular patterns like HTTP communication, reactive forms, observable streams, and chart integration.

![screenshot](screenshot.png) <!-- Replace with actual screenshot -->

## 🚀 Features

- 🔍 Select and view real-time data for major cryptocurrencies (e.g., Bitcoin, Ethereum).
- 📈 Live price chart with auto-refresh every minute.
- 💹 Market stats: current price, 24h change, market cap, volume.
- 📊 Comparison table for multiple selected coins.
- 🌗 Toggle dark mode for a polished user experience.
- 📱 Responsive UI for mobile and desktop.

## 🛠️ Tech Stack

- **Angular** 20+
- **RxJS** for real-time data streams
- **HttpClient** for API requests
- **Angular Material** for UI components
- **CoinGecko API** (free and public)

## 📦 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- CoinGecko API Key (free from [CoinGecko](https://www.coingecko.com/en/api))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/angular-crypto-dashboard.git
cd angular-crypto-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

   Create a local environment file with your API key:

   ```bash
   cp src/environments/environment.ts src/environments/environment.local.ts
   ```

   Then edit `src/environments/environment.local.ts` and add your CoinGecko API key:

   ```typescript
   export const environment = {
     production: false,
     coinGeckoApiKey: "YOUR_COINGECKO_API_KEY_HERE",
     coinGeckoBaseUrl: "https://api.coingecko.com/api/v3",
   };
   ```

4. **Start the development server**

```bash
npm start
```

5. **Open your browser**
   Navigate to `http://localhost:4200`

### Important Security Notes

- 🔒 **Never commit API keys to git**: The `environment.local.ts` file is gitignored to prevent accidentally committing sensitive data
- 🛡️ **Use environment variables in production**: For production deployments, use proper environment variable management
- 🔑 **API Key Management**: Keep your CoinGecko API key secure and never share it publicly

## 📋 API Usage

This app uses the CoinGecko API with the following endpoints:

- `/coins/markets` - Get top coins with market data
- `/simple/price` - Get current prices for selected coins
- `/search/trending` - Get trending coins

**Rate Limiting**: The free tier has 60-second cache updates, and the app automatically manages API calls to stay within limits.
