import { Button, Hidden, makeStyles } from '@material-ui/core';
import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import { LoadingModal } from 'components';
import { MAX_BIO_LENGTH } from 'config/constants';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiService } from 'services/api';
import { PutUsersParam } from 'types';

import { OptInput } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    paddingBottom: 50,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    maxWidth: '90%',
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 'auto',
    textAlign: 'center',
  },
  bioContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bioLabel: {
    margin: 0,
    fontSize: 27,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  bioTextarea: {
    height: 143,
    margin: `${theme.spacing(3)}px ${theme.spacing(6)}px`,
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    resize: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    background: 'rgba(81, 99, 105, 0.2)',
    borderRadius: 8,
    '&::placeholder': {
      opacity: 0.3,
    },
  },
  optContainer: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  optLabel: {
    margin: 0,
    fontSize: 27,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  optHr: {
    height: 1,
    width: '100%',
    color: theme.colors.primary,
  },
  optInputContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButton: {
    marginTop: theme.spacing(5),
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px 24px',
    fontSize: 19.5,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.colors.red,
    borderRadius: 13,
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      background: theme.colors.red,
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
  },
  arrowRightIconWrapper: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
}));

interface IProfileData {
  bio: string;
  non_receiver: number;
}

const ProfilePage = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { me, refreshUserInfo } = useUserInfo();
  const [profileData, setProfileData] = useState<IProfileData>({
    bio: me?.bio || '',
    non_receiver: me?.non_receiver || 0,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  // onChange Bio
  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, bio: e.target.value });
  };

  // onClick SaveProfile
  const onClickSaveProfile = () => {
    if (me?.address && me?.circle_id) {
      const putUsers = async () => {
        try {
          const params: PutUsersParam = {
            name: me?.name,
            bio: profileData.bio,
            non_receiver: profileData.non_receiver,
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
        setLoading(false);
        history.push('/team');
      };

      queryData();
    }
  };

  // Return
  return (
    <div className={classes.root}>
      <p className={classes.title}>What have you been working on recently?</p>
      <div className={classes.bioContainer}>
        <p className={classes.bioLabel}>
          Tell us about your contributions to the Yearn ecosystem this epoch
        </p>
        <textarea
          className={classes.bioTextarea}
          maxLength={MAX_BIO_LENGTH}
          onChange={onChangeBio}
          placeholder="Start Typing..."
          value={profileData.bio}
        />
      </div>
      <div className={classes.optContainer}>
        <p className={classes.optLabel}>
          Should you be eligible receive GIVE distributions this epoch?
        </p>
        <hr className={classes.optHr} />
        <div className={classes.optInputContainer}>
          <OptInput
            isChecked={profileData.non_receiver !== 0}
            subTitle="I am paid sufficiently via other channels"
            title="Opt Out"
            updateOpt={() =>
              setProfileData({ ...profileData, non_receiver: 1 })
            }
          />
          <OptInput
            isChecked={profileData.non_receiver === 0}
            subTitle="I want to be eligible to receive GIVE "
            title="Opt In"
            updateOpt={() =>
              setProfileData({ ...profileData, non_receiver: 0 })
            }
          />
        </div>
      </div>
      <Button className={classes.saveButton} onClick={onClickSaveProfile}>
        Save Your Profile
        <Hidden smDown>
          <div className={classes.arrowRightIconWrapper}>
            <ArrowRightSVG />
          </div>
        </Hidden>
      </Button>
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};

export default ProfilePage;
