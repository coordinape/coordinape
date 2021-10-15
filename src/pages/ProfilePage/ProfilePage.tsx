import React from 'react';

import { transparentize } from 'polished';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles, Avatar, Button } from '@material-ui/core';

import {
  ProfileSocialIcons,
  ProfileSkills,
  ApeAvatar,
  FormFileUpload,
} from 'components';
import { useProfile, useMe, useCircle, useImageUploader, useApi } from 'hooks';
import { EditIcon } from 'icons';
import { useSetEditProfileOpen } from 'recoilState';
import { getAvatarPath } from 'utils/domain';

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
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    padding: theme.spacing(0, 2),
    height: 300,
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
  body: {
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    padding: theme.spacing(0, 2),
  },
  name: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 30,
    fontWeight: 600,
    color: theme.colors.primary,
  },
  skillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
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

export const ProfilePage = ({
  match: { params },
}: RouteComponentProps<{ profileAddress?: string }>) => {
  const classes = useStyles();
  const { selectedCircleId } = useCircle();
  const setEditProfileOpen = useSetEditProfileOpen();

  // My or Other Profile
  const seemsAddress = params?.profileAddress?.startsWith('0x');
  const isMe = params?.profileAddress === 'me';
  const { profile: aProfile } = useProfile(
    seemsAddress ? params?.profileAddress : undefined
  );
  const { updateBackground } = useApi();

  const { myProfile } = useMe();

  const profile = isMe ? myProfile : aProfile;
  const user = profile?.users?.find(
    user => user.circle_id === selectedCircleId
  );
  const name = user?.name ?? profile?.users?.[0]?.name ?? 'unknown';

  const {
    imageUrl: backgroundUrl,
    formFileUploadProps: backgroundUploadProps,
  } = useImageUploader(
    getAvatarPath(profile?.background, '/imgs/background/profile-bg.jpg')
  );

  const recentEpochs = profile?.users?.map(user => ({
    bio: user.bio?.length > 0 ? user.bio : 'No epoch statement made.',
    circle: user.circle,
  }));

  if (!profile) {
    return <></>;
  }

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
            max={3}
          />
        </div>
        <div className={classes.socialGroup}>
          <ProfileSocialIcons profile={profile} />
        </div>
        <div className={classes.bio}>{profile?.bio}</div>
      </div>

      <div className={classes.sections}>
        <Section title="My Circles">
          {profile?.users?.map(u => (
            <div key={u.id} className={classes.circle}>
              <Avatar
                alt={u?.circle?.name}
                src={u.circle?.logo ? getAvatarPath(u.circle?.logo) : undefined}
              >
                {u.circle.name}
              </Avatar>

              <span>
                {u.circle.protocol.name} {u.circle.name}
              </span>
              {u?.non_receiver !== 0 && <span>Opted-Out</span>}
            </div>
          ))}
        </Section>
        <Section title="Recent Epoch Activity" asColumn>
          {recentEpochs?.map(({ bio, circle }, i) => (
            <div className={classes.recentEpoch} key={i}>
              <div className={classes.recentEpochTitle}>
                {circle.protocol.name} {circle.name}
              </div>
              <div className={classes.recentEpochStatement}>{bio}</div>
            </div>
          ))}
        </Section>
        {/* <Section title="Frequent Collaborators">TODO.</Section> */}
      </div>
    </div>
  );
};

export default ProfilePage;
