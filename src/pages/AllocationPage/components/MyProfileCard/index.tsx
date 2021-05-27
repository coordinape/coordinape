import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useSnackbar } from 'notistack';

import {
  Button,
  FormControlLabel,
  Radio,
  Tooltip,
  Zoom,
  makeStyles,
  withStyles,
} from '@material-ui/core';

import { ReactComponent as AllocationFire } from 'assets/svgs/button/allocation-fire.svg';
import { ReactComponent as EditProfileSVG } from 'assets/svgs/button/edit-profile.svg';
import { ReactComponent as SaveProfileSVG } from 'assets/svgs/button/save-profile.svg';
import { ReactComponent as UploadImageSVG } from 'assets/svgs/button/upload-image.svg';
import { Img, LoadingModal } from 'components';
import { MAX_BIO_LENGTH, MAX_NAME_LENGTH } from 'config/constants';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { getApiService } from 'services/api';
import { blobToFile, resizeImage } from 'utils/image';

import { PutUsersParam } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 270,
    height: 360,
    margin: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'inline-block',
    alignItems: 'center',
    background: '#DFE7E8',
    borderRadius: 10.75,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  fireIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    border: `1.34426px solid ${theme.colors.border}`,
  },
  uploadImageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    '&:after': {
      content: `" "`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.6)',
      opacity: 0.7,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
    },
    '&:hover': {
      '&:after': {
        opacity: 1,
      },
      '& .upload-image-icon': {
        background: 'rgba(81, 99, 105, 0.9)',
      },
    },
  },
  uploadImageIconWrapper: {
    position: 'absolute',
    left: 'calc(50% - 11px)',
    top: 'calc(50% - 11px)',
    width: 22,
    height: 22,
    borderRadius: 11,
    background: 'none',
    cursor: 'pointer',
    zIndex: 2,
  },
  name: {
    height: 29,
    marginTop: 0,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  bioContainer: {
    height: 140,
    marginTop: theme.spacing(0.5),
    marginBottom: 0,
  },
  bio: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    overflow: 'hidden',
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
  nameInput: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    background: 'none',
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textDecorationLine: 'underline',
    textAlign: 'center',
    '&::placeholder': {
      opacity: 0.3,
    },
  },
  bioTextareaContainer: {
    height: 150,
    marginTop: 6,
    padding: 11,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'rgba(81, 99, 105, 0.2)',
    borderRadius: 8,
  },
  bioTextarea: {
    width: '100%',
    height: '100%',
    padding: 0,
    resize: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
    background: 'none',
    border: 0,
    borderRadius: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-word',
    '&::placeholder': {
      opacity: 0.3,
      textAlign: 'center',
    },
  },
  bioLengthLabel: {
    marginTop: 6,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.2)',
  },
  buttonLabel: {
    paddingTop: 2,
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      background: 'none',
    },
  },
  editButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
    textTransform: 'none',
    '&:hover': {
      background: 'none',
      textDecoration: 'underline',
    },
  },
  saveButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      background: 'none',
      color: theme.colors.text,
    },
    '&:disabled': {
      color: 'rgba(81, 99, 105, 0.5)',
      opacity: 0.3,
    },
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: `13px 20px`,
    maxWidth: 240,
    fontSize: 15,
    fontWeight: 500,
    color: 'white',
    background: '#828F93',
  },
})(Tooltip);

interface IProfileData {
  avatar: string;
  avatarRaw: File | null;
  name: string;
  bio: string;
}

