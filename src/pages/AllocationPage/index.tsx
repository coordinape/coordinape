import { Button, Hidden, makeStyles } from '@material-ui/core';
import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import { ReactComponent as SettingsTeammatesSVG } from 'assets/svgs/button/settings-teammates.svg';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getApiService } from 'services/api';
import { PostTokenGiftsParam } from 'types';

import { MyProfileCard, TeammateCard } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    paddingBottom: 150,
    display: 'flex',
    flexDirection: 'column',
  },
  balanceContainer: {
    position: 'fixed',
    left: 0,
    right: 50,
    top: theme.custom.appHeaderHeight,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  balanceDescription: {
    fontSize: 20,
    fontWeight: 500,
    color: theme.colors.primary,
    '&:first-of-type': {
      fontWeight: 700,
      color: '#EF7376',
    },
  },
  headerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '80%',
    textAlign: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
    fontSize: 27,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  description: {
    padding: '0 100px',
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  settingTeammatesNavLink: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(1),
    marginRight: 'auto',
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.3)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&:hover': {
      background: 'none',
      textDecoration: 'underline',
    },
  },
  settingIconWrapper: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: 10,
  },
  teammateContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  saveButton: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 53,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px 24px',
    fontSize: 19.5,
    fontWeight: 600,
    textTransform: 'none',
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#EF7376',
    boxShadow: '0px 6.5px 9.75px rgba(181, 193, 199, 0.12)',
    borderRadius: 13,
    opacity: 0.3,
    '&:hover': {
      opacity: 1,
      background: '#EF7376',
    },
    '&:disabled': {
      color: 'white',
      opacity: 0.3,
    },
  },
  arrowRightIconWrapper: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
}));

const AllocationPage = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { me, refreshUserInfo } = useUserInfo();
  const [giveTokens, setGiveTokens] = useState<{ [id: number]: number }>({});
  const [giveNotes, setGiveNotes] = useState<{ [id: number]: string }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const maxGiveTokens = 100;
  const isEpochEnded = false;
  const epochStartedDate = moment(new Date(Date.UTC(2021, 2, 26, 0, 0, 0)));
  const epochEndedDate = moment(new Date(Date.UTC(2021, 3, 2, 0, 0, 0)));

  // Epoch Period
  const calculateEpochTimeLeft = () => {
    const date = moment.utc();
    const difference = Math.max(0, epochEndedDate.diff(date));

    const timeLeft = {
      Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      Minutes: Math.floor((difference / 1000 / 60) % 60),
      Seconds: Math.floor((difference / 1000) % 60),
    };

    return timeLeft;
  };

  const [epochTimeLeft, setEpochTimeLeft] = useState(calculateEpochTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setEpochTimeLeft(calculateEpochTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let epochTimeLeftString = '';
  let epochTimeLeftIndex = 0;

  Object.typedKeys(epochTimeLeft).forEach((interval) => {
    if (epochTimeLeftIndex > 1) {
      return;
    }

    if (epochTimeLeft[interval] !== 0 || interval === 'Seconds') {
      epochTimeLeftString =
        epochTimeLeftString +
        epochTimeLeft[interval] +
        ' ' +
        interval +
        (epochTimeLeftIndex === 0 ? ', ' : '.');
      epochTimeLeftIndex++;
    }
  });

  // GiveTokenRemaining & GiveTokens & GiveNotes
  const giveTokenRemaining =
    maxGiveTokens -
    Object.keys(giveTokens).reduce(
      (sum, key: any) => sum + (giveTokens[key] || 0),
      0
    );

  useEffect(() => {
    if (me?.pending_sent_gifts) {
      me.pending_sent_gifts.forEach((gift) => {
        giveTokens[gift.recipient_id] = gift.tokens;
        giveNotes[gift.recipient_id] = gift.note;
      });
      setGiveTokens({ ...giveTokens });
      setGiveNotes({ ...giveNotes });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.pending_sent_gifts]);

  // onClick SaveAllocation
  const onClickSaveAllocation = () => {
    if (me?.address && me?.teammates && giveTokenRemaining >= 0) {
      const postTokenGifts = async () => {
        try {
          const params: PostTokenGiftsParam[] = [];

          me.teammates.forEach((user) =>
            params.push({
              tokens: giveTokens[user.id] || 0,
              recipient_address: user.address,
              circle_id: user.circle_id,
              note: giveNotes[user.id] || '',
            })
          );

          await getApiService().postTokenGifts(me.address, params, library);
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || 'Something went wrong!',
            { variant: 'error' }
          );
        }
      };

      const queryData = async () => {
        setLoading(true);
        await postTokenGifts();
        await refreshUserInfo();
        setLoading(false);
      };

      queryData();
    }
  };

  // Return
  return (
    <div className={classes.root}>
      <div className={classes.balanceContainer}>
        <p className={classes.balanceDescription}>
          {giveTokenRemaining}
          {giveTokenRemaining > 1 ? ' GIVES' : ' GIVE'}
        </p>
        <p className={classes.balanceDescription}>&nbsp;left to allocate</p>
      </div>
      <div className={classes.headerContainer}>
        <p className={classes.title}>Reward Yearn Contributors</p>
        <p className={classes.subTitle}>
          {isEpochEnded
            ? `The next epoch will begin on ${moment(epochStartedDate)
                .utc()
                .format('MMMM Do')}.`
            : `This epoch’s GET tokens will
            be distributed in ${epochTimeLeftString}`}
        </p>
        <p className={classes.description}>
          {isEpochEnded
            ? 'Stay tuned for details, and thank you for being part of Coordinape’s alpha.'
            : 'These tokens represent $20,000 of contributor budget. Make your allocations below to reward people for bringing value to Yearn.'}
        </p>
      </div>
      <NavLink className={classes.settingTeammatesNavLink} to={'/team'}>
        <div className={classes.settingIconWrapper}>
          <SettingsTeammatesSVG />
        </div>
        Edit Teammates List
      </NavLink>
      <div className={classes.teammateContainer}>
        {(me ? [...me.teammates, me] : [])
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((user) =>
            user.id === me?.id ? (
              <MyProfileCard key={user.id} />
            ) : (
              <TeammateCard
                disabled={isEpochEnded}
                key={user.id}
                note={giveNotes[user.id] || ''}
                tokens={giveTokens[user.id] || 0}
                updateNote={(note) => {
                  giveNotes[user.id] = note;
                  setGiveNotes({ ...giveNotes });
                }}
                updateTokens={(tokens) => {
                  giveTokens[user.id] = tokens;
                  setGiveTokens({ ...giveTokens });
                }}
                user={user}
              />
            )
          )}
      </div>
      {!isEpochEnded ? (
        <Button
          className={classes.saveButton}
          disabled={giveTokenRemaining < 0}
          onClick={onClickSaveAllocation}
        >
          Save Allocations
          <Hidden smDown>
            <div className={classes.arrowRightIconWrapper}>
              <ArrowRightSVG />
            </div>
          </Hidden>
        </Button>
      ) : null}
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};

export default AllocationPage;
