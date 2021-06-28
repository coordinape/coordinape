import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import { useSnackbar } from 'notistack';

import { Button, Hidden, makeStyles } from '@material-ui/core';

import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import { LoadingModal, PopUpModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { getApiService } from 'services/api';
import { addForceOptOutCircleId, isForceOptOutCircleId } from 'utils/storage';
import { capitalizedName } from 'utils/string';

import { MyProfileCard, TeammateCard } from './components';

import { PostTokenGiftsParam } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 90,
    paddingBottom: 150,
    display: 'flex',
    flexDirection: 'column',
  },
  balanceContainer: {
    position: 'fixed',
    right: 50,
    top: theme.custom.appHeaderHeight + 15,
    zIndex: 1,
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    borderRadius: 8,
    justifyContent: 'flex-end',
    background: 'linear-gradient(0deg, #FAF1F2, #FAF1F2)',
    boxShadow: '2px 3px 6px rgba(81, 99, 105, 0.12)',
  },
  balanceDescription: {
    margin: 0,
    fontSize: 20,
    fontWeight: 500,
    color: theme.colors.primary,
    '&:first-of-type': {
      fontWeight: 700,
      color: theme.colors.red,
    },
  },
  headerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '80%',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
  },
  subTitle: {
    margin: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    fontSize: 27,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  description: {
    padding: '0 100px',
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.primary,
    margin: 0,
  },
  accessaryContainer: {
    width: '95%',
    marginTop: theme.spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  filterLabel: {
    margin: 0,
    paddingLeft: theme.spacing(1),
    fontSize: 14,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.35)',
  },
  filterButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterButton: {
    height: 17,
    padding: theme.spacing(0, 1),
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.35)',
    '&:hover': {
      background: 'none',
      color: 'rgba(81, 99, 105, 0.75)',
    },
    '&:first-of-type': {
      border: 'solid',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      borderRadius: 0,
      borderColor: 'rgba(81, 99, 105, 0.35)',
    },
    '&.selected': {
      color: theme.colors.selected,
    },
  },
  sortButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  sortLabel: {
    margin: 0,
    paddingRight: theme.spacing(1),
    fontSize: 14,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.35)',
  },
  sortButton: {
    height: 17,
    padding: theme.spacing(0, 1),
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.35)',
    border: 'solid',
    borderColor: 'rgba(81, 99, 105, 0.35)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 0,
    '&:hover': {
      background: 'none',
      color: 'rgba(81, 99, 105, 0.75)',
    },
    '&:first-of-type': {
      borderLeftWidth: 0,
    },
    '&:last-of-type': {
      borderRightWidth: 0,
    },
    '&.selected': {
      color: theme.colors.selected,
    },
  },
  settingTeammatesNavLink: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(1),
    marginRight: 'auto',
    padding: theme.spacing(1, 2),
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.red,
    borderRadius: 8,
    backgroundColor: theme.colors.transparent,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconWrapper: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: 10,
  },
  teammateContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    '&:disabled': {
      color: theme.colors.lightRed,
      background: theme.colors.mediumRed,
    },
  },
  arrowRightIconWrapper: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
}));

enum OrderType {
  Alphabetical = 'Alphabetical',
  Give_Allocated = 'Give Allocated',
  Opt_In_First = 'Opt-In First',
}

enum FilterType {
  OptIn = 1,
  NewMember = 2,
}

