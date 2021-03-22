import { Button, Tooltip, makeStyles } from '@material-ui/core';
import { ReactComponent as EditProfileSVG } from 'assets/svgs/button/edit-profile.svg';
import { ReactComponent as SaveProfileSVG } from 'assets/svgs/button/save-profile.svg';
import { ReactComponent as UploadImageSVG } from 'assets/svgs/button/upload-image.svg';
import clsx from 'clsx';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { getApiService } from 'services/api';
import { PutUsersParam } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 300,
    height: 380,
    margin: theme.spacing(1),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.75),
    paddingRight: theme.spacing(2.75),
    display: 'inline-block',
    alignItems: 'center',
    background: '#DFE7E8',
    borderRadius: 10.75,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
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
      content: '\\A',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,0.6)',
      opacity: 1,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
    },
    '&:hover:after': {
      opacity: 1,
    },
  },
  uploadImageIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    background: 'none',
    '&.hover': {
      background: 'rgba(81, 99, 105, 0.9)',
    },
  },
  name: {
    height: 29,
    marginTop: 12,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: '#516369',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  bio: {
    height: 50,
    marginTop: 1,
    marginBottom: 0,
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
  },
  nameInput: {
    width: '100%',
    marginTop: 12,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: '#516369',
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
    height: 115,
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
    color: '#516369',
    background: 'none',
    border: 0,
    borderRadius: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'center',
    '&::placeholder': {
      opacity: 0.3,
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
    marginBottom: 32,
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
    marginBottom: 32,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#516369',
    textTransform: 'none',
    '&:hover': {
      background: 'none',
      textDecoration: 'underline',
    },
    '&:disabled': {
      color: 'rgba(81, 99, 105, 0.5)',
    },
  },
}));

interface IProfileData {
  avatar: string;
  avatarRaw: File | null;
  name: string;
  bio: string;
}

export const MyProfileCard = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { me, refreshUserInfo } = useUserInfo();
  const [isEditing, setEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<IProfileData>({
    avatar: me?.avatar || '',
    avatarRaw: null,
    name: me?.name || '',
    bio: me?.bio || '',
  });
  const [isUploadImageHover, setUploadImageHover] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const maxNameLength = 20;
  const maxBioLength = 140;

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
          profileData.bio === (me?.bio || ''))
      ) {
        return;
      }

      const putUsers = async () => {
        try {
          if (profileData.avatarRaw) {
            const response = await getApiService().uploadImage(
              profileData.avatarRaw
            );
          }
          const params: PutUsersParam = {
            name: profileData.name,
            bio: profileData.bio,
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
      };

      const queryData = async () => {
        setLoading(true);
        await putUsers();
        await refreshUserInfo();
        setEditing(false);
        setLoading(false);
      };

      queryData();
    }
  };

  // Return
  return me ? (
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
          <div
            className={classes.uploadImageContainer}
            // onBlur={() => setUploadImageHover(false)}
            // onMouseEnter={() => setUploadImageHover(true)}
            // onMouseOut={() => setUploadImageHover(false)}
          >
            {/* <label htmlFor="upload-avatar-button"> */}
            <img
              alt=""
              className={classes.avatar}
              src={`/imgs/avatar/${
                profileData.avatar ? profileData.avatar : 'placeholder.jpg'
              }`}
            />
            {/* </label> */}
            {/* <div
              className={clsx(
                classes.uploadImageIconWrapper,
                isUploadImageHover ? 'hover' : ''
              )}
            >
              <UploadImageSVG />
            </div> */}
            {/* <input
              id="upload-avatar-button"
              onChange={onChangeAvatar}
              style={{ display: 'none' }}
              type="file"
            /> */}
          </div>
          <input
            className={classes.nameInput}
            maxLength={maxNameLength}
            onChange={onChangeName}
            placeholder="Your name ..."
            value={profileData.name}
          />
          <div className={classes.bioTextareaContainer}>
            <textarea
              className={classes.bioTextarea}
              maxLength={maxBioLength}
              onChange={onChangeBio}
              placeholder="Tell us about yourself, what you do and why you do it"
              value={profileData.bio}
            />
            <p
              className={classes.bioLengthLabel}
            >{`${profileData.bio.length}/${maxBioLength}`}</p>
          </div>
          <Button
            className={classes.saveButton}
            disabled={
              profileData.name.length === 0 ||
              (profileData.name === (me.name || '') &&
                profileData.bio === (me.bio || ''))
            }
            onClick={onClickSaveProfile}
          >
            <SaveProfileSVG />
            <div className={classes.buttonLabel}>Save My Profile</div>
          </Button>
        </>
      ) : (
        <>
          <img
            alt={me.name}
            className={classes.avatar}
            src={`/imgs/avatar/${me.avatar ? me.avatar : 'placeholder.jpg'}`}
          />
          <p className={classes.name}>{me.name}</p>
          <Tooltip title={me.bio ?? ''}>
            <p className={classes.bio}>{me.bio}</p>
          </Tooltip>
          <Button
            className={classes.editButton}
            onClick={() => setEditing(true)}
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
  ) : null;
};
