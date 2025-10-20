import { ExpenseCategory } from './expense';

export interface SpendingTrend {
  date: string; // ISO date string
  amount: number;
  count: number; // number of expenses on this date
}

export interface CategoryTrend {
  category: ExpenseCategory;
  trends: SpendingTrend[];
  total: number;
  average: number;
}

export interface BudgetItem {
  category: ExpenseCategory;
  limit: number;
  spent: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface TimeComparisonData {
  current: {
    period: string;
    total: number;
    average: number;
    count: number;
  };
  previous: {
    period: string;
    total: number;
    average: number;
    count: number;
  };
  change: {
    amount: number;
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

export interface SpendingInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  message: string;
  category?: ExpenseCategory;
  impact: 'high' | 'medium' | 'low';
}

export interface AnalyticsPeriod {
  label: string;
  value: '7d' | '30d' | '90d' | '1y' | 'all';
  days: number | null; // null for 'all'
}

export interface TopExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  percentageOfTotal: number;
}

export interface AnalyticsSummary {
  totalExpenses: number;
  averageExpense: number;
  medianExpense: number;
  highestExpense: TopExpense | null;
  lowestExpense: TopExpense | null;
  topExpenses: TopExpense[];
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
}
