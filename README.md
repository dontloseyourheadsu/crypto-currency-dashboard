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

- **Angular** 17+
- **RxJS** for real-time data streams
- **HttpClient** for API requests
- **Reactive Forms** for input control
- **Chart.js** via `ng2-charts` (or `ngx-charts`)
- **CoinGecko API** (free and public)

## 📦 Setup Instructions

```bash
git clone https://github.com/yourusername/angular-crypto-dashboard.git
cd angular-crypto-dashboard
npm install
ng serve
