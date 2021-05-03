import { Box, Divider, Typography, makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ITokenGift, IUser } from 'types';
import { labelEpoch } from 'utils/tools';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: theme.spacing(8, 0, 1),
  },
  epochCard: {
    margin: theme.spacing(1, 3, 2),
    padding: theme.spacing(2, 3),
    background: '#DFE7E8',
    borderRadius: 10.75,
    width: 600,
    maxWidth: '95%',
    flex: '1 1 auto',
  },
  epochTitle: {
    color: theme.colors.text,
  },
  epochSubtitle: {
    color: 'rgba(81, 99, 105, 0.6)',
  },
  giftNote: {
    overflowWrap: 'anywhere',
    margin: theme.spacing(2, 0),
    color: 'rgba(81, 99, 105, 0.7)',
  },
  giftTitle: {
    color: '#31A5AC',
    fontSize: 30,
    marginLeft: theme.spacing(-0.6),
  },
  divider: {
    margin: theme.spacing(2, 0),
    backgroundColor: 'rgba(81, 99, 105, 0.2)',
  },
}));

interface IHistoryEpoch {
  number: number;
  name: string;
  gifts: ITokenGift[];
}

interface ICardProps {
  className?: string;
  epoch: IHistoryEpoch;
  users: IUser[];
}

interface IProps {
  className?: string;
}

const getUser = (users: IUser[], id: number) => users.find((u) => u.id === id);

const EpochCard = (props: ICardProps) => {
  const classes = useStyles();
  const { epoch, users } = props;

  const list = epoch.gifts
    .flatMap((gift, idx) => [
      <Box key={idx}>
        <Typography className={classes.giftTitle} variant="h5">
          {gift.tokens > 0 ? `+${gift.tokens} Received from ` : 'From '}
          {getUser(users, gift.sender_id)?.name || 'Unknown'}
        </Typography>
        {gift.note && (
          <Typography className={classes.giftNote} variant="body1">
            &ldquo;{gift.note}&rdquo;
          </Typography>
        )}
      </Box>,
      idx < epoch.gifts.length - 1 && (
        <Divider className={classes.divider} key={-1 - idx} />
      ),
    ])
    .filter((elem) => Boolean(elem));

  return (
    <Box className={classes.epochCard}>
      <Box mb={2}>
        <Typography className={classes.epochTitle} variant="h4">
          {epoch.name}
        </Typography>
        <Typography className={classes.epochSubtitle} variant="subtitle1">
          Epoch {epoch.number}
        </Typography>
      </Box>
      {list}
    </Box>
  );
};

const HistoryPage = (props: IProps) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { me, pastEpochs: epochs, users } = useUserInfo();
  const [historyEpoch, setHistoryEpoch] = useState<IHistoryEpoch[]>([]);

  useEffect(() => {
    const fetchGifts = async () => {
      if (!me || !epochs.length) {
        return;
      }
      try {
        const myGifts = (await getApiService().getTokenGifts()).filter(
          (u) => u.recipient_id === me.id
        );
        const epochMap = keyBy(epochs, 'id');
        setHistoryEpoch(
          Object.entries(groupBy(myGifts, 'epoch_id'))
            .map(([epochId, gs]) => {
              const e = epochMap[epochId];
              return {
                number: e.number,
                name: labelEpoch(e),
                gifts: gs,
              };
            })
            .sort((a, b) => b.number - a.number)
        );
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Something went wrong!',
          { variant: 'error' }
        );
        setHistoryEpoch([]);
      }
    };
    fetchGifts();
  }, [me, epochs]);

  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h2">
        History
      </Typography>
      {historyEpoch.map((epoch) => (
        <EpochCard epoch={epoch} key={epoch.number} users={users} />
      ))}
    </Box>
  );
};

export default HistoryPage;
