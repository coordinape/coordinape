import Replicate from 'replicate';

import { REPLICATE_API_TOKEN } from '../../../api-lib/config';

const WAIT_TIMEOUT = 55;

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export const generateGiveImg = async ({ skill }: { skill: string }) => {
  const prompt = `Two people, entities, animals, characters, ideas are exchanging thanks, gratitude and respect for embodying the skill of "${skill}"
ILLUSTRATION STYLE
sometimes street photography style,
sometimes illuminated manuscript style, 
sometimes combine cartoon elements with photography
always using green, blue, purple, black`;

  const options = {
    model: 'ideogram-ai/ideogram-v2-turbo',
    wait: WAIT_TIMEOUT,
    input: {
      prompt: prompt,
      resolution: '1088x768',
      negative_prompt: 'sexual, erotic, violent, cute, contemporary, etc.',
      style_type: 'None',
      magic_prompt_option: 'On',
    },
  };

  try {
    const output = await replicate.predictions.create(options);
    return output.urls.stream;
  } catch (error) {
    console.error(`Error generating Give image: ${error}`);
    throw error;
  }
};
