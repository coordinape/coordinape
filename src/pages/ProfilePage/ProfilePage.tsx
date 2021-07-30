/* eslint-disable import/order */
import React, { useState, useEffect } from 'react';

import { RouteComponentProps } from 'react-router-dom';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { makeStyles, withStyles, Tooltip, Zoom } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ShowMore from 'react-show-more';

import discord from '../../assets/svgs/social/discord.svg';
import github from '../../assets/svgs/social/github.svg';
import medium from '../../assets/svgs/social/medium.svg';
import telegram from '../../assets/svgs/social/telegram-icon.svg';
import twitter from '../../assets/svgs/social/twitter-icon.svg';
import website from '../../assets/svgs/social/website.svg';
import { useProfile, useMe, useCircle } from 'hooks';

import { getAvatarPath } from 'utils/domain';
import EditModal, { IProfileData } from './EditModal';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // maxWidth: theme.breakpoints.values.md,
  },
  main: {
    padding: theme.spacing(4, 5.5),
  },
  body: {
    padding: '0px 145px',
  },
  button: {
    padding: theme.spacing(0.5, 2.5),
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    border: '0.3px solid rgba(132, 145, 149, 0.2)',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.12)',
    borderRadius: 8,
    textTransform: 'none',
  },
  background: {
    width: '100%',
    height: 240,
  },
  avatar: {
    width: 143,
    height: 143,
    left: 120,
    top: 90,
  },
  skillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  skillItem: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5, 2),
    background: theme.colors.lightBlue,
    textAlign: 'center',
    fontFamily: 'Space Grotesk',
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.white,
    borderRadius: 4,
  },
  skillGroupButton: {
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    backgroundColor: theme.colors.lightBlue,
    color: theme.colors.white,
    height: '22.97px',
    borderRadius: 4,
    textTransform: 'none',
    whiteSpace: 'nowrap',
  },
  socialGroup: {
    padding: theme.spacing(3, 0),
    display: 'flex',
    alignItems: 'center',
  },
  gridTitle: {
    borderBottom: '1px solid rgba(81, 99, 105, 0.33)',
    padding: '17px 48px',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600,
    color: theme.colors.text,
  },
  iconGroup: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 54,
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  gridItem: {
    textAlign: 'center',
    paddingTop: 54,
  },
  recentEpochContainer: {
    maxHeight: 300,
    overflowY: 'scroll',
    scroll: 'smooth',
  },
  collaborators: {
    border: '0.7px solid #939EA1',
    width: 60,
    height: 60,
    marginRight: 16,
  },
  collaboratorsGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  linkButton: {
    background: theme.colors.lightBackground,
    borderRadius: 8,
    textTransform: 'none',
    fontSize: 15,
    color: theme.colors.text,
    marginTop: 8,
    boxShadow: 'none',
  },
  recentEpoch: {
    fontSize: 18,
    color: theme.colors.text,
  },
  bioBox: {
    fontSize: 24,
    color: theme.colors.text,
    paddingBottom: 48,
    whiteSpace: 'pre-wrap',
  },
  bioBoxAnchor: {
    fontSize: 22,
    color: theme.colors.selected,
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: `4px 8px`,
    maxWidth: 240,
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
  },
})(Tooltip);

type FieldName =
  | 'bio'
  | 'skills'
  | 'twitter_username'
  | 'github_username'
  | 'telegram_username'
  | 'discord_username'
  | 'medium_username'
  | 'website';

const editableFields: FieldName[] = [
  'bio',
  'skills',
  'twitter_username',
  'github_username',
  'telegram_username',
  'discord_username',
  'medium_username',
  'website',
];

