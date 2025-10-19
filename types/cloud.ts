import { Expense } from './expense';

export type CloudProvider =
  | 'google-sheets'
  | 'google-drive'
  | 'dropbox'
  | 'onedrive'
  | 'email'
  | 'slack'
  | 'notion'
  | 'airtable';

export type ExportTemplate =
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'quarterly-report'
  | 'custom';

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'scheduled';

export interface CloudService {
  id: CloudProvider;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  description: string;
  features: string[];
}

export interface ExportTemplateConfig {
  id: ExportTemplate;
  name: string;
  description: string;
  icon: string;
  color: string;
  includeFields: string[];
  filterOptions?: {
    dateRange?: boolean;
    categories?: boolean;
  };
  outputFormat: 'pdf' | 'csv' | 'json' | 'spreadsheet';
}

export interface ExportHistoryItem {
  id: string;
  timestamp: Date;
  template: ExportTemplate;
  destination: CloudProvider | 'download';
  status: ExportStatus;
  recordCount: number;
  fileSize?: string;
  recipient?: string;
  error?: string;
  shareLink?: string;
}

export interface ScheduledExport {
  id: string;
  name: string;
  template: ExportTemplate;
  destination: CloudProvider;
  frequency: ScheduleFrequency;
  nextRun: Date;
  lastRun?: Date;
  enabled: boolean;
  recipients?: string[];
  filterSettings?: {
    categories?: string[];
    dateRange?: 'last-month' | 'last-quarter' | 'last-year';
  };
}

export interface ShareableLink {
  id: string;
  url: string;
  qrCode: string;
  expiresAt: Date;
  accessCount: number;
  maxAccess?: number;
  password?: boolean;
  createdAt: Date;
}

export interface EmailExportConfig {
  recipients: string[];
  subject: string;
  message: string;
  template: ExportTemplate;
  attachmentFormat: 'pdf' | 'csv' | 'json';
  includeInline?: boolean;
}

export interface CloudSyncStatus {
  provider: CloudProvider;
  status: 'idle' | 'syncing' | 'synced' | 'error';
  lastSync?: Date;
  nextSync?: Date;
  itemsSynced?: number;
  error?: string;
}
