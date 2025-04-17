import assert from 'assert';

import { CastWithInteractions } from '@neynar/nodejs-sdk/build/api';

import openai_client from './openaiClient';

export const getChannelInsights = async (
  casts: CastWithInteractions[]
): Promise<any> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'getChannelInsights',
    });

    const start = new Date().getTime();

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content:
            'Analyze the following channel casts for recent trends and insights. Generate a brief two paragram summary of the key highlights of the content. Do not provide overview or general statements. Assume the consumer is knowledgeable and up-to-speed.',
        },
        { role: 'user', content: JSON.stringify(casts) },
      ],
    });

    const end = new Date().getTime();
    // eslint-disable-next-line no-console
    console.log(`getChannelInsights: Took ${end - start}ms`);

    const insights = resp.choices[0].message.content;
    assert(insights);

    return insights;
  } catch (err) {
    console.error(
      'Received an error from OpenAI during getChannelInsights:',
      err
    );
  }
};
