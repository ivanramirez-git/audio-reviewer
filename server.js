const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { llmService } = require('./archivo');
const path = require('path');

const app = express();
const PORT = 3001;

// Configura body-parser para aceptar cargas más grandes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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

// Ruta para analizar el texto de los audios
app.post('/api/audios/analyze', async (req, res) => {
    try {
        // Importar node-fetch dinámicamente
        const { llmService } = await import('./archivo.js'); // Cambiado a import dinámico

        // Obtener los datos de la solicitud
        const audioData = req.body;
        const texto = audioData.texto;

        const prompt = `
        ${texto}

        Extrae del texto anterior las keywords o frases importantes y relevantes en el contexto de la llamada. Retorna en una lista [ ] de strings, si no existe informacion relevante, solo retorna la lista vacia. [ ]. Debe ser un JSON válido y bien formado.
        `;

        // Llamar a llmService y obtener la respuesta
        const response = await llmService(prompt);

        // Enviar la respuesta al cliente
        res.json(response);
    } catch (error) {
        console.error('Error processing analyze request:', error.message);
        res.status(500).send('Failed to process analyze request');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});