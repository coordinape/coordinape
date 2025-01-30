import openai_client from './openaiClient';

export const createEmbedding = async (input: string): Promise<number[]> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'createEmbedding',
    });
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: input,
    });

    return embeddingResponse.data[0].embedding;
  } catch (err) {
    console.error('Got an error from OpenAI', err);
    throw err;
  }
};
