'use client';

import { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import {
  ExportFormat,
  exportExpenses,
  generateExportPreview,
  filterExpensesForExport,
} from '@/lib/export';
import {
  X,
  FileText,
  FileJson,
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Eye,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { format as formatDate } from 'date-fns';

interface ExportModalProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

const FORMAT_OPTIONS: {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}[] = [
  {
    format: 'pdf',
    label: 'PDF Document',
    icon: <FileText className="w-5 h-5" />,
    description: 'Professional report with tables and formatting',
    color: 'from-red-400 to-red-600',
  },
  {
    format: 'csv',
    label: 'CSV Spreadsheet',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    description: 'Compatible with Excel, Google Sheets, etc.',
    color: 'from-green-400 to-green-600',
  },
  {
    format: 'json',
    label: 'JSON Data',
    icon: <FileJson className="w-5 h-5" />,
    description: 'Structured data for developers and APIs',
    color: 'from-purple-400 to-purple-600',
  },
];

export default function ExportModal({ expenses, isOpen, onClose }: ExportModalProps) {
  const [step, setStep] = useState<'configure' | 'preview'>('configure');
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [filename, setFilename] = useState('expense-report');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Generate preview data
  const preview = useMemo(
    () =>
      generateExportPreview(
        expenses,
        startDate || undefined,
        endDate || undefined,
        selectedCategories.length > 0 ? selectedCategories : undefined
      ),
    [expenses, startDate, endDate, selectedCategories]
  );

  // Get filtered expenses for preview table
  const filteredExpenses = useMemo(
    () =>
      filterExpensesForExport(
        expenses,
        startDate || undefined,
        endDate || undefined,
        selectedCategories.length > 0 ? selectedCategories : undefined
      ),
    [expenses, startDate, endDate, selectedCategories]
  );

  const toggleCategory = (category: ExpenseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    // Simulate processing delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      exportExpenses({
        format,
        filename,
        expenses,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        includeMetadata,
      });

      setExportSuccess(true);
      setTimeout(() => {
        onClose();
        resetModal();
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const resetModal = () => {
    setStep('configure');
    setFormat('pdf');
    setFilename('expense-report');
    setStartDate('');
    setEndDate('');
    setSelectedCategories([]);
    setIncludeMetadata(true);
    setExportSuccess(false);
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      setTimeout(resetModal, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8">
          <button
            onClick={handleClose}
            disabled={isExporting}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Advanced Export</h2>
              <p className="text-white/80 mt-1">
                Customize and export your expense data
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex gap-2 mt-6">
            <div
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                step === 'configure' ? 'bg-white' : 'bg-white/40'
              }`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                step === 'preview' ? 'bg-white' : 'bg-white/40'
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 'configure' ? (
            <>
              {/* Format Selection */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Export Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FORMAT_OPTIONS.map((option) => (
                    <button
                      key={option.format}
                      onClick={() => setFormat(option.format)}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                        format === option.format
                          ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${option.color} text-white mb-3`}
                      >
                        {option.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>

                      {format === option.format && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filename */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  File Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="my-expense-report"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    .{format}
                  </span>
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Filter className="w-4 h-4" />
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    No categories selected - all categories will be included
                  </p>
                )}
              </div>

              {/* Include Metadata */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Include summary metadata
                    </span>
                    <p className="text-xs text-gray-600">
                      Add totals, statistics, and generation info to export
                    </p>
                  </div>
                </label>
              </div>

              {/* Export Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Export Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Records</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {preview.totalRecords}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${preview.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Date Range</p>
                    <p className="text-sm font-bold text-gray-900">{preview.dateRange}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">File Size</p>
                    <p className="text-sm font-bold text-gray-900">
                      ~{preview.estimatedSize}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Preview Table */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Preview ({filteredExpenses.length} records)
                  </h3>
                </div>

                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredExpenses.slice(0, 50).map((expense, index) => (
                          <tr
                            key={expense.id}
                            className="hover:bg-blue-50/50 transition-colors"
                            style={{
                              animation: `slideIn 0.3s ease-out ${index * 0.02}s both`,
                            }}
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {formatDate(new Date(expense.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-right text-gray-900">
                              ${expense.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {expense.description.length > 50
                                ? expense.description.substring(0, 47) + '...'
                                : expense.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredExpenses.length > 50 && (
                    <div className="bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
                      Showing first 50 of {filteredExpenses.length} records
                    </div>
                  )}

                  {filteredExpenses.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-gray-500">
                        No expenses match your filter criteria
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {step === 'configure' ? (
                <span>Step 1 of 2: Configure export options</span>
              ) : (
                <span>Step 2 of 2: Review and export</span>
              )}
            </div>

            <div className="flex gap-3">
              {step === 'preview' && (
                <button
                  onClick={() => setStep('configure')}
                  disabled={isExporting}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  Back
                </button>
              )}

              {step === 'configure' ? (
                <button
                  onClick={() => setStep('preview')}
                  disabled={preview.totalRecords === 0}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Preview Export
                  <Eye className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleExport}
                  disabled={isExporting || preview.totalRecords === 0}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : exportSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Success!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Now
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
