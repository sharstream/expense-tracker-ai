'use client';

import { useState } from 'react';
import { BudgetItem } from '@/types/analytics';
import { ExpenseCategory } from '@/types/expense';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/expenses';
import { AlertCircle, CheckCircle, Edit2, Save, X, Wallet } from 'lucide-react';

interface BudgetTrackerProps {
  budgetItems: BudgetItem[];
  onUpdateBudget: (category: ExpenseCategory, limit: number) => void;
}

export default function BudgetTracker({
  budgetItems,
  onUpdateBudget,
}: BudgetTrackerProps) {
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(
    null
  );
  const [editValue, setEditValue] = useState('');

  const handleEdit = (category: ExpenseCategory, currentLimit: number) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
  };

  const handleSave = (category: ExpenseCategory) => {
    const value = parseFloat(editValue);
    if (!isNaN(value) && value >= 0) {
      onUpdateBudget(category, value);
    }
    setEditingCategory(null);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.limit, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverallOverBudget = totalSpent > totalBudget && totalBudget > 0;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
            <Wallet className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Monthly Budget</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Track your spending limits</p>
          </div>
        </div>
      </div>

      {/* Overall Budget Summary */}
      {totalBudget > 0 && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            isOverallOverBudget
              ? 'bg-red-50 border border-red-200'
              : overallPercentage > 80
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Overall Budget
            </span>
            <span
              className={`text-sm font-bold ${
                isOverallOverBudget
                  ? 'text-red-700'
                  : overallPercentage > 80
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}
            >
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverallOverBudget
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : overallPercentage > 80
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-600 text-center">
            {overallPercentage.toFixed(1)}% used
            {isOverallOverBudget && (
              <span className="text-red-700 font-semibold ml-2">
                (Over by {formatCurrency(totalSpent - totalBudget)})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Category Budgets */}
      <div className="space-y-4">
        {budgetItems.map((item) => {
          const isEditing = editingCategory === item.category;
          const bgColor = CATEGORY_COLORS[item.category].replace('bg-', '');

          return (
            <div
              key={item.category}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" title={item.category}>
                    {CATEGORY_ICONS[item.category]}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.category}
                    </div>
                    {item.limit > 0 ? (
                      <div className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {formatCurrency(item.spent)} /{' '}
                        {formatCurrency(item.limit)}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">No budget set</div>
                    )}
                  </div>
                </div>

                {/* Edit/Save Controls */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={() => handleSave(item.category)}
                      className="p-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                      title="Save"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(item.category, item.limit)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-100"
                    title="Edit budget"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {item.limit > 0 && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isOverBudget
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : item.percentage > 80
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : `bg-gradient-to-r from-${bgColor} to-${bgColor}`
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      {item.percentage.toFixed(1)}% used
                    </span>
                    {item.isOverBudget ? (
                      <div className="flex items-center gap-1 text-red-700 font-semibold">
                        <AlertCircle size={12} />
                        Over by {formatCurrency(item.spent - item.limit)}
                      </div>
                    ) : item.percentage > 80 ? (
                      <div className="flex items-center gap-1 text-yellow-700 font-semibold">
                        <AlertCircle size={12} />
                        {formatCurrency(item.limit - item.spent)} remaining
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-700">
                        <CheckCircle size={12} />
                        {formatCurrency(item.limit - item.spent)} remaining
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {totalBudget === 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            Click the edit icon to set budget limits for each category.
          </p>
        </div>
      )}
    </div>
  );
}
