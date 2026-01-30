import { Candle } from '../types';

export const generateCandles = (count: number, startPrice: number = 100): Candle[] => {
  let currentPrice = startPrice;
  const candles: Candle[] = [];

  for (let i = 0; i < count; i++) {
    const volatility = currentPrice * 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5);

    candles.push({
      time: i,
      open,
      high,
      low,
      close,
    });

    currentPrice = close;
  }

  return candles;
};