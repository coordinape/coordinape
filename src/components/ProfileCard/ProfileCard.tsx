import React from 'react';

import { useRecoilState } from 'recoil';

import { makeStyles, Button } from '@material-ui/core';

import { ReactComponent as EditProfileSVG } from 'assets/svgs/button/edit-profile.svg';
import {
  ApeAvatar,
  ApeInfoTooltip,
  ProfileSocialIcons,
  ThreeDotMenu,
  ProfileSkills,
  ReadMore,
} from 'components';
import { USER_ROLE_ADMIN, USER_ROLE_COORDINAPE } from 'config/constants';
import { useNavigation } from 'hooks';
import { useContributions } from 'hooks/useContributions';
import { rLocalGift } from 'recoilState';
import { useSetEditProfileOpen } from 'recoilState/ui';
import { EXTERNAL_URL_FEEDBACK } from 'routes/paths';

import { CardInfoText } from './CardInfoText';
import { ContributionSummary } from './ContributionSummary';
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
    display: '-webkit-box',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    gridColumn: '1 / 4',
    textAlign: 'center',
    margin: theme.spacing(0.5, 0),
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
  },
  tooltipLink: {
    display: 'block',
    margin: theme.spacing(2, 0, 0),
    textAlign: 'center',
    color: theme.colors.linkBlue,
  },
  tooltip: {
    fontWeight: 400,
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
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    textAlign: 'center',
    WebkitLineClamp: 4,
    wordBreak: 'break-word',
    width: '100%',
    overflowY: 'auto',
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

const ProfileCardInner = ({
  user,
  tokens,
  note,
  disabled,
  circleId,
  isMe,
  tokenName = 'GIVE',
}: {
  user: IUser;
  tokens: number;
  note: string;
  disabled?: boolean;
  circleId: number;
  isMe?: boolean;
  tokenName?: string;
}) => {
  const classes = useStyles();
  const { getToMap, getToProfile } = useNavigation();
  const setEditProfileOpen = useSetEditProfileOpen();

  const userBioTextLength = user?.bio?.length ?? 0;
  const skillsLength = user?.profile?.skills?.length ?? 0;

  const hideUserBio =
    (userBioTextLength > 93 && skillsLength > 2) || userBioTextLength > 270;

  const contributions = useContributions(user.address);
  const [gift, setGift] = useRecoilState(rLocalGift(user.id, circleId));

  const updateGift = ({ note, tokens }: { note?: string; tokens?: number }) => {
    setGift({
      user,
      note: note === undefined ? gift?.note || '' : note,
      tokens: tokens === undefined ? gift?.tokens || 0 : tokens,
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.topRow}>
        <div className={classes.socialContainer}>
          {user.profile && <ProfileSocialIcons profile={user.profile} />}
        </div>
        <ApeAvatar
          user={user}
          className={classes.avatar}
          onClick={getToProfile(user.address)}
        />
        <div className={classes.moreContainer}>
          <ThreeDotMenu
            actions={[
              {
                label: 'View on Graph',
                onClick: getToMap({ highlight: user.address }),
              },
              {
                label: 'View Profile',
                onClick: getToProfile(isMe ? 'me' : user.address),
              },
            ]}
          />
        </div>
        <span className={classes.name}>
          {user.name}
          {user.role === USER_ROLE_COORDINAPE && (
            <ApeInfoTooltip classes={{ tooltip: classes.tooltip }}>
              <b>Why is Coordinape in my circle?</b>
              <div>
                To date Coordinape has offered our service for free. We decided
                that using the gift circle mechanism as our revenue model might
                make a lot of sense, so we’re trying that out.
              </div>
              <a
                href={EXTERNAL_URL_FEEDBACK}
                rel="noreferrer"
                target="_blank"
                className={classes.tooltipLink}
              >
                Let us know what you think
              </a>
            </ApeInfoTooltip>
          )}
        </span>

        <div className={classes.skillContainer}>
          <ProfileSkills
            skills={user?.profile?.skills ?? []}
            isAdmin={user.role === USER_ROLE_ADMIN}
            max={3}
          />
        </div>
      </div>

      <div className={classes.bio}>
        {contributions?.contributions.length ? (
          <ContributionSummary contributions={contributions} />
        ) : isMe && !user.bio ? (
          'Your Epoch Statement is Blank'
        ) : (
          <ReadMore isHidden={hideUserBio}>{user.bio}</ReadMore>
        )}
      </div>

      {!disabled && !isMe && (
        <GiftInput
          tokens={
            user.fixed_non_receiver || user.non_receiver ? undefined : tokens
          }
          note={note}
          updateGift={updateGift}
          tokenName={tokenName}
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
          You are opted out of receiving ${tokenName}. Navigate to My Epoch and
          opt in to receive.
        </CardInfoText>
      )}

      {isMe && (
        <Button
          variant="text"
          className={classes.editButton}
          onClick={() => setEditProfileOpen(true)}
        >
          <EditProfileSVG />
          Edit My Profile
        </Button>
      )}
    </div>
  );
};

export const ProfileCard = React.memo(ProfileCardInner);
ProfileCard.displayName = 'ProfileCard';
