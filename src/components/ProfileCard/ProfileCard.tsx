import React from 'react';

import { useHistory } from 'react-router';

import { makeStyles, Button } from '@material-ui/core';

import { ReactComponent as EditProfileSVG } from 'assets/svgs/button/edit-profile.svg';
import {
  ApeAvatar,
  ProfileSocialIcons,
  ThreeDotMenu,
  ProfileSkills,
} from 'components';
import { useSelectedCircle } from 'recoilState';
import { MAP_HIGHLIGHT_PARAM } from 'routes/paths';

import { CardInfoText } from './CardInfoText';
import { GiftInput } from './GiftInput';

import { IUser } from 'types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 330,
    height: 452,
    margin: theme.spacing(1),
    padding: theme.spacing(1.3, 1.3, 2),
    background: theme.colors.background,
    borderRadius: 10.75,
  },
  topRow: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 60px 1fr',
  },
  socialContainer: {
    justifySelf: 'start',
    margin: theme.spacing(0.7),
  },
  moreContainer: {
    justifySelf: 'end',
    margin: theme.spacing(0.7),
  },
  avatar: {
    width: 60,
    height: 60,
    margin: 'auto',
    border: `1.4px solid ${theme.colors.border}`,
    cursor: 'pointer',
    transition: 'border-color .3s ease',
    '&:hover': {
      border: '1.4px solid rgba(239, 115, 118, 1)',
    },
  },
  name: {
    gridColumn: '1 / 4',
    textAlign: 'center',
    margin: theme.spacing(0.5, 0),
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
  },
  skillContainer: {
    gridColumn: '1 / 4',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bio: {
    flexGrow: 1,
    margin: theme.spacing(1.5, 0, 0),
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    textAlign: 'center',
    overflow: 'hidden',
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
  editButton: {
    margin: theme.spacing(7, 0, 2),
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      background: 'none',
      textDecoration: 'underline',
    },
  },
}));

type TUpdateGift = ({
  note,
  tokens,
}: {
  note?: string;
  tokens?: number;
}) => void;

export const ProfileCard = ({
  user,
  tokens,
  note,
  disabled,
  updateGift,
  isMe,
}: {
  user: IUser;
  tokens: number;
  note: string;
  disabled?: boolean;
  updateGift?: TUpdateGift;
  isMe?: boolean;
}) => {
  const classes = useStyles();
  const history = useHistory();
  const selectedCircle = useSelectedCircle();

  return (
    <div className={classes.root}>
      <div className={classes.topRow}>
        <div className={classes.socialContainer}>
          <ProfileSocialIcons profile={user.profile} />
        </div>
        <ApeAvatar
          user={user}
          className={classes.avatar}
          onClick={() => history.push(`profile/${user.address}`)}
        />
        <div className={classes.moreContainer}>
          <ThreeDotMenu
            actions={[
              {
                label: 'View on Graph',
                onClick: () =>
                  history.push(`map?${MAP_HIGHLIGHT_PARAM}=${user.address}`),
              },
              {
                label: 'View Profile',
                onClick: () => history.push(`profile/${user.address}`),
              },
            ]}
          />
        </div>
        <span className={classes.name}>{user.name}</span>
        <div className={classes.skillContainer}>
          <ProfileSkills user={user} max={3} />
        </div>
      </div>

      <div className={classes.bio}>
        {isMe && !user.bio ? 'Your Epoch Statement is Blank' : user.bio}
      </div>

      {!disabled && updateGift && (
        <GiftInput
          tokens={
            user.fixed_non_receiver || user.non_receiver ? tokens : undefined
          }
          note={note}
          updateGift={updateGift}
        />
      )}

      {isMe && !!user.fixed_non_receiver && (
        <CardInfoText tooltip="">
          Your administrator opted you out of receiving. You can still
          distribute as normal.
        </CardInfoText>
      )}

      {isMe && !user.fixed_non_receiver && !!user.non_receiver && (
        <CardInfoText tooltip="">
          You are opted out of receiving ${selectedCircle?.tokenName}, navigate
          to my epoch and opt in to receive.
        </CardInfoText>
      )}

      {isMe && (
        <Button
          variant="text"
          className={classes.editButton}
          onClick={() => history.push(`profile/me`)}
        >
          <EditProfileSVG />
          Edit My Profile
        </Button>
      )}
    </div>
  );
};
