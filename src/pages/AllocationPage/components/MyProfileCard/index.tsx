import {
  Button,
  FormControlLabel,
  Radio,
  Tooltip,
  Zoom,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import { ReactComponent as AlertCircleSVG } from 'assets/svgs/button/alert-circle.svg';
import { ReactComponent as CheckedRadioSVG } from 'assets/svgs/button/checked-radio.svg';
import { ReactComponent as EditProfileSVG } from 'assets/svgs/button/edit-profile.svg';
import { ReactComponent as SaveProfileSVG } from 'assets/svgs/button/save-profile.svg';
import { ReactComponent as UnCheckedRadioSVG } from 'assets/svgs/button/unchecked-radio.svg';
import { ReactComponent as UploadImageSVG } from 'assets/svgs/button/upload-image.svg';
import clsx from 'clsx';
import { Img, LoadingModal } from 'components';
import { MAX_BIO_LENGTH, MAX_NAME_LENGTH } from 'config/constants';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { PutUsersParam } from 'types';
import { blobToFile, resizeImage } from 'utils/image';

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
    height: 80,
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
    height: 110,
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
  optContainer: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
  },
  radioInput: {
    height: 18,
    width: 18,
    padding: 0,
  },
  radioLabel: {
    margin: `${theme.spacing(0.5)}px 0`,
    paddingLeft: theme.spacing(1),
    fontSize: 14,
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      color: 'rgba(81, 99, 105, 0.85)',
    },
    '&:checked': {
      color: theme.colors.text,
    },
  },
  alertContainer: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alertLabel: {
    margin: `${theme.spacing(0.5)}px 0`,
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(81, 99, 105, 0.3)',
    textDecoration: 'underline',
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
    padding: `4px 8px`,
    maxWidth: 240,
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
  },
})(Tooltip);

interface IProfileData {
  avatar: string;
  avatarRaw: File | null;
  name: string;
  bio: string;
  non_receiver: number;
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
    non_receiver: me?.non_receiver || 0,
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
          profileData.non_receiver === (me?.non_receiver || 0) &&
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
          profileData.bio !== (me?.bio || '') ||
          profileData.non_receiver !== (me?.non_receiver || 0)
        ) {
          try {
            const params: PutUsersParam = {
              name: profileData.name,
              bio: profileData.bio,
              epoch_first_visit: 0,
              non_receiver: profileData.non_receiver,
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
            <div className={classes.optContainer}>
              <FormControlLabel
                control={
                  <Radio
                    checked={profileData.non_receiver === 0}
                    checkedIcon={<CheckedRadioSVG />}
                    className={classes.radioInput}
                    icon={<UnCheckedRadioSVG />}
                    onChange={() =>
                      setProfileData({ ...profileData, non_receiver: 0 })
                    }
                  />
                }
                label={
                  <p className={classes.radioLabel}>
                    Opt in to receiving {circle?.token_name || 'GIVE'}
                  </p>
                }
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={profileData.non_receiver !== 0}
                    checkedIcon={<CheckedRadioSVG />}
                    className={classes.radioInput}
                    icon={<UnCheckedRadioSVG />}
                    onChange={() =>
                      setProfileData({ ...profileData, non_receiver: 1 })
                    }
                  />
                }
                label={
                  <p className={classes.radioLabel}>
                    Opt out to receiving {circle?.token_name || 'GIVE'}
                  </p>
                }
              />
            </div>
            <Button
              className={classes.saveButton}
              disableRipple={true}
              disabled={
                profileData.name.length === 0 ||
                (profileData.name === (me.name || '') &&
                  profileData.bio === (me.bio || '') &&
                  profileData.non_receiver === (me.non_receiver || 0) &&
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
            {me.non_receiver !== 0 && (
              <div className={classes.alertContainer}>
                <TextOnlyTooltip
                  TransitionComponent={Zoom}
                  placement="top-start"
                  title={`You opted out of receiving ${
                    circle?.token_name || 'GIVE'
                  }. You are paid through other channels or are not currently active.`}
                >
                  <AlertCircleSVG />
                </TextOnlyTooltip>
                <p className={classes.alertLabel}>
                  You opted out of receiving {circle?.token_name || 'GIVE'}
                </p>
              </div>
            )}
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
                  non_receiver: me?.non_receiver || 0,
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
