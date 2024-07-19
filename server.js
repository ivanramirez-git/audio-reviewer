const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/audios', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'audios.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading audios.json');
    } else {
      res.send(JSON.parse(data));
    }
  });
});

app.post('/api/audios', (req, res) => {
  const updatedAudios = req.body;
  fs.writeFile(path.join(__dirname, 'data', 'audios.json'), JSON.stringify(updatedAudios, null, 2), (err) => {
    if (err) {
      res.status(500).send('Error writing to audios.json');
    } else {
      res.send('File updated successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});