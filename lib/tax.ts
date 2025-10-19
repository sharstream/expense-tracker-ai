import { Expense } from '@/types/expense';
import { TaxSummary, TAX_CATEGORY_MAP, DEDUCTION_RATES, TaxCategory, QuarterlyBreakdown } from '@/types/tax';
import { parseISO, getYear, getQuarter, format } from 'date-fns';

export function calculateTaxSummary(expenses: Expense[], year: number): TaxSummary {
  // Filter expenses for the specified year
  const yearExpenses = expenses.filter(exp => {
    const expenseYear = getYear(parseISO(exp.date));
    return expenseYear === year;
  });

  // Initialize quarterly data
  const quarters: QuarterlyBreakdown[] = [
    { quarter: 'Q1', months: 'Jan - Mar', total: 0, deductible: 0, byCategory: {} as Record<TaxCategory, number> },
    { quarter: 'Q2', months: 'Apr - Jun', total: 0, deductible: 0, byCategory: {} as Record<TaxCategory, number> },
    { quarter: 'Q3', months: 'Jul - Sep', total: 0, deductible: 0, byCategory: {} as Record<TaxCategory, number> },
    { quarter: 'Q4', months: 'Oct - Dec', total: 0, deductible: 0, byCategory: {} as Record<TaxCategory, number> },
  ];

  // Initialize category totals
  const byTaxCategory: Record<TaxCategory, { total: number; deductible: number; count: number }> = {
    'Meals & Entertainment': { total: 0, deductible: 0, count: 0 },
    'Travel': { total: 0, deductible: 0, count: 0 },
    'Vehicle Expenses': { total: 0, deductible: 0, count: 0 },
    'Supplies': { total: 0, deductible: 0, count: 0 },
    'Utilities': { total: 0, deductible: 0, count: 0 },
    'Other Business Expenses': { total: 0, deductible: 0, count: 0 },
  };

  let totalExpenses = 0;
  let totalDeductible = 0;

  // Process each expense
  yearExpenses.forEach(expense => {
    const taxCategory = TAX_CATEGORY_MAP[expense.category];
    const deductionRate = DEDUCTION_RATES[taxCategory];
    const deductibleAmount = expense.amount * deductionRate;
    const quarter = getQuarter(parseISO(expense.date)) - 1; // 0-indexed

    // Update totals
    totalExpenses += expense.amount;
    totalDeductible += deductibleAmount;

    // Update category totals
    byTaxCategory[taxCategory].total += expense.amount;
    byTaxCategory[taxCategory].deductible += deductibleAmount;
    byTaxCategory[taxCategory].count += 1;

    // Update quarterly totals
    quarters[quarter].total += expense.amount;
    quarters[quarter].deductible += deductibleAmount;

    if (!quarters[quarter].byCategory[taxCategory]) {
      quarters[quarter].byCategory[taxCategory] = 0;
    }
    quarters[quarter].byCategory[taxCategory] += expense.amount;
  });

  return {
    year,
    totalExpenses,
    totalDeductible,
    quarters,
    byTaxCategory,
  };
}

export function exportTaxCSV(expenses: Expense[], year: number): string {
  // Filter expenses for the specified year
  const yearExpenses = expenses.filter(exp => {
    const expenseYear = getYear(parseISO(exp.date));
    return expenseYear === year;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const headers = [
    'Date',
    'Description',
    'Category',
    'IRS Tax Category',
    'Amount',
    'Deductible %',
    'Deductible Amount',
    'Quarter',
  ];

  const rows = yearExpenses.map(exp => {
    const taxCategory = TAX_CATEGORY_MAP[exp.category];
    const deductionRate = DEDUCTION_RATES[taxCategory];
    const deductibleAmount = exp.amount * deductionRate;
    const quarter = `Q${getQuarter(parseISO(exp.date))}`;

    return [
      format(parseISO(exp.date), 'MM/dd/yyyy'),
      exp.description,
      exp.category,
      taxCategory,
      exp.amount.toFixed(2),
      `${(deductionRate * 100).toFixed(0)}%`,
      deductibleAmount.toFixed(2),
      quarter,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadTaxReport(expenses: Expense[], year: number): void {
  const csvContent = exportTaxCSV(expenses, year);
  const summary = calculateTaxSummary(expenses, year);

  // Add summary at the top
  const summaryLines = [
    `"TAX REPORT FOR ${year}"`,
    `"Generated: ${format(new Date(), 'MM/dd/yyyy')}"`,
    '',
    '"SUMMARY"',
    `"Total Expenses","$${summary.totalExpenses.toFixed(2)}"`,
    `"Total Deductible","$${summary.totalDeductible.toFixed(2)}"`,
    `"Potential Tax Savings (25% bracket)","$${(summary.totalDeductible * 0.25).toFixed(2)}"`,
    '',
    '"BY IRS CATEGORY"',
  ];

  Object.entries(summary.byTaxCategory)
    .filter(([_, data]) => data.count > 0)
    .forEach(([category, data]) => {
      summaryLines.push(`"${category}","$${data.total.toFixed(2)}","$${data.deductible.toFixed(2)}","${data.count} items"`);
    });

  summaryLines.push('');
  summaryLines.push('"QUARTERLY BREAKDOWN"');
  summary.quarters.forEach(q => {
    summaryLines.push(`"${q.quarter} (${q.months})","$${q.total.toFixed(2)}","$${q.deductible.toFixed(2)}"`);
  });

  summaryLines.push('');
  summaryLines.push('"DETAILED TRANSACTIONS"');
  summaryLines.push('');

  const fullContent = summaryLines.join('\n') + '\n' + csvContent;

  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `business-tax-report-${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const TAX_TIPS: Record<TaxCategory, string> = {
  'Meals & Entertainment': 'Only 50% deductible. Business purpose required. Keep detailed records.',
  'Travel': 'Fully deductible if business-related. Include receipts for lodging, flights, etc.',
  'Vehicle Expenses': 'Track mileage or actual expenses. Standard mileage rate for 2024: 67¢/mile.',
  'Supplies': 'Office supplies, software, equipment under $2,500 are fully deductible.',
  'Utilities': 'Internet, phone, electricity for home office. May require home office deduction.',
  'Other Business Expenses': 'Advertising, professional services, bank fees, etc. Keep receipts.',
};
