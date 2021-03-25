import { Button, Hidden, makeStyles } from '@material-ui/core';
import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import { ReactComponent as CancelCircleSVG } from 'assets/svgs/button/cancel-circle.svg';
import { ReactComponent as CheckmarkSVG } from 'assets/svgs/button/checkmark.svg';
import clsx from 'clsx';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { getApiService } from 'services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 32,
    padding: '50px 0',
    maxWidth: '90%',
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
    padding: `0 ${theme.spacing(1.5)}px`,
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
    padding: `0 ${theme.spacing(1)}px`,
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
      color: theme.colors.text,
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
    margin: '6px 4px',
    padding: '4px 32px',
    fontSize: 15,
    fontWeight: 500,
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.35)',
    background: '#E1E1E1',
    borderRadius: theme.spacing(3),
    '&.selected': {
      paddingLeft: 12,
      color: theme.colors.text,
      background: '#DFE7E8',
    },
    '&.unmatched': {
      opacity: 0.3,
    },
  },
  checkmarkIconWrapper: {
    marginRight: 10,
  },
  buttonContainer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(3),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  cancelNavLink: {
    marginTop: theme.spacing(1),
    padding: '6px 12px',
    fontSize: 15,
    fontWeight: 600,
    textTransform: 'none',
    textDecoration: 'none',
    color: theme.colors.red,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    background: 'linear-gradient(0deg, #F0D7D8, #F0D7D8)',
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      background: 'linear-gradient(0deg, #F0D7D8, #F0D7D8)',
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
  },
  cancelIconWrapper: {
    paddingTop: 2,
    marginRight: theme.spacing(0.5),
  },
}));

enum OrderType {
  Alphabetical = 'Alphabetical',
  Give_Allocated = 'Give Allocated',
  Past_Teammates = 'Past Teammates',
}

export const ContentSection = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { me, refreshUserInfo, users } = useUserInfo();
  const [teammates, setTeammates] = useState<number[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Alphabetical);
  const [isLoading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (me?.teammates) {
      setTeammates([...me.teammates.map((teammatesmate) => teammatesmate.id)]);
    }
  }, [me]);

  // onClick SelectAll
  const onClickSelectAll = () => {
    setTeammates(users.map((user) => user.id));
  };

  // onClick DeselectAll
  const onClickDeselectAll = () => {
    setTeammates([]);
  };

  // onChangeKeyword
  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  // onClick TeammatesItem
  const onClickTeammatesItem = (userId: number) => {
    if (teammates.find((element) => element === userId)) {
      setTeammates([...teammates.filter((element) => element !== userId)]);
    } else {
      setTeammates([...teammates, userId]);
    }
  };

  // onClick SaveTeammates
  const onClickSaveTeammates = async () => {
    if (me?.address && teammates.length > 0) {
      setLoading(true);
      try {
        await getApiService().postTeammates(me.address, teammates, library);
        await refreshUserInfo();
        history.push('/allocation');
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Something went wrong!',
          { variant: 'error' }
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
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
                orderType === OrderType.Past_Teammates ? 'selected' : ''
              )}
              disableRipple={true}
              onClick={() => setOrderType(OrderType.Past_Teammates)}
            >
              Past Teammates
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.teammatesContainer}>
        {users
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
              case OrderType.Past_Teammates: {
                const av = teammates.some((element) => element === a.id)
                  ? 1
                  : 0;
                const bv = teammates.some((element) => element === b.id)
                  ? 1
                  : 0;
                if (av !== bv) {
                  return bv - av;
                } else {
                  return a.name.localeCompare(b.name);
                }
              }
            }
          })
          .map((user) => {
            const selected = teammates.some((element) => element === user.id);
            const pendingSentGifts =
              me?.pending_sent_gifts.find(
                (gift) => gift.recipient_id === user.id
              )?.tokens || 0;
            const matched =
              keyword.length === 0 ||
              user.name.includes(keyword) ||
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
              <div
                className={classes.checkmarkIconWrapper}
                hidden={!user.selected}
              >
                <CheckmarkSVG />
              </div>
              {user.name}
              {!user.non_receiver && ` | ${user.pendingSentGifts}`}
            </Button>
          ))}
      </div>
      <div className={classes.buttonContainer}>
        <Button
          className={classes.saveButton}
          disabled={teammates.length === 0}
          onClick={onClickSaveTeammates}
        >
          Save Teammates List
          <Hidden smDown>
            <div className={classes.arrowRightIconWrapper}>
              <ArrowRightSVG />
            </div>
          </Hidden>
        </Button>
        <NavLink
          className={classes.cancelNavLink}
          hidden={me?.teammates.length === 0}
          to={'/allocation'}
        >
          <div className={classes.cancelIconWrapper}>
            <CancelCircleSVG />
          </div>
          Don&apos;t Save Changes
        </NavLink>
      </div>
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};
