/* eslint-disable no-console */
import assert from 'assert';

import openai_client from './openaiClient';

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
  input: string
): Promise<{
  headline: string | undefined;
  description: string | undefined;
}> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'genHeadline',
    });

    if (input.length > 12000) {
      console.log(
        'genHeadline: Skipping generation because input size is too long'
      );
      return {
        headline: undefined,
        description: undefined,
      };
    }

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
    console.log(`genHeadline: Took ${end - start}ms`);

    const func_args =
      headlineResponse.choices[0].message.function_call?.arguments;
    assert(func_args);

    return JSON.parse(func_args);
  } catch (err) {
    console.error('Received an error from OpenAI during genHeadline:', err);
    return {
      headline: undefined,
      description: undefined,
    };
  }
};
