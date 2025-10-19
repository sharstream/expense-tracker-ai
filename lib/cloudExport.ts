import {
  CloudProvider,
  CloudService,
  ExportTemplate,
  ExportTemplateConfig,
  ExportHistoryItem,
  ScheduledExport,
  ScheduleFrequency,
  ShareableLink,
  CloudSyncStatus,
} from '@/types/cloud';

/**
 * Cloud service configurations
 */
export const CLOUD_SERVICES: CloudService[] = [
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: '📊',
    color: 'from-green-500 to-emerald-600',
    connected: false,
    description: 'Export directly to Google Sheets',
    features: ['Real-time sync', 'Collaborative editing', 'Auto-formatting'],
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '📁',
    color: 'from-blue-500 to-blue-600',
    connected: false,
    description: 'Save to Google Drive folder',
    features: ['Cloud backup', 'File versioning', 'Easy sharing'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    color: 'from-blue-600 to-indigo-600',
    connected: false,
    description: 'Sync with Dropbox',
    features: ['Automatic backup', 'File recovery', 'Cross-device access'],
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    color: 'from-blue-500 to-sky-600',
    connected: false,
    description: 'Save to Microsoft OneDrive',
    features: ['Office integration', 'Cloud storage', 'Collaboration'],
  },
  {
    id: 'email',
    name: 'Email',
    icon: '✉️',
    color: 'from-purple-500 to-pink-600',
    connected: true, // Always available
    description: 'Send via email',
    features: ['Direct delivery', 'Multiple recipients', 'Scheduled sending'],
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    color: 'from-purple-600 to-pink-500',
    connected: false,
    description: 'Post to Slack channel',
    features: ['Team notifications', 'Channel posting', 'Direct messages'],
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📝',
    color: 'from-gray-700 to-gray-900',
    connected: false,
    description: 'Export to Notion database',
    features: ['Database integration', 'Rich formatting', 'Linked records'],
  },
  {
    id: 'airtable',
    name: 'Airtable',
    icon: '🗂️',
    color: 'from-orange-500 to-red-500',
    connected: false,
    description: 'Sync with Airtable base',
    features: ['Database sync', 'Automatic updates', 'Custom views'],
  },
];

/**
 * Export template configurations
 */
export const EXPORT_TEMPLATES: ExportTemplateConfig[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'IRS-ready expense report with deductible amounts',
    icon: '📋',
    color: 'from-blue-500 to-indigo-600',
    includeFields: ['date', 'amount', 'category', 'description', 'tax-category', 'deductible-amount'],
    filterOptions: {
      dateRange: true,
      categories: true,
    },
    outputFormat: 'pdf',
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Concise monthly overview with totals',
    icon: '📅',
    color: 'from-green-500 to-emerald-600',
    includeFields: ['date', 'amount', 'category', 'monthly-total', 'category-breakdown'],
    filterOptions: {
      dateRange: true,
    },
    outputFormat: 'pdf',
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Detailed breakdown by spending category',
    icon: '📊',
    color: 'from-purple-500 to-pink-600',
    includeFields: ['category', 'total', 'percentage', 'trends', 'top-expenses'],
    filterOptions: {
      dateRange: true,
      categories: true,
    },
    outputFormat: 'spreadsheet',
  },
  {
    id: 'quarterly-report',
    name: 'Quarterly Report',
    description: 'Business quarterly financial summary',
    icon: '📈',
    color: 'from-orange-500 to-red-600',
    includeFields: ['date', 'amount', 'category', 'quarterly-total', 'yoy-comparison'],
    filterOptions: {
      dateRange: true,
    },
    outputFormat: 'pdf',
  },
  {
    id: 'custom',
    name: 'Custom Export',
    description: 'Configure your own export format',
    icon: '⚙️',
    color: 'from-gray-600 to-gray-800',
    includeFields: [],
    filterOptions: {
      dateRange: true,
      categories: true,
    },
    outputFormat: 'csv',
  },
];

/**
 * Generate a shareable link (simulated)
 */
