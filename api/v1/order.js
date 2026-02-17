import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. HANDLE PREFLIGHT (Browser Security Check)
  // We just say "OK" because vercel.json handles the headers now.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. POST: RECEIVE ORDER
  if (req.method === 'POST') {
    try {
      const newOrder = {
        id: Date.now().toString(),
        ...req.body,
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      await kv.lpush('orders', newOrder);

      return res.status(200).json({ 
        success: true, 
        message: "Order placed successfully!", 
        resData: newOrder 
      });
    } catch (error) {
      console.error("KV Error:", error);
      return res.status(500).json({ success: false, message: "Storage error" });
    }
  } 
  
  // 3. GET: SEND ORDERS TO ADMIN
  else if (req.method === 'GET') {
    try {
      const orders = await kv.lrange('orders', 0, -1);
      return res.status(200).json({ success: true, resData: orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Storage error" });
    }
  } 

  // 4. DELETE
  else if (req.method === 'DELETE') {
    try {
      const { orderIds } = req.body;
      const allOrders = await kv.lrange('orders', 0, -1);
      const keptOrders = allOrders.filter(order => !orderIds.includes(order.id));
      
      await kv.del('orders');
      if (keptOrders.length > 0) {
        await kv.rpush('orders', ...keptOrders);
      }

      return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } 
  
  else {
    return res.status(405).json({ success: false });
  }
}
