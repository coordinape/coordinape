import { z } from 'zod';

import { createForm } from './createForm';

import { IProfile } from 'types';

const schema = z
  .object({
    avatar: z.any(),
    bio: z.string(),
    skills: z.array(z.string()),
    twitter_username: z.string(),
    github_username: z.string(),
    telegram_username: z.string(),
    discord_username: z.string(),
    medium_username: z.string(),
    website: z.string(),
  })
  .strict();

const EditProfileForm = createForm({
  name: 'EditProfileForm',
  getInstanceKey: () => 'me',
  getZodParser: () => schema,
  load: (p: IProfile) => ({
    bio: p.bio ?? '',
    skills: p.skills ?? [],
    twitter_username: p.twitter_username ?? '',
    github_username: p.github_username ?? '',
    telegram_username: p.telegram_username ?? '',
    discord_username: p.discord_username ?? '',
    medium_username: p.medium_username ?? '',
    website: p.website ?? '',
  }),
  fieldKeys: Object.keys(schema.shape),
  fieldProps: {},
});

export default EditProfileForm;