export function generateShareableLink(expenseCount: number): ShareableLink {
  const id = Math.random().toString(36).substring(2, 15);
  const url = `https://expenses.app/share/${id}`;
  const qrCode = url; // In real app, would generate actual QR code data

  return {
    id,
    url,
    qrCode,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    accessCount: 0,
    maxAccess: 100,
    password: false,
    createdAt: new Date(),
  };
}

/**
 * Simulate cloud export
 */
export async function exportToCloud(
  provider: CloudProvider,
  template: ExportTemplate,
  recordCount: number
): Promise<ExportHistoryItem> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const historyItem: ExportHistoryItem = {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    template,
    destination: provider,
    status: 'completed',
    recordCount,
    fileSize: `${(recordCount * 0.5).toFixed(1)} KB`,
  };

  // Save to localStorage
  const history = getExportHistory();
  history.unshift(historyItem);
  localStorage.setItem('export-history', JSON.stringify(history.slice(0, 50))); // Keep last 50

  return historyItem;
}

/**
 * Get export history from localStorage
 */
export function getExportHistory(): ExportHistoryItem[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('export-history');
  if (!stored) return [];

  const history = JSON.parse(stored);
  // Convert timestamp strings back to Date objects
  return history.map((item: any) => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));
}

/**
 * Get scheduled exports from localStorage
 */
export function getScheduledExports(): ScheduledExport[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('scheduled-exports');
  if (!stored) return [];

  const scheduled = JSON.parse(stored);
  return scheduled.map((item: any) => ({
    ...item,
    nextRun: new Date(item.nextRun),
    lastRun: item.lastRun ? new Date(item.lastRun) : undefined,
  }));
}

/**
 * Save scheduled export
 */
export function saveScheduledExport(scheduled: ScheduledExport): void {
  const existing = getScheduledExports();
  const index = existing.findIndex((s) => s.id === scheduled.id);

  if (index >= 0) {
    existing[index] = scheduled;
  } else {
    existing.push(scheduled);
  }

  localStorage.setItem('scheduled-exports', JSON.stringify(existing));
}

/**
 * Delete scheduled export
 */
export function deleteScheduledExport(id: string): void {
  const existing = getScheduledExports();
  const filtered = existing.filter((s) => s.id !== id);
  localStorage.setItem('scheduled-exports', JSON.stringify(filtered));
}

/**
 * Get cloud sync status (simulated)
 */
export function getCloudSyncStatus(): CloudSyncStatus[] {
  return [
    {
      provider: 'google-sheets',
      status: 'synced',
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      nextSync: new Date(Date.now() + 55 * 60 * 1000),
      itemsSynced: 24,
    },
    {
      provider: 'dropbox',
      status: 'idle',
    },
  ];
}

/**
 * Simulate email export
 */
export async function sendEmailExport(
  recipients: string[],
  template: ExportTemplate,
  recordCount: number
): Promise<void> {
  // Simulate sending
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log(`📧 Email sent to ${recipients.join(', ')} with ${template} template (${recordCount} records)`);
}

/**
 * Format schedule frequency for display
 */
export function formatScheduleFrequency(frequency: ScheduleFrequency): string {
  const map: Record<ScheduleFrequency, string> = {
    daily: 'Every day at 9:00 AM',
    weekly: 'Every Monday at 9:00 AM',
    monthly: '1st of every month at 9:00 AM',
    quarterly: 'First Monday of quarter at 9:00 AM',
  };
  return map[frequency];
}

/**
 * Calculate next run date based on frequency
 */
export function calculateNextRun(frequency: ScheduleFrequency): Date {
  const now = new Date();
  const result = new Date(now);

  switch (frequency) {
    case 'daily':
      result.setDate(result.getDate() + 1);
      break;
    case 'weekly':
      result.setDate(result.getDate() + 7);
      break;
    case 'monthly':
      result.setMonth(result.getMonth() + 1);
      result.setDate(1);
      break;
    case 'quarterly':
      result.setMonth(result.getMonth() + 3);
      result.setDate(1);
      break;
  }

  result.setHours(9, 0, 0, 0);
  return result;
}
