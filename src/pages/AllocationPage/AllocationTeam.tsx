import React, { useState } from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import { Button, makeStyles } from '@material-ui/core';

import { ReactComponent as CheckmarkSVG } from 'assets/svgs/button/checkmark.svg';
import { ApeAvatar } from 'components';
import { useAllocation } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';
import { Text } from 'ui';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(8),
    maxWidth: '80%',
    textAlign: 'center',
  },
  subTitle: {
    padding: '7px 32px',
    fontSize: 20,
    lineHeight: 1.8,
    fontWeight: 300,
    color: theme.colors.text,
    margin: 0,
    maxWidth: '100%',
    textAlign: 'center',
  },
  description: {
    padding: '0 100px',
    fontSize: 16,
    fontWeight: 400,
    color: theme.colors.text,
    margin: 0,
  },
  warning: {
    marginBottom: 32,
    fontSize: 24,
    fontWeight: 500,
    color: theme.colors.secondaryText,
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
    background: theme.colors.surface,
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    '&::placeholder': {
      color: theme.colors.secondaryText,
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
    fontWeight: 400,
    textTransform: 'none',
    color: theme.colors.text,
    background: theme.colors.surface,
    borderRadius: theme.spacing(3),
    '&:hover': {
      background: theme.colors.surface,
    },
    '&.selected': {
      paddingRight: theme.spacing(1.5),
      color: theme.colors.text,
      background: theme.colors.secondary + '80',
    },
    '&.unmatched': {
      opacity: 0.3,
    },
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: 40,
    height: 40,
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
    color: theme.colors.text,
    textAlign: 'center',
  },
  hr: {
    height: 1,
    width: '100%',
    color: theme.colors.text,
    opacity: 0.5,
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
    background: theme.colors.alert,
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
  const {
    circleId,
    usersNotMe: availableTeammates,
    circle: selectedCircle,
    circleEpochsStatus: { epochIsActive, timingMessage },
  } = useSelectedCircle();

  const {
    localTeammates,
    givePerUser,
    toggleLocalTeammate,
    setAllLocalTeammates,
    clearLocalTeammates,
  } = useAllocation(circleId);

  const [keyword, setKeyword] = useState<string>('');
  const orderType = OrderType.Alphabetical as OrderType; // Was useState

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {!epochIsActive && (
          <Text h3 css={{ mb: '$sm', justifyContent: 'center' }}>
            {timingMessage}
          </Text>
        )}
        <Text h2>
          Who are your Teammates in the {selectedCircle?.name} Circle?
        </Text>
        <p className={classes.subTitle}>{selectedCircle?.team_sel_text}</p>
      </div>
      <div className={classes.content}>
        <div className={classes.accessaryContainer}>
          <div className={classes.selectButtonContainer}>
            <Button
              className={classes.selectButton}
              disableRipple={true}
              onClick={setAllLocalTeammates}
            >
              Select All
            </Button>
            <Button
              className={classes.selectButton}
              disableRipple={true}
              onClick={clearLocalTeammates}
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
        </div>
        <div
          className={classes.teammatesContainer}
          data-testid="eligibleTeammates"
        >
          {availableTeammates
            .filter(a => !a.non_receiver)
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
                  return Number(a.non_receiver) - Number(b.non_receiver);
                }
              }
            })
            .map(user => {
              const selected = localTeammates.some(u => u.id === user.id);
              const pendingSentGifts = givePerUser.get(user.id)?.tokens ?? 0;
              const matched =
                keyword.length === 0 ||
                user.name.toLowerCase().includes(keyword.toLowerCase()) ||
                String(pendingSentGifts).includes(keyword);

              return { ...user, selected, matched, pendingSentGifts };
            })
            .map(user => (
              <Button
                className={clsx(
                  classes.teammatesItem,
                  user.selected ? 'selected' : '',
                  !user.matched ? 'unmatched' : ''
                )}
                key={user.id}
                onClick={() => toggleLocalTeammate(user.id)}
              >
                <ApeAvatar user={user} className={classes.avatar} />
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
        {availableTeammates.filter(a => a.non_receiver).length > 0 && (
          <>
            <p className={classes.contentTitle}>
              These users are opted-out of receiving{' '}
              {selectedCircle?.token_name}
            </p>
            <hr className={classes.hr} />
            <div className={classes.teammatesContainer}>
              {availableTeammates
                .filter(a => a.non_receiver)
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
                      return Number(a.non_receiver) - Number(b.non_receiver);
                    }
                  }
                })
                .map(user => {
                  const selected = localTeammates.some(u => u.id === user.id);
                  const pendingSentGifts =
                    givePerUser.get(user.id)?.tokens ?? 0;
                  const matched =
                    keyword.length === 0 ||
                    user.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    String(pendingSentGifts).includes(keyword);

                  return { ...user, selected, matched, pendingSentGifts };
                })
                .map(user => (
                  <Button
                    className={clsx(
                      classes.teammatesItem,
                      user.selected ? 'selected' : '',
                      !user.matched ? 'unmatched' : ''
                    )}
                    key={user.id}
                    onClick={() => toggleLocalTeammate(user.id)}
                  >
                    <ApeAvatar user={user} className={classes.avatar} />
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
