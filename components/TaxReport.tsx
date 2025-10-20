'use client';

import { Expense } from '@/types/expense';
import { TaxCategory, TAX_CATEGORY_MAP } from '@/types/tax';
import { calculateTaxSummary, downloadTaxReport, TAX_TIPS } from '@/lib/tax';
import { formatCurrency } from '@/lib/expenses';
import {
  FileText,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { getYear } from 'date-fns';

interface TaxReportProps {
  expenses: Expense[];
}

// IRS category colors and icons
const TAX_CATEGORY_COLORS: Record<TaxCategory, string> = {
  'Meals & Entertainment': 'from-orange-400 to-orange-600',
  'Travel': 'from-blue-400 to-blue-600',
  'Vehicle Expenses': 'from-purple-400 to-purple-600',
  'Supplies': 'from-pink-400 to-pink-600',
  'Utilities': 'from-red-400 to-red-600',
  'Other Business Expenses': 'from-gray-400 to-gray-600',
};

const TAX_CATEGORY_ICONS: Record<TaxCategory, string> = {
  'Meals & Entertainment': '🍽️',
  'Travel': '✈️',
  'Vehicle Expenses': '🚗',
  'Supplies': '📦',
  'Utilities': '⚡',
  'Other Business Expenses': '💼',
};

export default function TaxReport({ expenses }: TaxReportProps) {
  const availableYears = useMemo(() => {
    const years = new Set(expenses.map(exp => getYear(new Date(exp.date))));
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses]);

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] || new Date().getFullYear()
  );
  const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const taxSummary = useMemo(
    () => calculateTaxSummary(expenses, selectedYear),
    [expenses, selectedYear]
  );

  const toggleQuarter = (quarter: string) => {
    const newExpanded = new Set(expandedQuarters);
    if (newExpanded.has(quarter)) {
      newExpanded.delete(quarter);
    } else {
      newExpanded.add(quarter);
    }
    setExpandedQuarters(newExpanded);
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      downloadTaxReport(expenses, selectedYear);
      setTimeout(() => {
        setIsExporting(false);
        setExported(true);
        setTimeout(() => setExported(false), 2000);
      }, 800);
    } catch (error) {
      console.error('Error exporting tax report:', error);
      alert('Failed to export tax report');
      setIsExporting(false);
    }
  };

  const estimatedTaxSavings = taxSummary.totalDeductible * 0.25; // Assuming 25% tax bracket

  if (expenses.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-4">
          <FileText size={40} className="text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Tax Data Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Add expenses to generate your tax report</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200/50 dark:shadow-primary-900/50">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Tax Report</h2>
              <p className="text-gray-600 font-medium">IRS Schedule C Ready</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white hover:border-gray-400 cursor-pointer font-semibold"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>Tax Year {year}</option>
              ))}
            </select>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ${
                exported
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                  : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
              }`}
            >
              {exported ? (
                <>
                  <CheckCircle size={18} className="animate-bounce" />
                  Downloaded!
                </>
              ) : isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Export Tax Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Expenses */}
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/60 hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Expenses</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{selectedYear}</p>
              </div>
            </div>
            <p className="text-4xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {formatCurrency(taxSummary.totalExpenses)}
            </p>
          </div>
        </div>

        {/* Total Deductible */}
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-green-200/60 hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tax Deductible</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">IRS Approved</p>
              </div>
            </div>
            <p className="text-4xl font-black bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent">
              {formatCurrency(taxSummary.totalDeductible)}
            </p>
          </div>
        </div>

        {/* Estimated Savings */}
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/60 hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Est. Tax Savings</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">25% bracket</p>
              </div>
            </div>
            <p className="text-4xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {formatCurrency(estimatedTaxSavings)}
            </p>
          </div>
        </div>
      </div>

      {/* IRS Categories Breakdown */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span>📋</span> IRS Schedule C Categories
        </h3>
        <div className="space-y-4">
          {Object.entries(taxSummary.byTaxCategory)
            .filter(([_, data]) => data.count > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([category, data], index) => {
              const taxCategory = category as TaxCategory;
              const percentage = (data.total / taxSummary.totalExpenses) * 100;
              const deductionPercentage = (data.deductible / data.total) * 100;

              return (
                <div
                  key={category}
                  className="group"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TAX_CATEGORY_COLORS[taxCategory]} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        {TAX_CATEGORY_ICONS[taxCategory]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{category}</h4>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                            {data.count} items
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Info size={12} />
                          {TAX_TIPS[taxCategory]}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black bg-gradient-to-br ${TAX_CATEGORY_COLORS[taxCategory]} bg-clip-text text-transparent`}>
                        {formatCurrency(data.total)}
                      </div>
                      <p className="text-xs text-green-600 font-semibold">
                        {formatCurrency(data.deductible)} deductible
                      </p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-2">
                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${TAX_CATEGORY_COLORS[taxCategory]} rounded-full transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {deductionPercentage < 100 && (
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <AlertCircle size={12} />
                        <span>Only {deductionPercentage.toFixed(0)}% deductible (IRS rules)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Quarterly Breakdown */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Calendar size={20} />
          Quarterly Breakdown
        </h3>
        <div className="space-y-3">
          {taxSummary.quarters.map((quarter, index) => {
            const isExpanded = expandedQuarters.has(quarter.quarter);
            const hasData = quarter.total > 0;

            if (!hasData) return null;

            return (
              <div
                key={quarter.quarter}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 dark:border-gray-600"
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                <button
                  onClick={() => toggleQuarter(quarter.quarter)}
                  className="w-full p-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                      {quarter.quarter}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{quarter.months}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {formatCurrency(quarter.total)} total • {formatCurrency(quarter.deductible)} deductible
                      </p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      {Object.entries(quarter.byCategory)
                        .filter(([_, amount]) => amount > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => {
                          const taxCategory = category as TaxCategory;
                          return (
                            <div key={category} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{TAX_CATEGORY_ICONS[taxCategory]}</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(amount)}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
