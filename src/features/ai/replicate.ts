import Replicate from 'replicate';

import { REPLICATE_API_TOKEN } from '../../../api-lib/config';
import { genGiveImagePrompt } from '../../../api-lib/openai';

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

export const genImageFluxSchnell = async ({ skill }: { skill: string }) => {
  const prompt = await genGiveImagePrompt(skill);

  const options = {
    model: 'black-forest-labs/flux-schnell',
    wait: WAIT_TIMEOUT,
    input: {
      prompt: prompt,
      go_fast: true,
      megapixels: '1',
      num_outputs: 1,
      aspect_ratio: '4:3',
      output_format: 'webp',
      output_quality: 80,
      num_inference_steps: 4,
    },
  };

  try {
    const output = await replicate.predictions.create(options);
    return output.urls.stream;
  } catch (error) {
    console.error(`Error generating Give image with flux schnell: ${error}`);
    throw error;
  }
};

const modelStyles = [
  'digital_illustration/engraving_color',
  'realistic_image/hard_flash',
  'realistic_image/studio_portrait',
  'digital_illustration/handmade_3d',
];

export const genImageRecraft20b = async ({ skill }: { skill: string }) => {
  const prompt = await genGiveImagePrompt(skill);

  const options = {
    model: 'recraft-ai/recraft-20b',
    wait: WAIT_TIMEOUT,
    input: {
      prompt: prompt,
      size: '1365x1024',
      style: modelStyles[Math.floor(Math.random() * modelStyles.length)],
    },
  };

  try {
    const output = await replicate.predictions.create(options);
    return output.urls.stream;
  } catch (error) {
    console.error(`Error generating Give image with flux schnell: ${error}`);
    throw error;
  }
};
