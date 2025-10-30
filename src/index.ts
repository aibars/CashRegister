import * as fs from 'fs';
import * as path from 'path';

/**
 * Currency denominations in cents
 */
const DENOMINATIONS = {
  dollar: 100,
  quarter: 25,
  dime: 10,
  nickel: 5,
  penny: 1
} as const;

/**
 * Type for denomination names
 */
type DenominationName = keyof typeof DENOMINATIONS;

/**
 * Type for change calculation result
 */
type ChangeResult = Partial<Record<DenominationName, number>>;

/**
 * Converts dollars to cents to avoid floating point precision issues
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Calculates change using minimum number of denominations
 * @param changeCents - Change amount in cents
 * @returns Object with denomination counts
 */
function calculateMinimumChange(changeCents: number): ChangeResult {
  const change: ChangeResult = {};
  let remaining = changeCents;

  // Calculate minimum denominations
  for (const [name, value] of Object.entries(DENOMINATIONS) as Array<[DenominationName, number]>) {
    const count = Math.floor(remaining / value);
    if (count > 0) {
      change[name] = count;
      remaining -= count * value;
    }
  }

  return change;
}

/**
 * Calculates change using random distribution when divisible by 3
 * @param changeCents - Change amount in cents
 * @returns Object with denomination counts
 */
function calculateRandomChange(changeCents: number): ChangeResult {
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

/**
 * Formats change object into readable string
 * @param change - Object with denomination counts
 * @returns Formatted change string
 */
function formatChange(change: ChangeResult): string {
  const parts: string[] = [];
  
  // Order denominations from highest to lowest value
  const orderedDenominations: DenominationName[] = ['dollar', 'quarter', 'dime', 'nickel', 'penny'];
  
  for (const denomination of orderedDenominations) {
    const count = change[denomination];
    if (count && count > 0) {
      const plural = count === 1 ? denomination : `${denomination}s`;
      // Handle special case for penny -> pennies
      const displayName = denomination === 'penny' && count > 1 ? 'pennies' : plural;
      parts.push(`${count} ${displayName}`);
    }
  }
  
  return parts.join(',');
}

/**
 * Processes a single line of input (amount_owed,amount_paid)
 * @param line - Input line
 * @returns Formatted change output
 */
function processLine(line: string): string {
  const parts = line.trim().split(',');
  if (parts.length !== 2) {
    throw new Error(`Invalid line format: ${line}`);
  }
  
  const [owedStr, paidStr] = parts;
  const owed = parseFloat(owedStr!);
  const paid = parseFloat(paidStr!);
  
  if (isNaN(owed) || isNaN(paid)) {
    throw new Error(`Invalid numeric values in line: ${line}`);
  }
  
  const changeDollars = paid - owed;
  const changeCents = dollarsToCents(changeDollars);
  
  if (changeCents === 0) {
    return 'No change';
  }
  
  if (changeCents < 0) {
    throw new Error(`Insufficient payment in line: ${line}`);
  }
  
  let change: ChangeResult;
  
  // Check if change is divisible by 3 (in cents)
  if (changeCents % 3 === 0) {
    change = calculateRandomChange(changeCents);
  } else {
    change = calculateMinimumChange(changeCents);
  }
  
  return formatChange(change);
}

/**
 * Processes input file and generates output
 * @param inputFilePath - Path to input file
 * @param outputFilePath - Path to output file
 */
function processFile(inputFilePath: string, outputFilePath: string): void {
  try {
    const inputData = fs.readFileSync(inputFilePath, 'utf8');
    const lines = inputData.trim().split('\n').filter((line: string) => line.trim());
    
    const results = lines.map((line: string, index: number) => {
      try {
        return processLine(line);
      } catch (error) {
        throw new Error(`Error processing line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    
    fs.writeFileSync(outputFilePath, results.join('\n') + '\n');
    console.log(`Processing complete. Output written to: ${outputFilePath}`);
    
  } catch (error) {
    console.error('Error processing file:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Main function - handles command line arguments
 */
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: npm run start <input_file> [output_file]');
    console.log('       npm run dev <input_file> [output_file]');
    console.log('Example: npm run start sample-input.txt output.txt');
    process.exit(1);
  }
  
  const inputFile = args[0]!;
  const outputFile = args[1] || 'output.txt';
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }
  
  processFile(inputFile, outputFile);
}

// Export functions for testing
export {
  dollarsToCents,
  calculateMinimumChange,
  calculateRandomChange,
  formatChange,
  processLine,
  processFile,
  type DenominationName,
  type ChangeResult
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}