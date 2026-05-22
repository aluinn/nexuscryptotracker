export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
];

export function getDefaultCurrency() {
  const saved = localStorage.getItem('nexus_currency');
  if (saved) return saved;
  const lang = navigator.language || 'en-US';
  if (lang.includes('-GB') || lang === 'en-gb') return 'GBP';
  if (/^(de|fr|it|es|nl|pt-PT|fi|sv-SE|nb|da|pl)/.test(lang)) return 'EUR';
  if (lang.includes('-AU')) return 'AUD';
  if (lang.includes('-CA')) return 'CAD';
  if (lang.includes('-NZ')) return 'NZD';
  if (lang.includes('-IN')) return 'INR';
  if (lang.startsWith('ja')) return 'JPY';
  if (lang.startsWith('ko')) return 'KRW';
  if (lang.startsWith('zh')) return 'HKD';
  return 'USD';
}

export function saveCurrency(code) {
  localStorage.setItem('nexus_currency', code);
}

export function getCurrencyInfo(code) {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}