import { ParsedTransaction, TransactionResult, CashRegisterConfig } from '../types';
import { ChangeStrategyFactory } from './change-strategy';
import { FormattingService } from './formatting';

/**
 * Main cash register service for processing transactions
 */
export class CashRegisterService {
  private config: CashRegisterConfig;

  constructor(config: Partial<CashRegisterConfig> = {}) {
    this.config = {
      enableRandomMode: true,
      randomModeDivisor: 3,
      outputFormat: 'standard',
      ...config
    };
  }

  processTransaction(transaction: ParsedTransaction): TransactionResult {
    if (transaction.changeDue === 0) {
      return {
        transaction,
        change: {},
        formattedChange: 'No change',
        strategy: 'minimum'
      };
    }

    // Determine strategy and calculate change
    const strategy = ChangeStrategyFactory.createStrategy(
      transaction.changeDue,
      this.config.enableRandomMode,
      this.config.randomModeDivisor
    );
    
    const strategyType = ChangeStrategyFactory.getStrategyType(
      transaction.changeDue,
      this.config.enableRandomMode,
      this.config.randomModeDivisor
    );

    const change = strategy.calculate(transaction.changeDue);
    const formattedChange = FormattingService.formatStandard(change);

    return {
      transaction,
      change,
      formattedChange,
      strategy: strategyType
    };
  }

  processTransactions(transactions: ParsedTransaction[]): TransactionResult[] {
    return transactions.map(transaction => this.processTransaction(transaction));
  }

  updateConfig(newConfig: Partial<CashRegisterConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): CashRegisterConfig {
    return { ...this.config };
  }

  formatResult(result: TransactionResult): string {
    return FormattingService.format(result, this.config);
  }
}