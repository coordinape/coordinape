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
  input: string
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
        'genHeadline: Skipping generation because input size is too long'
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
    console.error('Received an error from OpenAI during genHeadline:', err);
    return {
      headline: undefined,
      description: undefined,
    };
  }
};

export const botReply = async (input: string): Promise<string | undefined> => {
  try {
    const openai = openai_client();

    // skip if message length is too long
    if (input.length > 400) {
      // eslint-disable-next-line no-console
      console.log(
        'botReply: Skipping generation because input size is too long'
      );
      return undefined;
    }

    // time this function
    const start = new Date().getTime();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly GIVEBOT, powered by CoLinks. The user will tag you when they want to send GIVE to another user. Give a brief response to this users input, encouraging their giving and celebrating on-chain reputation. Be quirky.',
        },
        { role: 'user', content: input },
      ],
    });

    const end = new Date().getTime();
    // eslint-disable-next-line no-console
    console.log(`botReply: Took ${end - start}ms`);

    return response.choices[0].message.content || 'Hello - I am GIVEbot';
  } catch (err) {
    console.error('Received an error from OpenAI during genHeadling:', err);
    return undefined;
  }
};

export const genGiveImagePrompt = async (
  skill: string
): Promise<string | undefined> => {
  try {
    const openai = openai_client();

    // skip if message length is too long
    if (skill.length > 400) {
      // eslint-disable-next-line no-console
      console.log(
        'genGiveImagePrompt : Skipping generation because skill is too long'
      );
      return undefined;
    }

    // time this function
    const start = new Date().getTime();

    const sceneBonuses = [
      ' Hieronymus Bosch painting',
      ' Salvador Dali painting',
      ' Sandro Botticelli painting',
      ' Japanese woodblock print',
      ' Zen ink calligraphy',
      ' Paleolithic cave paintings',
      ' Sistine chapel characters',
      ' Orthodoc icon painting',
      ' Gustav Klimt painting',
      ' Cubism painting',
      ' Futurism painting',
      ' Psychedelic painting',
      ' Street photography',
    ];

    const characters = [
      ` Two surreal, melting faces, facing each other exchanging ${skill}`,
      ` Two japanese paper collage bodies exchanging ${skill}`,
      ` Two diverse humans greeting each other exchanging ${skill}`,
      ` Two aliens greeting each other exchanging ${skill}`,
      ` Two cyborgs greeting each other exchanging ${skill}`,
      ` Two Egyptian gods greeting each other exchanging ${skill}`,
      ` Two computers talking with each other exchanging ${skill}`,
      ` Two Buddhist dieties exchanging ${skill}`,
    ];

    const sceneVariations = [
      // Cosmic Scale
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}, rendered as if captured through both a radio telescope and a Renaissance master's eyes. The interaction creates impossible auroras that form architectural structures in space.`,

      // Microscopic Scale
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}. The scene should appear as if viewed through both an electron microscope and stained glass.`,

      // Natural Scale
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}, depicted as if their roots are forming baroque cathedral architecture underground. The exchange should be visible as bioluminescent flows.`,
    ];

    const basePrompt = `Generate a text description capturing an exchange of gratitude, thanks, and respect between two people, entities, animals, or characters.  The dominant theme is ${skill}. 
${sceneVariations[Math.floor(Math.random() * sceneVariations.length)]}

Craft the prompt so that it describes the style ${sceneBonuses[Math.floor(Math.random() * sceneBonuses.length)]}.

Technical requirements:
- Avoid: cartoon or cartoonish style, obvious symbolism
- Use: natural color palette
- Include the name of the artist or style in the prompt
- ${skill} should play a significant roll in the image
- Response must be 400 characters or less

`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1.2,
      messages: [
        {
          role: 'system',
          content: `Generate a terse 400 character text description for a text-to-image model. Return the text for the prompt without ANY other content in your response. Always show an exchange or interaction, never just a scene with one subject. The scene should be directly inspired by the word: ${skill}.
          `,
        },
        {
          role: 'user',
          content: basePrompt,
        },
      ],
    });

    const end = new Date().getTime();
    // eslint-disable-next-line no-console
    console.log(`genGiveImagePrompt: Took ${end - start}ms`);

    return response.choices[0].message.content || undefined;
  } catch (err) {
    console.error(
      'Received an error from OpenAI during genGiveImagePrompt:',
      err
    );
    return undefined;
  }
};
