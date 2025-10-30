# Cash Register Application

A TypeScript/NodeJS application that processes flat files to calculate change denominations for a cash register system with a special twist - when change is divisible by 3, it uses random denomination distribution.

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

## How It Works

1. **Parse Input**: Reads each line and extracts owed and paid amounts
2. **Calculate Change**: Determines change amount in cents to avoid floating-point issues
3. **Check Divisibility**: If change (in cents) is divisible by 3, uses random distribution
4. **Generate Output**: Formats denominations into readable string
5. **Write Results**: Saves output to specified file

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
│   └── test.ts            # Test suite (TypeScript)
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

## VS Code Tasks

The project includes VS Code tasks for easy development:
- **Build TypeScript**: Compiles the TypeScript code
- **Run Cash Register (TS)**: Builds and runs the application
- **Run Cash Register (Dev)**: Runs the application using ts-node
- **Run Tests**: Builds and runs the test suite
- **Run Tests (Dev)**: Runs tests using ts-node

## TypeScript Features

### Type Definitions

```typescript
type DenominationName = 'dollar' | 'quarter' | 'dime' | 'nickel' | 'penny';
type ChangeResult = Partial<Record<DenominationName, number>>;
```

### Strict Type Checking

The project uses strict TypeScript configuration with:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noImplicitReturns: true`
- `exactOptionalPropertyTypes: true`

## Algorithm Details

### Minimum Change Algorithm

Uses a greedy algorithm to calculate the minimum number of coins:
1. Start with the largest denomination
2. Use as many of that denomination as possible
3. Move to the next smaller denomination
4. Repeat until change is fully distributed

### Random Change Algorithm

When change is divisible by 3:
1. Randomly select valid denominations
2. Ensure selected denomination doesn't exceed remaining amount
3. Continue until all change is distributed
4. Results will vary between runs

## Error Handling

- **File Not Found**: Displays clear error message and exits
- **Invalid Input**: Handles malformed input lines gracefully
- **Permission Issues**: Reports file system permission problems
- **Invalid Arguments**: Shows usage instructions

## License

MIT