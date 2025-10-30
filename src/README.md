
### Command Line Interface

```bash
# Basic usage
npm run start <input_file> [output_file]

# Development mode
npm run dev <input_file> [output_file]

# Disable random mode (always use minimum change)
npm run dev <input_file> [output_file] --no-random
```

**Examples:**
```bash
# Process with default settings (random mode enabled)
npm run start sample-input.txt

# Specify custom output file
npm run start sample-input.txt results.txt

# Disable random mode for consistent results
npm run start sample-input.txt output.txt --no-random
```

### Output Format

The application now uses a single, clean output format:

```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,2 quarters,1 dime,1 nickel,2 pennies
```

**Behavior:**
- **Default**: Uses random denomination distribution when change is divisible by 3
- **With `--no-random`**: Always uses minimum denominations (greedy algorithm)

### **🧪 Comprehensive Testing**

The test suite includes:
- **Unit Tests**: Individual function testing
- **Integration Tests**: End-to-end workflow testing  
- **Strategy Tests**: Change calculation algorithm verification
- **Service Tests**: Business logic validation
- **Error Handling Tests**: Edge case and error scenario testing

Run tests with:
```bash
npm run test      # Compiled version
npm run test:dev  # Development version
```

## Features

- **File Processing**: Reads input files with owed and paid amounts
- **Minimum Change**: Calculates optimal change using minimum denominations
- **Random Mode**: When change amount (in cents) is divisible by 3, randomly distributes denominations
- **Type Safety**: Written in TypeScript with comprehensive type definitions
- **Error Handling**: Proper error handling for file operations and invalid input
- **Flexible Output**: Configurable output file location

## Currency Denominations

- Dollar: $1.00 (100 cents)
- Quarter: $0.25 (25 cents)
- Dime: $0.10 (10 cents)
- Nickel: $0.05 (5 cents)
- Penny: $0.01 (1 cent)

## Usage

### Command Line

```bash
# Production mode (compiled)
npm run start <input_file> [output_file]

# Development mode (ts-node)
npm run dev <input_file> [output_file]
```

**Examples:**
```bash
# Basic usage - outputs to output.txt
npm run start sample-input.txt
npm run dev sample-input.txt

# Specify custom output file
npm run start sample-input.txt results.txt
npm run dev sample-input.txt results.txt
```

### Environment Configuration (.env)

Configure the application using environment variables:

1. Copy the sample configuration:
   ```bash
   cp .env.sample .env
   ```

2. Edit `.env` with your settings:
   ```bash
   # Cash Register Configuration
   RANDOM_DIVISOR=3          # Change amount divisible by this triggers random mode
   ENABLE_RANDOM_MODE=true   # Enable/disable random mode entirely
   OUTPUT_FORMAT=standard    # Output format (standard, json, verbose)
   NODE_ENV=development      # Environment (development, production, test)
   ```

3. Run with environment configuration:
   ```bash
   npm run start sample-input.txt  # Uses .env settings
   ```

### Input Format

Each line in the input file should contain: `amount_owed,amount_paid`

**Example input file:**
```
2.12,3.00
1.97,2.00
3.33,5.00
```

### Output Format

Change denominations separated by commas, ordered from highest to lowest value.

**Example output:**
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,2 quarters,1 dime,1 nickel,2 pennies
```

## Development

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

```bash
npm install
```

### Building

```bash
# Compile TypeScript to JavaScript
npm run build

# Clean compiled files
npm run clean
```

### Testing

```bash
# Run tests (compiled)
npm test

# Run tests in development mode
npm run test:dev
```

## Project Structure

```
cash-register/
├── src/
│   ├── index.ts           # Main application (TypeScript)
│   ├── services/          # Business logic layer
│   ├── tests/             # Test suite
│   │   └── test.ts        # Comprehensive tests
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── dist/                  # Compiled JavaScript (generated)
├── sample-input.txt       # Sample input file
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # Documentation
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Build and run the application
- `npm run dev`: Run the application in development mode (ts-node)
- `npm test`: Build and run tests
- `npm run test:dev`: Run tests in development mode
- `npm run clean`: Remove compiled files