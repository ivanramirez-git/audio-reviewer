
# Audio Transcription Review

Esta aplicación permite revisar y corregir transcripciones de audio. Proporciona una interfaz para cargar y revisar archivos JSON con transcripciones de audio, reproducir audios, y realizar correcciones en tiempo real.

## Requisitos

- Node.js
- NPM (Node Package Manager)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/audio-transcription-review.git
   cd audio-transcription-review
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Configuración

### Modificar el archivo `audios.json`

El archivo `audios.json` debe estar en la carpeta `data`. Este archivo contiene las transcripciones originales, las correcciones humanas y el porcentaje de revisión.

Ejemplo de `audios.json`:

```json
[
  {
    "audio_file_name": "/assets/20240626_092813_IN_16263675008_2d1a2c96-6dfe-4be1-bac1-92d17016c23e_F_b37f0bbe-948e-4d0c-8bbb-698cd4907698.mp3",
    "original_transcription": "acá medinología buenos días...",
    "human_correction": "acá medinología buenos días...",
    "review_percentage": 0
  }
  // otras entradas
]
```

### Agregar los audios en la carpeta `public/assets/`

Coloca todos los archivos de audio (.mp3) en la carpeta `public/assets/`.

### Convertir CSV a JSON

Si tienes los datos en un archivo CSV, conviértelos a JSON. Aquí hay un ejemplo de cómo hacerlo:

#### CSV de entrada:

```csv
Audio File Name;Transcription
/Users/schwarze/Documents/TechD/CerebralBlue/AU-Recordings/96_Spanish_Call_Recordings_07092024/InboundRecs_4/20240626_092813_IN_16263675008_2d1a2c96-6dfe-4be1-bac1-92d17016c23e_F_b37f0bbe-948e-4d0c-8bbb-698cd4907698.mp3;acá medinología buenos días...
/Users/schwarze/Documents/TechD/CerebralBlue/AU-Recordings/96_Spanish_Call_Recordings_07092024/InboundRecs_4/20240626_093802_IN_14802176611_733fbb15-1db4-4b94-9986-faf5e23e589b_F_ee80efbf-8e69-458a-8a62-ed5c0f528ff3.mp3;gracias por llamar a academia de eurología...
```

#### Código de conversión de CSV a JSON:

Puedes usar un script en Node.js para convertir tu CSV a JSON:

```javascript
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('path_to_your_file.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', (data) => {
    results.push({
      audio_file_name: `/assets/${path.basename(data['Audio File Name'])}`,
      original_transcription: data.Transcription,
      human_correction: data.Transcription,
      review_percentage: 0
    });
  })
  .on('end', () => {
    fs.writeFileSync('data/audios.json', JSON.stringify(results, null, 2));
    console.log('CSV file successfully processed');
  });
```

Guarda este script como `csv_to_json.js` y ejecútalo con:

```bash
node csv_to_json.js
```

## Ejecución

Para ejecutar la aplicación, utiliza el siguiente comando:

```bash
npx nodemon server.js
```

La aplicación estará disponible en `http://localhost:3000`.

## Uso

1. Abre la aplicación en tu navegador (`http://localhost:3000`).
2. Verás una tabla con la lista de audios y su porcentaje de revisión.
3. Haz clic en "Revisar" para corregir la transcripción de un audio.
4. La vista de revisión permite reproducir el audio, ver la transcripción original, y realizar correcciones.
5. El porcentaje de revisión se actualiza en tiempo real mientras se reproduce el audio.
6. Haz clic en "Volver" para regresar a la tabla principal.

## Estructura del Proyecto

- `public/`: Contiene los archivos estáticos (HTML, CSS, JS).
  - `assets/`: Carpeta donde se almacenan los archivos de audio.
  - `css/`: Estilos CSS.
  - `js/`: Archivos JavaScript para la funcionalidad de la aplicación.
- `data/`: Contiene el archivo `audios.json` con las transcripciones y metadatos.
- `server.js`: Configuración del servidor Express.
- `csv_to_json.js`: Script para convertir archivos CSV a JSON (opcional).

## Contribuciones

Las contribuciones son bienvenidas. Si tienes alguna mejora o corrección, por favor abre un issue o un pull request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
