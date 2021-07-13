import React, { useState, useReducer } from 'react';

import clsx from 'clsx';

import { Button, makeStyles } from '@material-ui/core';

import { PopUpModal, MyProfileCard, TeammateCard } from 'components';
import { useMe, useSelectedAllocation, useSelectedCircleEpoch } from 'hooks';
import storage from 'utils/storage';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.lg,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(10, 4, 20),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5, 1, 20),
    },
  },
  balanceContainer: {
    position: 'fixed',
    right: 50,
    top: theme.custom.appHeaderHeight + 90,
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
    fontWeight: 300,
    color: theme.colors.primary,
    '&:first-of-type': {
      fontWeight: 500,
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
    fontSize: 40,
    lineHeight: 1.25,
    fontWeight: 700,
    color: theme.colors.primary,
  },
  subTitle: {
    margin: 0,
    padding: theme.spacing(1, 4),
    fontSize: 20,
    lineHeight: 1.5,
    fontWeight: 300,
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
  teammateContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
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

const AllocationGive = () => {
  const classes = useStyles();

  // Yes wierd but true
  // TODO: move that storage state into Recoil
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { epochIsActive, longTimingMessage } = useSelectedCircleEpoch();
  const { selectedMyUser, selectedCircle } = useMe();
  const { givePerUser, localTeammates, updateGift } = useSelectedAllocation();
  console.log('-=->', localTeammates);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Alphabetical);
  const [filterType, setFilterType] = useState<number>(0);

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <h2
          className={classes.title}
        >{`${selectedCircle?.name} ${longTimingMessage}`}</h2>
        <h2 className={classes.subTitle}>{selectedCircle?.alloc_text}</h2>
      </div>
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
        {(selectedMyUser
          ? [...localTeammates.filter((a) => a.is_hidden === 0)]
          : []
        )
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
                const av = givePerUser.get(a.id)?.tokens ?? 0;
                const bv = givePerUser.get(b.id)?.tokens ?? 0;
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
            user.id === selectedMyUser?.id ? (
              <MyProfileCard key={user.id} />
            ) : (
              <TeammateCard
                disabled={!epochIsActive}
                key={user.id}
                note={givePerUser.get(user.id)?.note || ''}
                tokenName={selectedCircle?.token_name || 'GIVE'}
                tokens={givePerUser.get(user.id)?.tokens || 0}
                updateNote={(note) => updateGift(user.id, { note })}
                updateTokens={(tokens) => updateGift(user.id, { tokens })}
                user={user}
              />
            )
          )}
      </div>

      {selectedCircle && selectedMyUser?.fixed_non_receiver ? (
        <PopUpModal
          onClose={() => {
            storage.setHasSeenForceOptOutPopup(selectedMyUser.id);
            forceUpdate();
          }}
          title={`Your administrator opted you out of receiving ${
            selectedCircle.token_name || 'GIVE'
          }`}
          description={`You can still distribute ${
            selectedCircle.token_name || 'GIVE'
          } as normal. Generally people are opted out of receiving ${
            selectedCircle.token_name || 'GIVE'
          } if they are compensated in other ways by their organization.  Please contact your circle admin for more details.`}
          button="Okay, Got it."
          visible={!storage.hasSeenForceOptOutPopup(selectedMyUser.id)}
        />
      ) : null}
    </div>
  );
};

export default AllocationGive;
