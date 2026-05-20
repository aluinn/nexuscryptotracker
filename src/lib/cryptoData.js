export const CRYPTO_LIST = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'SOL', name: 'Solana', color: '#9945FF' },
  { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA' },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5' },
  { symbol: 'ADA', name: 'Cardano', color: '#0033AD' },
  { symbol: 'DOT', name: 'Polkadot', color: '#E6007A' },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142' },
  { symbol: 'ATOM', name: 'Cosmos', color: '#6F7390' },
  { symbol: 'XRP', name: 'XRP', color: '#00AAE4' },
  { symbol: 'BNB', name: 'BNB', color: '#F3BA2F' },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633' },
  { symbol: 'UNI', name: 'Uniswap', color: '#FF007A' },
  { symbol: 'AAVE', name: 'Aave', color: '#B6509E' },
  { symbol: 'ARB', name: 'Arbitrum', color: '#28A0F0' },
  { symbol: 'OP', name: 'Optimism', color: '#FF0420' },
  { symbol: 'NEAR', name: 'NEAR', color: '#00C08B' },
  { symbol: 'APT', name: 'Aptos', color: '#4CD9AC' },
  { symbol: 'SUI', name: 'Sui', color: '#6FBCF0' },
  { symbol: 'FIL', name: 'Filecoin', color: '#0090FF' },
];

export function getCryptoBySymbol(symbol) {
  return CRYPTO_LIST.find(c => c.symbol === symbol);
}

export function getCryptoColor(symbol) {
  const crypto = getCryptoBySymbol(symbol);
  return crypto?.color || '#8B5CF6';
}