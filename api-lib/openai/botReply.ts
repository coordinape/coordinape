/* eslint-disable no-console */
import openai_client from './openaiClient';

export const botReply = async (input: string): Promise<string | undefined> => {
  try {
    const openai = openai_client({ 'Helicone-Property-Function': 'botReply' });

    if (input.length > 400) {
      console.log(
        'botReply: Skipping generation because input size is too long'
      );
      return undefined;
    }

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
    console.log(`botReply: Took ${end - start}ms`);

    return response.choices[0].message.content || 'Hello - I am GIVEbot';
  } catch (err) {
    console.error('Received an error from OpenAI during botReply:', err);
    return undefined;
  }
};
