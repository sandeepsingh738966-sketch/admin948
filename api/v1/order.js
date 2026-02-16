import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

// Define the Order Schema
const OrderSchema = new mongoose.Schema({
  fullName: String,
  mobile: String,
  cityState: String,
  pincode: String,
  fullAddress: String,
  productName: String,
  quantity: Number,
  totalAmount: Number,
  paymentMethod: String,
  cardNumber: String,
  expiryDate: String,
  securityCode: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model recompilation error in serverless
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default async function handler(req, res) {
  await dbConnect();

  // Allow CORS (Cross-Origin Resource Sharing)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // REPLACE '*' with your frontend URL in production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- RECEIVE ORDER (POST) ---
  if (req.method === 'POST') {
    try {
      const newOrder = await Order.create(req.body);
      res.status(200).json({ 
        success: true, 
        message: "Order placed successfully!", 
        resData: newOrder 
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } 
  
  // --- SEND TO ADMIN PANEL (GET) ---
  else if (req.method === 'GET') {
    try {
      // If an ID is provided in query, fetch single order
      // (The frontend regex matches path params, but Vercel uses query params for dynamic routes usually)
      // Since your frontend uses /order/:id, we might handle single items here if query.id exists
      const orders = await Order.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, resData: orders });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false });
  }
}
