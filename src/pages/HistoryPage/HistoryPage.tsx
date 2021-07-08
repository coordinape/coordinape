import React, { useState, useEffect } from 'react';

import { Avatar, Divider, Typography, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { ApeTabs } from 'components';
import { useSelectedCircleEpoch } from 'hooks';
import {
  useSelectedMyUser,
  useValUserGifts,
  useValSelectedCircle,
  useValEpochTotalGive,
} from 'recoilState';
import { getAvatarPath } from 'utils/domain';
import { getEpochDates } from 'utils/tools';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    color: theme.colors.primary,
    margin: theme.spacing(6, 2),
  },
  body: {
    margin: theme.spacing(1, 0, 4),
    padding: theme.spacing(0, 2, 1),
    width: '100%',
  },
  bodyInner: {
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    borderRadius: 8,
    background: '#DFE7E8',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 'auto',
    padding: theme.spacing(5, 6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 3),
    },
  },
  epochSummary: {
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(5),
    minWidth: 427,
    [theme.breakpoints.down('xs')]: {
      minWidth: 0,
      width: '100%',
    },
  },
  epochGifts: {
    flex: 1,
    minWidth: 576,
    [theme.breakpoints.down('xs')]: {
      minWidth: 0,
      width: '100%',
    },
  },
  epochHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    padding: theme.spacing(1, 0, 1.5),
  },
  epochTitle: {
    color: theme.colors.red,
    fontSize: 30,
    lineHeight: 1.3,
    fontWeight: 600,
    margin: theme.spacing(0, 0, -0.5),
  },
  pagination: {
    marginTop: theme.spacing(1),
  },
  epochItem: {
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 1.3,
    fontWeight: 600,
    margin: theme.spacing(1, 0),
  },
  epochSubItem: {
    fontWeight: 300,
    fontSize: 20,
    marginLeft: theme.spacing(1),
  },
  epochSubtitle: {
    color: theme.colors.text,
    opacity: 0.5,
    fontSize: 20,
    lineHeight: 1.25,
    fontWeight: 600,
    margin: theme.spacing(5, 0, 0),
  },

  tabPanel: {
    padding: theme.spacing(5, 1),
  },
  giftRow: {
    display: 'grid',
    gridTemplateColumns: '75px 1fr',
    gap: 21,
  },
  avatar: {
    alignSelf: 'center',
    width: 75,
    height: 75,
    margin: theme.spacing(2, 0),
  },
  giftTitle: {
    color: theme.colors.red,
    fontSize: 20,
    lineHeight: 1.25,
    fontWeight: 600,
    margin: theme.spacing(3, 0, 2),
  },
  giftNote: {
    overflowWrap: 'anywhere',
    margin: theme.spacing(0, 0, 3),
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: 300,
  },
  giftRowText: {},
}));

export const HistoryPage = () => {
  const classes = useStyles();
  const [tabIdx, setTabIdx] = useState<number>(0);
  const isReceiving = tabIdx === 0;

  const [page, setPage] = useState<number>(0);
  const pastEpochIdx = page - 1;

  const circle = useValSelectedCircle();
  const myUser = useSelectedMyUser();
  const {
    fromUserByEpoch,
    forUserByEpoch,
    totalReceivedByEpoch,
  } = useValUserGifts(myUser?.id ?? -1);
  const {
    pastEpochs,
    // previousEpoch,
    // epochIsActive,
    longTimingMessage,
  } = useSelectedCircleEpoch();
  const selectedEpoch = pastEpochs[pastEpochIdx];
  const selectedEpochId = selectedEpoch?.id ?? -1;

  const totalReceived = totalReceivedByEpoch.get(selectedEpochId) ?? 0;
  const totalEpochGive = useValEpochTotalGive(selectedEpochId);

  const percentReceived =
    totalEpochGive === 0
      ? 0
      : Math.round((10000 * totalReceived) / totalEpochGive) / 100;

  useEffect(() => {
    if (page === 0) {
      setPage(pastEpochs.length);
    }
  }, [pastEpochs]);

  const gifts =
    (isReceiving
      ? forUserByEpoch.get(selectedEpochId)
      : fromUserByEpoch.get(selectedEpochId)) ?? [];
  const list = gifts
    .flatMap((gift, idx) => {
      const user = isReceiving ? gift.sender : gift.recipient;
      const receivedMessage =
        gift.tokens > 0 ? `+${gift.tokens} Received from ` : 'From ';
      const giveMessage = gift.tokens > 0 ? `+${gift.tokens} Given to ` : 'To ';
      const message = isReceiving ? receivedMessage : giveMessage;
      return [
        <div key={idx} className={classes.giftRow}>
          <Avatar
            src={getAvatarPath(user?.avatar)}
            className={classes.avatar}
          />
          <div className={classes.giftRowText}>
            <h5 className={classes.giftTitle}>
              {message}
              {(isReceiving ? gift.sender : gift.recipient)?.name || 'Unknown'}
            </h5>
            {gift.note && (
              <Typography className={classes.giftNote} variant="body1">
                &ldquo;{gift.note}&rdquo;
              </Typography>
            )}
          </div>
        </div>,
        idx < gifts.length - 1 ? <Divider key={-1 - idx} /> : undefined,
      ];
    })
    .filter((elem) => elem !== undefined);

  return !selectedEpoch || !selectedEpoch || !circle ? (
    <div className={classes.root}>
      <h2 className={classes.title}>{longTimingMessage}</h2>
    </div>
  ) : (
    <div className={classes.root}>
      <h2 className={classes.title}>{longTimingMessage}</h2>
      <div className={classes.body}>
        <div className={classes.bodyInner}>
          <div className={classes.epochSummary}>
            <div className={classes.epochHeader}>
              <h3 className={classes.epochTitle}>
                Epoch {selectedEpoch.number}
              </h3>
              <Pagination
                shape="rounded"
                variant="outlined"
                count={pastEpochs.length}
                onChange={(event: any, value: number) => setPage(value)}
                page={page}
                className={classes.pagination}
              />
            </div>
            <Divider />
            <h3 className={classes.epochItem}>
              {getEpochDates(selectedEpoch)}
            </h3>

            {selectedEpoch.grant !== '0.00' ? (
              <>
                <h4 className={classes.epochSubtitle}>Total Distributed</h4>
                <Divider />
                <h3 className={classes.epochItem}>{selectedEpoch.grant}</h3>
              </>
            ) : undefined}

            <h4 className={classes.epochSubtitle}>Total Allocations</h4>
            <Divider />
            <h3 className={classes.epochItem}>{totalEpochGive}</h3>

            <h4 className={classes.epochSubtitle}>You Recieved</h4>
            <Divider />
            <h3 className={classes.epochItem}>
              {totalReceived} {circle.token_name}
              <span className={classes.epochSubItem}>({percentReceived}%)</span>
            </h3>
          </div>
          <div className={classes.epochGifts}>
            <ApeTabs
              tabIdx={tabIdx}
              setTabIdx={setTabIdx}
              tabs={[
                {
                  label: 'Recieved',
                  panel: <div className={classes.tabPanel}>{list}</div>,
                },
                {
                  label: 'Sent',
                  panel: <div className={classes.tabPanel}>{list}</div>,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
