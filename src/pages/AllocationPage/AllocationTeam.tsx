import React, { useState } from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import { Button, makeStyles } from '@material-ui/core';

import { ReactComponent as CheckmarkSVG } from 'assets/svgs/button/checkmark.svg';
import { Img } from 'components';
import { useCircle, useMe, useSelectedAllocation } from 'hooks';
import { getAvatarPath } from 'utils/domain';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 70,
    maxWidth: '80%',
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    lineHeight: 1.25,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: 0,
  },
  subTitle: {
    padding: '7px 32px',
    fontSize: 20,
    lineHeight: 1.8,
    fontWeight: 300,
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
  warning: {
    marginBottom: 32,
    fontSize: 24,
    fontWeight: 500,
    color: theme.colors.secondary,
    margin: 0,
  },
  content: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(4),
    padding: '50px 0',
    width: '80%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  accessaryContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  selectButtonContainer: {
    display: 'flex',
  },
  selectButton: {
    height: 17,
    padding: theme.spacing(0, 1.5),
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
    '&:last-of-type': {
      border: 'solid',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 1,
      borderRightWidth: 0,
      borderRadius: 0,
      borderColor: 'rgba(81, 99, 105, 0.35)',
    },
  },
  searchInput: {
    padding: '6px 6px',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: theme.colors.text,
    background: 'rgba(225, 225, 225, 0.3)',
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    '&::placeholder': {
      color: theme.colors.text,
      opacity: 0.35,
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
  teammatesContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(9),
    paddingLeft: 0,
    paddingRight: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  teammatesItem: {
    height: theme.spacing(6),
    margin: theme.spacing(1, 0.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(2.5),
    fontSize: 15,
    fontWeight: 500,
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.35)',
    background: '#E1E1E1',
    borderRadius: theme.spacing(3),
    '&.selected': {
      paddingRight: theme.spacing(1.5),
      color: theme.colors.text,
      background: '#DFE7E8',
    },
    '&.unmatched': {
      opacity: 0.3,
    },
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: 40,
    height: 40,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 400,
  },
  checkmarkIconWrapper: {
    marginLeft: 10,
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
  contentTitle: {
    margin: 0,
    paddingLeft: theme.spacing(1),
    fontSize: 20,
    lineHeight: 1.8,
    fontWeight: 300,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  hr: {
    height: 1,
    width: '100%',
    color: theme.colors.primary,
    opacity: 0.5,
  },
  saveButton: {
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
  regiftContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: transparentize(0.3, theme.colors.text),
    display: 'flex',
    flexDirection: 'column',
  },
  regiftTitle: {
    marginTop: theme.custom.appHeaderHeight,
    padding: theme.spacing(1),
    width: '100%',
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.white,
    textAlign: 'center',
    background: theme.colors.red,
  },
  navLink: {
    color: theme.colors.white,
  },
}));

enum OrderType {
  Alphabetical = 'Alphabetical',
  Give_Allocated = 'Give Allocated',
  Opt_In_First = 'Opt-In First',
}

const AllocationTeam = () => {
  const classes = useStyles();
  const { selectedMyUser } = useMe();
  const { availableTeammates, selectedCircle } = useCircle();
  const {
    localTeammates,
    setLocalTeammates,
    givePerUser,
  } = useSelectedAllocation();

  const [keyword, setKeyword] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Alphabetical);

  const onClickSelectAll = () => {
    setLocalTeammates(availableTeammates);
  };

  const onClickDeselectAll = () => {
    setLocalTeammates([]);
  };

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const onClickTeammatesItem = (userId: number) => {
    if (localTeammates.find((u) => u.id === userId)) {
      setLocalTeammates([...localTeammates.filter((u) => u.id !== userId)]);
    } else {
      setLocalTeammates([
        ...localTeammates,
        availableTeammates.find((u) => u.id === userId) as IUser,
      ]);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <p className={classes.title}>
          Who are your Teammates in the {selectedCircle?.name} Circle?
        </p>
        <p className={classes.subTitle}>
          {selectedCircle?.team_sel_text ||
            'Select the people you have been working with during this epoch so you can thank them with GIVE'}
        </p>
      </div>
      <div className={classes.content}>
        <div className={classes.accessaryContainer}>
          <div className={classes.selectButtonContainer}>
            <Button
              className={classes.selectButton}
              disableRipple={true}
              onClick={onClickSelectAll}
            >
              Select All
            </Button>
            <Button
              className={classes.selectButton}
              disableRipple={true}
              onClick={onClickDeselectAll}
            >
              Deselect All
            </Button>
          </div>
          <input
            className={classes.searchInput}
            onChange={onChangeKeyword}
            placeholder="🔍 Search"
            value={keyword}
          />
          {/* <div className={classes.sortButtonContainer}>
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
        </div> */}
        </div>
        <div className={classes.teammatesContainer}>
          {availableTeammates
            .filter((a) => a.non_receiver === 0)
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
            .map((user) => {
              const selected = localTeammates.some((u) => u.id === user.id);
              const pendingSentGifts = givePerUser.get(user.id)?.tokens ?? 0;
              const matched =
                keyword.length === 0 ||
                user.name.toLowerCase().includes(keyword.toLowerCase()) ||
                String(pendingSentGifts).includes(keyword);

              return { ...user, selected, matched, pendingSentGifts };
            })
            .map((user) => (
              <Button
                className={clsx(
                  classes.teammatesItem,
                  user.selected ? 'selected' : '',
                  !user.matched ? 'unmatched' : ''
                )}
                key={user.id}
                onClick={() => onClickTeammatesItem(user.id)}
              >
                {user.avatar && user.avatar.length > 0 ? (
                  <Img
                    alt={user.name}
                    className={classes.avatar}
                    placeholderImg="/imgs/avatar/placeholder.jpg"
                    src={getAvatarPath(user.avatar)}
                  />
                ) : (
                  <span>&nbsp;&nbsp;&nbsp;</span>
                )}
                {user.name} | {user.pendingSentGifts}
                <div
                  className={classes.checkmarkIconWrapper}
                  hidden={!user.selected}
                >
                  <CheckmarkSVG />
                </div>
              </Button>
            ))}
        </div>
        {availableTeammates.filter((a) => a.non_receiver !== 0).length > 0 && (
          <>
            <p className={classes.contentTitle}>
              These users are opted-out of receiving{' '}
              {selectedCircle?.token_name}
            </p>
            <hr className={classes.hr} />
            <div className={classes.teammatesContainer}>
              {availableTeammates
                .filter((a) => a.non_receiver !== 0)
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
                .map((user) => {
                  const selected = localTeammates.some((u) => u.id === user.id);
                  const pendingSentGifts =
                    givePerUser.get(user.id)?.tokens ?? 0;
                  const matched =
                    keyword.length === 0 ||
                    user.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    String(pendingSentGifts).includes(keyword);

                  return { ...user, selected, matched, pendingSentGifts };
                })
                .map((user) => (
                  <Button
                    className={clsx(
                      classes.teammatesItem,
                      user.selected ? 'selected' : '',
                      !user.matched ? 'unmatched' : ''
                    )}
                    key={user.id}
                    onClick={() => onClickTeammatesItem(user.id)}
                  >
                    {user.avatar && user.avatar.length > 0 ? (
                      <Img
                        alt={user.name}
                        className={classes.avatar}
                        placeholderImg="/imgs/avatar/placeholder.jpg"
                        src={getAvatarPath(user.avatar)}
                      />
                    ) : (
                      <span>&nbsp;&nbsp;&nbsp;</span>
                    )}
                    {user.name} | {user.pendingSentGifts}
                    <div
                      className={classes.checkmarkIconWrapper}
                      hidden={!user.selected}
                    >
                      <CheckmarkSVG />
                    </div>
                  </Button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllocationTeam;
