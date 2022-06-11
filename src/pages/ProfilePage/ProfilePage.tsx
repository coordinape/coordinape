import React from 'react';

import { transparentize } from 'polished';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { makeStyles, Button } from '@material-ui/core';

import {
  ProfileSocialIcons,
  ProfileSkills,
  ApeAvatar,
  FormFileUpload,
  scrollToTop,
} from 'components';
import { USER_ROLE_COORDINAPE } from 'config/constants';
import { useImageUploader, useApiWithProfile, useApiBase } from 'hooks';
import { EditIcon } from 'icons';
import {
  useMyProfile,
  useSelectedCircleLoadable,
  useProfile,
} from 'recoilState/app';
import { useSetEditProfileOpen } from 'recoilState/ui';
import { EXTERNAL_URL_FEEDBACK, paths } from 'routes/paths';
import { Avatar } from 'ui';
import { getAvatarPath, getCircleAvatar } from 'utils/domain';

import { IMyProfile, IProfile } from 'types';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 307,
    width: '100%',
    '& > img': {
      position: 'absolute',
      objectFit: 'cover',
      top: 0,
      width: '100%',
      height: 235,
    },
  },
  headerInside: {
    position: 'relative',
    height: 300,
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    padding: theme.spacing(0, 8),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
    },
  },
  body: {
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    padding: theme.spacing(0, 8),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
    },
  },
  avatar: {
    top: 155,
    width: 143,
    height: 143,
  },
  uploadButton: {
    position: 'absolute',
    top: 22,
    right: 16,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 28,
  },
  name: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 30,
    fontWeight: 600,
    color: theme.colors.text,
    display: '-webkit-box',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  skillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '0 10%',
  },
  socialGroup: {
    padding: theme.spacing(3, 0),
    display: 'flex',
    alignItems: 'center',
  },
  bio: {
    color: theme.colors.text,
    paddingBottom: 48,
    whiteSpace: 'pre-wrap',
    fontWeight: 300,
    fontSize: 24,
    lineHeight: 1.5,
  },

  sections: {
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        width: '100%',
      },
    },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: transparentize(0.3, theme.colors.text),
    padding: theme.spacing(0, 0, 1),
    margin: theme.spacing(4, 0, 2),
    borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
    width: '60%',
    minWidth: 300,
    textAlign: 'center',
  },
  sectionBody: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionBodyColumn: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: 300,
    cursor: 'pointer',
    color: transparentize(0.3, theme.colors.text),
    margin: theme.spacing(1),
    '& > .MuiAvatar-root': {
      marginBottom: theme.spacing(1),
      width: 60,
      height: 60,
    },
  },
  recentEpoch: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 1.3,
  },
  recentEpochTitle: {
    color: theme.colors.text,
    fontWeight: 600,
  },
  recentEpochStatement: {
    color: transparentize(0.3, theme.colors.text),
    fontWeight: 300,
    margin: theme.spacing(0.25, 0, 3),
  },
}));

export const ProfilePage = () => {
  const { profileAddress: address } = useParams();

  const { address: myAddress } = useMyProfile();
  const isMe = address === 'me' || address === myAddress;
  if (!(isMe || address?.startsWith('0x'))) {
    return <></>; // todo better 404?
  }

  return isMe ? <MyProfilePage /> : <OtherProfilePage address={address} />;
};

const MyProfilePage = () => {
  const myProfile = useMyProfile();
  const selectedCircle = useSelectedCircleLoadable();

  return (
    <ProfilePageContent
      profile={myProfile}
      circleId={selectedCircle.valueMaybe()?.circleId}
      isMe
    />
  );
};

const OtherProfilePage = ({ address }: { address: string }) => {
  const profile = useProfile(address);
  const selectedCircle = useSelectedCircleLoadable();

  return (
    <ProfilePageContent
      profile={profile}
      circleId={selectedCircle.valueMaybe()?.circleId}
    />
  );
};

