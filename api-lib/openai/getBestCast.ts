import assert from 'assert';

import { CastWithInteractions } from '@neynar/nodejs-sdk/build/neynar-api/v2';

import openai_client from './openaiClient';

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

export const getBestCast = async (
  casts: CastWithInteractions[],
  qualities: string
): Promise<any> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'getBestCast',
    });

    const start = new Date().getTime();

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: genFarcasterPrompt(qualities),
        },
        { role: 'user', content: JSON.stringify(simplifyCasts(casts)) },
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

const simplifyCasts = (casts: CastWithInteractions[]) => {
  return casts.map(cast => {
    // create deep copy to avoid mutating original or type issues
    const simplifiedCast = JSON.parse(JSON.stringify(cast));

    if (simplifiedCast?.embeds) delete simplifiedCast.embeds;
    if (simplifiedCast?.mentioned_profiles)
      delete simplifiedCast.mentioned_profiles;
    if (simplifiedCast?.reactions) {
      if (simplifiedCast.reactions.likes) delete simplifiedCast.reactions.likes;
      if (simplifiedCast.reactions.recasts)
        delete simplifiedCast.reactions.recasts;
    }
    if (simplifiedCast?.author) {
      if (simplifiedCast.author.verified_addresses)
        delete simplifiedCast.author.verified_addresses;
      if (simplifiedCast.author.verifications)
        delete simplifiedCast.author.verifications;
    }
    return simplifiedCast;
  });
};
