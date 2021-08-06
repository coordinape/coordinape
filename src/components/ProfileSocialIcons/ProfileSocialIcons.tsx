import React from 'react';

import clsx from 'clsx';

import { makeStyles, Link } from '@material-ui/core';

import { ReactComponent as DiscordSVG } from 'assets/svgs/social/discord.svg';
import { ReactComponent as GithubSVG } from 'assets/svgs/social/github.svg';
import { ReactComponent as MediumSVG } from 'assets/svgs/social/medium.svg';
import { ReactComponent as TelegramSVG } from 'assets/svgs/social/telegram-icon.svg';
import { ReactComponent as TwitterSVG } from 'assets/svgs/social/twitter-icon.svg';
import { ReactComponent as WebsiteSVG } from 'assets/svgs/social/website.svg';

import { IProfileEmbed } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  socialItem: {
    margin: theme.spacing(0.5),
    width: 18,
    height: 18,
    '& svg': {
      width: '100%',
      height: '100%',
    },
  },
}));

export const ProfileSocialIcons = ({
  className,
  profile,
}: {
  className?: string;
  profile: IProfileEmbed;
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      {profile.twitter_username && (
        <Link
          href={`https://twitter.com/${profile.twitter_username}`}
          target="_blank"
          className={classes.socialItem}
        >
          <TwitterSVG />
        </Link>
      )}
      {profile.github_username && (
        <Link
          href={`https://github.com/${profile.github_username}`}
          target="_blank"
          className={classes.socialItem}
        >
          <GithubSVG />
        </Link>
      )}
      {profile.telegram_username && (
        <Link
          href={`https://t.me/${profile.telegram_username}`}
          target="_blank"
          className={classes.socialItem}
        >
          <TelegramSVG />
        </Link>
      )}
      {profile.discord_username && (
        <Link
          href={`https://discord.com/${profile.discord_username}`}
          target="_blank"
          className={classes.socialItem}
        >
          <DiscordSVG />
        </Link>
      )}
      {profile.medium_username && (
        <Link
          href={`https://medium.com/${profile.medium_username}`}
          target="_blank"
          className={classes.socialItem}
        >
          <MediumSVG />
        </Link>
      )}
      {profile.website && (
        <Link
          href={profile.website}
          target="_blank"
          className={classes.socialItem}
        >
          <WebsiteSVG />
        </Link>
      )}
    </div>
  );
};