// http://app.localhost:3000/profile/0xb9209ed68a702e25e738ca0e550b4a560bf4d9d8
// http://app.localhost:3000/profile/me
export const ProfilePage = ({
  match: { params },
}: RouteComponentProps<{ profileAddress?: string }>) => {
  const classes = useStyles();

  // Circle
  const { selectedCircleId } = useCircle();

  // My or Other Profile
  const seemsAddress = params?.profileAddress?.startsWith('0x');
  const isMe = params?.profileAddress === 'me';
  const { profile: aProfile, avatarPath, backgroundPath } = useProfile(
    seemsAddress ? params?.profileAddress : undefined
  );
  const {
    myProfile,
    updateProfile: updateMyProfile,
    updateAvatar,
    updateBackground,
    avatarPath: myAvatarPath,
    backgroundPath: myBackgroundPath,
  } = useMe();

  const [open, setOpenModal] = useState(false);

  const profile = isMe ? myProfile : aProfile;

  // Show Profile Data
  const savedProfileData = {
    avatar: isMe ? myAvatarPath : avatarPath,
    avatarRaw: null,
    background: isMe ? myBackgroundPath : backgroundPath,
    backgroundRaw: null,
    name:
      profile?.users.find((user) => user.circle_id === selectedCircleId)
        ?.name || 'N/A',
    bio: profile?.bio || '',
    telegram_username: profile?.telegram_username || '',
    twitter_username: profile?.twitter_username || '',
    discord_username: profile?.discord_username || '',
    medium_username: profile?.medium_username || '',
    github_username: profile?.github_username || '',
    website: profile?.website || '',
    skills: profile?.skills || [],
    users: profile?.users || [],
    recentEpochs: profile?.users.map((user) => {
      return {
        epochBio: user.bio?.length > 0 ? user.bio : 'N/A',
        epochCircle: user.circle?.name,
      };
    }),
  };

  // Edit Profile Data
  const [profileData, setProfileData] = useState<IProfileData>(
    omit(savedProfileData, ['recentEpochs'])
  );

  const updateSomething = async () => {
    if (isMe) {
      if (profileData.avatarRaw) {
        await updateAvatar(profileData.avatarRaw);
        setProfileData({
          ...profileData,
          avatarRaw: null,
        });
      }

      if (editableFields.some((x) => savedProfileData[x] !== profileData[x])) {
        updateMyProfile(pick(profileData, editableFields));
      }
    }
  };

  const onChangeBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setProfileData({
        ...profileData,
        background: URL.createObjectURL(e.target.files[0]),
        backgroundRaw: e.target.files[0],
      });

      await updateBackground(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (open) setProfileData(omit(savedProfileData, ['recentEpochs']));
  }, [open]);

  return (
    <div className={classes.root}>
      <img
        alt="background"
        src={savedProfileData?.background}
        className={classes.background}
      />
      <Box
        style={{
          width: '100%',
          marginTop: -240,
        }}
      >
        <div className={classes.main}>
          {isMe ? (
            <Box style={{ textAlign: 'right' }}>
              <input
                id="upload-background-button"
                onChange={onChangeBackground}
                style={{ display: 'none' }}
                type="file"
              />
              <label htmlFor="upload-background-button">
                <Button
                  component="span"
                  variant="contained"
                  color="default"
                  className={classes.button}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Background
                </Button>
              </label>
            </Box>
          ) : (
            <Box style={{ textAlign: 'right', paddingTop: 34 }}></Box>
          )}
          <Avatar
            alt="avatar"
            src={savedProfileData?.avatar || '/imgs/avatar/placeholder.jpg'}
            className={classes.avatar}
          />
          {isMe ? (
            <Box style={{ textAlign: 'right', paddingTop: 45 }}>
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<EditOutlinedIcon />}
                onClick={() => setOpenModal(true)}
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <Box style={{ textAlign: 'right', paddingTop: 100 }}></Box>
          )}
          <Box className={classes.body}>
            <h2
              style={{
                marginTop: 18,
                marginBottom: 12,
                fontSize: 30,
                fontWeight: 600,
                fontFamily: 'Space Grotesk',
                color: '#5E6F74',
              }}
            >
              {savedProfileData.name}
            </h2>
            <Box className={classes.skillGroup}>
              {/* loop section from the myprofile data */}
              {savedProfileData?.skills?.length
                ? savedProfileData.skills.map((item) => (
                    <div key={item} className={classes.skillItem}>
                      {item}
                    </div>
                  ))
                : ''}
            </Box>
            <Box className={classes.socialGroup}>
              {savedProfileData?.twitter_username && (
                <Link
                  href={`https://twitter.com/${savedProfileData.twitter_username}`}
                  target="_blank"
                >
                  <img
                    alt="twitter"
                    src={twitter}
                    style={{ paddingRight: 16 }}
                  />
                </Link>
              )}
              {savedProfileData?.github_username && (
                <Link
                  href={`https://github.com/${savedProfileData.github_username}`}
                  target="_blank"
                >
                  <img alt="github" src={github} style={{ paddingRight: 16 }} />
                </Link>
              )}
              {savedProfileData?.telegram_username && (
                <Link
                  href={`https://t.me/${savedProfileData.telegram_username}`}
                  target="_blank"
                >
                  <img
                    alt="telegram"
                    src={telegram}
                    style={{ paddingRight: 16 }}
                  />
                </Link>
              )}
              {savedProfileData?.discord_username && (
                <Link
                  href={`https://discord.com/${savedProfileData.discord_username}`}
                  target="_blank"
                >
                  <img
                    alt="discord"
                    src={discord}
                    style={{
                      paddingRight: 16,
                      width: 50,
                      height: 50,
                    }}
                  />
                </Link>
              )}
              {savedProfileData?.medium_username && (
                <Link
                  href={`https://medium.com/${savedProfileData.medium_username}`}
                  target="_blank"
                >
                  <img
                    alt="medium"
                    src={medium}
                    style={{ paddingRight: 16, width: 50, height: 50 }}
                  />
                </Link>
              )}
              {savedProfileData?.website && (
                <Link
                  style={{ color: 'rgba(81, 99, 105, 0.7)', paddingRight: 16 }}
                  href={savedProfileData.website}
                  target="_blank"
                >
                  <img
                    alt="website"
                    src={website}
                    style={{ paddingRight: 16, width: 50, height: 50 }}
                  />
                </Link>
              )}
            </Box>
            <Box className={classes.bioBox}>
              <ShowMore anchorClass={classes.bioBoxAnchor}>
                {savedProfileData?.bio}
              </ShowMore>
            </Box>
            <Grid container spacing={10}>
              <Grid item sm={6} xs={12}>
                <Box className={classes.gridTitle}>
                  {isMe ? 'My Circles' : 'Circles'}
                </Box>
                <Box className={classes.iconGroup}>
                  {savedProfileData?.users.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        textAlign: 'center',
                        marginLeft: 13,
                        marginRight: 13,
                      }}
                    >
                      <TextOnlyTooltip
                        TransitionComponent={Zoom}
                        placement="top"
                        title={user.circle?.name || ''}
                      >
                        <Avatar
                          alt={user?.circle?.name}
                          src={getAvatarPath(user.circle?.logo)}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            border: '1px solid rgba(94, 111, 116, 0.7)',
                          }}
                        />
                      </TextOnlyTooltip>
                      {user?.non_receiver !== 0 && (
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'rgba(81, 99, 105, 0.5)',
                          }}
                        >
                          Opted-Out
                        </p>
                      )}
                    </div>
                  ))}
                </Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Box className={classes.gridTitle}>Recent Epoch Activity</Box>
                <div className={classes.recentEpochContainer}>
                  {savedProfileData.recentEpochs?.map((epoch, index) => (
                    <Box key={index} className={classes.gridItem}>
                      <Typography
                        style={{ fontWeight: 600 }}
                        className={classes.recentEpoch}
                      >
                        {`Epoch on ${epoch.epochCircle}`}
                      </Typography>
                      <Typography className={classes.recentEpoch}>
                        {epoch.epochBio}
                      </Typography>
                    </Box>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Box>
      <EditModal
        data={profileData}
        setData={setProfileData}
        isOpen={open}
        close={() => setOpenModal(false)}
        save={updateSomething}
      />
    </div>
  );
};

export default ProfilePage;
