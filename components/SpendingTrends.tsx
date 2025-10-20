'use client';

import { SpendingTrend } from '@/types/analytics';
import { formatCurrency } from '@/lib/expenses';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface SpendingTrendsProps {
  trends: SpendingTrend[];
  title?: string;
  showCount?: boolean;
}

export default function SpendingTrends({
  trends,
  title = 'Spending Trends',
  showCount = true,
}: SpendingTrendsProps) {
  if (trends.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">No spending data available for this period</p>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...trends.map((t) => t.amount));
  const minAmount = Math.min(...trends.map((t) => t.amount));
  const totalAmount = trends.reduce((sum, t) => sum + t.amount, 0);
  const averageAmount = totalAmount / trends.length;

  // Calculate trend direction
  const firstHalf = trends.slice(0, Math.floor(trends.length / 2));
  const secondHalf = trends.slice(Math.floor(trends.length / 2));
  const firstHalfAvg =
    firstHalf.reduce((sum, t) => sum + t.amount, 0) / firstHalf.length;
  const secondHalfAvg =
    secondHalf.reduce((sum, t) => sum + t.amount, 0) / secondHalf.length;
  const trendDirection = secondHalfAvg > firstHalfAvg ? 'up' : 'down';
  const trendPercentage =
    firstHalfAvg > 0
      ? Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
      : 0;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            trendDirection === 'up'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {trendDirection === 'up' ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className="text-sm font-semibold">
            {trendPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-6">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {trends.map((trend, index) => {
            const heightPercentage =
              maxAmount > 0 ? (trend.amount / maxAmount) * 100 : 0;

            return (
              <div
                key={trend.date}
                className="group relative flex-1 flex flex-col justify-end"
              >
                {/* Bar */}
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500 cursor-pointer"
                  style={{
                    height: `${Math.max(heightPercentage, 2)}%`,
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      <div className="font-semibold">
                        {format(parseISO(trend.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-primary-300">
                        {formatCurrency(trend.amount)}
                      </div>
                      {showCount && (
                        <div className="text-gray-400 dark:text-gray-500">
                          {trend.count} expense{trend.count !== 1 ? 's' : ''}
                        </div>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>

                {/* Date label (show every few bars to avoid crowding) */}
                {(trends.length <= 7 ||
                  index % Math.ceil(trends.length / 5) === 0) && (
                  <div className="text-xs text-gray-500 mt-2 text-center transform -rotate-45 origin-top-left">
                    {format(parseISO(trend.date), 'MM/dd')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Average</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(averageAmount)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Highest</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(maxAmount)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Lowest</div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(minAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}
