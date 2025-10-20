'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import {
  CloudProvider,
  ExportTemplate,
  ScheduleFrequency,
  ExportHistoryItem,
  ScheduledExport,
  ShareableLink,
} from '@/types/cloud';
import {
  CLOUD_SERVICES,
  EXPORT_TEMPLATES,
  exportToCloud,
  getExportHistory,
  getScheduledExports,
  saveScheduledExport,
  deleteScheduledExport,
  generateShareableLink,
  sendEmailExport,
  formatScheduleFrequency,
  calculateNextRun,
} from '@/lib/cloudExport';
import {
  X,
  Cloud,
  Mail,
  Share2,
  Clock,
  History,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  Zap,
  TrendingUp,
  Calendar,
  Users,
  Link as LinkIcon,
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface CloudExportHubProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

type TabView = 'export' | 'scheduled' | 'history' | 'share';

export default function CloudExportHub({ expenses, isOpen, onClose }: CloudExportHubProps) {
  const [activeTab, setActiveTab] = useState<TabView>('export');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('monthly-summary');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledExport[]>([]);
  const [shareLink, setShareLink] = useState<ShareableLink | null>(null);

  // Email export states
  const [emailRecipients, setEmailRecipients] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState('Your Expense Report');
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Schedule export states
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('monthly');
  const [scheduleProvider, setScheduleProvider] = useState<CloudProvider>('google-sheets');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setHistory(getExportHistory());
    setScheduled(getScheduledExports());
  };

  const handleExportNow = async () => {
    if (!selectedProvider) return;

    setIsExporting(true);
    setExportSuccess(false);

    try {
      await exportToCloud(selectedProvider, selectedTemplate, expenses.length);
      setExportSuccess(true);
      loadData();

      setTimeout(() => {
        setExportSuccess(false);
        setSelectedProvider(null);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = async () => {
    const recipients = emailRecipients.split(',').map((r) => r.trim());
    if (recipients.length === 0) return;

    setIsExporting(true);

    try {
      await sendEmailExport(recipients, selectedTemplate, expenses.length);
      setExportSuccess(true);
      setShowEmailForm(false);
      setEmailRecipients('');

      // Add to history
      const historyItem: ExportHistoryItem = {
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date(),
        template: selectedTemplate,
        destination: 'email',
        status: 'completed',
        recordCount: expenses.length,
        recipient: recipients.join(', '),
      };

      const updatedHistory = [historyItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('export-history', JSON.stringify(updatedHistory.slice(0, 50)));

      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('Email export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleExport = () => {
    if (!scheduleName) return;

    const newSchedule: ScheduledExport = {
      id: Math.random().toString(36).substring(2, 15),
      name: scheduleName,
      template: selectedTemplate,
      destination: scheduleProvider,
      frequency: scheduleFrequency,
      nextRun: calculateNextRun(scheduleFrequency),
      enabled: true,
    };

    saveScheduledExport(newSchedule);
    setScheduled([...scheduled, newSchedule]);
    setShowScheduleForm(false);
    setScheduleName('');
  };

  const handleDeleteSchedule = (id: string) => {
    deleteScheduledExport(id);
    setScheduled(scheduled.filter((s) => s.id !== id));
  };

  const handleGenerateShareLink = () => {
    const link = generateShareableLink(expenses.length);
    setShareLink(link);
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink.url);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      setTimeout(() => {
        setActiveTab('export');
        setSelectedProvider(null);
        setShowEmailForm(false);
        setShowScheduleForm(false);
        setShareLink(null);
      }, 300);
    }
  };

  if (!isOpen) return null;

  const selectedTemplateConfig = EXPORT_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8">
          <button
            onClick={handleClose}
            disabled={isExporting}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Cloud Export Hub</h2>
              <p className="text-white/90 mt-1">
                Export, share, and sync your data across platforms
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'export' as TabView, label: 'Export', icon: Download },
              { id: 'scheduled' as TabView, label: 'Scheduled', icon: Clock },
              { id: 'history' as TabView, label: 'History', icon: History },
              { id: 'share' as TabView, label: 'Share', icon: Share2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
          {activeTab === 'export' && (
            <div className="space-y-8">
              {/* Template Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Choose Export Template</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EXPORT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md bg-white'
                      }`}
                    >
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${template.color} text-white mb-3 text-2xl`}
                      >
                        {template.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{template.description}</p>

                      {selectedTemplate === template.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-6 h-6 text-purple-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Export */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Email Export</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Send directly to recipients</p>
                    </div>
                  </div>

                  {!showEmailForm ? (
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Configure Email Export
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="recipient@example.com, another@example.com"
                        value={emailRecipients}
                        onChange={(e) => setEmailRecipients(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowEmailForm(false)}
                          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEmailExport}
                          disabled={!emailRecipients || isExporting}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isExporting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4" />
                              Send
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Export */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Schedule Export</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Automatic recurring exports</p>
                    </div>
                  </div>

                  {!showScheduleForm ? (
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Create Schedule
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Schedule name"
                        value={scheduleName}
                        onChange={(e) => setScheduleName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                      />
                      <select
                        value={scheduleFrequency}
                        onChange={(e) => setScheduleFrequency(e.target.value as ScheduleFrequency)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowScheduleForm(false)}
                          className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleScheduleExport}
                          disabled={!scheduleName}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cloud Services */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Cloud className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Cloud Services</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {CLOUD_SERVICES.filter((s) => s.connected).length} Connected
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CLOUD_SERVICES.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedProvider(service.id)}
                      disabled={!service.connected && service.id !== 'email'}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                        selectedProvider === service.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                          : service.connected || service.id === 'email'
                          ? 'border-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md bg-white'
                          : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`text-3xl p-2 rounded-xl bg-gradient-to-br ${service.color}`}
                        >
                          {service.icon}
                        </div>
                        {service.connected && (
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 text-sm">{service.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{service.description}</p>

                      {!service.connected && service.id !== 'email' && (
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Click to connect</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              {selectedProvider && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Ready to Export</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        {expenses.length} expenses with {selectedTemplateConfig?.name} template
                      </p>
                    </div>
                    <button
                      onClick={handleExportNow}
                      disabled={isExporting}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-3"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Exporting...
                        </>
                      ) : exportSuccess ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Success!
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Export Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Scheduled Exports</h3>
                  <p className="text-sm text-gray-600 mt-1">Automatic recurring exports</p>
                </div>
                <button
                  onClick={() => setShowScheduleForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Schedule
                </button>
              </div>

              {scheduled.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-gray-900 mb-2">No scheduled exports</h4>
                  <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Create your first automated export schedule</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduled.map((schedule) => {
                    const template = EXPORT_TEMPLATES.find((t) => t.id === schedule.template);
                    const service = CLOUD_SERVICES.find((s) => s.id === schedule.destination);

                    return (
                      <div
                        key={schedule.id}
                        className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100">{schedule.name}</h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  schedule.enabled
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {schedule.enabled ? 'Active' : 'Paused'}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>Template: {template?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{service?.icon}</span>
                                <span>Destination: {service?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatScheduleFrequency(schedule.frequency)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Next run:{' '}
                                  {formatDate(schedule.nextRun, 'MMM d, yyyy - h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Export History</h3>
                <p className="text-sm text-gray-600 mt-1">Recent exports and their status</p>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-gray-900 mb-2">No export history</h4>
                  <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Your exports will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => {
                    const template = EXPORT_TEMPLATES.find((t) => t.id === item.template);
                    const service = CLOUD_SERVICES.find((s) => s.id === item.destination);

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
                        style={{
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-br ${
                                template?.color || 'from-gray-400 to-gray-600'
                              }`}
                            >
                              <span className="text-2xl">{template?.icon || '📄'}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100">{template?.name}</h4>
                              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
                                <span className="flex items-center gap-1">
                                  {service?.icon || '📧'}
                                  {item.destination === 'email'
                                    ? 'Email'
                                    : service?.name || item.destination}
                                </span>
                                <span>•</span>
                                <span>{item.recordCount} records</span>
                                {item.fileSize && (
                                  <>
                                    <span>•</span>
                                    <span>{item.fileSize}</span>
                                  </>
                                )}
                              </div>
                              {item.recipient && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Sent to: {item.recipient}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                                item.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : item.status === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {item.status === 'completed' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {item.status}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(item.timestamp, 'MMM d, h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Share Your Data</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Generate secure links to share your expense data
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Generate Link */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                      <LinkIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Shareable Link</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Create a secure access link</p>
                    </div>
                  </div>

                  {!shareLink ? (
                    <button
                      onClick={handleGenerateShareLink}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Generate Share Link
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border-2 border-blue-300">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={shareLink.url}
                            readOnly
                            className="flex-1 bg-transparent text-sm font-mono text-gray-700 outline-none"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                          <div className="text-gray-600 mb-1">Expires</div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {formatDate(shareLink.expiresAt, 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                          <div className="text-gray-600 mb-1">Access Count</div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">
                            {shareLink.accessCount} / {shareLink.maxAccess}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setShareLink(null)}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Generate New Link
                      </button>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">QR Code</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Quick mobile access</p>
                    </div>
                  </div>

                  {shareLink ? (
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-6 rounded-2xl border-4 border-purple-200 shadow-lg">
                        <QRCodeSVG value={shareLink.url} size={200} level="H" />
                      </div>
                      <p className="text-sm text-gray-600 mt-4 text-center">
                        Scan with mobile device
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[280px] text-gray-400 dark:text-gray-500">
                      <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-4xl">📱</span>
                      </div>
                      <p className="text-sm text-center">
                        Generate a link to see QR code
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Statistics */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Share Analytics
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      12
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Links Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      48
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      5
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Active Links</div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
