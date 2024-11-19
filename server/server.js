const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const NOTES_FILE = path.join(__dirname, 'notes.json');

// Read notes
app.get('/notes', async (req, res) => {
  try {
    const data = await fs.readFile(NOTES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return empty array
      res.json([]);
    } else {
      res.status(500).json({ error: 'Error reading notes' });
    }
  }
});

// Save notes
app.post('/notes', async (req, res) => {
  try {
    await fs.writeFile(NOTES_FILE, JSON.stringify(req.body));
    res.json({ message: 'Notes saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving notes' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});