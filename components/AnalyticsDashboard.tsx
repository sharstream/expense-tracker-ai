'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { AnalyticsPeriod } from '@/types/analytics';
import {
  calculateSpendingTrends,
  calculateAnalyticsSummary,
  generateInsights,
  calculateBudgetItems,
  compareTimePeriods,
  getDateRangeLabel,
} from '@/lib/analytics';
import { formatCurrency } from '@/lib/expenses';
import SpendingTrends from './SpendingTrends';
import BudgetTracker from './BudgetTracker';
import InsightsPanel from './InsightsPanel';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  expenses: Expense[];
}

const PERIODS: AnalyticsPeriod[] = [
  { label: 'Last 7 Days', value: '7d', days: 7 },
  { label: 'Last 30 Days', value: '30d', days: 30 },
  { label: 'Last 90 Days', value: '90d', days: 90 },
  { label: 'Last Year', value: '1y', days: 365 },
  { label: 'All Time', value: 'all', days: null },
];

const BUDGET_STORAGE_KEY = 'expense-tracker-budgets';

export default function AnalyticsDashboard({ expenses }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(PERIODS[1]); // Default to 30 days
  const [budgets, setBudgets] = useState<Record<ExpenseCategory, number>>({
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  });

  // Load budgets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBudgets(parsed);
      }
    } catch (error) {
      console.error('Failed to load budgets:', error);
    }
  }, []);

  // Save budgets to localStorage
  const handleUpdateBudget = (category: ExpenseCategory, limit: number) => {
    const newBudgets = { ...budgets, [category]: limit };
    setBudgets(newBudgets);
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(newBudgets));
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  // Calculate analytics data
  const trends = calculateSpendingTrends(expenses, selectedPeriod.days);
  const summary = calculateAnalyticsSummary(expenses, selectedPeriod.days);
  const insights = generateInsights(expenses, budgets);
  const budgetItems = calculateBudgetItems(expenses, budgets);
  const comparison = compareTimePeriods(expenses, 30);

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                selectedPeriod.value === period.value
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200/50 dark:shadow-primary-900/50 scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spending */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={28} />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">
              {getDateRangeLabel(selectedPeriod.days)}
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="text-blue-100 text-sm font-medium">Total Spending</div>
        </div>

        {/* Average Expense */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 size={28} />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">
              Per Transaction
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(summary.averageExpense)}
          </div>
          <div className="text-purple-100 text-sm font-medium">Average Expense</div>
        </div>

        {/* Daily Average */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={28} />
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">
              Daily
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {formatCurrency(summary.dailyAverage)}
          </div>
          <div className="text-green-100 text-sm font-medium">Daily Average</div>
        </div>

        {/* Trend Comparison */}
        <div
          className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
            comparison.change.trend === 'up'
              ? 'bg-gradient-to-br from-red-500 to-red-600'
              : comparison.change.trend === 'down'
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          } text-white`}
        >
          <div className="flex items-center justify-between mb-2">
            {comparison.change.trend === 'up' ? (
              <TrendingUp size={28} />
            ) : (
              <TrendingDown size={28} />
            )}
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">
              vs Last Period
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {comparison.change.trend === 'neutral' ? '~' : ''}
            {Math.abs(comparison.change.percentage).toFixed(1)}%
          </div>
          <div className="text-white/90 text-sm font-medium">
            {comparison.change.trend === 'up'
              ? 'Spending Increased'
              : comparison.change.trend === 'down'
              ? 'Spending Decreased'
              : 'No Significant Change'}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trends */}
        <div className="lg:col-span-2 space-y-6">
          <SpendingTrends trends={trends} title="Spending Over Time" />

          {summary.topExpenses.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                  <PieChart className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Top Expenses</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Largest transactions</p>
                </div>
              </div>
              <div className="space-y-3">
                {summary.topExpenses.map((expense, index) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {expense.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {expense.category} • {expense.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {expense.percentageOfTotal.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Budget & Insights */}
        <div className="space-y-6">
          <BudgetTracker
            budgetItems={budgetItems}
            onUpdateBudget={handleUpdateBudget}
          />
          <InsightsPanel insights={insights} />
        </div>
      </div>
    </div>
  );
}
