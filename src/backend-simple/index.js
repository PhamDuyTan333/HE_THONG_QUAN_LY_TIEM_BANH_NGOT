const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Bakery Backend API is working!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Health check passed'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API endpoint working',
    data: { test: true }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
