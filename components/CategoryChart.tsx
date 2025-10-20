'use client';

import { ExpenseCategory } from '@/types/expense';
import { formatCurrency, CATEGORY_ICONS } from '@/lib/expenses';
import { PieChart } from 'lucide-react';

interface CategoryChartProps {
  categoryBreakdown: Record<ExpenseCategory, number>;
}

// Gradient colors for each category
const CATEGORY_GRADIENTS: Record<ExpenseCategory, string> = {
  Food: 'from-orange-400 to-orange-600',
  Transportation: 'from-blue-400 to-blue-600',
  Entertainment: 'from-purple-400 to-purple-600',
  Shopping: 'from-pink-400 to-pink-600',
  Bills: 'from-red-400 to-red-600',
  Other: 'from-gray-400 to-gray-600',
};

export default function CategoryChart({ categoryBreakdown }: CategoryChartProps) {
  const total = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);

  const sortedCategories = (Object.entries(categoryBreakdown) as [ExpenseCategory, number][])
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-gray-300/50 dark:hover:border-gray-600/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200/50 dark:shadow-primary-900/50">
            <PieChart size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Spending by Category</h3>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-3">
            <PieChart size={28} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No expenses to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:border-gray-300/50 dark:hover:border-gray-600/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200/50 dark:shadow-primary-900/50">
          <PieChart size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Spending by Category</h3>
      </div>

      <div className="space-y-5">
        {sortedCategories.map(([category, amount], index) => {
          const percentage = (amount / total) * 100;
          return (
            <div
              key={category}
              className="group"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENTS[category]} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {CATEGORY_ICONS[category]}
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-950 dark:group-hover:text-gray-50 transition-colors">{category}</span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-black bg-gradient-to-br ${CATEGORY_GRADIENTS[category]} bg-clip-text text-transparent`}>
                    {formatCurrency(amount)}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{percentage.toFixed(1)}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden group-hover:h-4 transition-all duration-300">
                <div
                  className={`h-full bg-gradient-to-r ${CATEGORY_GRADIENTS[category]} rounded-full transition-all duration-700 ease-out shadow-sm`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Shine effect */}
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total</span>
          <span className="text-2xl font-black bg-gradient-to-br from-primary-500 to-primary-600 bg-clip-text text-transparent">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
