'use client';

import { Expense } from '@/types/expense';
import { formatCurrency, CATEGORY_ICONS } from '@/lib/expenses';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';
import { format, parseISO, isToday, isYesterday, isThisWeek } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

// Get gradient colors for each category
const CATEGORY_GRADIENTS: Record<string, string> = {
  Food: 'from-orange-400 to-orange-600',
  Transportation: 'from-blue-400 to-blue-600',
  Entertainment: 'from-purple-400 to-purple-600',
  Shopping: 'from-pink-400 to-pink-600',
  Bills: 'from-red-400 to-red-600',
  Other: 'from-gray-400 to-gray-600',
};

// Get background glow colors
const CATEGORY_GLOWS: Record<string, string> = {
  Food: 'shadow-orange-200/50',
  Transportation: 'shadow-blue-200/50',
  Entertainment: 'shadow-purple-200/50',
  Shopping: 'shadow-pink-200/50',
  Bills: 'shadow-red-200/50',
  Other: 'shadow-gray-200/50',
};

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-900 text-xl font-semibold">No expenses yet</p>
        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Start tracking your spending by adding your first expense above</p>
      </div>
    );
  }

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDelete(id);
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className="group relative"
          style={{
            animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
          }}
        >
          {/* Animated background glow effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${CATEGORY_GRADIENTS[expense.category]} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl`}
          />

          {/* Main card */}
          <div className={`relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:scale-[1.01] hover:border-gray-300/50 hover:-translate-y-0.5`}>
            <div className="flex items-start gap-4">
              {/* Category Icon with Gradient */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[expense.category]} flex items-center justify-center text-white text-2xl shadow-lg ${CATEGORY_GLOWS[expense.category]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  {CATEGORY_ICONS[expense.category]}
                </div>
                {/* Animated ring on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[expense.category]} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Description */}
                <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-gray-950 transition-colors">
                  {expense.description}
                </h3>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium group-hover:bg-gray-200 transition-colors">
                    <Tag size={14} className="text-gray-500" />
                    <span>{expense.category}</span>
                  </div>

                  {/* Date Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium group-hover:bg-gray-200 transition-colors">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{getDateLabel(expense.date)}</span>
                  </div>
                </div>
              </div>

              {/* Amount and Actions */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                {/* Amount - Bold and Beautiful */}
                <div className={`text-3xl font-black bg-gradient-to-br ${CATEGORY_GRADIENTS[expense.category]} bg-clip-text text-transparent transition-all duration-300`}>
                  {formatCurrency(expense.amount)}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(expense)}
                    className="group/btn p-2.5 text-gray-600 hover:text-primary-600 bg-gray-100/80 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md hover:shadow-primary-200/50"
                    title="Edit expense"
                  >
                    <Pencil size={18} className="transition-transform group-hover/btn:rotate-12" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id, expense.description)}
                    className="group/btn p-2.5 text-gray-600 hover:text-red-600 bg-gray-100/80 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md hover:shadow-red-200/50"
                    title="Delete expense"
                  >
                    <Trash2 size={18} className="transition-transform group-hover/btn:scale-110" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${CATEGORY_GRADIENTS[expense.category]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
