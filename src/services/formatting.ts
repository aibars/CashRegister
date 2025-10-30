import { ChangeResult, DenominationName, CashRegisterConfig, TransactionResult } from '../types';

/**
 * Service for formatting change output in various formats
 */
export class FormattingService {
  static formatStandard(change: ChangeResult): string {
    if (this.isEmptyChange(change)) {
      return 'No change';
    }

    const parts: string[] = [];
    
    // Order denominations from highest to lowest value
    const orderedDenominations: DenominationName[] = ['dollar', 'quarter', 'dime', 'nickel', 'penny'];
    
    for (const denomination of orderedDenominations) {
      const count = change[denomination];
      if (count && count > 0) {
        const displayName = this.getDenominationDisplayName(denomination, count);
        parts.push(`${count} ${displayName}`);
      }
    }
    
    return parts.join(',');
  }

  static formatJson(change: ChangeResult): string {
    return JSON.stringify(change, null, 2);
  }

  /**
   * Formats change result with verbose details
   * @param transactionResult - Complete transaction result
   * @returns Verbose formatted string
   */
  static formatVerbose(transactionResult: TransactionResult): string {
    const { transaction, change, formattedChange, strategy } = transactionResult;
    
    const lines = [
      `Transaction: $${transaction.amountOwed.toFixed(2)} owed, $${transaction.amountPaid.toFixed(2)} paid`,
      `Change Due: $${(transaction.changeDue / 100).toFixed(2)}`,
      `Strategy: ${strategy}`,
      `Denominations: ${formattedChange}`
    ];
    
    return lines.join(' | ');
  }

  /**
   * Formats output based on configuration
   * @param transactionResult - Transaction result to format
   * @param config - Configuration specifying format type
   * @returns Formatted string
   */
  static format(transactionResult: TransactionResult, config: CashRegisterConfig): string {
    switch (config.outputFormat) {
      case 'json':
        return this.formatJson(transactionResult.change);
      case 'verbose':
        return this.formatVerbose(transactionResult);
      case 'standard':
      default:
        return transactionResult.formattedChange;
    }
  }

  /**
   * Gets the proper display name for a denomination
   * @param denomination - Denomination name
   * @param count - Count of denominations
   * @returns Display name (singular/plural)
   */
  private static getDenominationDisplayName(denomination: DenominationName, count: number): string {
    if (count === 1) {
      return denomination;
    }
    
    // Handle special case for penny -> pennies
    if (denomination === 'penny') {
      return 'pennies';
    }
    
    return `${denomination}s`;
  }

  /**
   * Checks if change result is empty (no change due)
   */
  private static isEmptyChange(change: ChangeResult): boolean {
    return Object.values(change).every(count => !count || count === 0);
  }
}