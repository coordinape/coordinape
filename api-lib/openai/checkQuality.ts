import assert from 'assert';

import openai_client from './openaiClient';

export const checkQuality = async (cast: any, quality: string) => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'checkQuality',
    });

    const start = new Date().getTime();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'You are tasked with determining if a provided cast meets the specified quality criteria. Respond with a clear true or false to `meets_quality` and an assessment numerically as well, with 1 being absolutely meets quality and 0 being does not meet quality.',
        },
        {
          role: 'user',
          content: `Cast: ${JSON.stringify(cast)}, Quality Criteria: ${quality}`,
        },
      ],
      functions: [
        {
          name: 'qualityAssessment',
          description:
            'Determine if the cast meets specified quality criteria.',
          parameters: {
            type: 'object',
            properties: {
              meets_quality: {
                type: 'boolean',
              },
              quality_score: {
                type: 'number',
                minimum: 0,
                maximum: 1,
              },
            },
            required: ['meets_quality', 'quality_score'],
          },
        },
      ],
      function_call: { name: 'qualityAssessment' },
    });

    const end = new Date().getTime();
    // eslint-disable-next-line no-console
    console.log(`checkQuality: Took ${end - start}ms`);

    const func_args = response.choices[0].message.function_call?.arguments;
    assert(func_args);

    const { meets_quality, quality_score } = JSON.parse(func_args);
    return { meets_quality, quality_score };
  } catch (err) {
    console.error('Received an error from OpenAI during checkQuality:', err);
    return false;
  }
};
