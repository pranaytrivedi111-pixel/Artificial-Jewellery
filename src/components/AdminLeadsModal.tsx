import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
  IndianRupee,
  Clock,
} from 'lucide-react';
import {
  getAllOrders,
  getGoogleSheetsWebhookUrl,
  setGoogleSheetsWebhookUrl,
  exportOrdersToCSV,
  GOOGLE_APPS_SCRIPT_CODE,
  CustomerLead,
} from '../services/leadService';

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orders, setOrders] = useState<CustomerLead[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [filterType, setFilterType] = useState<'all' | 'upi' | 'cod'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'sheets'>('leads');

  useEffect(() => {
    if (isOpen) {
      setOrders(getAllOrders());
      setWebhookUrl(getGoogleSheetsWebhookUrl());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetsWebhookUrl(webhookUrl);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'upi'
        ? order.paymentType === 'Prepaid UPI'
        : order.paymentType === 'COD';

    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const upiCount = orders.filter((o) => o.paymentType === 'Prepaid UPI').length;
  const codCount = orders.filter((o) => o.paymentType === 'COD').length;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full border border-gray-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0F172A] text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  QAVELLE Store Lead & Order Manager
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {webhookUrl ? '● Google Sheets Active' : '○ Local Storage Active'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Live capture of customer delivery addresses, items, and payments (COD & UPI)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Quick Stats Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Captured Leads ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sheets'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Google Sheets Setup
              {webhookUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              )}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <span>
              Total Volume:{' '}
              <strong className="text-gray-900 font-bold">₹{totalRevenue.toLocaleString('en-IN')}</strong>
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline">
              UPI: <strong className="text-emerald-700">{upiCount}</strong>
            </span>
            <span className="hidden sm:inline">
              COD: <strong className="text-amber-700">{codCount}</strong>
            </span>
            <button
              onClick={() => exportOrdersToCSV()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'sheets' ? (
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              {/* Google Sheets Configuration Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Google Sheets Webhook URL
                    </h4>
                    <p className="text-xs text-gray-500">
                      Every checkout lead and payment type will be sent to this endpoint instantly.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveWebhook} className="space-y-3 mt-3">
                  <div>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono bg-gray-50"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      {webhookUrl ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Webhook configured
                        </span>
                      ) : (
                        'No webhook configured yet (leads are stored locally in the meantime)'
                      )}
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {saveStatus === 'saved' ? 'Saved Successfully!' : 'Save Webhook URL'}
                    </button>
                  </div>
                </form>
              </div>

              {/* 60-Second Setup Guide */}
              <div className="bg-amber-50/70 rounded-xl border border-amber-200/80 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <h5 className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                      How to set up your Google Sheet in 60 Seconds
                    </h5>
                  </div>
                  <button
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    className="text-xs font-bold text-amber-800 underline cursor-pointer"
                  >
                    {showSetupGuide ? 'Hide Instructions' : 'Show Step-by-Step Guide'}
                  </button>
                </div>

                {showSetupGuide && (
                  <div className="mt-3 text-xs text-gray-700 space-y-2.5 pt-2 border-t border-amber-200/60">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <span>
                        Open <a href="https://sheets.new" target="_blank" rel="noreferrer" className="font-bold text-amber-900 underline inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-3 h-3" /></a> to create a new spreadsheet named <strong>"Qavelle Leads & Orders"</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <span>
                        In the top menu, click <strong>Extensions</strong> → <strong>Apps Script</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <div className="flex-1">
                        <span>Delete existing code in the editor and paste this code:</span>
                        <div className="mt-1 relative bg-gray-900 text-gray-100 p-2.5 rounded-lg font-mono text-[10px] overflow-x-auto">
                          <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
                          <button
                            onClick={handleCopyScript}
                            className="absolute top-2 right-2 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Copied' : 'Copy Script'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        4
                      </span>
                      <span>
                        Click <strong>Deploy</strong> → <strong>New Deployment</strong>. Select <strong>Web app</strong>. Set <em>"Who has access"</em> to <strong>Anyone</strong>, then click <strong>Deploy</strong>.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        5
                      </span>
                      <span>
                        Copy the <strong>Web App URL</strong> provided by Google and paste it into the box above. That's it! Every order will now write directly into your Google Sheet.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, city, or Order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setFilterType('upi')}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                      filterType === 'upi'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Prepaid UPI ({upiCount})
                  </button>
                  <button
                    onClick={() => setFilterType('cod')}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                      filterType === 'cod'
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    COD ({codCount})
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Order & Date</th>
                        <th className="py-2.5 px-3">Customer & Contact</th>
                        <th className="py-2.5 px-3">Payment & Status</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Delivery Destination</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                            No matching leads found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span className="font-bold text-gray-950 font-mono text-[11px] block">
                                {order.orderId}
                              </span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(order.timestamp).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            <td className="py-3 px-3 align-top">
                              <span className="font-bold text-gray-900 block">
                                {order.customerName}
                              </span>
                              <a
                                href={`tel:${order.phone}`}
                                className="text-emerald-700 hover:underline font-mono text-[11px] flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                {order.phone}
                              </a>
                            </td>

                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.paymentType === 'Prepaid UPI'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {order.paymentType}
                              </span>
                              {order.utr && (
                                <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                                  UTR: {order.utr}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 align-top whitespace-nowrap">
                              <span className="font-black text-gray-950 font-mono">
                                ₹{order.totalAmount}
                              </span>
                            </td>

                            <td className="py-3 px-3 align-top text-[11px] text-gray-600 max-w-[200px] truncate" title={order.items}>
                              {order.items}
                            </td>

                            <td className="py-3 px-3 align-top text-[11px] text-gray-600 max-w-[220px]">
                              <div className="flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                  <p className="truncate">{order.address}</p>
                                  <p className="text-gray-400 text-[10px]">
                                    {order.city}, {order.state} - {order.pincode}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between shrink-0">
          <span className="text-[11px]">
            Data is stored securely in browser storage and streamed to Google Sheets via Webhook.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
