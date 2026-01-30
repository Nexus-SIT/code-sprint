const axios = require("axios");
const fs = require("fs");
const path = require("path");

const charts = [
  { symbol: "RELIANCE.NS", name: "reliance_uptrend" },
  { symbol: "TATAMOTORS.NS", name: "tatamotors_downtrend" },
  { symbol: "HDFCBANK.NS", name: "hdfcbank_range" }
];

// Add delay between requests to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCharts() {
  // Ensure the output directory exists
  const outputDir = path.join(__dirname, "../data/charts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const chart of charts) {
    console.log(`Fetching ${chart.symbol}...`);
    
    try {
      // Try 5-minute interval first
      let url = `https://query1.finance.yahoo.com/v8/finance/chart/${chart.symbol}?interval=5m&range=1d`;
      
      let res;
      try {
        res = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`  5m interval not available, trying 1d interval...`);
          // Fallback to daily data
          url = `https://query1.finance.yahoo.com/v8/finance/chart/${chart.symbol}?interval=1d&range=1mo`;
          res = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
        } else {
          throw error;
        }
      }

      const result = res.data.chart.result[0];
      
      if (!result || !result.timestamp) {
        console.error(`  No data available for ${chart.symbol}`);
        continue;
      }

      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];

      const formatted = timestamps.map((t, i) => ({
        index: i,
        time: new Date(t * 1000).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }),
        date: new Date(t * 1000).toLocaleDateString("en-IN"),
        open: quotes.open[i] ? Number(quotes.open[i].toFixed(2)) : null,
        high: quotes.high[i] ? Number(quotes.high[i].toFixed(2)) : null,
        low: quotes.low[i] ? Number(quotes.low[i].toFixed(2)) : null,
        close: quotes.close[i] ? Number(quotes.close[i].toFixed(2)) : null,
        volume: quotes.volume[i] || 0
      })).filter(item => item.close !== null); // Remove null entries

      const filePath = path.join(outputDir, `${chart.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2));
      console.log(`  ✓ Saved ${chart.name} (${formatted.length} data points)`);
      
      // Wait 1 second between requests to avoid rate limiting
      await delay(1000);
      
    } catch (error) {
      console.error(`  ✗ Error fetching ${chart.symbol}:`, error.message);
      if (error.response) {
        console.error(`    Status: ${error.response.status}`);
        console.error(`    Response:`, error.response.data);
      }
    }
  }
  
  console.log("\nAll done!");
}

fetchCharts().catch(console.error);