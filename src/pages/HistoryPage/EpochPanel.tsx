import { useState } from 'react';

import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { CSS } from 'stitches.config';

import { NewApeAvatar } from 'components';
import { Box, Panel, Text, Button } from 'ui';

import { useDistroAmount } from './distributions';
import type { QueryEpoch } from './HistoryPage';

type EpochPanelProps = { epoch: QueryEpoch; tokenName: string; css?: CSS };
export const EpochPanel = ({ epoch, tokenName, css = {} }: EpochPanelProps) => {
  const [tab, setTab] = useState(0);
  const [showLess, setShowLess] = useState(true);
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMMM d';

  const received = epoch.received.token_gifts;
  const sent = epoch.sent.token_gifts;
  const totalAllocated = epoch.token_gifts_aggregate.aggregate?.sum?.tokens;
  const totalReceived = received.map(g => g.tokens).reduce((a, b) => a + b, 0);

  const distro = epoch.distributions[0];
  const distroAmount = useDistroAmount(distro);

  return (
    <Panel
      css={{
        display: 'grid',
        gridTemplateColumns: '23fr 15fr 62fr',
        gap: '$md',
        '@sm': { display: 'flex' },
        ...css,
      }}
      onClick={() => showLess && setShowLess(false)}
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
        {distroAmount && (
          <Text bold font="inter" css={{ fontSize: '$6' }}>
            {distroAmount.amount.toString()} {distroAmount.symbol}
          </Text>
        )}
      </Panel>
      {showLess ? (
        <Panel
          nested
          css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            color: '$primary',
          }}
        >
          <Box css={{ display: 'flex', gap: '$md' }}>
            <Box>
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
          </Box>
          <button onClick={() => setShowLess(false)}>
            <Text
              variant="formLabel"
              css={{ color: '$green', cursor: 'pointer' }}
            >
              Show More
            </Text>
          </button>
        </Panel>
      ) : (
        <Panel nested>
          <Box
            css={{
              display: 'flex',
              gap: '$md',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
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
            <button
              onClick={event => (setShowLess(true), event.stopPropagation())}
            >
              <Text
                variant="formLabel"
                css={{ color: '$green', cursor: 'pointer' }}
              >
                Show Less
              </Text>
            </button>
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

type QueryReceivedGift = QueryEpoch['received']['token_gifts'][0];
type QuerySentGift = QueryEpoch['sent']['token_gifts'][0];
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
  const other = (gift as QueryReceivedGift).sender ||
    (gift as QuerySentGift).recipient || { name: 'Deleted User' };

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
