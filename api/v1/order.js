import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // --- CORS CONFIGURATION (THE FIX) ---
  
  // 1. Get the frontend URL trying to access this
  const allowedOrigin = req.headers.origin;
  
  // 2. Set that specific URL as the allowed origin (Dynamic Origin)
  // This allows "credentials: include" to work properly
  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 3. Handle the Preflight (OPTIONS) request immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- LOGIC ---

  if (req.method === 'POST') {
    try {
      const newOrder = {
        id: Date.now().toString(),
        ...req.body,
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      await kv.lpush('orders', newOrder);

      res.status(200).json({ 
        success: true, 
        message: "Order placed successfully!", 
        resData: newOrder 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Storage error" });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      const orders = await kv.lrange('orders', 0, -1);
      res.status(200).json({ success: true, resData: orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Storage error" });
    }
  } 

  else if (req.method === 'DELETE') {
    try {
      const { orderIds } = req.body;
      const allOrders = await kv.lrange('orders', 0, -1);
      const keptOrders = allOrders.filter(order => !orderIds.includes(order.id));
      await kv.del('orders');
      if (keptOrders.length > 0) {
        await kv.rpush('orders', ...keptOrders);
      }
      res.status(200).json({ success: true, message: "Orders deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } 
  
  else {
    res.status(405).json({ success: false });
  }
}