const AllocationPage = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { circle, epoch, me, refreshUserInfo } = useUserInfo();
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Alphabetical);
  const [filterType, setFilterType] = useState<number>(0);
  const [giveTokens, setGiveTokens] = useState<{ [id: number]: number }>({});
  const [giveNotes, setGiveNotes] = useState<{ [id: number]: string }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const epochStartDate = epoch ? moment.utc(epoch.start_date) : moment.utc();
  const epochEndDate = epoch ? moment.utc(epoch.end_date) : moment.utc();
  let isEpochEnded = true;
  let isWaitingEpoch = true;

  // Epoch Period
  const calculateEpochTimeLeft = () => {
    const date = moment.utc();
    const differenceStart = date.diff(epochStartDate);
    const differenceEnd = epochEndDate.diff(date);

    if (differenceStart >= 0 && differenceEnd > 0) {
      isEpochEnded = false;

      return {
        Days: Math.floor(differenceEnd / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((differenceEnd / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((differenceEnd / 1000 / 60) % 60),
        Seconds: Math.floor((differenceEnd / 1000) % 60),
      };
    } else {
      isEpochEnded = true;
      isWaitingEpoch = differenceStart < 0;

      return {
        Days: 0,
        Hours: 0,
        Minutes: 0,
        Seconds: 0,
      };
    }
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
    (me?.non_giver !== 0 ? 0 : me.starting_tokens) -
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

          me.teammates.forEach((user) => {
            const gift = me.pending_sent_gifts.find(
              (gift) => gift.recipient_id === user.id
            );
            if (
              (gift?.tokens || 0) !== (giveTokens[user.id] || 0) ||
              (gift?.note || '') !== (giveNotes[user.id] || '')
            ) {
              params.push({
                tokens: giveTokens[user.id] || 0,
                recipient_id: user.id,
                circle_id: user.circle_id,
                note: giveNotes[user.id] || '',
              });
            }
          });

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
          {giveTokenRemaining} {circle?.token_name || 'GIVE'}
        </p>
        <p className={classes.balanceDescription}>&nbsp;left to allocate</p>
      </div>
      <div className={classes.headerContainer}>
        <p className={classes.title}>
          Reward {capitalizedName(circle?.name)} Contributors
        </p>
        <p className={classes.subTitle}>
          {isEpochEnded
            ? isWaitingEpoch
              ? `Epoch ${
                  epoch?.number || 1
                } starts on ${epochStartDate.local().format('dddd MMMM Do')}.`
              : `The last epoch ended on ${epochEndDate
                  .subtract(1, 'seconds')
                  .local()
                  .format('dddd MMMM Do')}.`
            : `GET tokens will be distributed in ${epochTimeLeftString}`}
        </p>
        {/* <p className={classes.description}>
          {isEpochEnded
            ? 'Stay tuned for details, and thank you for being part of Coordinape’s alpha.'
            : `These tokens represent ${moment(
                epochStartDate.subtract(1, 'days')
              )
                .utc()
                .format(
                  'MMMM'
                )}’s contributor budget of $20,000. Make your allocation below to reward people for bringing value to Yearn.`}
        </p> */}
      </div>
      {/* <NavLink className={classes.settingTeammatesNavLink} to={'/team'}>
        <div className={classes.settingIconWrapper}>
          <SettingsTeammatesSVG />
        </div>
        Edit Teammates List
      </NavLink> */}
      <div className={classes.accessaryContainer}>
        <div className={classes.filterButtonContainer}>
          <p className={classes.filterLabel}>filter by</p>
          <div>
            <Button
              className={clsx(
                classes.filterButton,
                filterType & FilterType.OptIn ? 'selected' : ''
              )}
              disableRipple={true}
              onClick={() => setFilterType(filterType ^ FilterType.OptIn)}
            >
              Opt-In
            </Button>
            <Button
              className={clsx(
                classes.filterButton,
                filterType & FilterType.NewMember ? 'selected' : ''
              )}
              disableRipple={true}
              onClick={() => setFilterType(filterType ^ FilterType.NewMember)}
            >
              New Members
            </Button>
          </div>
        </div>
        <div className={classes.sortButtonContainer}>
          <p className={classes.sortLabel}>sort by</p>
          <div>
            <Button
              className={clsx(
                classes.sortButton,
                orderType === OrderType.Alphabetical ? 'selected' : ''
              )}
              disableRipple={true}
              onClick={() => setOrderType(OrderType.Alphabetical)}
            >
              Alphabetical
            </Button>
            <Button
              className={clsx(
                classes.sortButton,
                orderType === OrderType.Give_Allocated ? 'selected' : ''
              )}
              disableRipple={true}
              onClick={() => setOrderType(OrderType.Give_Allocated)}
            >
              Give Allocated
            </Button>
            <Button
              className={clsx(
                classes.sortButton,
                orderType === OrderType.Opt_In_First ? 'selected' : ''
              )}
              disableRipple={true}
              onClick={() => setOrderType(OrderType.Opt_In_First)}
            >
              Opt-In First
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.teammateContainer}>
        {(me ? [...me.teammates.filter((a) => a.is_hidden === 0), me] : [])
          .filter((a) => {
            if (filterType & FilterType.OptIn) {
              return !a.non_receiver;
            }
            if (filterType & FilterType.NewMember) {
              return +new Date() - +new Date(a.created_at) < 24 * 3600 * 1000;
            }
            return true;
          })
          .sort((a, b) => {
            switch (orderType) {
              case OrderType.Alphabetical:
                return a.name.localeCompare(b.name);
              case OrderType.Give_Allocated: {
                const av =
                  me?.pending_sent_gifts.find(
                    (gift) => gift.recipient_id === a.id
                  )?.tokens || 0;
                const bv =
                  me?.pending_sent_gifts.find(
                    (gift) => gift.recipient_id === b.id
                  )?.tokens || 0;
                if (av !== bv) {
                  return av - bv;
                } else {
                  return a.name.localeCompare(b.name);
                }
              }
              case OrderType.Opt_In_First: {
                return a.non_receiver - b.non_receiver;
              }
            }
          })
          .map((user) =>
            user.id === me?.id ? (
              <MyProfileCard key={user.id} />
            ) : (
              <TeammateCard
                disabled={isEpochEnded}
                key={user.id}
                note={giveNotes[user.id] || ''}
                tokenName={circle?.token_name || 'GIVE'}
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
      {!isEpochEnded && (
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
      )}
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
      {me &&
        circle &&
        me.fixed_non_receiver &&
        !isForceOptOutCircleId(me.id, circle.id) && (
          <PopUpModal
            onClose={() => {
              addForceOptOutCircleId(me.id, circle.id);
            }}
            title={`Your administrator opted you out of receiving ${
              circle.token_name || 'GIVE'
            }`}
            description={`You can still distribute ${
              circle.token_name || 'GIVE'
            } as normal. Generally people are opted out of receiving ${
              circle.token_name || 'GIVE'
            } if they are compensated in other ways by their organization.  Please contact your circle admin for more details.`}
            button="Okay, Got it."
            visible={!isForceOptOutCircleId(me.id, circle.id)}
          />
        )}
    </div>
  );
};

export default AllocationPage;
