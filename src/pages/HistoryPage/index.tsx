import React from 'react';

import { Box, Divider, Typography, makeStyles } from '@material-ui/core';

import { useSelectedCircleEpoch, useMyEpochGifts } from 'hooks';
import { labelEpoch } from 'utils/tools';

import { IEpoch } from 'types';

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

const EpochCard = ({
  className,
  epoch,
}: {
  className?: string;
  epoch: IEpoch;
}) => {
  const classes = useStyles();
  const { userGifts } = useMyEpochGifts(epoch.id);

  const list = userGifts
    .flatMap(({ gift, user }, idx) => [
      <Box key={idx}>
        <Typography className={classes.giftTitle} variant="h5">
          {gift.tokens > 0 ? `+${gift.tokens} Received from ` : 'From '}
          {user?.name || 'Unknown'}
        </Typography>
        {gift.note && (
          <Typography className={classes.giftNote} variant="body1">
            &ldquo;{gift.note}&rdquo;
          </Typography>
        )}
      </Box>,
      idx < userGifts.length - 1 && (
        <Divider className={classes.divider} key={-1 - idx} />
      ),
    ])
    .filter((elem) => Boolean(elem));

  return (
    <Box className={classes.epochCard}>
      <Box mb={2}>
        <Typography className={classes.epochTitle} variant="h4">
          {labelEpoch(epoch)}
        </Typography>
        <Typography className={classes.epochSubtitle} variant="subtitle1">
          Epoch {epoch.number}
        </Typography>
      </Box>
      {list}
    </Box>
  );
};

const HistoryPage = ({ className }: { className?: string }) => {
  const classes = useStyles();
  const { pastEpochs } = useSelectedCircleEpoch();
  return (
    <Box className={classes.root}>
      <Typography className={classes.title} variant="h2">
        History
      </Typography>
      {pastEpochs
        .slice()
        .reverse()
        .map((epoch) => (
          <EpochCard epoch={epoch} key={epoch.id} />
        ))}
    </Box>
  );
};

export default HistoryPage;
