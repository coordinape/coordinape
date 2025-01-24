import assert from 'assert';

import { CastWithInteractions } from '@neynar/nodejs-sdk/build/neynar-api/v2';
import OpenAI from 'openai';

function openai_client(custom_headers?: Record<string, string>) {
  const defaultHeaders = {
    'Helicone-Auth': 'Bearer ' + process.env.HELICONE_API_KEY,
    'Helicone-Cache-Enabled': 'true',
    'Helicone-Property-App': 'coordinape.com',
  };

  return new OpenAI({
    baseURL: 'https://oai.hconeai.com/v1',
    defaultHeaders: { ...defaultHeaders, ...custom_headers },
  });
}

export const createEmbedding = async (input: string): Promise<number[]> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'createEmbedding',
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

const farcasterSchema = {
  type: 'object',
  properties: {
    most_interesting_index: {
      type: 'integer',
      description:
        'The 0-based index of the most interesting cast in the array',
      minimum: 0,
    },
    reasoning: {
      type: 'string',
      description:
        'One sentence qualitative positive description of why this cast is interesting',
      maxLength: 150,
    },
  },
  required: ['most_interesting_index', 'reasoning'],
};

export const getBestCast = async (
  casts: CastWithInteractions[],
  qualities: string
): Promise<any> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'getBestCast',
    });

    // time this function
    const start = new Date().getTime();

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: genFarcasterPrompt(qualities),
        },
        { role: 'user', content: JSON.stringify(casts) },
      ],
      functions: [
        {
          name: 'find_most_interesting_cast',
          description:
            'Analyzes an array of social media casts and identifies the most interesting one based on content value, engagement, author credibility, and context',
          parameters: farcasterSchema,
        },
      ],
      function_call: { name: 'find_most_interesting_cast' },
    });

    const end = new Date().getTime();
    // eslint-disable-next-line no-console
    console.log(`getBestCast: Took ${end - start}ms`);

    const func_args = resp.choices[0].message.function_call?.arguments;
    assert(func_args);

    return JSON.parse(func_args);
  } catch (err) {
    console.error('Received an error from OpenAI during getBestCast:', err);
  }
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
    const openai = openai_client({ 'Helicone-Property-Function': 'botReply' });

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
    const openai = openai_client({
      'Helicone-Property-Function': 'genGiveImagePrompt',
    });

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

    const characters = [
      ` Two multi-racial people wearing unique clothing exchange ${skill}`,
      ` Two paper origami dolls exchanging ${skill}`,
      ` Two cautious strangers wearing outlandish clothing exchange ${skill}`,
      ` Two fantasy novel characters wearing outlandish clothing exchange  ${skill}`,
      ` Two sci-fi novel characters wearing outlandish clothing exchange  ${skill}`,
      ` Two cyborgs wearing unique clothing exchange  ${skill}`,
      ` Two egyptian gods wearing unique clothing exchange ${skill}`,
      ` Two computers talking with each other exchanging ${skill}`,
      ` Two ancient dieties wearing unique clothing exchange ${skill}`,
    ];

    const sceneVariations = [
      // Cosmic Scale
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}, rendered as if captured through both a radio telescope and a Renaissance master's eyes. The interaction creates impossible auroras that form architectural structures in space.`,

      // Microscopic Scale
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}. The scene should appear as if viewed through both an electron microscope and stained glass.`,

      // Natural Scale
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}, depicted as if their roots are forming baroque cathedral architecture underground.`,
    ];

    const basePrompt = `Generate a text description capturing an exchange of gratitude, thanks, and respect between two people, entities, animals, or characters.  The dominant theme is ${skill}. 
${sceneVariations[Math.floor(Math.random() * sceneVariations.length)]}.

Technical requirements:
- Avoid: cartoon or cartoonish style, obvious symbolism, nudity
- Use: natural color palette
- ${skill} should play a significant roll in the image
- All characters are fully clothed
- Response must be 400 characters or less

`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1.2,
      max_tokens: 110,
      messages: [
        {
          role: 'system',
          content: `Generate a text description for a text-to-image model. Return the text for the prompt without ANY other content in your response. Always show an exchange or interaction, never just a scene with one subject. The scene should be directly inspired by the word: ${skill}.
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

const genFarcasterPrompt = (qualities: string) => {
  return `
You are an expert at analyzing social media content and identifying engaging posts. Given an array of cast objects from a social media platform, your task is to identify the single most interesting cast and return its index in the array (0-based indexing).

When evaluating each cast's interestingness, consider these factors in order of importance:

0. Relevance to quality:
  - The text of the cast demonstrates the qualities of ${qualities}.

1. Content Value:
   - Uniqueness and novelty of the information shared
   - Whether it contains newsworthy or timely information
   - Quality of any embedded content (news articles, media)
   - Whether it sparks meaningful discussion
   
2. Engagement Metrics:
   - Relative comparison of likes_count, recasts_count, and replies.count
   - Quality of engagement (are verified or prominent users engaging?)
   
3. Author Credibility:
   - Author's follower_count relative to others
   - Whether the author is verified
   - Author's professional background (from bio)

4. Content Context:
   - Relevance to the channel it's posted in
   - Whether it's starting a new thread (parent_hash is null) or contributing to existing discussion
   - Timeliness (based on timestamp)

Return format:
{
  "most_interesting_index": <number>,
  "reasoning": "<One sentence qualitative positive description of why this cast is interesting>"
}

Remember:
- Only return one index, even if multiple posts are interesting
- Compare relative engagement metrics within the provided dataset, not against global standards
- Consider the full context including embedded content metadata (ogTitle, ogDescription)
- If all posts seem equally interesting, prioritize posts with unique insights or information`;
};
