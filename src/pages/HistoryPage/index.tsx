import { Box, Divider, Typography, makeStyles } from '@material-ui/core';
import { useUserInfo } from 'contexts';
import groupBy from 'lodash/groupBy';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getApiService } from 'services/api';
import { ITokenGift, IUser } from 'types';

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
    maxWidth: 600,
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
    color: 'rgba(81, 99, 105, 0.6)',
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

interface IEpoch {
  id: number;
  name: string;
  gifts: ITokenGift[];
}

interface ICardProps {
  className?: string;
  epoch: IEpoch;
  users: IUser[];
}

interface IProps {
  className?: string;
}

const UNKNOWN_EPOCH = {
  id: 0,
  name: 'Unknown Epoch',
};

const EPOCHS = [
  {
    id: 1,
    name: 'Febuary 2020',
  },
];

const getEpoch = (id: number) =>
  EPOCHS.find((e) => e.id === id) ?? UNKNOWN_EPOCH;
const getUser = (users: IUser[], id: number) => users.find((u) => u.id === id);

const EpochCard = (props: ICardProps) => {
  const classes = useStyles();
  const { epoch, users } = props;

  const list = epoch.gifts
    .flatMap((gift, idx) => [
      <Box key={idx}>
        <Typography className={classes.giftTitle} variant="h5">
          +{gift.tokens} from {getUser(users, gift.sender_id)?.name}
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
          Epoch {epoch.id}
        </Typography>
      </Box>
      {list}
    </Box>
  );
};

const HistoryPage = (props: IProps) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { me, users } = useUserInfo();
  const [epochs, setEpochs] = useState<IEpoch[]>([]);

  useEffect(() => {
    const fetchGifts = async () => {
      if (!me) {
        return;
      }
      try {
        const myGifts = (await getApiService().getTokenGifts()).filter(
          (u) => u.recipient_id === me.id
        );
        setEpochs(
          Object.entries(groupBy(myGifts, 'epoch_id')).map(([epochId, gs]) => ({
            ...getEpoch(Number(epochId)),
            gifts: gs,
          }))
        );
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Something went wrong!',
          { variant: 'error' }
        );
        setEpochs([]);
      }
    };
    fetchGifts();
  }, [me]);

  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h2">
        History
      </Typography>
      {epochs.map((epoch) => (
        <EpochCard epoch={epoch} key={epoch.id} users={users} />
      ))}
    </Box>
  );
};

export default HistoryPage;
