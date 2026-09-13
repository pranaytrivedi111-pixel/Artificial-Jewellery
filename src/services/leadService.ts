export interface CustomerLead {
  orderId: string;
  timestamp: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: string;
  totalAmount: number;
  paymentType: 'COD' | 'Prepaid UPI';
  paymentStatus: string;
  utr?: string;
  leadStage: 'Completed Order' | 'Address Submitted';
}

const STORAGE_KEY = 'qavelle_all_orders';
const WEBHOOK_CONFIG_KEY = 'qavelle_sheets_webhook_url';

// Default mock initial leads so the store owner immediately sees the dashboard layout
const INITIAL_DEMO_LEADS: CustomerLead[] = [
  {
    orderId: 'QVL-782419',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: 'Pooja Sharma',
    phone: '9876543210',
    email: 'pooja.s@gmail.com',
    address: 'Flat 402, Royal Palms, Link Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    items: 'Pack of 6 Royal Jhumka Earrings Set x 1',
    totalAmount: 999,
    paymentType: 'Prepaid UPI',
    paymentStatus: 'Payment Verified (UPI)',
    utr: '428910543981',
    leadStage: 'Completed Order',
  },
  {
    orderId: 'QVL-914520',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerName: 'Ananya Verma',
    phone: '9820112233',
    email: 'ananya.v@gmail.com',
    address: 'House 14B, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    items: 'Heritage Royal Kundan Pearl Bridal Choker Set x 1',
    totalAmount: 1499,
    paymentType: 'COD',
    paymentStatus: 'Confirmed (Cash on Delivery)',
    utr: '',
    leadStage: 'Completed Order',
  }
];

export const DEFAULT_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbz85fr5XXQPvN-yLT8RAj2HART9Tlhs1aUz9ns_JG9PB_zGJdCa1wBwcZ8ihmwDnt4/exec';

// Deprecated or decommissioned script IDs that should be purged from browser localStorage
const DEPRECATED_URL_SNIPPETS = [
  'AKfycbzh_XblHIZGPEbncYT6P1LnUOU2qyTBMS6KqXB3GXqj30uwguzQF6h7-QqVSxUVmdLB',
  'AKfycbw-aE-ESaJvnzSCImwxmrp2FDvSUyyh-rLmlPbXwDAnCwofIDuBFrskEBxLbhmkKI09',
];

export const getGoogleSheetsWebhookUrl = (): string => {
  try {
    const saved = localStorage.getItem(WEBHOOK_CONFIG_KEY);
    if (saved) {
      const isDeprecated = DEPRECATED_URL_SNIPPETS.some((bad) => saved.includes(bad));
      if (isDeprecated) {
        localStorage.removeItem(WEBHOOK_CONFIG_KEY);
        return DEFAULT_SHEETS_WEBHOOK_URL;
      }
      return saved;
    }
  } catch {
    // ignore
  }
  return (
    import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
    DEFAULT_SHEETS_WEBHOOK_URL
  );
};

export const setGoogleSheetsWebhookUrl = (url: string): void => {
  localStorage.setItem(WEBHOOK_CONFIG_KEY, url.trim());
};

export const getAllOrders = (): CustomerLead[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample leads for preview
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
      return INITIAL_DEMO_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_LEADS;
  }
};

