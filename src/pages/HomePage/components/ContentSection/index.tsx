import { Button, makeStyles } from '@material-ui/core';
import { LoadingModal } from 'components';
import { useConnectedWeb3Context, useUserInfo } from 'contexts';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { PostTokenGiftsParam } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.custom.appFooterHeight
      ? (theme.custom.appFooterHeight as number) + 30
      : 30,
    paddingTop: 8,
    paddingBottom: 30,
    paddingLeft: 94,
    paddingRight: 94,
    width: '80%',
    borderRadius: 8,
    background: '#DFE7E8',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    position: 'relative',
  },
  one: {
    width: '20%',
  },
  two: {
    width: '20%',
  },
  three: {
    width: '40%',
  },
  trHeader: {
    height: 80,
  },
  th: {
    fontSize: 16,
    fontWeight: 700,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#DFE7E8',
    position: 'sticky',
    top: 0,
    boxShadow: '0 1px 0 0 rgba(81, 99, 105, 0.2)',
    zIndex: 1,
  },
  trBody: {
    height: 70,
    border: 'solid',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(81, 99, 105, 0.2)',
  },
  tdName: {
    fontSize: 27,
    fontWeight: 600,
    color: '#516369',
    textAlign: 'center',
    padding: '0px 10px',
  },
  tdDistribution: {
    fontSize: 20,
    fontWeight: 400,
    color: '#516369',
    textAlign: 'center',
    padding: '0px 10px',
  },
  tdAllocate: {
    textAlign: 'center',
    padding: '0px 10px',
  },
  tdNote: {
    textAlign: 'center',
    padding: '0px 25px',
  },
  inputGiveToken: {
    width: 85,
    height: 41,
    border: 0,
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    fontWeight: 400,
    color: '#516369',
    textAlign: 'center',
  },
  inputGiveNote: {
    width: '100%',
    height: 41,
    border: 0,
    borderRadius: 8,
    padding: 13,
    fontSize: 13,
    fontWeight: 400,
    color: '#516369',
    textOverflow: 'ellipsis',
    '&::placeholder': {
      color: '#516369',
      opacity: 0.2,
    },
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
    background: theme.colors.primary,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  balance: {
    fontSize: 36,
    fontWeight: 600,
    color: 'white',
  },
  description: {
    margin: '0px 16px',
    fontSize: 20,
    fontWeight: 500,
    color: 'white',
  },
  saveButton: {
    marginLeft: 44,
    height: 38,
    padding: '0 26px',
    borderRadius: 8,
    background: '#31A5AC',
    fontSize: 20,
    fontWeight: 500,
    color: 'white',
    textTransform: 'none',
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
  const { library } = useConnectedWeb3Context();
  const { me, refreshUserInfo, users } = useUserInfo();
  const [sumOfTokens, setSumOfTokens] = useState<number>(0);
  const [giveTokens, setGiveTokens] = useState<{ [id: number]: number }>({});
  const [giveNotes, setGiveNotes] = useState<{ [id: number]: string }>({});
  const [isLoading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getPendingTokenGifts = async () => {
      if (me?.address) {
        try {
          // Get Pending Token Gifts
          const tokenGifts = await getApiService().getPendingTokenGifts(
            me.address
          );

          // Update GiveTokens & GiveNotes
          tokenGifts.forEach((tokenGift) => {
            giveTokens[tokenGift.recipient_id] = tokenGift.tokens;
            giveNotes[tokenGift.recipient_id] = tokenGift.note;
          });
          setGiveTokens({ ...giveTokens });
          setGiveNotes({ ...giveNotes });
        } catch (error) {
          enqueueSnackbar(
            error.response?.data?.message || 'Something went wrong!',
            { variant: 'error' }
          );
        }
      }
    };

    getPendingTokenGifts();
  }, [me?.address]);

  useEffect(() => {
    setSumOfTokens(
      Math.max(
        1,
        users.reduce(
          (sum, user) => sum + user.give_token_received,
          me?.give_token_received || 0
        )
      )
    );
  }, [me, users]);

  // OnChange GiveToken Input
  const onChangeGiveToken = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.target.validity.valid) {
      const newValue = Math.abs(Number(e.target.value));
      e.target.value = String(newValue);
      giveTokens[id] = newValue;
      setGiveTokens({ ...giveTokens });
    }
  };

  // OnChange GiveNote Input
  const onChangeGiveNote = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    giveNotes[id] = e.target.value;
    setGiveNotes({ ...giveNotes });
  };

  // Save Allocations
  const onClickSave = () => {
    if (me?.address) {
      const postTokenGifts = async () => {
        try {
          const params: PostTokenGiftsParam[] = [];
          users.forEach((user) =>
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

  return (
    <div className={classes.root}>
      <table className={classes.table}>
        <colgroup>
          <col className={classes.one} />
          <col className={classes.two} />
          <col className={classes.two} />
          <col className={classes.three} />
        </colgroup>
        <thead>
          <tr className={classes.trHeader}>
            <th className={classes.th}>Contributor</th>
            <th className={classes.th}>Estimated Distribution</th>
            <th className={classes.th}>GIVE to allocate</th>
            <th className={classes.th}>Add a note</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className={classes.trBody} key={user.id}>
              <td className={classes.tdName}>{user.name}</td>
              <td className={classes.tdDistribution}>
                {Math.round(
                  (10000 * user.give_token_received) / Math.max(1, sumOfTokens)
                ) / 100}
                % of GET
              </td>
              <td className={classes.tdAllocate}>
                <input
                  className={classes.inputGiveToken}
                  disabled={!me}
                  min="0"
                  onChange={(e) => onChangeGiveToken(e, user.id)}
                  pattern="[0-9]*"
                  type="number"
                  value={giveTokens[user.id] || 0}
                ></input>
              </td>
              <td className={classes.tdNote}>
                <input
                  className={classes.inputGiveNote}
                  disabled={!me}
                  maxLength={280}
                  onChange={(e) => onChangeGiveNote(e, user.id)}
                  placeholder="Why are you contributing?"
                  value={giveNotes[user.id] || ''}
                ></input>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={classes.footer}>
        <p className={classes.description}>You have </p>
        <p className={classes.balance}>
          {me?.give_token_remaining || 0}
          {(me?.give_token_remaining || 0) > 1 ? ' GIVES' : ' GIVE'}
        </p>
        <p className={classes.description}>left to allocate</p>
        <Button
          className={classes.saveButton}
          disabled={!me}
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
