import { BasicProfile } from '@datamodels/identity-profile-basic';

export type ISelfIdProfile = BasicProfile & {
  address: string;
  // caipAddress: string; // In the future we can use these
  github_username?: string;
  twitter_username?: string;
};
