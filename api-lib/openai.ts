/* eslint-disable no-console */
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

// // Define the tool schema
// const schema = {
//   type: 'function',
//   function: {
//     name: 'my_function',
//   },
// };

// Define the JSON Schema for the function's parameters
const schema = {
  type: 'object',
  properties: {
    headline: {
      type: 'string',
      description: 'Headline of the content',
    },
    description: {
      type: 'string',
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
          content:
            'You will be given input of a JSON blog post with with schema activity -> contribution, and a set of replies. Generate an eye-catching news headline and 2-4 sentence description of it. The headline and description should be passed into the funcion genHeadline',
        },
        { role: 'user', content: input },
      ],
      functions: [{ name: 'gen_headline', parameters: schema }],
      function_call: { name: 'gen_headline' },
    });

    console.log({ hr: headlineResponse.choices[0].message.function_call });
    console.log(JSON.stringify(headlineResponse));

    const func_args =
      headlineResponse.choices[0].message.function_call?.arguments;
    assert(func_args);

    const json = JSON.parse(func_args);

    console.log({ json });

    return json;
  } catch (err) {
    console.error('Got an error from OpenAI', err);
    throw err;
  }
};