const ProfilePageContent = ({
  profile,
  circleId,
  isMe,
}: {
  profile: IMyProfile | IProfile;
  circleId?: number;
  isMe?: boolean;
}) => {
  const classes = useStyles();
  const users = (profile as IMyProfile)?.myUsers ?? profile?.users ?? [];
  const user = users.find(user => user.circle_id === circleId);
  const name = user?.name ?? users?.[0]?.name ?? 'unknown';

  const setEditProfileOpen = useSetEditProfileOpen();
  const { updateBackground } = useApiWithProfile();
  const navigate = useNavigate();
  const { selectCircle } = useApiBase();

  const goToCircleHistory = (id: number, path: string) => {
    selectCircle(id).then(() => {
      scrollToTop();
      navigate(path);
    });
  };

  const {
    imageUrl: backgroundUrl,
    formFileUploadProps: backgroundUploadProps,
  } = useImageUploader(
    getAvatarPath(profile?.background, '/imgs/background/profile-bg.jpg')
  );

  const recentEpochs = profile?.users?.map(user => ({
    bio: (user?.bio?.length ?? 0) > 0 ? user.bio : null,
    circle: user.circle,
  }));

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img src={backgroundUrl} alt={name} />
        <div className={classes.headerInside}>
          <ApeAvatar
            profile={{ ...profile, users: [] }}
            className={classes.avatar}
          />
          {isMe && (
            <>
              <FormFileUpload
                className={classes.uploadButton}
                editText="Edit Background"
                uploadText="Upload Background"
                {...backgroundUploadProps}
                commit={f =>
                  updateBackground(f)
                    .catch(console.warn)
                    .then(() => backgroundUploadProps.onChange(undefined))
                }
                accept="image/gif, image/jpeg, image/png"
              />
              <Button
                className={classes.editButton}
                variant="outlined"
                color="default"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={classes.body}>
        <h1 className={classes.name}>{name}</h1>
        <div className={classes.skillGroup}>
          <ProfileSkills
            skills={profile.skills ?? []}
            isAdmin={user?.role === 1}
            max={50}
          />
        </div>
        <div className={classes.socialGroup}>
          <ProfileSocialIcons profile={profile} />
        </div>
        <div className={classes.bio}>
          {user?.role === USER_ROLE_COORDINAPE ? (
            <div>
              Coordinape is the platform you’re using right now! We currently
              offer our service for free and invite people to allocate to us
              from within your circles. All tokens received go to the Coordinape
              treasury.{' '}
              <a href={EXTERNAL_URL_FEEDBACK} rel="noreferrer" target="_blank">
                Let us know what you think.
              </a>
            </div>
          ) : (
            profile?.bio
          )}
        </div>
      </div>

      {user && !user.isCoordinapeUser && (
        <div className={classes.sections}>
          <Section title="My Circles">
            {profile?.users?.map(
              u =>
                u.circle && (
                  <div key={u.id} className={classes.circle}>
                    <Avatar
                      name={u.circle.name}
                      size="small"
                      path={getCircleAvatar({
                        avatar: u.circle.logo,
                        circleName: u.circle.name,
                      })}
                      onClick={() =>
                        goToCircleHistory(u.circle_id, paths.history)
                      }
                    />

                    <span>
                      {u.circle.protocol.name} {u.circle.name}
                    </span>
                    {u.non_receiver && <span>Opted-Out</span>}
                  </div>
                )
            )}
          </Section>
          <Section title="Recent Epoch Activity" asColumn>
            {recentEpochs?.map(
              ({ bio, circle }, i) =>
                circle && (
                  <div className={classes.recentEpoch} key={i}>
                    <div className={classes.recentEpochTitle}>
                      {circle.protocol.name} {circle.name}
                    </div>
                    <div className={classes.recentEpochStatement}>{bio}</div>
                  </div>
                )
            )}
          </Section>
          {/* <Section title="Frequent Collaborators">TODO.</Section> */}
        </div>
      )}
    </div>
  );
};

const Section = ({
  title,
  children,
  asColumn,
}: {
  title: string;
  children?: React.ReactNode;
  asColumn?: boolean;
}) => {
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <h4 className={classes.sectionHeader}>{title}</h4>
      <div
        className={asColumn ? classes.sectionBodyColumn : classes.sectionBody}
      >
        {children}
      </div>
    </div>
  );
};

export default ProfilePage;
