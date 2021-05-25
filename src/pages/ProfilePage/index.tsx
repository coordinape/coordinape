import { Button, Hidden, makeStyles } from '@material-ui/core';
import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import clsx from 'clsx';
import { LoadingModal } from 'components';
import { MAX_BIO_LENGTH } from 'config/constants';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import { transparentize } from 'polished';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiService } from 'services/api';
import { PutUsersParam } from 'types';
import { capitalizedName } from 'utils/string';

import { OptInput } from './components';

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
  regiftContainer: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  regiftLabel: {
    width: '45%',
    margin: 0,
    fontSize: 15,
    fontWeight: 400,
    color: theme.colors.primary,
    opacity: 0.7,
  },
  link: {
    color: theme.colors.primary,
  },
  burnContainer: {
    width: '45%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  percentTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: theme.colors.text,
    opacity: 0.4,
    textAlign: 'center',
  },
  percentContainer: {
    margin: theme.spacing(2.5, 0),
    padding: theme.spacing(0, 2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  percentButton: {
    position: 'relative',
    width: 64,
    height: 40,
    margin: theme.spacing(0, 0.5),
    padding: theme.spacing(1, 0),
    fontSize: 18,
    fontWeight: 600,
    color: transparentize(0.4, theme.colors.text),
    textAlign: 'center',
    background: theme.colors.white,
    borderRadius: 13,
    border: 0,
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
    '&.selected': {
      color: theme.colors.white,
      background: transparentize(0.5, theme.colors.text),
    },
  },
  percentLabel: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    marginTop: theme.spacing(2.5),
    marginLeft: 0,
    marginRight: 0,
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    opacity: 0.4,
    textAlign: 'center',
    whiteSpace: 'nowrap',
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
  regift_percent: number;
}

const ProfilePage = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { circle, me, refreshUserInfo } = useUserInfo();
  const [profileData, setProfileData] = useState<IProfileData>({
    bio: me?.bio || '',
    regift_percent: me?.regift_percent || 0,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const percents = [0, 25, 50, 75, 100];

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
            regift_percent: profileData.regift_percent,
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
          placeholder="Tell us about your contributions in the Stategy Circle this  epoch..."
          value={profileData.bio}
        />
      </div>
      <div className={classes.titleContainer}>
        <p className={classes.titleIndex}>2</p>
        <p className={classes.title}>
          Do you want to burn the {circle?.token_name || 'GIVE'} you receive
          this epoch?
        </p>
      </div>
      <hr className={classes.optHr} />
      <div className={classes.regiftContainer}>
        <div className={classes.burnContainer}>
          <p className={classes.percentTitle}>Choose a Percentage to Burn:</p>
          <div className={classes.percentContainer}>
            {percents.map((percent) => (
              <>
                <button
                  className={clsx(
                    classes.percentButton,
                    profileData.regift_percent === percent ? 'selected' : ''
                  )}
                  key={percent}
                  onClick={() =>
                    setProfileData({ ...profileData, regift_percent: percent })
                  }
                >
                  {percent}%
                  {profileData.regift_percent === percent && (
                    <p className={classes.percentLabel}>
                      ( ≈{' '}
                      {(
                        ((me?.give_token_received || 0) * percent) /
                        100
                      ).toFixed(1)}{' '}
                      )
                    </p>
                  )}
                </button>
              </>
            ))}
          </div>
        </div>
        <p className={classes.regiftLabel}>
          Burns a percentage of tokens you receive, thereby boosting the value
          of {circle?.token_name || 'GIVE'} this epoch for all Circle members.{' '}
          <a
            className={classes.link}
            href="https://docs.coordinape.com/welcome/new-feature-regift"
            rel="noreferrer"
            target="_blank"
          >
            Learn more about burning.
          </a>
        </p>
      </div>
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
