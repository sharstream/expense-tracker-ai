'use client';

import { Expense } from '@/types/expense';
import { downloadCSV } from '@/lib/expenses';
import { Download, Check } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonProps {
  expenses: Expense[];
}

export default function ExportButton({ expenses }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(expenses, filename);
      setTimeout(() => {
        setIsExporting(false);
        setExported(true);
        setTimeout(() => setExported(false), 2000);
      }, 800);
    } catch (error) {
      console.error('Error exporting expenses:', error);
      alert('Failed to export expenses');
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || expenses.length === 0}
      className={`group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100 ${
        exported
          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white focus:ring-green-400 shadow-green-200/50 dark:shadow-green-900/50'
          : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-400 shadow-emerald-200/50 hover:shadow-emerald-300/50 dark:shadow-emerald-900/50 dark:hover:shadow-emerald-800/50'
      }`}
      title="Export to CSV"
    >
      {exported ? (
        <>
          <Check size={18} className="animate-bounce" />
          Exported!
        </>
      ) : isExporting ? (
        <>
          <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Exporting...
        </>
      ) : (
        <>
          <Download size={18} className="transition-transform group-hover/btn:translate-y-0.5" />
          Export CSV
        </>
      )}
    </button>
  );
}
