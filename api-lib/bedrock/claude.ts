/* eslint-disable no-console */
import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { bedrock } from './bedrock';

export const checkQuality = async (cast: any, quality: string) => {
  try {
    const start = new Date().getTime();

    // Prepare the request body - Updated format for Claude 3
    const body = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are tasked with determining if this cast meets the specified quality criteria. Respond with a JSON object containing 'meets_quality' (boolean) and 'quality_score' (number between 0 and 1). Do not include any other text.

Cast: ${JSON.stringify(cast)}
Quality Criteria: ${quality}`,
        },
      ],
    };

    // Create and send the request
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      body: JSON.stringify(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await bedrock.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Parse the response - Updated for Claude 3 response format
    const jsonResponse = JSON.parse(
      responseBody.completion || responseBody.content[0].text
    );

    const end = new Date().getTime();
    console.log(`checkQuality: Took ${end - start}ms`);

    const { meets_quality, quality_score } = jsonResponse;
    return { meets_quality, quality_score };
  } catch (err) {
    console.error('Received an error from Bedrock during checkQuality:', err);
    throw err; // Changed to throw error for better error handling
  }
};
