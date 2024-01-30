import assert from 'assert';

import OpenAI from 'openai';

function openai_client() {
  return new OpenAI({
    baseURL: 'https://oai.hconeai.com/v1',
    defaultHeaders: {
      'Helicone-Auth': 'Bearer ' + process.env.HELICONE_API_KEY,
      'Helicone-Cache-Enabled': 'true',
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
  'You will receive JSON object representing a CoLinks `post` with the text `replies` to the post. Act as a creative and funky journalist and generate a summary `headline` of the post, and then a longer `description` of the post. Include a small reflection on and how other people responded to it, but focus primarily on the original post. Call the function with a headline of no more than 60 characters, and a description of no more than 350 characters.';

// Define the JSON Schema for the function's parameters
const schema = {
  type: 'object',
  properties: {
    headline: {
      type: 'string',
      maxLength: 50,
      description: 'Headline of the summary',
    },
    description: {
      maxLength: 250,
      type: 'string',
      description: '2-4 sentence description of the post and replies',
    },
  },
  required: ['headline', 'description'],
};

export const genHeadline = async (
  input: string,
): Promise<{
  headline: string | undefined;
  description: string | undefined;
}> => {
  try {
    const openai = openai_client();

    // skip if message length is too long
    if (input.length > 12000) {
      // eslint-disable-next-line no-console
      console.log(
        'genHeadline: Skipping generation because input size is too long',
      );
      return {
        headline: undefined,
        description: undefined,
      };
    }

    // time this function
    const start = new Date().getTime();

    const headlineResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      temperature: 0.8,
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

    const end = new Date().getTime();
    // eslint-disable-next-line no-console
    console.log(`genHeadline: Took ${end - start}ms`);

    const func_args =
      headlineResponse.choices[0].message.function_call?.arguments;
    assert(func_args);

    return JSON.parse(func_args);
  } catch (err) {
    console.error('Received an error from OpenAI during genHeadling:', err);
    return {
      headline: undefined,
      description: undefined,
    };
  }
};
