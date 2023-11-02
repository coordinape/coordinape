import OpenAI from 'openai';

export const createEmbedding = async (input: string): Promise<number[]> => {
  try {
    const openai = new OpenAI({
      baseURL: 'https://oai.hconeai.com/v1',
      defaultHeaders: {
        'Helicone-Auth': 'Bearer ' + process.env.HELICONE_API_KEY,
      },
    });

    const embeddingResponse: OpenAI.Embeddings.CreateEmbeddingResponse =
      await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: input,
      });

    return embeddingResponse.data[0].embedding;
  } catch (err) {
    console.error('Got an error from OpenAI', err);
    throw err;
  }
};
