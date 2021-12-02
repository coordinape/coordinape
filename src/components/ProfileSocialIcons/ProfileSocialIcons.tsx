import React from 'react';

import { makeStyles, IconButton } from '@material-ui/core';

import {
  TwitterIcon,
  DiscordIcon,
  MediumIcon,
  TelegramIcon,
  LinkIcon,
  GithubIcon,
} from 'icons';

import { IApiProfile } from 'types';

const useStyles = makeStyles(theme => ({
  socialItem: {
    margin: theme.spacing(0.5),
    width: 18,
    height: 18,
  },
}));

export const ProfileSocialIcons = ({ profile }: { profile: IApiProfile }) => {
  const classes = useStyles();

  return (
    <>
      {profile.twitter_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://twitter.com/${profile.twitter_username}`}
          target="_blank"
        >
          <TwitterIcon />
        </IconButton>
      )}
      {profile.github_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://github.com/${profile.github_username}`}
          target="_blank"
        >
          <GithubIcon />
        </IconButton>
      )}
      {profile.telegram_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://t.me/${profile.telegram_username}`}
          target="_blank"
        >
          <TelegramIcon />
        </IconButton>
      )}
      {profile.discord_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://discord.com/${profile.discord_username}`}
          target="_blank"
        >
          <DiscordIcon />
        </IconButton>
      )}
      {profile.medium_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://medium.com/${profile.medium_username}`}
          target="_blank"
        >
          <MediumIcon />
        </IconButton>
      )}
      {profile.website && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={profile.website}
          target="_blank"
        >
          <LinkIcon />
        </IconButton>
      )}
    </>
  );
};
