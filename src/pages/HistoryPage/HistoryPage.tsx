/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useMemo } from 'react';

import { circleIdInput } from 'lib/zod';
import times from 'lodash/times';
import { styled, CSS } from 'stitches.config';

import { Divider, Typography, makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { ApeTabs, ApeAvatar } from 'components';
import { useUserGifts } from 'recoilState/allocation';
import { useSelectedCircle } from 'recoilState/app';
import { Box, Button, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

import { IEpoch, ITokenGift } from 'types';

const useStyles = makeStyles(theme => ({
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

  const {
    circle,
    myUser,
    circleEpochsStatus: { pastEpochs, longTimingMessage },
  } = useSelectedCircle();
  const { fromUserByEpoch, forUserByEpoch, totalReceivedByEpoch } =
    useUserGifts(myUser.id);

  const selectedEpoch = pastEpochs[pastEpochIdx];
  const selectedEpochId = selectedEpoch?.id ?? -1;

  const totalReceived = totalReceivedByEpoch.get(selectedEpochId) ?? 0;

  const percentReceived =
    selectedEpoch?.totalTokens > 0
      ? Math.round((10000 * totalReceived) / selectedEpoch.totalTokens) / 100
      : 0;

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
          <ApeAvatar user={user} className={classes.avatar} />
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
    .filter(elem => elem !== undefined);

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
              {pastEpochs.length > 1 && (
                <Pagination
                  shape="rounded"
                  variant="outlined"
                  count={pastEpochs.length}
                  onChange={(event: any, value: number) => setPage(value)}
                  page={page}
                  className={classes.pagination}
                />
              )}
            </div>
            <Divider />
            <h3 className={classes.epochItem}>{selectedEpoch.labelDayRange}</h3>

            {selectedEpoch.grant !== '0.00' ? (
              <>
                <h4 className={classes.epochSubtitle}>Total Distributed</h4>
                <Divider />
                <h3 className={classes.epochItem}>{selectedEpoch.grant}</h3>
              </>
            ) : undefined}

            <h4 className={classes.epochSubtitle}>Total Allocations</h4>
            <Divider />
            <h3 className={classes.epochItem}>{selectedEpoch.totalTokens}</h3>

            <h4 className={classes.epochSubtitle}>You Received</h4>
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
                  label: 'Received',
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

const pageSize = 3;

export const NewHistoryPage = () => {
  const {
    circle,
    myUser,
    circleEpochsStatus: { currentEpoch, nextEpoch, pastEpochs },
  } = useSelectedCircle();

  const { fromUserByEpoch, forUserByEpoch, totalReceivedByEpoch } =
    useUserGifts(myUser.id);

  const [page, setPage] = useState(0);
  const shownPastEpochs = useMemo(
    () =>
      pastEpochs
        .slice()
        .reverse()
        .slice(page * pageSize, (page + 1) * pageSize),
    [page]
  );
  const totalPages = Math.ceil(pastEpochs.length / pageSize);

  const currentEndDateFormat =
    currentEpoch?.endDate.month === currentEpoch?.startDate.month
      ? 'dd'
      : 'MMMM dd';

  return (
    <OrgLayout>
      {page === 0 && nextEpoch && (
        <>
          <Header>Next</Header>
          <Panel css={{ mb: '$lg' }}>
            {nextEpoch.id}: {nextEpoch.startDate.toString()} -{' '}
            {nextEpoch.endDate.toString()}
          </Panel>
        </>
      )}
      {page === 0 && currentEpoch && (
        <>
          <Header>Current</Header>
          <Panel css={{ mb: '$lg', fontSize: '$8', fontFamily: 'Inter' }}>
            {currentEpoch.startDate.toFormat('MMMM dd')} -{' '}
            {currentEpoch.endDate.toFormat(currentEndDateFormat)}
          </Panel>
        </>
      )}
      <Header>Past</Header>
      {shownPastEpochs.map(epoch => (
        <EpochPanel
          key={epoch.id}
          epoch={epoch}
          received={forUserByEpoch.get(epoch.id) || []}
          sent={fromUserByEpoch.get(epoch.id) || []}
          tokenName={circle.tokenName}
          totalReceived={totalReceivedByEpoch.get(epoch.id) || 0}
        />
      ))}
      <Paginator
        pages={totalPages}
        current={page}
        onSelect={setPage}
        css={{ alignSelf: 'flex-end' }}
      />
    </OrgLayout>
  );
};

const formatDateRange = (startDate: Date, endDate: Date) => {};

type EpochPanelProps = {
  epoch: IEpoch;
  received: ITokenGift[];
  sent: ITokenGift[];
  tokenName: string;
  totalReceived: number;
};
const EpochPanel = ({
  epoch,
  received,
  sent,
  tokenName,
  totalReceived,
}: EpochPanelProps) => {
  const [tab, setTab] = useState(0);
  const { startDate, endDate } = epoch;
  const endDateFormat = endDate.month === startDate.month ? 'dd' : 'MMMM dd';
  return (
    <Panel
      css={{
        display: 'grid',
        gridTemplateColumns: '23fr 15fr 62fr',
        gap: '$md',
      }}
    >
      <Box css={{ fontSize: '$8', fontFamily: 'Inter' }}>
        {startDate.toFormat('MMMM dd')} - {endDate.toFormat(endDateFormat)}
      </Box>
      <Panel nested>
        <Text variant="formLabel">You received</Text>
        <Text bold css={{ fontSize: '$6' }}>
          {totalReceived} {tokenName}
        </Text>
      </Panel>
      <Panel nested>
        <Box
          css={{
            display: 'flex',
            gap: '$sm',
          }}
        >
          <Text
            variant="formLabel"
            css={{
              color: tab === 0 ? '$primary' : '$gray400',
              cursor: 'pointer',
            }}
            onClick={() => setTab(0)}
          >
            Received
          </Text>
          <Text
            variant="formLabel"
            css={{
              color: tab === 1 ? '$primary' : '$gray400',
              cursor: 'pointer',
            }}
            onClick={() => setTab(1)}
          >
            Sent
          </Text>
        </Box>
        {tab === 0
          ? received.map((gift, index) => (
              <Box key={gift.id} css={{ display: 'flex', my: '$sm' }}>
                <Box css={{ mr: '$md' }}>
                  <ApeAvatar user={gift.sender} />
                </Box>
                <Box
                  css={
                    !gift.note ? { alignItems: 'center', display: 'flex' } : {}
                  }
                >
                  {gift.note && (
                    <Text css={{ mb: '$xs', lineHeight: 'normal' }}>
                      {gift.note}
                    </Text>
                  )}
                  <Box css={{ fontSize: '$3', color: '$green' }}>
                    {gift.tokens} {tokenName} received from {gift.sender.name}
                  </Box>
                </Box>
              </Box>
            ))
          : sent.map(gift => (
              <Box key={gift.id}>
                +{gift.tokens} to {gift.recipient.name}: {gift.note}
              </Box>
            ))}
      </Panel>
    </Panel>
  );
};

const Header = styled(Text, {
  fontSize: '$7',
  fontFamily: 'Inter !important',
  color: '$placeholder !important',
  fontWeight: '$semibold',
});

type PaginatorProps = {
  css?: CSS;
  pages: number;
  current: number;
  onSelect: (page: number) => void;
};
const Paginator = ({ css, pages, current, onSelect }: PaginatorProps) => {
  return (
    <Box
      css={{
        display: 'flex',
        height: '$xl',
        gap: '$sm',
        '> *': {
          width: '$xl',
          fontFamily: 'Inter',
          fontSize: '$4',
          fontWeight: '$normal',
          padding: 0,
          backgroundColor: 'white',
          color: '$primary',
        },
        ...css,
      }}
    >
      <Button
        color="transparent"
        disabled={current === 0}
        onClick={() => onSelect(current - 1)}
      >
        &#60;
      </Button>
      {times(pages, n => (
        <Button
          color="transparent"
          css={
            n !== current
              ? {}
              : {
                  borderRadius: '$1',
                  backgroundColor: '$teal !important',
                  color: 'white !important',
                }
          }
          onClick={() => onSelect(n)}
        >
          {n + 1}
        </Button>
      ))}
      <Button
        color="transparent"
        disabled={current === pages - 1}
        onClick={() => onSelect(current + 1)}
      >
        &#62;
      </Button>
    </Box>
  );
};
