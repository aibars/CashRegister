/**
 * Converts dollars to cents to avoid floating point precision issues
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Converts cents to dollars for display purposes
 * @param cents - Amount in cents
 * @returns Amount in dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Validates that a number is a valid monetary amount
 * @param value - Value to validate
 * @returns True if valid monetary amount
 */
export function isValidMonetaryAmount(value: number): boolean {
  return !isNaN(value) && isFinite(value) && value >= 0;
}

/**
 * Rounds a monetary amount to two decimal places
 * @param amount - Amount to round
 * @returns Rounded amount
 */
export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}