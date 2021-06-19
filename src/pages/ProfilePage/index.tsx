import React, { useState } from 'react';

import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';

import { Button, Hidden, makeStyles } from '@material-ui/core';

import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import { LoadingModal } from 'components';
import { MAX_BIO_LENGTH } from 'config/constants';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { getApiService } from 'services/api';
import { capitalizedName } from 'utils/string';

import { OptInput } from './components';

import { PutUsersParam } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIndex: {
    margin: 0,
    width: 32,
    height: 32,
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: '32px',
    background: theme.colors.lightGray,
    borderRadius: 16,
  },
  title: {
    margin: 0,
    paddingLeft: theme.spacing(1),
    fontSize: 30,
    fontWeight: 600,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  optHr: {
    height: 1,
    width: '100%',
    color: theme.colors.primary,
    opacity: 0.5,
  },
  bioContainer: {
    marginTop: 0,
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bioTextarea: {
    height: 143,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(3),
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
    wordBreak: 'break-word',
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
  optInputContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 53,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  fixed_non_receiver: number;
}

const ProfilePage = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { circle, me, refreshUserInfo } = useUserInfo();
  const [profileData, setProfileData] = useState<IProfileData>({
    bio: me?.bio || '',
    non_receiver: me?.non_receiver || 0,
    fixed_non_receiver: me?.fixed_non_receiver || 0,
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
      let isPutUser = false;

      const putUsers = async () => {
        try {
          const params: PutUsersParam = {
            name: me?.name,
            bio: profileData.bio,
            epoch_first_visit: 0,
            non_receiver: profileData.non_receiver,
            non_giver: me?.non_giver,
            address: me?.address,
            circle_id: me?.circle_id,
          };

          await getApiService().putUsers(me?.address, params, library);

          isPutUser = true;
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
        if (isPutUser) {
          history.push('/team');
        }
      };

      queryData();
    }
  };

  // Return
  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <p className={classes.titleIndex}>1</p>
        <p className={classes.title}>What have you been working on recently?</p>
      </div>
      <hr className={classes.optHr} />
      <div className={classes.bioContainer}>
        <textarea
          className={classes.bioTextarea}
          maxLength={MAX_BIO_LENGTH}
          onChange={onChangeBio}
          placeholder={`Tell us about your contributions in the ${capitalizedName(
            circle?.name
          )} Circle this  epoch...`}
          value={profileData.bio}
        />
      </div>
      {profileData.fixed_non_receiver === 0 ? (
        <>
          <div className={classes.titleContainer}>
            <p className={classes.titleIndex}>2</p>
            <p className={classes.title}>
              Should you receive {circle?.token_name || 'GIVE'} distributions in
              the {capitalizedName(circle?.name)} Circle this epoch?
            </p>
          </div>
          <hr className={classes.optHr} />
          <div className={classes.optInputContainer}>
            <OptInput
              isChecked={profileData.non_receiver === 0}
              subTitle={`I want to be eligible to receive ${
                circle?.token_name || 'GIVE'
              }`}
              title="Opt In"
              updateOpt={() =>
                setProfileData({ ...profileData, non_receiver: 0 })
              }
            />
            <OptInput
              isChecked={profileData.non_receiver !== 0}
              subTitle="I am paid sufficiently via other channels"
              title="Opt Out"
              updateOpt={() =>
                setProfileData({ ...profileData, non_receiver: 1 })
              }
            />
          </div>
        </>
      ) : (
        <>
          <div className={classes.titleContainer}>
            <p className={classes.title}>
              Your administrator opted you out of receiving{' '}
              {circle?.token_name || 'GIVE'}
            </p>
          </div>
          <hr className={classes.optHr} />
          <div className={classes.optInputContainer}>
            <p className={classes.optLabel}>
              You can still distribute {circle?.token_name || 'GIVE'} as normal.
              Generally people are opted out of receiving{' '}
              {circle?.token_name || 'GIVE'} if they are compensated in other
              ways by their organization. Please contact your circle admin for
              more details.
            </p>
          </div>
        </>
      )}

      <div className={classes.buttonContainer}>
        <Button className={classes.saveButton} onClick={onClickSaveProfile}>
          Save Your Profile
          <Hidden smDown>
            <div className={classes.arrowRightIconWrapper}>
              <ArrowRightSVG />
            </div>
          </Hidden>
        </Button>
      </div>
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};

export default ProfilePage;
