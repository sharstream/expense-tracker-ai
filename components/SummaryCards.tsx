'use client';

import { ExpenseSummary } from '@/types/expense';
import { formatCurrency, CATEGORY_ICONS } from '@/lib/expenses';
import { DollarSign, TrendingUp, PieChart, Sparkles } from 'lucide-react';

interface SummaryCardsProps {
  summary: ExpenseSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Spending */}
      <div className="group relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />

        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/60 dark:hover:shadow-blue-900/60 hover:scale-[1.02] hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Spending</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">All time</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {formatCurrency(summary.totalSpending)}
          </p>
        </div>
      </div>

      {/* Monthly Spending */}
      <div className="group relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />

        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-green-200/60 dark:hover:shadow-green-900/60 hover:scale-[1.02] hover:border-green-300/50 dark:hover:border-green-600/50 hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">This Month</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Current period</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-black bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent">
            {formatCurrency(summary.monthlySpending)}
          </p>
        </div>
      </div>

      {/* Top Category */}
      <div className="group relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />

        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/60 dark:hover:shadow-purple-900/60 hover:scale-[1.02] hover:border-purple-300/50 dark:hover:border-purple-600/50 hover:-translate-y-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200/50 dark:shadow-purple-900/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <PieChart size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Top Category</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500">Highest spend</p>
              </div>
            </div>
          </div>
          {summary.topCategory ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{CATEGORY_ICONS[summary.topCategory.category]}</span>
                <p className="text-2xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {summary.topCategory.category}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {formatCurrency(summary.topCategory.amount)} spent
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-gray-400 dark:text-gray-500" />
              <p className="text-lg font-bold text-gray-400 dark:text-gray-500">No data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
