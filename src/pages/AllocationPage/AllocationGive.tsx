import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import iti from 'itiriri';

import { Button, IconButton, makeStyles } from '@material-ui/core';

import { useApiBase, useRecoilLoadCatch } from '../../hooks';
import { DeprecatedBalanceIcon } from '../../icons';
import * as mutations from '../../lib/gql/mutations';
import { ISimpleGift, PostTokenGiftsParam } from '../../types';
import { Button as UIButton } from '../../ui';
import { ProfileCard } from 'components';
import { useCurrentCircleIntegrations } from 'hooks/gql/useCurrentCircleIntegrations';
import { useSelectedCircle } from 'recoilState/app';
import { Text } from 'ui';

import BalanceContainer from './BalanceContainer';
import BalanceDescription from './BalanceDescription';
import { buildDiffMap, isLocalGiftsChanged } from './calculations';
import SaveButtonContainer from './SaveButtonContainer';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: theme.breakpoints.values.lg,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(8, 4, 20),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5, 1, 20),
    },
  },
  headerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '80%',
    textAlign: 'center',
  },
  subTitle: {
    margin: 0,
    padding: theme.spacing(1, 4),
    fontSize: 20,
    lineHeight: 1.5,
    fontWeight: 300,
    color: theme.colors.text,
    textAlign: 'center',
  },
  description: {
    padding: '0 100px',
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.text,
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
    fontWeight: 400,
    color: theme.colors.secondaryText,
  },
  filterButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterButton: {
    height: 17,
    padding: theme.spacing(0, 1),
    fontSize: 14,
    fontWeight: 400,
    textTransform: 'none',
    color: theme.colors.secondaryText,
    '&:hover': {
      background: 'none',
      color: theme.colors.text,
    },
    '&:first-of-type': {
      border: 'solid',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      borderRadius: 0,
      borderColor: theme.colors.secondaryText,
    },
    '&.selected': {
      color: theme.colors.secondary,
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
    fontWeight: 400,
    color: theme.colors.secondaryText,
  },
  sortButton: {
    height: 17,
    padding: theme.spacing(0, 1),
    fontSize: 14,
    fontWeight: 400,
    textTransform: 'none',
    color: theme.colors.secondaryText,
    border: 'solid',
    borderColor: theme.colors.secondaryText,
    borderWidth: 0,
    borderRadius: 0,
    '&:hover': {
      background: 'none',
      color: theme.colors.text,
    },
    '&:first-of-type': {
      borderRightWidth: 1,
    },
    '&:last-of-type': {
      borderLeftWidth: 1,
    },
    '&.selected': {
      color: theme.colors.secondary,
    },
  },
  teammateContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  rebalanceButton: {
    color: theme.colors.text,
    marginLeft: theme.spacing(1),
    padding: '1px',
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

export interface WonderContribution {
  user_address: string;
  tasks: [];
  org_id: string;
}

type AllocationGiveProps = {
  givePerUser: Map<number, ISimpleGift>;
  localGifts: ISimpleGift[];
  pendingGiftsFrom: { recipient_id: number; tokens: number; note?: string }[];
  setLocalGifts: (value: React.SetStateAction<ISimpleGift[]>) => void;
};

const AllocationGive = ({
  givePerUser,
  localGifts,
  pendingGiftsFrom,
  setLocalGifts,
}: AllocationGiveProps) => {
  const classes = useStyles();
  const { fetchCircle } = useApiBase();

  const {
    myUser,
    circleEpochsStatus: { epochIsActive, longTimingMessage, currentEpoch },
    circle: selectedCircle,
  } = useSelectedCircle();
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Alphabetical);
  const [filterType, setFilterType] = useState<number>(0);
  const integrations = useCurrentCircleIntegrations();
  const [wonderTasks, setWonderTasks] = useState<any>();
  const teammateReceiverCount = localGifts
    .map(g => (g.user.non_receiver ? 0 : 1))
    .reduce((a: number, b: number) => a + b, 0);

  const tokenStarting = myUser.non_giver ? 0 : myUser.starting_tokens;
  const tokenAllocated = Array.from(localGifts).reduce(
    (sum, { tokens }: ISimpleGift) => sum + tokens,
    0
  );
  const tokenRemaining = tokenStarting - tokenAllocated;

  const localGiftsChanged =
    pendingGiftsFrom && isLocalGiftsChanged(pendingGiftsFrom, localGifts);

  const handleSaveAllocations = async () => {
    try {
      await saveGifts();
    } catch (e) {
      console.warn('handleSaveAllocations', e);
    }
  };

  const rebalanceGifts = () => {
    if (teammateReceiverCount === 0) {
      return;
    }
    if (tokenAllocated === 0) {
      setLocalGifts(
        localGifts.slice().map(g => {
          if (!g.user.non_receiver) {
            return {
              ...g,
              tokens: Math.floor(tokenStarting / teammateReceiverCount),
            };
          }
          return g;
        })
      );
    } else {
      const rebalance = tokenStarting / tokenAllocated;
      setLocalGifts(
        localGifts
          .slice()
          .map(g => ({ ...g, tokens: Math.floor(g.tokens * rebalance) }))
      );
    }
  };

  const updateLocalGift = (updatedGift: ISimpleGift): void => {
    setLocalGifts(prevState => {
      // This is to ensure it can't go negative in the UI
      updatedGift.tokens = Math.max(0, updatedGift.tokens);

      const idx = prevState.findIndex(g => g.user.id === updatedGift.user.id);

      let updatedGifts;
      if (idx === -1) {
        updatedGifts = [...prevState, updatedGift];
      } else {
        updatedGifts = prevState.slice();
        updatedGifts[idx] = updatedGift;
      }

      // prevent giving more than you have
      const total = updatedGifts.reduce((t, g) => t + g.tokens, 0);
      if (total > (myUser.non_giver ? 0 : myUser.starting_tokens))
        return prevState;

      return updatedGifts;
    });
  };

  const saveGifts = useRecoilLoadCatch(
    () => async () => {
      const diff = buildDiffMap(pendingGiftsFrom, localGifts);

      const params: PostTokenGiftsParam[] = iti(diff.entries())
        .map(([userId, [tokens, note]]) => ({
          tokens,
          recipient_id: userId,
          note,
        }))
        .toArray();

      await mutations.updateAllocations(myUser.circle_id, params);

      // FIXME: calling fetchCircle here is wasteful
      // i think the only point of this is to update myUser.teammates
      await fetchCircle({ circleId: myUser.circle_id });
    },
    [myUser, pendingGiftsFrom, localGifts],
    { success: 'Saved Gifts' }
  );

  const getResult = async (wonderOrgIds: string | any[]) => {
    let orgIdString = '';

    //create query string for all the addresses minus coordinape
    let addresses = `&user_addresses=${myUser.address}`;
    for (let i = 0; i < localGifts?.length; i++) {
      if (localGifts[i].user.name !== 'Coordinape') {
        addresses = addresses + `&user_addresses=${localGifts[i].user.address}`;
      }
    }

    //create query string for org ids
    for (let i = 0; i < wonderOrgIds?.length; i++) {
      orgIdString = orgIdString + `&organization_ids=${wonderOrgIds[i]}`;
    }

    //trim epoch dates because requests were giving errors with full date inputs
    const start_date = currentEpoch?.start_date.slice(0, -10);
    const end_date = currentEpoch?.end_date.slice(0, -10);

    //fetch the tasks and set WonderTasks to: {address: address, task: {title, link}}
    await fetch(
      `http://localhost:8001/v1/coordinape/user?${addresses}${orgIdString}&epoch_start=${start_date}&epoch_end=${end_date}`,
      {
        headers: new Headers({
          Authorization: 'PPjXk7fvc2P7gU4dXGWnZsJo',
          'Content-Type': 'application/json',
        }),
      }
    )
      .then(response => response.json())
      .then(tasks => {
        setWonderTasks(tasks?.data);
      });
  };

  useEffect(() => {
    //if user integrations includes wonder then lets get the tasks.
    //add the org ids to an array and send to getResult to grab tasks
    const wonderOrgIds = [];
    if (integrations?.data) {
      const wonderIntegrations = integrations.data?.filter(
        (integration: { type: string }) => integration?.type === 'wonder'
      );
      for (let i = 0; i < wonderIntegrations.length; i++) {
        wonderOrgIds.push(...wonderIntegrations?.[i]?.data?.organizationId);
      }

      const uniqueOrgs = [...new Set(wonderOrgIds)];

      getResult(uniqueOrgs);
    }
  }, [integrations.isFetched]);

  const getMyWonderTasks = () => {
    const myContributionIndex = wonderTasks?.findIndex(
      (userTasks: { user_address: string }) =>
        userTasks.user_address === myUser.address
    );
    return {
      address: myUser.address,
      contributions: wonderTasks?.[myContributionIndex]?.tasks,
      type: 'wonder',
    };
  };

  const getUserWonderTasks = (address: string) => {
    const otherContributionIndex = wonderTasks?.findIndex(
      (userTasks: { user_address: string }) =>
        userTasks.user_address === address
    );
    return {
      address: address,
      contributions: wonderTasks?.[otherContributionIndex]?.tasks,
      type: 'wonder',
    };
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.headerContainer}>
          <Text
            h2
            css={{ justifyContent: 'center' }}
          >{`${myUser.circle.name} ${longTimingMessage}`}</Text>
          <h2 className={classes.subTitle}>{myUser.circle.allocText}</h2>
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
                {selectedCircle.tokenName} Allocated
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
          <ProfileCard
            user={myUser}
            isMe
            tokenName={myUser.circle.tokenName}
            gift={undefined}
            setGift={() => {}}
            tasks={getMyWonderTasks()}
          />
          {localGifts
            .filter(a => {
              if (filterType & FilterType.OptIn) {
                return !a.user.non_receiver;
              }
              if (filterType & FilterType.NewMember) {
                return (
                  +new Date() - +new Date(a.user.created_at) < 24 * 3600 * 1000
                );
              }
              return true;
            })
            .sort((a, b) => {
              switch (orderType) {
                case OrderType.Alphabetical:
                  return a.user.name.localeCompare(b.user.name);
                case OrderType.Give_Allocated: {
                  const av = givePerUser.get(a.user.id)?.tokens ?? 0;
                  const bv = givePerUser.get(b.user.id)?.tokens ?? 0;
                  if (av !== bv) {
                    return av - bv;
                  } else {
                    return a.user.name.localeCompare(b.user.name);
                  }
                }
                case OrderType.Opt_In_First: {
                  // FIXME: i dunno about this
                  return a.user.non_receiver ? 1 : -1;
                }
              }
            })
            .map(gift => {
              return (
                <ProfileCard
                  disabled={!epochIsActive}
                  key={gift.user.id}
                  tokenName={myUser.circle.tokenName}
                  user={gift.user}
                  gift={gift}
                  tasks={getUserWonderTasks(gift.user.address)}
                  setGift={(gift: ISimpleGift) => {
                    updateLocalGift(gift);
                  }}
                />
              );
            })}
        </div>
      </div>
      <BalanceContainer>
        <BalanceDescription>
          {tokenRemaining} {selectedCircle.tokenName}
        </BalanceDescription>
        <BalanceDescription>&nbsp;left to allocate</BalanceDescription>
        <IconButton
          size="small"
          /* FIXME: Can't make this stitches cuz it depends on a mui button */
          className={classes.rebalanceButton}
          onClick={rebalanceGifts}
          disabled={tokenRemaining === 0}
        >
          <DeprecatedBalanceIcon />
        </IconButton>
      </BalanceContainer>
      <SaveButtonContainer>
        {localGiftsChanged && (
          <UIButton
            size="large"
            color="primary"
            onClick={handleSaveAllocations}
            disabled={tokenRemaining < 0}
          >
            Save Allocations
          </UIButton>
        )}
      </SaveButtonContainer>
    </>
  );
};

export default AllocationGive;
