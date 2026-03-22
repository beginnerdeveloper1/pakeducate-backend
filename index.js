const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ڈیٹا بیس کنکشن ود SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // یہ سپا بیس کے لیے ضروری ہے
  }
});

app.get('/', (req, res) => {
  res.send('Pak Educate API is Live and Connected!');
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "یوزر نیم یا پاس ورڈ غلط ہے۔" });
    }
  } catch (err) {
    // یہاں ہم اصلی ایرر بھیج رہے ہیں تاکہ پتہ چلے مسئلہ کیا ہے
    res.status(500).json({ success: false, message: "ڈیٹا بیس ایرر: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started` ));
