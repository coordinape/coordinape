import { useState, useMemo } from 'react';

import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { styled } from 'stitches.config';

import { LoadingModal, NewApeAvatar } from 'components';
import { Paginator } from 'components/Paginator';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Box, Panel, Text, AppLink, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CurrentEpochPanel } from './CurrentEpochPanel';
import { getHistoryData } from './getHistoryData';

import type { Awaited } from 'types/shim';

const pageSize = 3;

export const HistoryPage = () => {
  const {
    circle: { id: circleId },
    myUser: { id: userId },
  } = useSelectedCircle();

  const query = useQuery(
    ['history', circleId],
    () => getHistoryData(circleId, userId),
    { enabled: !!userId && !!circleId }
  );

  const circle = query.data?.circles_by_pk;
  const isAdmin = circle?.users[0]?.role === 1;

  const [page, setPage] = useState(0);

  const nextEpoch = circle?.future.epochs[0];
  const nextEpochStartLabel = useMemo(() => {
    if (!nextEpoch) return '';
    const date = DateTime.fromISO(nextEpoch.start_date);
    const diff = date
      .diffNow(['days', 'hours', 'minutes'])
      .toHuman({ unitDisplay: 'short', notation: 'compact' });
    return `starts in ${diff}, on ${date.toFormat('LLL d')}`;
  }, [nextEpoch]);

  const currentEpoch = circle?.current.epochs[0];
  const pastEpochs = circle?.past.epochs || [];

  // TODO fetch only data for page shown
  const shownPastEpochs = useMemo(
    () => pastEpochs.slice(page * pageSize, (page + 1) * pageSize),
    [pastEpochs, page]
  );
  const totalPages = Math.ceil(pastEpochs.length / pageSize);

  if (query.isLoading || query.isIdle) return <LoadingModal visible />;

  if (!currentEpoch && !nextEpoch && pastEpochs.length === 0) {
    return (
      <SingleColumnLayout>
        <p>
          This circle has no epochs yet.{' '}
          {isAdmin ? (
            <>
              <AppLink to={paths.adminCircles}>Visit the admin page</AppLink> to
              create one.
            </>
          ) : (
            <>Please return once your admin has created one.</>
          )}
        </p>
      </SingleColumnLayout>
    );
  }

  return (
    <Box css={{ maxWidth: '$mediumScreen', ml: 'auto', mr: 'auto', p: '$xl' }}>
      {page === 0 && nextEpoch && (
        <>
          <Header>Next</Header>
          <Panel css={{ mb: '$xl', color: '#717C7F' }}>
            <Text inline>
              <Text inline bold color="gray" font="inter">
                Next Epoch
              </Text>{' '}
              {nextEpochStartLabel}
            </Text>
          </Panel>
        </>
      )}
      {page === 0 && currentEpoch && (
        <>
          <Header>Current</Header>
          <CurrentEpochPanel epoch={currentEpoch} />
        </>
      )}
      {pastEpochs.length > 0 && (
        <>
          <Header>Past</Header>
          {shownPastEpochs.map((epoch: QueryEpoch) => (
            <EpochPanel
              key={epoch.id}
              epoch={epoch}
              tokenName={circle?.token_name || 'GIVE'}
            />
          ))}
          <Paginator pages={totalPages} current={page} onSelect={setPage} />
        </>
      )}
    </Box>
  );
};

export type QueryResult = Awaited<ReturnType<typeof getHistoryData>>;
type QueryEpoch = Exclude<
  QueryResult['circles_by_pk'],
  undefined
>['past']['epochs'][0];

