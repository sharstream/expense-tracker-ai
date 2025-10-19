'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseFilters } from '@/types/expense';
import { storage } from '@/lib/storage';
import {
  filterExpenses,
  calculateSummary,
  sortExpenses,
} from '@/lib/expenses';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SummaryCards from '@/components/SummaryCards';
import CategoryChart from '@/components/CategoryChart';
import ExpenseFiltersComponent from '@/components/ExpenseFilters';
import ExportButton from '@/components/ExportButton';
import TaxReport from '@/components/TaxReport';
import { Plus, X, Wallet, Receipt, FileText } from 'lucide-react';

type TabView = 'expenses' | 'taxes';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('expenses');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({ category: 'All' });
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storage.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  // Apply filters whenever expenses or filters change
  useEffect(() => {
    const filtered = filterExpenses(expenses, filters);
    const sorted = sortExpenses(filtered, 'date');
    setFilteredExpenses(sorted);
  }, [expenses, filters]);

  const handleAddExpense = (expense: Expense) => {
    const newExpenses = storage.addExpense(expense);
    setExpenses(newExpenses);
    setShowForm(false);
  };

  const handleUpdateExpense = (expense: Expense) => {
    const newExpenses = storage.updateExpense(expense.id, expense);
    setExpenses(newExpenses);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    const newExpenses = storage.deleteExpense(id);
    setExpenses(newExpenses);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleClearFilters = () => {
    setFilters({ category: 'All' });
  };

  const summary = calculateSummary(expenses);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <div className="absolute inset-0 rounded-full bg-primary-100/20 blur-xl animate-pulse"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading your expenses...</p>
          <p className="text-sm text-gray-500 mt-1">Just a moment</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200/50">
                  <Wallet className="text-white" size={32} />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 blur-xl opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Expense Tracker
                </h1>
                <p className="text-gray-600 font-medium mt-1">Manage your finances with elegance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportButton expenses={filteredExpenses} />
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingExpense(null);
                }}
                className={`group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ${
                  showForm
                    ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 focus:ring-gray-400 shadow-gray-200/50'
                    : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-400 shadow-primary-200/50 hover:shadow-primary-300/50'
                }`}
              >
                {showForm ? (
                  <>
                    <X size={18} className="transition-transform group-hover/btn:rotate-90" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus size={18} className="transition-transform group-hover/btn:rotate-90" />
                    Add Expense
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'expenses'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200/50 scale-105'
                : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <Receipt size={20} />
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('taxes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'taxes'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200/50 scale-105'
                : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <FileText size={20} />
            Tax Report
          </button>
        </div>

        {activeTab === 'expenses' ? (
          <>
            {/* Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Add/Edit Expense Form */}
            {(showForm || editingExpense) && (
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 mb-8 shadow-lg shadow-gray-200/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-200/50">
                    {editingExpense ? (
                      <span className="text-white text-xl">✎</span>
                    ) : (
                      <Plus size={20} className="text-white" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                  </h2>
                </div>
                <ExpenseForm
                  onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                  onCancel={editingExpense ? handleCancelEdit : undefined}
                  initialData={editingExpense || undefined}
                  mode={editingExpense ? 'edit' : 'create'}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <ExpenseFiltersComponent
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Expense List */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Expenses
                  </h2>
                  {filteredExpenses.length > 0 && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                      {filteredExpenses.length} {filteredExpenses.length === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
              </div>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryChart categoryBreakdown={summary.categoryBreakdown} />
          </div>
            </div>
          </>
        ) : (
          /* Tax Report Tab */
          <TaxReport expenses={expenses} />
        )}
      </div>
    </main>
  );
}
