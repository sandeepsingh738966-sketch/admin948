export default function handler(req, res) {
  // --- CORS HEADERS (Fixed for https://demotestdeletesoon.vercel.app) ---
  
  res.setHeader('Access-Control-Allow-Origin', 'https://demotestdeletesoon.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- HANDLE PREFLIGHT ---
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- POST: HANDLE LOGIN ---
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    // Hardcoded credentials (Change these if you want)
    if (username === "admin" && password === "admin123") {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ success: false });
  }
}