type EpochPanelProps = { epoch: QueryEpoch; tokenName: string };
const EpochPanel = ({ epoch, tokenName }: EpochPanelProps) => {
  const [tab, setTab] = useState(0);
  const [shortPanelShow, setshortPanelShow] = useState(true);
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMMM d';

  const received = epoch.received_gifts.token_gifts;
  const sent = epoch.sent_gifts.token_gifts;
  const totalAllocated = epoch.token_gifts_aggregate.aggregate?.sum?.tokens;
  const totalReceived = received.map(g => g.tokens).reduce((a, b) => a + b, 0);

  return (
    <Panel
      css={{
        mb: '$md',
        display: 'grid',
        gridTemplateColumns: '23fr 15fr 62fr',
        gap: '$md',
      }}
    >
      <Box
        css={{
          fontSize: '$8',
          fontFamily: 'Inter',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Text font="inter" inline>
          <Text inline font="inter" css={{ fontWeight: '$semibold' }}>
            {startDate.toFormat('MMMM')}
          </Text>{' '}
          {startDate.toFormat('d')} - {endDate.toFormat(endDateFormat)}
        </Text>
        <button onClick={() => setshortPanelShow(!shortPanelShow)}>
          <Text
            variant="formLabel"
            css={{
              size: '$max',
              fontSize: '$2',
              color: '$green',
              mt: '$xl',
              cursor: 'pointer',
            }}
          >
            {shortPanelShow ? 'Show More' : 'Show Less'}
          </Text>
        </button>
      </Box>
      <Panel nested>
        <Text variant="formLabel">You received</Text>
        <Text bold font="inter" css={{ fontSize: '$6', mb: '$md' }}>
          {totalReceived} {tokenName}
        </Text>
        <Text variant="formLabel">Total Distributed</Text>
        <Text bold font="inter" css={{ fontSize: '$6' }}>
          {totalAllocated} {tokenName}
        </Text>
      </Panel>
      {shortPanelShow ? (
        <Panel
          nested
          css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            color: '$primary',
          }}
        >
          <Box css={{ mr: '$md' }}>
            <Text variant="formLabel">Notes Left</Text>
            <Text bold font="inter" css={{ fontSize: '$6' }}>
              {sent.filter(g => g.gift_private?.note).length}
            </Text>
          </Box>
          <Box>
            <Text variant="formLabel">Received</Text>
            <Text bold font="inter" css={{ fontSize: '$6' }}>
              {received.filter(g => g.gift_private?.note).length}
            </Text>
          </Box>
        </Panel>
      ) : (
        <Panel nested>
          <Box css={{ display: 'flex', gap: '$sm', mb: '$xs' }}>
            {['Received', 'Sent'].map((label, index) => (
              <Button
                key={label}
                outlined
                size="small"
                css={{ borderRadius: '$pill' }}
                onClick={() => setTab(index)}
              >
                <Text
                  variant="formLabel"
                  css={{ color: tab === index ? '$primary' : '$gray400' }}
                >
                  {label}
                </Text>
              </Button>
            ))}
          </Box>
          {tab === 0 ? (
            <Notes tokenName={tokenName} data={received} received />
          ) : (
            <Notes tokenName={tokenName} data={sent} />
          )}
        </Panel>
      )}
    </Panel>
  );
};

const Header = styled(Text, {
  mb: '$md',
  fontSize: '$7',
  fontFamily: 'Inter !important',
  color: '$placeholder',
  fontWeight: '$semibold',
});

type QueryReceivedGift = QueryEpoch['received_gifts']['token_gifts'][0];
type QuerySentGift = QueryEpoch['sent_gifts']['token_gifts'][0];
type QueryGift = QueryReceivedGift | QuerySentGift;

type NotesProps = {
  tokenName: string;
  data: QueryGift[];
  received?: boolean;
};

const Notes = ({ data, received = false, tokenName }: NotesProps) => {
  if (data.length === 0) {
    return (
      <Box css={{ mt: '$md' }}>
        <Text variant="formLabel">
          You did not {received ? 'receive' : 'send'} any notes
        </Text>
      </Box>
    );
  }

  const sorted = sortBy(data, gift => -gift.tokens);

  return (
    <>
      {sorted.map(gift => (
        <NotesItem
          key={gift.id}
          gift={gift}
          received={received}
          tokenName={tokenName}
        />
      ))}
    </>
  );
};

const NotesItem = ({
  gift,
  received,
  tokenName,
}: {
  gift: QueryGift;
  received: boolean;
  tokenName: string;
}) => {
  const other =
    (gift as QueryReceivedGift).sender || (gift as QuerySentGift).recipient;
  const note = gift.gift_private?.note;
  return (
    <Box css={{ display: 'flex', my: '$sm' }}>
      <Box css={{ mr: '$md' }}>
        <NewApeAvatar path={other.profile?.avatar} name={other.name} />
      </Box>
      <Box css={!note ? { alignItems: 'center', display: 'flex' } : {}}>
        {note && <Text css={{ mb: '$xs', lineHeight: 'normal' }}>{note}</Text>}
        <Box css={{ fontSize: '$3', color: '$green' }}>
          {gift.tokens} {tokenName} {received ? 'received from ' : 'sent to '}
          {other.name}
        </Box>
      </Box>
    </Box>
  );
};
