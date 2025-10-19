'use client';

import { ExpenseFilters, ExpenseCategory } from '@/types/expense';
import { CATEGORIES } from '@/lib/expenses';
import { Search, X, Filter, Calendar } from 'lucide-react';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
  onClearFilters: () => void;
}

export default function ExpenseFiltersComponent({
  filters,
  onFilterChange,
  onClearFilters,
}: ExpenseFiltersProps) {
  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.startDate ||
    filters.endDate ||
    filters.searchQuery;

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200/50">
            <Filter size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="group/btn flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 hover:text-white bg-primary-50 hover:bg-gradient-to-br hover:from-primary-400 hover:to-primary-600 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-primary-200/50"
          >
            <X size={16} className="transition-transform group-hover/btn:rotate-90" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Search
          </label>
          <div className="relative group/input">
            <input
              type="text"
              id="search"
              value={filters.searchQuery || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, searchQuery: e.target.value })
              }
              placeholder="Search expenses..."
              className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 bg-white/50 group-hover/input:bg-white group-hover/input:border-gray-400"
            />
            <Search
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-hover/input:text-primary-500"
              size={18}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category || 'All'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: e.target.value as ExpenseCategory | 'All',
              })
            }
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white hover:border-gray-400 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            <Calendar size={12} className="inline mr-1" />
            From
          </label>
          <input
            type="date"
            id="startDate"
            value={filters.startDate || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, startDate: e.target.value })
            }
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white hover:border-gray-400 cursor-pointer"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
            <Calendar size={12} className="inline mr-1" />
            To
          </label>
          <input
            type="date"
            id="endDate"
            value={filters.endDate || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, endDate: e.target.value })
            }
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white hover:border-gray-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 font-medium">
            {[
              filters.searchQuery && 'search',
              filters.category !== 'All' && 'category',
              (filters.startDate || filters.endDate) && 'date range',
            ]
              .filter(Boolean)
              .join(', ')}{' '}
            active
          </p>
        </div>
      )}
    </div>
  );
}
