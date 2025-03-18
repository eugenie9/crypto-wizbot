# Crypto WizBot

A powerful Telegram bot for cryptocurrency tracking, analysis, and charting. Crypto WizBot provides real-time price information, technical analysis, market data visualization, and more.

## Features

- **Real-time Price Tracking**: Get instant price updates for cryptocurrencies
- **Technical Analysis**: Receive TA reports for various trading pairs and timeframes
- **Chart Generation**: Create visual charts with customizable timeframes and indicators
- **Market Depth**: View order book information for trading pairs
- **Market Cap Analysis**: Track top cryptocurrency market dominance
- **Heat Maps**: Visual representation of market performance
- **Trending Coins**: Discover trending cryptocurrencies from CoinGecko
- **Fear & Greed Index**: Monitor market sentiment with historical comparisons
- **TradingView Integration**: Get TradingView charts with various indicators

## Commands

- `/chart`, `/c` - Create price charts for specific pairs and intervals
- `/tv` - Generate TradingView charts with custom indicators
- `/ta` - Get technical analysis reports
- `/heat`, `/hmap` - View market heat maps
- `/price`, `/p` - Check daily price information
- `/mprice`, `/mp` - Compare prices of multiple cryptocurrencies
- `/depth`, `/d` - View market depth (order book)
- `/bfund`, `/bf` - Check Binance funding information
- `/mcap` - View top 10 market cap dominance
- `/trending`, `/trend` - See trending coins on CoinGecko
- `/info`, `/i` - Get detailed information about a specific cryptocurrency
- `/fear`, `/fgi` - View the Crypto Fear & Greed Index
- `/help`, `/h` - Show list of available commands

## Installation

1. Clone the repository
   ```
   git clone https://github.com/eugenie9/crypto-wizbot.git
   cd crypto-wizbot
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up your configuration
   ```
   cp config.sample.js config.js
   ```
   Then edit `config.js` with your own Telegram bot token and other settings.

4. Start the bot
   ```
   node main.js
   ```

## Configuration

Create a `config.js` file with the following structure:

```javascript
module.exports = {
  botToken: "YOUR_TELEGRAM_BOT_TOKEN",
  superuser: YOUR_TELEGRAM_USER_ID
};
```

## Dependencies

- Node.js
- AnyChart & AnyChart-Node
- Axios
- Chart.js & ChartJS-Node-Canvas
- jsdom
- LowDB
- Node-Binance-API
- Node-Telegram-Bot-API
- Playwright

## Contributing

Pull requests are welcomed and encouraged! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
