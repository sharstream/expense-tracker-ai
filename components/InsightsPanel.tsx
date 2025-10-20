'use client';

import { SpendingInsight } from '@/types/analytics';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

interface InsightsPanelProps {
  insights: SpendingInsight[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Spending Insights</h3>
        <div className="text-center py-8">
          <Lightbulb className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">No insights available yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add more expenses to get personalized insights
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      case 'tip':
        return <Lightbulb size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-700',
          icon: 'text-red-500',
          badge: 'bg-red-100 text-red-700',
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-700',
          icon: 'text-green-500',
          badge: 'bg-green-100 text-green-700',
        };
      case 'tip':
        return {
          bg: 'bg-purple-50 border-purple-200',
          text: 'text-purple-700',
          icon: 'text-purple-500',
          badge: 'bg-purple-100 text-purple-700',
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-700',
          icon: 'text-blue-500',
          badge: 'bg-blue-100 text-blue-700',
        };
    }
  };

  // Sort by impact: high > medium > low
  const sortedInsights = [...insights].sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Spending Insights</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
              {insights.length} insight{insights.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {sortedInsights.map((insight, index) => {
          const styles = getStyles(insight.type);

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-xl border ${styles.bg} transition-all duration-300 hover:shadow-md animate-fadeIn`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${styles.icon}`}>
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${styles.text}`}>
                      {insight.title}
                    </h4>
                    {insight.impact === 'high' && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${styles.badge}`}>
                        HIGH
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insight.message}
                  </p>
                  {insight.category && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-white/50 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {insight.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
