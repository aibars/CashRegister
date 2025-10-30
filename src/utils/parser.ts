import { Transaction, ParsedTransaction } from '../types';
import { dollarsToCents, isValidMonetaryAmount } from './currency';

/**
 * Parses a transaction line from input file
 */
export function parseTransactionLine(line: string, lineNumber: number): ParsedTransaction {
  const trimmedLine = line.trim();
  
  if (!trimmedLine) {
    throw new Error(`Line ${lineNumber}: Empty line`);
  }
  
  const parts = trimmedLine.split(',');
  if (parts.length !== 2) {
    throw new Error(`Line ${lineNumber}: Invalid format. Expected "amount_owed,amount_paid"`);
  }
  
  const [owedStr, paidStr] = parts;
  const amountOwed = parseFloat(owedStr!.trim());
  const amountPaid = parseFloat(paidStr!.trim());
  
  if (!isValidMonetaryAmount(amountOwed)) {
    throw new Error(`Line ${lineNumber}: Invalid amount owed: ${owedStr}`);
  }
  
  if (!isValidMonetaryAmount(amountPaid)) {
    throw new Error(`Line ${lineNumber}: Invalid amount paid: ${paidStr}`);
  }
  
  const changeDue = amountPaid - amountOwed;
  
  if (changeDue < 0) {
    throw new Error(`Line ${lineNumber}: Insufficient payment. Paid: $${amountPaid}, Owed: $${amountOwed}`);
  }
  
  return {
    amountOwed,
    amountPaid,
    changeDue: dollarsToCents(changeDue)
  };
}

/**
 * Validates transaction data
 */
export function validateTransaction(transaction: Transaction): void {
  if (!isValidMonetaryAmount(transaction.amountOwed)) {
    throw new Error('Invalid amount owed');
  }
  
  if (!isValidMonetaryAmount(transaction.amountPaid)) {
    throw new Error('Invalid amount paid');
  }
  
  if (transaction.amountPaid < transaction.amountOwed) {
    throw new Error('Insufficient payment');
  }
}