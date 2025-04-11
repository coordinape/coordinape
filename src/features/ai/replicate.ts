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
  let prompt;
  if (skill.toLowerCase() === 'create') {
    const creatures = [
      'human-cat',
      'human-dog',
      'human-horse',
      'woman',
      'man',
      'cyborg',
      'wizard',
    ];
    const creature1 = creatures[Math.floor(Math.random() * creatures.length)];
    const creature2 = creatures[Math.floor(Math.random() * creatures.length)];
    prompt = `A mythical Japanese anime ${creature1} and a mythical Japanese anime ${creature2} in side profile are smiling at each other, touching hands, exchanging a solid white circle.  The background is solid flat blue #0053FF.  Style is 2D Japanese comic book anime.`;
  } else {
    prompt = await genGiveImagePrompt(skill);
  }

  const options = {
    model: 'recraft-ai/recraft-20b',
    wait: WAIT_TIMEOUT,
    input: {
      prompt: prompt,
      size: '1536x1024',
      style:
        skill.toLowerCase() === 'create'
          ? 'digital_illustration'
          : modelStyles[Math.floor(Math.random() * modelStyles.length)],
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

export const describeImage = async (url: string) => {
  try {
    const result = await replicate.run(
      'yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb',
      {
        input: {
          image: url,
          top_p: 1,
          prompt: 'describe this image',
          max_tokens: 512,
          temperature: 0.2,
        },
      }
    );

    const text = (result as string[]).join('');

    return text;
  } catch (error) {
    console.error(`Error describing image: ${error}`);
    return '';
  }
};
