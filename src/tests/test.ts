import {
  CashRegisterService,
  MinimumChangeStrategy,
  RandomChangeStrategy,
  FormattingService,
  dollarsToCents,
  parseTransactionLine,
  type ChangeResult,
  type ParsedTransaction
} from '../services';

/**
 * Test result interface
 */
interface TestResult {
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
}

/**
 * Comprehensive test suite for the cash register system
 */
function runTests(): void {
  console.log('Running Cash Register Service Tests...\n');
  
  const tests: TestResult[] = [];
  
  // Test utility functions
  console.log('=== Testing Utility Functions ===');
  tests.push(...testUtilityFunctions());
  console.log('');
  
  // Test change strategies
  console.log('=== Testing Change Strategies ===');
  tests.push(...testChangeStrategies());
  console.log('');
  
  // Test formatting service
  console.log('=== Testing Formatting Service ===');
  tests.push(...testFormattingService());
  console.log('');
  
  // Test parser functions
  console.log('=== Testing Parser Functions ===');
  tests.push(...testParserFunctions());
  console.log('');
  
  // Test cash register service
  console.log('=== Testing Cash Register Service ===');
  tests.push(...testCashRegisterService());
  console.log('');
  
  // Test integration scenarios
  console.log('=== Testing Integration Scenarios ===');
  tests.push(...testIntegrationScenarios());
  console.log('');
  
  // Summary
  const passedTests = tests.filter(test => test.passed);
  const failedTests = tests.filter(test => !test.passed);
  
  console.log(`=== Test Summary ===`);
  console.log(`Total: ${tests.length} tests`);
  console.log(`Passed: ${passedTests.length}`);
  console.log(`Failed: ${failedTests.length}`);
  
  if (failedTests.length > 0) {
    console.log('\n❌ Failed tests:');
    failedTests.forEach(test => {
      console.log(`   ${test.name}`);
      console.log(`   Expected: ${JSON.stringify(test.expected)}`);
      console.log(`   Actual: ${JSON.stringify(test.actual)}`);
    });
    console.log('');
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

function testUtilityFunctions(): TestResult[] {
  const tests: TestResult[] = [];
  
  console.log('Testing dollarsToCents:');
  tests.push(testFunction('dollarsToCents(2.13)', () => dollarsToCents(2.13), 213));
  tests.push(testFunction('dollarsToCents(0.88)', () => dollarsToCents(0.88), 88));
  tests.push(testFunction('dollarsToCents(1.67)', () => dollarsToCents(1.67), 167));
  
  return tests;
}

function testChangeStrategies(): TestResult[] {
  const tests: TestResult[] = [];
  
  console.log('Testing MinimumChangeStrategy:');
  const minStrategy = new MinimumChangeStrategy();
  tests.push(testFunction(
    'MinimumChangeStrategy.calculate(88)', 
    () => minStrategy.calculate(88), 
    { quarter: 3, dime: 1, penny: 3 }
  ));
  tests.push(testFunction(
    'MinimumChangeStrategy.calculate(3)', 
    () => minStrategy.calculate(3), 
    { penny: 3 }
  ));
  tests.push(testFunction(
    'MinimumChangeStrategy.calculate(167)', 
    () => minStrategy.calculate(167), 
    { dollar: 1, quarter: 2, dime: 1, nickel: 1, penny: 2 }
  ));
  
  console.log('Testing RandomChangeStrategy:');
  const randomStrategy = new RandomChangeStrategy();
  const randomResult = randomStrategy.calculate(167);
  tests.push({
    name: 'RandomChangeStrategy.calculate(167) returns valid result',
    passed: typeof randomResult === 'object' && Object.keys(randomResult).length > 0,
    expected: 'object with denominations',
    actual: typeof randomResult
  });
  console.log('✅ RandomChangeStrategy.calculate(167):', randomResult, '(random - will vary)');
  
  return tests;
}

function testFormattingService(): TestResult[] {
  const tests: TestResult[] = [];
  
  console.log('Testing FormattingService:');
  tests.push(testFunction(
    'FormattingService.formatStandard({quarter: 3, dime: 1, penny: 3})', 
    () => FormattingService.formatStandard({quarter: 3, dime: 1, penny: 3}), 
    '3 quarters,1 dime,3 pennies'
  ));
  tests.push(testFunction(
    'FormattingService.formatStandard({penny: 3})', 
    () => FormattingService.formatStandard({penny: 3}), 
    '3 pennies'
  ));
  tests.push(testFunction(
    'FormattingService.formatStandard({})', 
    () => FormattingService.formatStandard({}), 
    'No change'
  ));
  
  return tests;
}

function testParserFunctions(): TestResult[] {
  const tests: TestResult[] = [];
  
  console.log('Testing parseTransactionLine:');
  tests.push(testFunction(
    'parseTransactionLine("2.12,3.00", 1)', 
    () => parseTransactionLine('2.12,3.00', 1), 
    { amountOwed: 2.12, amountPaid: 3.00, changeDue: 88 }
  ));
  
  // Test error cases
  tests.push({
    name: 'parseTransactionLine with invalid format throws error',
    passed: testThrows(() => parseTransactionLine('invalid', 1)),
    expected: 'error thrown',
    actual: 'no error or error thrown'
  });
  
  return tests;
}

function testCashRegisterService(): TestResult[] {
  const tests: TestResult[] = [];
  
  console.log('Testing CashRegisterService:');
  const service = new CashRegisterService({
    enableRandomMode: false, // Disable random for predictable tests
    outputFormat: 'standard'
  });
  
  const transaction: ParsedTransaction = {
    amountOwed: 2.12,
    amountPaid: 3.00,
    changeDue: 88
  };
  
  const result = service.processTransaction(transaction);
  tests.push(testFunction(
    'CashRegisterService.processTransaction (minimum mode)', 
    () => result.formattedChange, 
    '3 quarters,1 dime,3 pennies'
  ));
  tests.push(testFunction(
    'CashRegisterService strategy type', 
    () => result.strategy, 
    'minimum'
  ));
  
  return tests;
}

function testIntegrationScenarios(): TestResult[] {
  const tests: TestResult[] = [];
  
  console.log('Testing integration scenarios:');
  
  // Test the full workflow
  const service = new CashRegisterService({ enableRandomMode: false });
  
  try {
    const transaction1 = parseTransactionLine('2.12,3.00', 1);
    const result1 = service.processTransaction(transaction1);
    
    tests.push(testFunction(
      'Full workflow: "2.12,3.00"', 
      () => result1.formattedChange, 
      '3 quarters,1 dime,3 pennies'
    ));
    
    const transaction2 = parseTransactionLine('1.97,2.00', 2);
    const result2 = service.processTransaction(transaction2);
    
    tests.push(testFunction(
      'Full workflow: "1.97,2.00"', 
      () => result2.formattedChange, 
      '3 pennies'
    ));
    
    console.log('✅ Integration test passed');
    
  } catch (error) {
    tests.push({
      name: 'Integration test',
      passed: false,
      expected: 'successful processing',
      actual: error instanceof Error ? error.message : String(error)
    });
    console.log('❌ Integration test failed:', error);
  }
  
  return tests;
}

/**
 * Helper function to run a test and capture results
 */
function testFunction<T>(name: string, testFn: () => T, expected: T): TestResult {
  try {
    const actual = testFn();
    const passed = deepEquals(actual, expected);
    
    console.log(`${passed ? '✅' : '❌'} ${name}:`, actual, passed ? '' : `(expected: ${JSON.stringify(expected)})`);
    
    return {
      name,
      passed,
      expected,
      actual
    };
  } catch (error) {
    console.log(`❌ ${name}: ERROR -`, error instanceof Error ? error.message : String(error));
    return {
      name,
      passed: false,
      expected,
      actual: error
    };
  }
}

/**
 * Helper function to test if a function throws an error
 */
function testThrows(testFn: () => any): boolean {
  try {
    testFn();
    return false; // No error thrown
  } catch {
    return true; // Error thrown as expected
  }
}

/**
 * Deep equality check for test results
 */
function deepEquals(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEquals(a[key], b[key])) return false;
    }
    
    return true;
  }
  
  return false;
}

if (require.main === module) {
  runTests();
}