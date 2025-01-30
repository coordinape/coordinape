/* eslint-disable no-console */
import openai_client from './openaiClient';

export const genGiveImagePrompt = async (
  skill: string
): Promise<string | undefined> => {
  try {
    const openai = openai_client({
      'Helicone-Property-Function': 'genGiveImagePrompt',
    });

    if (skill.length > 400) {
      console.log(
        'genGiveImagePrompt : Skipping generation because skill is too long'
      );
      return undefined;
    }

    const start = new Date().getTime();

    const characters = [
      ` Two multi-racial people wearing unique clothing exchange ${skill}`,
      ` Two paper origami dolls exchanging ${skill}`,
      ` Two cautious strangers wearing outlandish clothing exchange ${skill}`,
      ` Two fantasy novel characters wearing outlandish clothing exchange  ${skill}`,
      ` Two sci-fi novel characters wearing outlandish clothing exchange  ${skill}`,
      ` Two cyborgs wearing unique clothing exchange  ${skill}`,
      ` Two egyptian gods wearing unique clothing exchange ${skill}`,
      ` Two computers talking with each other exchanging ${skill}`,
      ` Two ancient dieties wearing unique clothing exchange ${skill}`,
    ];

    const sceneVariations = [
      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}, rendered as if captured through both a radio telescope and a Renaissance master's eyes. The interaction creates impossible auroras that form architectural structures in space.`,

      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}. The scene should appear as if viewed through both an electron microscope and stained glass.`,

      `Scene focus: ${characters[Math.floor(Math.random() * characters.length)]}, depicted as if their roots are forming baroque cathedral architecture underground.`,
    ];

    const basePrompt = `Generate a text description capturing an exchange of gratitude, thanks, and respect between two people, entities, animals, or characters.  The dominant theme is ${skill}. 
${sceneVariations[Math.floor(Math.random() * sceneVariations.length)]}.

Technical requirements:
- Avoid: cartoon or cartoonish style, obvious symbolism, nudity
- Use: natural color palette
- ${skill} should play a significant role in the image
- All characters are fully clothed
- Response must be 400 characters or less

`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1.2,
      max_tokens: 110,
      messages: [
        {
          role: 'system',
          content: `Generate a text description for a text-to-image model. Return the text for the prompt without ANY other content in your response. Always show an exchange or interaction, never just a scene with one subject. The scene should be directly inspired by the word: ${skill}.
          `,
        },
        {
          role: 'user',
          content: basePrompt,
        },
      ],
    });

    const end = new Date().getTime();
    console.log(`genGiveImagePrompt: Took ${end - start}ms`);

    return response.choices[0].message.content || undefined;
  } catch (err) {
    console.error(
      'Received an error from OpenAI during genGiveImagePrompt:',
      err
    );
    return undefined;
  }
};
