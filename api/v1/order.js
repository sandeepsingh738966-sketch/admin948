import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // --- CORS HEADERS (Fixed for https://demotestdeletesoon.vercel.app) ---
  
  // 1. Explicitly allow YOUR frontend domain
  res.setHeader('Access-Control-Allow-Origin', 'https://demotestdeletesoon.vercel.app');
  
  // 2. Allow credentials (cookies/auth headers)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // 3. Allow standard methods
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  // 4. Allow necessary headers
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // --- HANDLE PREFLIGHT (OPTIONS) ---
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- POST: RECEIVE ORDER ---
  if (req.method === 'POST') {
    try {
      const newOrder = {
        id: Date.now().toString(),
        ...req.body,
        status: "Pending", // Default status
        createdAt: new Date().toISOString()
      };

      // Push to the beginning of the list
      await kv.lpush('orders', newOrder);

      res.status(200).json({ 
        success: true, 
        message: "Order placed successfully!", 
        resData: newOrder 
      });
    } catch (error) {
      console.error("KV Error:", error);
      res.status(500).json({ success: false, message: "Storage error" });
    }
  } 
  
  // --- GET: SEND ORDERS TO ADMIN ---
  else if (req.method === 'GET') {
    try {
      // Fetch all orders (index 0 to -1)
      const orders = await kv.lrange('orders', 0, -1);
      res.status(200).json({ success: true, resData: orders });
    } catch (error) {
      console.error("KV Error:", error);
      res.status(500).json({ success: false, message: "Storage error" });
    }
  } 

  // --- DELETE: REMOVE SELECTED ORDERS ---
  else if (req.method === 'DELETE') {
    try {
      const { orderIds } = req.body;
      
      // Get all orders
      const allOrders = await kv.lrange('orders', 0, -1);
      
      // Filter out the ones we want to delete
      const keptOrders = allOrders.filter(order => !orderIds.includes(order.id));
      
      // Clear the list
      await kv.del('orders');
      
      // Add back the kept orders (if any remain)
      if (keptOrders.length > 0) {
        // We use spread syntax to push multiple items at once
        await kv.rpush('orders', ...keptOrders);
      }

      res.status(200).json({ success: true, message: "Orders deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } 
  
  // --- METHOD NOT ALLOWED ---
  else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
