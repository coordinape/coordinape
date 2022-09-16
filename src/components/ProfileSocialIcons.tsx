import React from 'react';

import { makeStyles, IconButton } from '@material-ui/core';

import {
  DeprecatedTwitterIcon,
  DeprecatedDiscordIcon,
  DeprecatedMediumIcon,
  DeprecatedTelegramIcon,
  DeprecatedLinkIcon,
  DeprecatedGithubIcon,
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
          <DeprecatedTwitterIcon />
        </IconButton>
      )}
      {profile.github_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://github.com/${profile.github_username}`}
          target="_blank"
        >
          <DeprecatedGithubIcon />
        </IconButton>
      )}
      {profile.telegram_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://t.me/${profile.telegram_username}`}
          target="_blank"
        >
          <DeprecatedTelegramIcon />
        </IconButton>
      )}
      {profile.discord_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://discord.com/${profile.discord_username}`}
          target="_blank"
        >
          <DeprecatedDiscordIcon />
        </IconButton>
      )}
      {profile.medium_username && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={`https://${profile.medium_username}.medium.com`}
          target="_blank"
        >
          <DeprecatedMediumIcon />
        </IconButton>
      )}
      {profile.website && (
        <IconButton
          size="small"
          className={classes.socialItem}
          href={profile.website}
          target="_blank"
        >
          <DeprecatedLinkIcon />
        </IconButton>
      )}
    </>
  );
};
