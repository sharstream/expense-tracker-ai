import { ExpenseCategory } from './expense';

// IRS Business Expense Categories (Schedule C)
export type TaxCategory =
  | 'Meals & Entertainment'
  | 'Travel'
  | 'Vehicle Expenses'
  | 'Supplies'
  | 'Utilities'
  | 'Other Business Expenses';

// Mapping our categories to IRS categories
export const TAX_CATEGORY_MAP: Record<ExpenseCategory, TaxCategory> = {
  Food: 'Meals & Entertainment',
  Transportation: 'Vehicle Expenses',
  Entertainment: 'Meals & Entertainment',
  Shopping: 'Supplies',
  Bills: 'Utilities',
  Other: 'Other Business Expenses',
};

// Deduction percentages (Meals & Entertainment is 50% deductible)
export const DEDUCTION_RATES: Record<TaxCategory, number> = {
  'Meals & Entertainment': 0.5, // 50% deductible
  'Travel': 1.0, // 100% deductible
  'Vehicle Expenses': 1.0, // 100% deductible (or standard mileage)
  'Supplies': 1.0, // 100% deductible
  'Utilities': 1.0, // 100% deductible
  'Other Business Expenses': 1.0, // 100% deductible
};

export interface QuarterlyBreakdown {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  months: string;
  total: number;
  deductible: number;
  byCategory: Record<TaxCategory, number>;
}

export interface TaxSummary {
  year: number;
  totalExpenses: number;
  totalDeductible: number;
  quarters: QuarterlyBreakdown[];
  byTaxCategory: Record<TaxCategory, {
    total: number;
    deductible: number;
    count: number;
  }>;
}

export interface TaxExportOptions {
  year: number;
  includeNotes: boolean;
  format: 'csv' | 'detailed-csv';
}
