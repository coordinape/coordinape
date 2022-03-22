/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useMemo } from 'react';

import times from 'lodash/times';
import { styled, CSS } from 'stitches.config';

import { ApeAvatar } from 'components';
import { useUserGifts } from 'recoilState/allocation';
import { useSelectedCircle } from 'recoilState/app';
import { Box, Button, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

import { IEpoch, ITokenGift } from 'types';

const pageSize = 3;

export const HistoryPage = () => {
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
