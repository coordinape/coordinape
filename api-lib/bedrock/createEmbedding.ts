import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { bedrock } from './bedrock';

const EMBEDDING_MODEL_ID = 'amazon.titan-embed-text-v2:0';

/**
 * Creates an embedding using Titan Text Embeddings V2 via AWS SDK
 * @param {string} text - The text to create an embedding for
 * @returns {Promise<number[]>} - A promise that resolves to the embedding vector
 */
export async function createTextEmbedding(text: string): Promise<number[]> {
  try {
    const body = {
      inputText: text,
      dimensions: 1024,
      normalize: true,
    };

    const command = new InvokeModelCommand({
      modelId: EMBEDDING_MODEL_ID,
      body: JSON.stringify(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.EmbeddingVector;
  } catch (error) {
    console.error('Failed to create text embedding:', error);
    throw error;
  }
}
