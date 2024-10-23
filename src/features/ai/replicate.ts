import Replicate from 'replicate';

import { REPLICATE_API_TOKEN } from '../../../api-lib/config';

const WAIT_TIMEOUT = 55;

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const generateBonesGiveImg = async ({
  giverName,
  receiverName,
}: {
  giverName: string;
  receiverName: string;
}) => {
  const prompt = `8bit, pixelated style, colorful, halloween. A scene of two dead animal skeleton spirits, one with an floating title '${giverName}', the other with a floating title '${receiverName}'. They are joyfully dancing and celebrating.`;

  const options = {
    model: 'ideogram-ai/ideogram-v2-turbo',
    wait: WAIT_TIMEOUT,
    input: {
      prompt: prompt,
      resolution: '1088x768',
      style_type: 'None',
      magic_prompt_option: 'On',
    },
  };

  try {
    const output = await replicate.predictions.create(options);
    return output.urls.stream;
  } catch (error) {
    console.error(`Error generating Bones Give image: ${error}`);
    throw error;
  }
};
