import { CashRegisterService, FileProcessingService, CashRegisterConfig } from './services';
import { loadConfigFromEnv, displayConfig } from './utils/config';

/**
 * Main function - handles command line arguments and orchestrates the cash register system
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: npm run start <input_file> [output_file] [--no-random]');
    console.log('       npm run dev <input_file> [output_file] [--no-random]');
    console.log('');
    console.log('Examples:');
    console.log('  npm run start sample-input.txt');
    console.log('  npm run start sample-input.txt output.txt');
    console.log('  npm run start sample-input.txt output.txt --no-random');
    process.exit(1);
  }
  
  const inputFile = args[0]!;
  const outputFile = args[1] || 'output.txt';
  
  // Load configuration from environment variables (.env file)
  const config: CashRegisterConfig = loadConfigFromEnv();
  
  // Override with command line arguments if provided
  if (args.includes('--no-random')) {
    config.enableRandomMode = false;
  }
  
  // Display configuration in development mode
  displayConfig(config);
  
  try {
    // Initialize services
    const cashRegisterService = new CashRegisterService(config);
    const fileProcessingService = new FileProcessingService(cashRegisterService);
    
    // Validate file paths
    fileProcessingService.validateFilePaths(inputFile, outputFile);
    
    // Process the file
    await fileProcessingService.processFile({
      inputPath: inputFile,
      outputPath: outputFile,
      config
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error:', errorMessage);
    process.exit(1);
  }
}

export * from './services';
