import { Button, makeStyles } from '@material-ui/core';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useGlobal } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ITokenGift, IUser, Maybe, PostTokenGiftsParam } from 'types';
import { isUnparsedPrepend } from 'typescript';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    marginTop: 122,
    maxWidth: '80%',
    paddingTop: 8,
    paddingBottom: 50,
    paddingLeft: 94,
    paddingRight: 94,
    borderRadius: 8,
    background: '#EAEAEB',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  trHeader: {
    height: 80,
  },
  th: {
    fontSize: 16,
    fontWeight: 700,
    color: 'rgba(81,99,105,0.5)',
  },
  trBody: {
    height: 70,
    border: 'solid',
    borderWidth: '1px 0px',
    borderColor: 'rgba(81, 99, 105, 0.2)',
  },
  tdName: {
    fontSize: 27,
    fontWeight: 600,
    color: '#516369',
    textAlign: 'center',
  },
  tdDistribution: {
    fontSize: 20,
    color: '#516369',
    textAlign: 'center',
  },
  tdAllocate: {
    textAlign: 'center',
  },
  tdNote: {
    textAlign: 'center',
  },
  inputGive: {
    width: 85,
    height: 41,
    border: 0,
    fontSize: 20,
    fontWeight: 400,
    color: '#516369',
    textAlign: 'center',
  },
  footer: {
    height: theme.custom.appFooterHeight,
    display: 'flex',
    justifyContent: 'center',
    padding: `0 ${theme.spacing(4)}px`,
    alignItems: 'center',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    background: '#5E6F74',
  },
  balance: {
    fontSize: 40,
    color: 'white',
  },
  balanceNumber: {
    fontWeight: 600,
  },
  description: {
    marginLeft: 16,
    fontSize: 20,
    color: 'white',
  },
  saveButton: {
    marginLeft: 44,
    height: 35,
    padding: '0px 37px',
    borderRadius: 8,
    background: '#31A5AC',
    fontSize: 18,
    fontWeight: 600,
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

interface IProps {
  className?: string;
}

export const ContentSection = (props: IProps) => {
  const classes = useStyles();
  const { account, library } = useConnectedWeb3Context();
  const [me, setMe] = useState<Maybe<IUser>>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [tokenGifts, setTokenGifts] = useState<ITokenGift[]>([]);
  const [giveTokens, setGiveTokens] = useState<{ [id: number]: number }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getUsers = async () => {
      try {
        // Get Me & Users
        const users = await getApiService().getUsers();
        setMe(
          users.find(
            (user) => user.address.toLowerCase() === account?.toLowerCase()
          ) || null
        );
        setUsers(
          users.filter(
            (user) => user.address.toLowerCase() !== account?.toLowerCase()
          )
        );

        // Init Tokens
        setTokenGifts([]);
        setGiveTokens({});
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Something went wrong!',
          { variant: 'error' }
        );
      }
    };

    const getPendingTokenGifts = async () => {
      if (account) {
        try {
          // Get Pending Token Gifts
          const tokenGifts = await getApiService().getPendingTokenGifts(
            account
          );
          setTokenGifts(tokenGifts);

          // Update Input Value
          tokenGifts.forEach(
            (tokenGift) =>
              (giveTokens[tokenGift.recipient_id] = tokenGift.tokens)
          );
          setGiveTokens({ ...giveTokens });
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || 'Something went wrong!',
            { variant: 'error' }
          );
        }
      }
    };

    const queryData = async () => {
      setLoading(true);
      await getUsers();
      await getPendingTokenGifts();
      setLoading(false);
    };

    queryData();
  }, [account]);

  // OnChange Give Input
  const onChangeGive = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const newValue = Math.abs(Number(e.target.value));
    e.target.value = String(newValue);
    giveTokens[id] = newValue;
    setGiveTokens({ ...giveTokens });
  };

  // Save Allocations
  const onClickSave = () => {
    if (account) {
      const postTokenGifts = async () => {
        try {
          // Post Token Gifts
          const params: PostTokenGiftsParam[] = [];
          users.forEach((user) =>
            params.push({
              tokens: giveTokens[user.id],
              recipient_address: user.address,
              circle_id: user.circle_id,
              note: 'Test Note',
            })
          );

          const userPendingGift = await getApiService().postTokenGifts(
            account,
            params,
            library
          );

          setTokenGifts(userPendingGift.pending_sent_gifts);
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || 'Something went wrong!',
            { variant: 'error' }
          );
        }
      };

      const getUsers = async () => {
        try {
          // Get Me & Users
          const users = await getApiService().getUsers();
          setMe(
            users.find(
              (user) => user.address.toLowerCase() === account?.toLowerCase()
            ) || null
          );
          setUsers(
            users.filter(
              (user) => user.address.toLowerCase() !== account?.toLowerCase()
            )
          );
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
        await getUsers();
        setLoading(false);
      };

      queryData();
    }
  };

  return (
    <div className={classes.root}>
      <table className={classes.table}>
        <thead>
          <tr className={classes.trHeader}>
            <th className={classes.th}>Contributor</th>
            <th className={classes.th}>Estimated Distribution</th>
            <th className={classes.th}>GIVE to allocate ↓</th>
            <th className={classes.th}>Add a note</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className={classes.trBody} key={user.id}>
              <td className={classes.tdName}>{user.name}</td>
              <td className={classes.tdDistribution}>
                {Math.round(
                  (user.give_token_remaining + user.give_token_received) /
                    (users.length + (me ? 1 : 0))
                )}
                % of GIVE
              </td>
              <td className={classes.tdAllocate}>
                <input
                  className={classes.inputGive}
                  min="0"
                  onChange={(e) => onChangeGive(e, user.id)}
                  type="number"
                  value={giveTokens[user.id] || 0}
                ></input>
              </td>
              <td className={classes.tdNote}>
                <Button>
                  <img alt="edit_note" src="/svgs/button/edit_note.svg" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={classes.footer}>
        <p className={classes.balance}>
          <span className={classes.balanceNumber}>
            {tokenGifts.reduce((sum, tokenGift) => sum + tokenGift.tokens, 0)}
          </span>{' '}
          of{' '}
          <span className={classes.balanceNumber}>
            {tokenGifts.reduce(
              (sum, tokenGift) => sum + tokenGift.tokens,
              (me?.give_token_remaining || 0) + (me?.give_token_received || 0)
            )}
          </span>
        </p>
        <p className={classes.description}>GIVE Allocated</p>
        <Button
          className={classes.saveButton}
          disabled={!account}
          onClick={onClickSave}
        >
          Save Allocations
        </Button>
      </div>
      {isLoading && (
        <LoadingModal onClose={() => {}} text="" visible={isLoading} />
      )}
    </div>
  );
};
