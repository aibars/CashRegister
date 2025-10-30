import { ChangeResult, DenominationName, DENOMINATIONS, ChangeCalculationStrategy } from '../types';

/**
 * Strategy for calculating minimum change using greedy algorithm
 */
export class MinimumChangeStrategy implements ChangeCalculationStrategy {
  calculate(changeCents: number): ChangeResult {
    const change: ChangeResult = {};
    let remaining = changeCents;

    // Calculate minimum denominations using greedy approach
    for (const [name, value] of Object.entries(DENOMINATIONS) as Array<[DenominationName, number]>) {
      const count = Math.floor(remaining / value);
      if (count > 0) {
        change[name] = count;
        remaining -= count * value;
      }
    }

    return change;
  }
}

/**
 * Strategy for calculating random change distribution
 */
export class RandomChangeStrategy implements ChangeCalculationStrategy {
  calculate(changeCents: number): ChangeResult {
    const change: ChangeResult = {};
    let remaining = changeCents;

    // Randomly distribute denominations while ensuring we don't exceed the amount
    const denominations = Object.entries(DENOMINATIONS) as Array<[DenominationName, number]>;
    
    while (remaining > 0) {
      // Pick a random denomination that doesn't exceed remaining amount
      const validDenominations = denominations.filter(([, value]) => value <= remaining);
      
      if (validDenominations.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * validDenominations.length);
      const [name, value] = validDenominations[randomIndex]!;
      
      // Add one of this denomination
      change[name] = (change[name] || 0) + 1;
      remaining -= value;
    }

    return change;
  }
}

/**
 * Factory for creating change calculation strategies
 */
export class ChangeStrategyFactory {
  /**
   * Creates appropriate strategy based on change amount and configuration
   */
  static createStrategy(
    changeCents: number, 
    enableRandomMode: boolean = true, 
    randomModeDivisor: number = 3
  ): ChangeCalculationStrategy {
    if (enableRandomMode && changeCents % randomModeDivisor === 0) {
      return new RandomChangeStrategy();
    }
    return new MinimumChangeStrategy();
  }
  
  /**
   * Gets the strategy type name for logging/reporting
   */
  static getStrategyType(
    changeCents: number, 
    enableRandomMode: boolean = true, 
    randomModeDivisor: number = 3
  ): 'minimum' | 'random' {
    if (enableRandomMode && changeCents % randomModeDivisor === 0) {
      return 'random';
    }
    return 'minimum';
  }
}