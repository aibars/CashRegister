import * as fs from 'fs';
import { FileProcessingOptions, ParsedTransaction, TransactionResult } from '../types';
import { parseTransactionLine } from '../utils/parser';
import { CashRegisterService } from './cash-register';

/**
 * Service for handling file input/output operations
 */
export class FileProcessingService {
  private cashRegisterService: CashRegisterService;

  constructor(cashRegisterService: CashRegisterService) {
    this.cashRegisterService = cashRegisterService;
  }

  /**
   * Processes input file and generates output
   */
  async processFile(options: FileProcessingOptions): Promise<TransactionResult[]> {
    try {
      // Read and parse input file
      const transactions = await this.readAndParseFile(options.inputPath);
      
      // Process transactions
      const results = this.cashRegisterService.processTransactions(transactions);
      
      // Write output file
      await this.writeResultsFile(options.outputPath, results);
      
      console.log(`Processing complete. Output written to: ${options.outputPath}`);
      return results;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error processing file:', errorMessage);
      throw new Error(`File processing failed: ${errorMessage}`);
    }
  }

  /**
   * Reads and parses transactions from input file
   */
  private async readAndParseFile(inputPath: string): Promise<ParsedTransaction[]> {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const inputData = fs.readFileSync(inputPath, 'utf8');
    const lines = inputData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('Input file is empty');
    }

    const transactions: ParsedTransaction[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      try {
        const transaction = parseTransactionLine(lines[i]!, i + 1);
        transactions.push(transaction);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`${errorMessage}`);
      }
    }

    return transactions;
  }

  /**
   * Writes transaction results to output file
   * @param outputPath - Path to output file
   * @param results - Transaction results to write
   */
  private async writeResultsFile(outputPath: string, results: TransactionResult[]): Promise<void> {
    const formattedResults = results.map(result => 
      this.cashRegisterService.formatResult(result)
    );
    
    const outputContent = formattedResults.join('\n') + '\n';
    
    try {
      fs.writeFileSync(outputPath, outputContent, 'utf8');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write output file: ${errorMessage}`);
    }
  }

  /**
   * Validates file paths and permissions
   * @param inputPath - Input file path
   * @param outputPath - Output file path
   */
  validateFilePaths(inputPath: string, outputPath: string): void {
    if (!inputPath || !inputPath.trim()) {
      throw new Error('Input file path is required');
    }

    if (!outputPath || !outputPath.trim()) {
      throw new Error('Output file path is required');
    }

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }

    // Check if input file is readable
    try {
      fs.accessSync(inputPath, fs.constants.R_OK);
    } catch {
      throw new Error(`Input file is not readable: ${inputPath}`);
    }

    // Check if output directory exists and is writable
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    if (outputDir && !fs.existsSync(outputDir)) {
      throw new Error(`Output directory does not exist: ${outputDir}`);
    }
  }
}