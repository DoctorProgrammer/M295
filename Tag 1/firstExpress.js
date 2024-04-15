const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/help', (req, res) => {
  res.send('run node <filename>.js or npm start');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});