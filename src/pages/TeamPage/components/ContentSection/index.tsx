import { Button, Hidden, makeStyles } from '@material-ui/core';
import { ReactComponent as ArrowRightSVG } from 'assets/svgs/button/arrow-right.svg';
import { ReactComponent as CheckmarkSVG } from 'assets/svgs/button/checkmark.svg';
import clsx from 'clsx';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiService } from 'services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 32,
    padding: '50px 0',
    maxWidth: '80%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  accessaryContainer: {
    width: '80%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectButtonContainer: {
    display: 'flex',
  },
  selectButton: {
    padding: `0 ${theme.spacing(2.5)}px`,
    fontSize: 18,
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
    padding: '0 4px',
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
    color: '#516369',
    background: 'none',
    border: 'solid',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(81, 99, 105, 0.35)',
    outline: 'none',
    '&::placeholder': {
      color: '#516369',
      opacity: 0.35,
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
      color: '#516369',
      background: '#DFE7E8',
    },
    '&.unmatched': {
      opacity: 0.3,
    },
  },
  checkmarkIconWrapper: {
    marginRight: 10,
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

export const ContentSection = () => {
  const classes = useStyles();
  const { library } = useConnectedWeb3Context();
  const { me, refreshUserInfo, users } = useUserInfo();
  const [teammates, setTeammates] = useState<number[]>([]);
  const [keyword, setKeyword] = useState<string>('');
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
          <Button className={classes.selectButton} onClick={onClickSelectAll}>
            Select All
          </Button>
          <Button className={classes.selectButton} onClick={onClickDeselectAll}>
            Deselect All
          </Button>
        </div>
        <input
          className={classes.searchInput}
          onChange={onChangeKeyword}
          placeholder="Search"
          value={keyword}
        />
      </div>
      <div className={classes.teammatesContainer}>
        {users
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
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
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};
