const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// แปลงไฟล์เป็น JSON
function convertToJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  try {
    return JSON.parse(content);
  } catch {
    return { text: content };
  }
}

// อัปโหลดไฟล์
app.post('/upload', upload.array('files'), async (req, res) => {
  const id = uuidv4();
  const result = [];

  for (let file of req.files) {
    const json = convertToJSON(file.path);
    result.push({
      filename: file.originalname,
      data: json
    });
  }

  await fs.ensureDir('data');
  await fs.writeJson(`data/${id}.json`, result);

  res.json({
    success: true,
    api: `/api/data/${id}`
  });
});

// API ดึงข้อมูล
app.get('/api/data/:id', async (req, res) => {
  const file = `data/${req.params.id}.json`;

  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: 'Not found' });
  }

  const data = await fs.readJson(file);
  res.json(data);
});

// API สำหรับ Joke Generator
app.get('/api/jokes', async (req, res) => {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
    const joke = await response.json();
    
    res.json({
      success: true,
      joke: `${joke.setup} - ${joke.punchline}`,
      setup: joke.setup,
      punchline: joke.punchline,
      type: joke.type,
      id: joke.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch joke from external API'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
