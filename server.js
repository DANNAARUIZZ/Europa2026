const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'data', 'state.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.use(express.json());
app.use(express.static('public'));

// GET shared state
app.get('/api/state', (req, res) => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      return res.json(data);
    }
    res.json({ activities: [], transport: [], docs: [] });
  } catch (e) {
    res.json({ activities: [], transport: [], docs: [] });
  }
});

// POST shared state
app.post('/api/state', (req, res) => {
  try {
    const { activities, transport, docs } = req.body;
    const state = {
      activities: activities || [],
      transport: transport || [],
      docs: docs || [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save state' });
  }
});

app.listen(PORT, () => {
  console.log(`Europe Trip 2026 running on port ${PORT}`);
});
