import { Expense, ExpenseCategory, ExpenseFilters, ExpenseSummary } from '@/types/expense';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: 'bg-orange-500',
  Transportation: 'bg-blue-500',
  Entertainment: 'bg-purple-500',
  Shopping: 'bg-pink-500',
  Bills: 'bg-red-500',
  Other: 'bg-gray-500',
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📌',
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] {
  return expenses.filter((expense) => {
    // Category filter
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const expenseDate = parseISO(expense.date);

      if (filters.startDate && filters.endDate) {
        const start = parseISO(filters.startDate);
        const end = parseISO(filters.endDate);
        if (!isWithinInterval(expenseDate, { start, end })) {
          return false;
        }
      } else if (filters.startDate) {
        const start = parseISO(filters.startDate);
        if (expenseDate < start) {
          return false;
        }
      } else if (filters.endDate) {
        const end = parseISO(filters.endDate);
        if (expenseDate > end) {
          return false;
        }
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(query);
      const matchesCategory = expense.category.toLowerCase().includes(query);
      const matchesAmount = expense.amount.toString().includes(query);

      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }

    return true;
  });
}

export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyExpenses = expenses.filter((exp) => {
    const expenseDate = parseISO(exp.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });

  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryBreakdown: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach((exp) => {
    categoryBreakdown[exp.category] += exp.amount;
  });

  let topCategory: { category: ExpenseCategory; amount: number } | null = null;
  let maxAmount = 0;

  (Object.keys(categoryBreakdown) as ExpenseCategory[]).forEach((category) => {
    if (categoryBreakdown[category] > maxAmount) {
      maxAmount = categoryBreakdown[category];
      topCategory = { category, amount: maxAmount };
    }
  });

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
  };
}

export function sortExpenses(expenses: Expense[], sortBy: 'date' | 'amount' = 'date'): Expense[] {
  return [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.amount - a.amount;
    }
  });
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map((exp) => [
    exp.date,
    exp.category,
    exp.amount.toString(),
    exp.description,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(expenses: Expense[], filename: string = 'expenses.csv'): void {
  const csvContent = exportToCSV(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
