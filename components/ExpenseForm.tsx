'use client';

import { useState } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types/expense';
import { CATEGORIES, generateId } from '@/lib/expenses';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  onCancel?: () => void;
  initialData?: Expense;
  mode?: 'create' | 'edit';
}

export default function ExpenseForm({
  onSubmit,
  onCancel,
  initialData,
  mode = 'create',
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const expense: Expense = {
      id: initialData?.id || generateId(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(expense);
    setIsSubmitting(false);

    if (mode === 'create') {
      // Reset form after creation
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food',
        description: '',
      });
    }
  };

  const handleChange = (
    field: keyof ExpenseFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Date */}
        <div className="group/field">
          <label htmlFor="date" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${
              errors.date
                ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20 dark:text-red-200'
                : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-gray-100'
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-600 dark:bg-red-400"></span>
              {errors.date}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="group/field">
          <label htmlFor="amount" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="0.00"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 text-lg font-semibold ${
              errors.amount
                ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20 dark:text-red-200'
                : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
            }`}
          />
          {errors.amount && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-600 dark:bg-red-400"></span>
              {errors.amount}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="group/field">
        <label htmlFor="category" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value as ExpenseCategory)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer font-medium text-gray-900 dark:text-gray-100"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="group/field">
        <label htmlFor="description" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What did you spend on?"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${
            errors.description
              ? 'border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20 dark:text-red-200'
              : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
          }`}
          maxLength={200}
        />
        <div className="flex items-center justify-between mt-2">
          {errors.description ? (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-600 dark:bg-red-400"></span>
              {errors.description}
            </p>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">{formData.description.length}/200</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group/btn flex-1 bg-gradient-to-br from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg shadow-primary-200/50 dark:shadow-primary-900/50 hover:shadow-xl hover:shadow-primary-300/50 dark:hover:shadow-primary-800/50 hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            mode === 'edit' ? '✓ Update Expense' : '+ Add Expense'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 font-semibold text-gray-700 dark:text-gray-300 hover:scale-[1.02]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
