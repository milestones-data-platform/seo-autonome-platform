const { helpers } = require('@google-cloud/aiplatform');

// Configuration
const project = process.env.GCP_PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION || 'europe-west1';
const publisher = 'google';
const model = 'text-embedding-004';

let client;

/**
 * Generates an embedding vector for a given text
 * @param {string} text
 * @returns {Promise<number[]>} Array of floats (the vector)
 */
async function generateEmbedding(text) {
  if (!client) {
    // Initialize client only once
    client = new helpers.PredictionServiceClient({
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
    });
  }

  const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;
  
  // Transform text into an instance compatible with the model
  const instance = {
    content: text,
    taskType: 'RETRIEVAL_DOCUMENT', // Optimized for retrieval
  };

  const instanceValue = helpers.toValue(instance);
  
  const parameters = {
    // Optional parameters (e.g., output dimensionality if supported)
  };
  const parametersValue = helpers.toValue(parameters);

  const request = {
    endpoint,
    instances: [instanceValue],
    parameters: parametersValue,
  };

  try {
    const [response] = await client.predict(request);
    const predictions = response.predictions;
    
    if (predictions.length === 0) {
      throw new Error('No prediction returned for embedding');
    }

    // Extract embedding from prediction
    // The structure depends on the model. For text-embedding-004:
    // predictions[0].structValue.fields.embeddings.structValue.fields.values.listValue.values
    const predictionValue = helpers.fromValue(predictions[0]);
    const embedding = predictionValue.embeddings.values;
    
    return embedding;
  } catch (error) {
    console.error('❌ Embedding Generation Error:', error);
    // Fallback for dev without GCP access: return mock vector
    if (process.env.NODE_ENV === 'local_test') {
      console.warn('⚠️ Using mock embedding for local test');
      return Array(768).fill(0).map(() => Math.random());
    }
    throw error;
  }
}

module.exports = { generateEmbedding };
