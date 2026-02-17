export default function handler(req, res) {
  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    // Hardcoded credentials
    if (username === "admin" && password === "admin123") {
      return res.status(200).json({ success: true, message: "Login successful" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } else {
    return res.status(405).json({ success: false });
  }
}
