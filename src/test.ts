import {
  dollarsToCents,
  calculateMinimumChange,
  formatChange,
  processLine,
  type ChangeResult
} from './index';

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
 * Simple test runner
 */
function runTests(): void {
  console.log('Running TypeScript tests...\n');
  
  const tests: TestResult[] = [];
  
  // Test dollarsToCents
  console.log('Testing dollarsToCents:');
  tests.push(testFunction('dollarsToCents(2.13)', () => dollarsToCents(2.13), 213));
  tests.push(testFunction('dollarsToCents(0.88)', () => dollarsToCents(0.88), 88));
  tests.push(testFunction('dollarsToCents(1.67)', () => dollarsToCents(1.67), 167));
  console.log('');
  
  // Test calculateMinimumChange
  console.log('Testing calculateMinimumChange:');
  const change88: ChangeResult = { quarter: 3, dime: 1, penny: 3 };
  const change3: ChangeResult = { penny: 3 };
  const change167: ChangeResult = { dollar: 1, quarter: 2, dime: 1, nickel: 1, penny: 2 };
  
  tests.push(testFunction('calculateMinimumChange(88)', () => calculateMinimumChange(88), change88));
  tests.push(testFunction('calculateMinimumChange(3)', () => calculateMinimumChange(3), change3));
  tests.push(testFunction('calculateMinimumChange(167)', () => calculateMinimumChange(167), change167));
  console.log('');
  
  // Test formatChange
  console.log('Testing formatChange:');
  tests.push(testFunction(
    'formatChange({quarter: 3, dime: 1, penny: 3})', 
    () => formatChange({quarter: 3, dime: 1, penny: 3}), 
    '3 quarters,1 dime,3 pennies'
  ));
  tests.push(testFunction(
    'formatChange({penny: 3})', 
    () => formatChange({penny: 3}), 
    '3 pennies'
  ));
  tests.push(testFunction(
    'formatChange({dollar: 1, quarter: 2, nickel: 1})', 
    () => formatChange({dollar: 1, quarter: 2, nickel: 1}), 
    '1 dollar,2 quarters,1 nickel'
  ));
  console.log('');
  
  // Test processLine
  console.log('Testing processLine:');
  tests.push(testFunction('processLine("2.12,3.00")', () => processLine('2.12,3.00'), '3 quarters,1 dime,3 pennies'));
  tests.push(testFunction('processLine("1.97,2.00")', () => processLine('1.97,2.00'), '3 pennies'));
  
  // For random test, just verify it returns a string (since it's random)
  const randomResult = processLine('3.33,5.00');
  console.log('processLine("3.33,5.00") ->', randomResult, '(random - will vary)');
  tests.push({
    name: 'processLine("3.33,5.00") returns string',
    passed: typeof randomResult === 'string' && randomResult.length > 0,
    expected: 'non-empty string',
    actual: typeof randomResult
  });
  console.log('');
  
  // Summary
  const passedTests = tests.filter(test => test.passed);
  const failedTests = tests.filter(test => !test.passed);
  
  console.log(`Tests completed! ${passedTests.length}/${tests.length} passed`);
  
  if (failedTests.length > 0) {
    console.log('\nFailed tests:');
    failedTests.forEach(test => {
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${JSON.stringify(test.expected)}`);
      console.log(`   Actual: ${JSON.stringify(test.actual)}`);
    });
  } else {
    console.log('🎉 All tests passed!');
  }
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