export const MyProfileCard = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { circle, me, refreshUserInfo } = useUserInfo();
  const [isEditing, setEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<IProfileData>({
    avatar: (process.env.REACT_APP_S3_BASE_URL as string) + (me?.avatar || ''),
    avatarRaw: null,
    name: me?.name || '',
    bio: me?.bio || '',
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  // onChange Avatar
  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setProfileData({
        ...profileData,
        avatar: URL.createObjectURL(e.target.files[0]),
        avatarRaw: e.target.files[0],
      });
    }
  };

  // onChange Name
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, name: e.target.value });
  };

  // onChange Bio
  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, bio: e.target.value });
  };

  // onClick SaveProfile
  const onClickSaveProfile = () => {
    if (me?.address && me?.circle_id) {
      if (
        profileData.name.length === 0 ||
        (profileData.name === (me?.name || '') &&
          profileData.bio === (me?.bio || '') &&
          !profileData.avatarRaw)
      ) {
        return;
      }

      const postUploadImage = async () => {
        if (profileData.avatarRaw) {
          try {
            await getApiService().postUploadImage(
              me?.address,
              profileData.avatarRaw,
              library
            );
          } catch (error) {
            enqueueSnackbar(
              error.response?.data?.message || 'Something went wrong!',
              { variant: 'error' }
            );
          }
        }
      };

      const putUsers = async () => {
        if (
          profileData.name !== (me?.name || '') ||
          profileData.bio !== (me?.bio || '')
        ) {
          try {
            const params: PutUsersParam = {
              name: profileData.name,
              bio: profileData.bio,
              epoch_first_visit: 0,
              regift_percent: me?.regift_percent,
              non_giver: me?.non_giver,
              address: me?.address,
              circle_id: me?.circle_id,
            };

            await getApiService().putUsers(me?.address, params, library);
          } catch (error) {
            enqueueSnackbar(
              error.response?.data?.message || 'Something went wrong!',
              { variant: 'error' }
            );
          }
        }
      };

      const queryData = async () => {
        setLoading(true);
        await postUploadImage();
        await putUsers();
        await refreshUserInfo();
        setEditing(false);
        setLoading(false);
      };

      queryData();
    }
  };

  // Return
  return (
    me && (
      <div className={classes.root}>
        {isEditing ? (
          <>
            <Button
              className={classes.backButton}
              disableRipple={true}
              onClick={() => setEditing(false)}
            >
              ←
            </Button>
            <div className={classes.uploadImageContainer}>
              <label htmlFor="upload-avatar-button">
                <Img
                  alt="avatar"
                  className={classes.avatar}
                  placeholderImg="/imgs/avatar/placeholder.jpg"
                  src={profileData.avatar}
                />
                <div
                  className={clsx(
                    classes.uploadImageIconWrapper,
                    'upload-image-icon'
                  )}
                >
                  <UploadImageSVG />
                </div>
              </label>
              <input
                id="upload-avatar-button"
                onChange={onChangeAvatar}
                style={{ display: 'none' }}
                type="file"
              />
            </div>
            <input
              className={classes.nameInput}
              maxLength={MAX_NAME_LENGTH}
              onChange={onChangeName}
              placeholder="Your name ..."
              value={profileData.name}
            />
            <div className={classes.bioTextareaContainer}>
              <textarea
                className={classes.bioTextarea}
                maxLength={MAX_BIO_LENGTH}
                onChange={onChangeBio}
                placeholder="Tell us about yourself, what you do and why you do it"
                value={profileData.bio}
              />
              <p
                className={classes.bioLengthLabel}
              >{`${profileData.bio.length}/${MAX_BIO_LENGTH}`}</p>
            </div>
            <Button
              className={classes.saveButton}
              disableRipple={true}
              disabled={
                profileData.name.length === 0 ||
                (profileData.name === (me.name || '') &&
                  profileData.bio === (me.bio || '') &&
                  !profileData.avatarRaw)
              }
              onClick={onClickSaveProfile}
            >
              <SaveProfileSVG />
              <div className={classes.buttonLabel}>Save My Profile</div>
            </Button>
          </>
        ) : (
          <>
            {me.regift_percent === 100 && (
              <div className={classes.fireIcon}>
                <TextOnlyTooltip
                  TransitionComponent={Zoom}
                  placement="bottom-start"
                  title={`You are currently set to burn 100% of the ${
                    circle?.token_name || 'GIVE'
                  } you receive this epoch.`}
                >
                  <AllocationFire />
                </TextOnlyTooltip>
              </div>
            )}
            <Img
              alt="avatar"
              className={classes.avatar}
              placeholderImg="/imgs/avatar/placeholder.jpg"
              src={(process.env.REACT_APP_S3_BASE_URL as string) + me.avatar}
            />
            <p className={classes.name}>{me.name}</p>
            <div className={classes.bioContainer}>
              <p className={classes.bio}>{me.bio}</p>
            </div>
            <Button
              className={classes.editButton}
              disableRipple={true}
              onClick={() => {
                setProfileData({
                  avatar:
                    (process.env.REACT_APP_S3_BASE_URL as string) +
                    (me?.avatar || ''),
                  avatarRaw: null,
                  name: me?.name || '',
                  bio: me?.bio || '',
                });
                setEditing(true);
              }}
            >
              <EditProfileSVG />
              <div className={classes.buttonLabel}>Edit My Profile</div>
            </Button>
          </>
        )}
        {isLoading && (
          <LoadingModal onClose={() => {}} text="" visible={isLoading} />
        )}
      </div>
    )
  );
};
