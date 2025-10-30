/**
 * Currency denominations in cents
 */
export const DENOMINATIONS = {
  dollar: 100,
  quarter: 25,
  dime: 10,
  nickel: 5,
  penny: 1
} as const;

/**
 * Type for denomination names
 */
export type DenominationName = keyof typeof DENOMINATIONS;

/**
 * Type for change calculation result
 */
export type ChangeResult = Partial<Record<DenominationName, number>>;

/**
 * Interface for transaction input
 */
export interface Transaction {
  amountOwed: number;
  amountPaid: number;
}

/**
 * Interface for parsed transaction line
 */
export interface ParsedTransaction extends Transaction {
  changeDue: number;
}

/**
 * Interface for change calculation strategy
 */
export interface ChangeCalculationStrategy {
  calculate(changeCents: number): ChangeResult;
}

/**
 * Configuration for the cash register service
 */
export interface CashRegisterConfig {
  enableRandomMode: boolean;
  randomModeDivisor: number;
  outputFormat: 'standard' | 'json' | 'verbose';
}

/**
 * Result of processing a transaction
 */
export interface TransactionResult {
  transaction: ParsedTransaction;
  change: ChangeResult;
  formattedChange: string;
  strategy: 'minimum' | 'random';
}

/**
 * File processing options
 */
export interface FileProcessingOptions {
  inputPath: string;
  outputPath: string;
  config: CashRegisterConfig;
}