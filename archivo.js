require('dotenv').config();
// Enum y clases de error

// Enum para definir los diferentes modelos de LLM (Large Language Models) que se pueden usar
const LLM = {
    claude3_haiku: 'claude3-haiku',
    claude3_opus: 'claude3-opus',
    gpt_4o_mini: 'gpt-4o-mini',
    gpt_4o: 'gpt-4o',
};

// Clase personalizada para errores de extracción de JSON
class JsonExtractionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JsonExtractionError';
    }
}

// Clase personalizada para errores relacionados con el servicio de Maistro
class MaistroError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MaistroError';
    }
}

// Función para extraer JSON de la respuesta
function extractJsonFromResponse(text) {
    const jsonMatch = text.match(/\[(?:.|\n)*?\]/);
    if (jsonMatch) {
        return jsonMatch[0];
    }
    throw new JsonExtractionError('No JSON found in the provided text');
}

// Funcion que construye el body a partir de un prompt y opciones de llamada
function buildBody(prompt, llm, templateName) {
    return JSON.stringify({
        templateName: templateName,
        params: [
            {
                name: 'input',
                value: prompt,
            },
        ],
        options: {
            streaming: false, // Deshabilita la transmisión en tiempo real
            llm: llm, // Modelo de lenguaje a utilizar
            temperatureMod: 1, // Modificador de temperatura para el comportamiento del modelo
            toppMod: 1, // Modificador para Top-P Sampling
            freqpenaltyMod: 1, // Penalización por frecuencia de palabras
            minTokens: 0, // Mínimo de tokens que puede devolver el modelo
            maxTokens: 1000, // Máximo de tokens que puede devolver el modelo
            returnVariables: false,
            returnVariablesExpanded: false,
            returnRender: false,
            returnSource: false,
            maxRecursion: 10, // Máxima profundidad de recursión
        },
    });
}

// Función que interactúa con el servicio de Maistro utilizando fetch
async function llmService(prompt, { llm = LLM.gpt_4o } = {}) {
    const apiKey = process.env.NEURALSEEK_API_KEY // API Key
    const instanceId = process.env.NEURALSEEK_INSTANCE_ID  // Instance ID
    const templateName = process.env.MAISTRO_TEMPLATES_LLM_TEMPLATE // Template name
    const hostname = process.env.HOST_NAME  // Hostname

    console.log('llmService', prompt, llm);

    const postData = buildBody(prompt, llm, templateName);
    const url = `https://${hostname}/v1/${instanceId}/maistro?overrideschema=${templateName}`;

    try {
        // Importación dinámica de node-fetch
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'apikey': apiKey,
            },
            body: postData,
        });

        if (!response.ok) {
            throw new MaistroError('Error processing the response from Maistro API');
        }

        const jsonResponse = await response.json();
        console.log('Response:', jsonResponse['answer']);
        return JSON.parse(extractJsonFromResponse(jsonResponse['answer']));

    } catch (error) {
        throw new MaistroError(`Request error: ${error.message}`);
    }
}

// Exporta las funciones utilizando la sintaxis de CommonJS
module.exports = {
    llmService,
    LLM,
    JsonExtractionError,
    MaistroError,
};

