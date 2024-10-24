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
  const prompt = `Top left corner has the title "${giverName}". Top right corner has the title: "${receiverName}". The scene is a dark fantasy, 8bit, pixel art.  The two skeletal spirits are interacting and exchanging a magical, glowing undead object. Graveyard scene with sharp spires and broken windows. The background features retro-style lightning strikes that illuminate the scene in stark flashes. Include video-glitch elements.`;

  const options = {
    model: 'ideogram-ai/ideogram-v2-turbo',
    wait: WAIT_TIMEOUT,
    input: {
      prompt: prompt,
      resolution: '1088x768',
      negative_prompt:
        'cute, happy, videogame, game, bricks, hats, symmetrical',
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
