// Exchange rate: 1 USD = 4,000 KHR (Cambodian Riel)
export const KHR_RATE = 4000;

/**
 * Format an amount that is stored in base USD.
 * If currency is '$', returns '$12.50' (or '$350' if whole).
 * If currency is '៛', multiplies by 4000 and formats as '50,000 ៛'.
 */
export function formatMoney(amountInUSD: number, currencySymbol: string = '$', includeDecimals: boolean = true): string {
  if (currencySymbol === '៛') {
    const khrVal = Math.round(amountInUSD * KHR_RATE);
    return `${khrVal.toLocaleString('en-US')} ៛`;
  }
  // USD ($)
  if (includeDecimals && amountInUSD % 1 !== 0) {
    return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${amountInUSD.toLocaleString('en-US')}`;
}

/**
 * Returns both primary and secondary conversions for dual-currency display.
 * e.g. primary: "$25.00", secondary: "100,000 ៛"
 */
export function getDualCurrency(amountInUSD: number, currencySymbol: string = '$'): { primary: string; secondary: string } {
  const usdStr = `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: amountInUSD % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}`;
  const khrStr = `${Math.round(amountInUSD * KHR_RATE).toLocaleString('en-US')} ៛`;

  if (currencySymbol === '៛') {
    return {
      primary: khrStr,
      secondary: usdStr,
    };
  }

  return {
    primary: usdStr,
    secondary: khrStr,
  };
}

/**
 * Convert user input into base USD amount based on active currency.
 * If active currency is '៛', divides by 4000.
 * If active currency is '$', returns the number directly.
 */
export function toBaseUSD(amountInput: number, currencySymbol: string = '$'): number {
  if (currencySymbol === '៛') {
    return amountInput / KHR_RATE;
  }
  return amountInput;
}

/**
 * Convert base USD amount into the active currency value.
 */
export function fromBaseUSD(amountInUSD: number, currencySymbol: string = '$'): number {
  if (currencySymbol === '៛') {
    return Math.round(amountInUSD * KHR_RATE);
  }
  return amountInUSD;
}

