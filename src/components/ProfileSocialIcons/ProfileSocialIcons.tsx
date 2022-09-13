import { Link2Icon } from '@radix-ui/react-icons';

import { DeprecatedMediumIcon } from 'icons';
import { Discord, Github, Telegram, Twitter } from 'icons/__generated';
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
          <Twitter />
        </Link>
      )}
      {profile.github_username && (
        <Link
          color="neutral"
          href={`https://github.com/${profile.github_username}`}
          target="_blank"
        >
          <Github />
        </Link>
      )}
      {profile.telegram_username && (
        <Link
          color="neutral"
          href={`https://t.me/${profile.telegram_username}`}
          target="_blank"
        >
          <Telegram />
        </Link>
      )}
      {profile.discord_username && (
        <Link
          href={`https://discord.com/${profile.discord_username}`}
          target="_blank"
          color="neutral"
        >
          <Discord />
        </Link>
      )}
      {profile.medium_username && (
        <Link
          color="neutral"
          href={`https://${profile.medium_username}.medium.com`}
          target="_blank"
        >
          <DeprecatedMediumIcon />
        </Link>
      )}
      {profile.website && (
        <Link color="neutral" href={profile.website} target="_blank">
          <Link2Icon />
        </Link>
      )}
    </Flex>
  );
};
