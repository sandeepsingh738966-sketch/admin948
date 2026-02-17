export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
const allowedOrigin = req.headers.origin;
if (allowedOrigin) {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
}  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    // SET YOUR ADMIN PASSWORD HERE
    if (username === "admin" && password === "admin123") {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ success: false });
  }
}
