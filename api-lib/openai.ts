import assert from 'assert';

import OpenAI from 'openai';

function openai_client() {
  return new OpenAI({
    baseURL: 'https://oai.hconeai.com/v1',
    defaultHeaders: {
      'Helicone-Auth': 'Bearer ' + process.env.HELICONE_API_KEY,
    },
  });
}

export const createEmbedding = async (input: string): Promise<number[]> => {
  try {
    const openai = openai_client();
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

const SYSTEM_PROMPT =
  'You will be given input of a post in JSON format with the schema activity -> contribution as the posts contents, and a set of replies to this post, and emoji reactions to this post. Act as a journalist and generate a news headline and 2-4 sentence description of the post. The headline should not be more than 48 characters of length. The headlien and description should be passed into the funcion genHeadline';

// Define the JSON Schema for the function's parameters
const schema = {
  type: 'object',
  properties: {
    headline: {
      type: 'string',
      length: 50,
      description: 'Headline of the content',
    },
    description: {
      type: 'string',
      length: 250,
      description: '2-4 sentence description of the content',
    },
  },
};

export const genHeadline = async (input: string): Promise<any> => {
  try {
    const openai = openai_client();

    const headlineResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        { role: 'user', content: input },
      ],
      functions: [{ name: 'gen_headline', parameters: schema }],
      function_call: { name: 'gen_headline' },
    });

    const func_args =
      headlineResponse.choices[0].message.function_call?.arguments;
    assert(func_args);

    return JSON.parse(func_args);
  } catch (err) {
    console.error('Got an error from OpenAI', err);
    throw err;
  }
};
