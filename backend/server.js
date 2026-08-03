const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Finora backend is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
