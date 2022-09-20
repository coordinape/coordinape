import {
  Discord,
  Github,
  Link as LinkIcon,
  Medium,
  Telegram,
  Twitter,
} from 'icons/__generated';
import { Link, Flex } from 'ui';

import { IApiProfile } from 'types';

export const ProfileSocialIcons = ({ profile }: { profile: IApiProfile }) => {
  return (
    <Flex css={{ gap: '$xs' }}>
      {profile.twitter_username && (
        <Link
          color="neutral"
          href={`https://twitter.com/${profile.twitter_username}`}
          target="_blank"
        >
          <Twitter nostroke />
        </Link>
      )}
      {profile.github_username && (
        <Link
          color="neutral"
          href={`https://github.com/${profile.github_username}`}
          target="_blank"
        >
          <Github nostroke />
        </Link>
      )}
      {profile.telegram_username && (
        <Link
          color="neutral"
          href={`https://t.me/${profile.telegram_username}`}
          target="_blank"
        >
          <Telegram nostroke />
        </Link>
      )}
      {profile.discord_username && (
        <Link
          href={`https://discord.com/${profile.discord_username}`}
          target="_blank"
          color="neutral"
        >
          <Discord nostroke />
        </Link>
      )}
      {profile.medium_username && (
        <Link
          color="neutral"
          href={`https://${profile.medium_username}.medium.com`}
          target="_blank"
        >
          <Medium nostroke />
        </Link>
      )}
      {profile.website && (
        <Link color="neutral" href={profile.website} target="_blank">
          <LinkIcon />
        </Link>
      )}
    </Flex>
  );
};
