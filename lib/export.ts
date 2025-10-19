import { Expense, ExpenseCategory } from '@/types/expense';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  expenses: Expense[];
  startDate?: string;
  endDate?: string;
  categories?: ExpenseCategory[];
  includeMetadata?: boolean;
}

export interface ExportPreview {
  totalRecords: number;
  totalAmount: number;
  dateRange: string;
  categories: string[];
  estimatedSize: string;
}

/**
 * Filter expenses based on export criteria
 */
export function filterExpensesForExport(
  expenses: Expense[],
  startDate?: string,
  endDate?: string,
  categories?: ExpenseCategory[]
): Expense[] {
  let filtered = [...expenses];

  // Filter by date range
  if (startDate) {
    filtered = filtered.filter((expense) => expense.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((expense) => expense.date <= endDate);
  }

  // Filter by categories
  if (categories && categories.length > 0) {
    filtered = filtered.filter((expense) => categories.includes(expense.category));
  }

  return filtered.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Generate export preview metadata
 */
export function generateExportPreview(
  expenses: Expense[],
  startDate?: string,
  endDate?: string,
  categories?: ExpenseCategory[]
): ExportPreview {
  const filtered = filterExpensesForExport(expenses, startDate, endDate, categories);

  const totalAmount = filtered.reduce((sum, expense) => sum + expense.amount, 0);
  const uniqueCategories = [...new Set(filtered.map((e) => e.category))];

  // Calculate date range
  let dateRange = 'All time';
  if (filtered.length > 0) {
    const dates = filtered.map((e) => e.date).sort();
    const earliest = format(new Date(dates[0]), 'MMM d, yyyy');
    const latest = format(new Date(dates[dates.length - 1]), 'MMM d, yyyy');
    dateRange = earliest === latest ? earliest : `${earliest} - ${latest}`;
  }

  // Estimate file size (rough approximation)
  const avgRecordSize = 150; // bytes per record
  const estimatedBytes = filtered.length * avgRecordSize;
  const estimatedSize =
    estimatedBytes < 1024
      ? `${estimatedBytes} B`
      : estimatedBytes < 1024 * 1024
      ? `${(estimatedBytes / 1024).toFixed(1)} KB`
      : `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;

  return {
    totalRecords: filtered.length,
    totalAmount,
    dateRange,
    categories: uniqueCategories,
    estimatedSize,
  };
}

/**
 * Export to CSV format
 */
export function exportToCSV(options: ExportOptions): void {
  const { expenses, filename } = options;

  // CSV headers
  const headers = ['Date', 'Amount', 'Category', 'Description', 'Created', 'Updated'];

  // Convert expenses to CSV rows
  const rows = expenses.map((expense) => [
    format(new Date(expense.date), 'yyyy-MM-dd'),
    expense.amount.toFixed(2),
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes
    format(new Date(expense.createdAt), 'yyyy-MM-dd HH:mm:ss'),
    format(new Date(expense.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
  ]);

  // Add summary section if metadata included
  const csvLines: string[] = [];

  if (options.includeMetadata) {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    csvLines.push('EXPENSE EXPORT SUMMARY');
    csvLines.push(`Generated,${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
    csvLines.push(`Total Records,${expenses.length}`);
    csvLines.push(`Total Amount,${totalAmount.toFixed(2)}`);
    csvLines.push('');
    csvLines.push('');
  }

  // Add data
  csvLines.push(headers.join(','));
  rows.forEach((row) => csvLines.push(row.join(',')));

  const csvContent = csvLines.join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export to JSON format
 */
export function exportToJSON(options: ExportOptions): void {
  const { expenses, filename, includeMetadata } = options;

  const jsonData = includeMetadata
    ? {
        metadata: {
          generatedAt: new Date().toISOString(),
          totalRecords: expenses.length,
          totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
          dateRange: {
            start: expenses.length > 0 ? expenses[expenses.length - 1].date : null,
            end: expenses.length > 0 ? expenses[0].date : null,
          },
          categories: [...new Set(expenses.map((e) => e.category))],
        },
        expenses,
      }
    : { expenses };

  const jsonString = JSON.stringify(jsonData, null, 2);
  downloadFile(jsonString, `${filename}.json`, 'application/json;charset=utf-8;');
}

/**
 * Export to PDF format with professional formatting
 */
export function exportToPDF(options: ExportOptions): void {
  const { expenses, filename, includeMetadata } = options;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Expense Report', pageWidth / 2, 15, { align: 'center' });

  let yPosition = 25;

  // Metadata section
  if (includeMetadata) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categories = [...new Set(expenses.map((e) => e.category))];

    doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy - HH:mm:ss')}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Total Records: ${expenses.length}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Categories: ${categories.join(', ')}`, 14, yPosition);
    yPosition += 10;
  }

  // Table data
  const tableData = expenses.map((expense) => [
    format(new Date(expense.date), 'MMM d, yyyy'),
    `$${expense.amount.toFixed(2)}`,
    expense.category,
    expense.description.length > 40
      ? expense.description.substring(0, 37) + '...'
      : expense.description,
  ]);

  // Generate table
  autoTable(doc, {
    startY: yPosition,
    head: [['Date', 'Amount', 'Category', 'Description']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246], // Blue
      fontSize: 10,
      fontStyle: 'bold',
      textColor: [255, 255, 255],
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25, halign: 'right' },
      2: { cellWidth: 35 },
      3: { cellWidth: 'auto' },
    },
    margin: { top: 10, left: 14, right: 14 },
  });

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`${filename}.pdf`);
}

/**
 * Main export function that routes to appropriate exporter
 */
export function exportExpenses(options: ExportOptions): void {
  // Filter expenses based on criteria
  const filteredExpenses = filterExpensesForExport(
    options.expenses,
    options.startDate,
    options.endDate,
    options.categories
  );

  const exportOptions = {
    ...options,
    expenses: filteredExpenses,
  };

  switch (options.format) {
    case 'csv':
      exportToCSV(exportOptions);
      break;
    case 'json':
      exportToJSON(exportOptions);
      break;
    case 'pdf':
      exportToPDF(exportOptions);
      break;
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
}

/**
 * Utility function to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
