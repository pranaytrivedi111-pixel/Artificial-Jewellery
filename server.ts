import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DEFAULT_SHEETS_WEBHOOK_URL =
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  process.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbz85fr5XXQPvN-yLT8RAj2HART9Tlhs1aUz9ns_JG9PB_zGJdCa1wBwcZ8ihmwDnt4/exec';

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 1. Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Server-side Order Lead Proxy to Google Sheets
  // Eliminates browser CORS, iframe, adblocker, and 302 redirect conversion issues
  app.post('/api/order', async (req, res) => {
    const orderData = req.body;
    const targetWebhookUrl = orderData.customWebhookUrl || DEFAULT_SHEETS_WEBHOOK_URL;

    console.log(`[Order API] Received order ${orderData.orderId || 'NEW'} (${orderData.paymentType || 'COD'})`);

    const payload = {
      orderId: orderData.orderId || `QVL-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: orderData.customerName || 'Customer',
      phone: orderData.phone || '',
      email: orderData.email || '',
      address: orderData.address || '',
      city: orderData.city || '',
      state: orderData.state || '',
      pincode: orderData.pincode || '',
      items: orderData.items || 'Gold Plated Fancy Jhumka Earrings Set x 1',
      totalAmount: Number(orderData.totalAmount) || 499,
      paymentType: orderData.paymentType || 'COD',
      paymentStatus: orderData.paymentStatus || 'Confirmed (Cash on Delivery)',
      utr: orderData.utr || '',
      leadStage: orderData.leadStage || 'Completed Order',
      timestamp: orderData.timestamp || new Date().toISOString(),
    };

    try {
      console.log(`[Order API] Forwarding to Google Sheets: ${targetWebhookUrl.slice(0, 45)}...`);
      const response = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      const responseText = await response.text();
      console.log(`[Order API] Google Apps Script response status ${response.status}:`, responseText);

      return res.json({
        success: true,
        syncedWithSheet: true,
        orderId: payload.orderId,
        sheetResponse: responseText,
      });
    } catch (err: any) {
      console.error('[Order API] Error forwarding order to Google Sheets:', err);
      // Still return 200 with syncedWithSheet: false so the frontend order flow does not crash
      return res.json({
        success: true,
        syncedWithSheet: false,
        orderId: payload.orderId,
        error: err?.message || 'Network error streaming to Google Sheets',
      });
    }
  });

  // 3. Test ping endpoint for manual verification
  app.post('/api/test-sheet', async (req, res) => {
    const targetWebhookUrl = req.body.webhookUrl || DEFAULT_SHEETS_WEBHOOK_URL;
    const testPayload = {
      orderId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Verified Connection Test',
      phone: '9876543210',
      email: 'test@qavelle.com',
      address: 'Shop 1, Fashion Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      items: 'Test Item Connection Check x 1',
      totalAmount: 499,
      paymentType: 'COD',
      paymentStatus: 'Connection Test OK',
      utr: 'TEST-PING',
      leadStage: 'Test Verification',
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(testPayload),
        redirect: 'follow',
      });
      const responseText = await response.text();
      res.json({ success: true, status: response.status, responseText });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed test' });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