export const saveOrderLocally = (lead: CustomerLead): void => {
  try {
    const existing = getAllOrders();
    // Prepend new order to top
    const updated = [lead, ...existing.filter((o) => o.orderId !== lead.orderId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error persisting lead locally:', err);
  }
};

export const recordLead = async (lead: CustomerLead): Promise<{ success: boolean; syncedWithSheet: boolean }> => {
  // 1. Always save in local storage first so zero data is lost
  saveOrderLocally(lead);

  const webhookUrl = getGoogleSheetsWebhookUrl();

  // Standardized order payload
  const payload = {
    orderId: lead.orderId,
    customerName: lead.customerName,
    phone: lead.phone,
    email: lead.email || '',
    address: lead.address,
    city: lead.city,
    state: lead.state,
    pincode: lead.pincode,
    items: lead.items,
    totalAmount: lead.totalAmount,
    paymentType: lead.paymentType,
    paymentStatus: lead.paymentStatus,
    utr: lead.utr || '',
    leadStage: lead.leadStage,
    timestamp: lead.timestamp || new Date().toISOString(),
    customWebhookUrl: webhookUrl !== DEFAULT_SHEETS_WEBHOOK_URL ? webhookUrl : undefined,
  };

  // Primary: Send through server-side /api/order route
  // This completely eliminates CORS issues, browser adblockers, and 302 redirect conversion!
  try {
    const apiRes = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      console.log('[LeadService] Server processed order:', result);
      if (result.syncedWithSheet) {
        return { success: true, syncedWithSheet: true };
      }
    }
  } catch (serverErr) {
    console.warn('[LeadService] Server-side /api/order call note:', serverErr);
  }

  // Fallback: Direct client dispatch
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return { success: true, syncedWithSheet: true };
  } catch (clientErr) {
    console.warn('[LeadService] Direct Google Sheets dispatch note:', clientErr);
    return { success: true, syncedWithSheet: false };
  }
};

export const testSheetConnection = async (
  customUrl?: string
): Promise<{ success: boolean; message: string }> => {
  const urlToTest = customUrl || getGoogleSheetsWebhookUrl();
  try {
    const res = await fetch('/api/test-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: urlToTest }),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true, message: `Connected! Status ${data.status}: ${data.responseText}` };
    }
    return { success: false, message: data.error || 'Connection test failed' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Unable to connect to server' };
  }
};

export const exportOrdersToCSV = (): void => {
  const orders = getAllOrders();
  if (orders.length === 0) return;

  const headers = [
    'Order ID',
    'Date & Time',
    'Customer Name',
    'Phone Number',
    'Payment Type',
    'Payment Status',
    'UPI UTR Number',
    'Total Amount (INR)',
    'Items Ordered',
    'Delivery Address',
    'City',
    'State',
    'PIN Code',
    'Lead Stage',
  ];

  const escapeCell = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = orders.map((o) => [
    escapeCell(o.orderId),
    escapeCell(new Date(o.timestamp).toLocaleString('en-IN')),
    escapeCell(o.customerName),
    escapeCell(o.phone),
    escapeCell(o.paymentType),
    escapeCell(o.paymentStatus),
    escapeCell(o.utr || 'N/A'),
    escapeCell(o.totalAmount),
    escapeCell(o.items),
    escapeCell(o.address),
    escapeCell(o.city),
    escapeCell(o.state),
    escapeCell(o.pincode),
    escapeCell(o.leadStage),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Qavelle_Leads_and_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const GOOGLE_APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    var headers = [
      "Timestamp",
      "Order ID",
      "Customer Name",
      "Phone Number",
      "Email",
      "Payment Type",
      "Payment Status",
      "UPI / UTR Number",
      "Total Amount (₹)",
      "Items Ordered",
      "Delivery Address",
      "City",
      "State",
      "PIN Code",
      "Order Stage"
    ];

    // Check if header exists in Row 1. If not, insert it!
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#F3F4F6");
      sheet.setFrozenRows(1);
    } else {
      var firstCell = sheet.getRange(1, 1).getValue().toString().trim();
      if (firstCell !== "Timestamp" && firstCell !== "Order ID" && firstCell !== "Date") {
        sheet.insertRowBefore(1);
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#F3F4F6");
        sheet.setFrozenRows(1);
      }
    }
    
    // Parse the incoming JSON or form payload
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.orderId || "",
      data.customerName || "",
      "'" + (data.phone || ""),
      data.email || "",
      data.paymentType || "",
      data.paymentStatus || "",
      data.utr ? "'" + data.utr : "N/A",
      data.totalAmount || 0,
      data.items || "",
      data.address || "",
      data.city || "",
      data.state || "",
      data.pincode || "",
      data.leadStage || "Completed Order"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Qavelle Google Sheets Order Webhook is Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
