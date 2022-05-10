import { useState } from 'react';

import { getUnwrappedAmount } from 'lib/vaults';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { CSS } from 'stitches.config';

import { NewApeAvatar } from 'components';
import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Box, Panel, Text, Button, AppLink } from 'ui';

import type { QueryEpoch, QueryDistribution } from './getHistoryData';

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

  const dist = epoch.distributions[0] as QueryDistribution | undefined;
  const distAmount =
    dist &&
    isFeatureEnabled('vaults') &&
    getUnwrappedAmount(
      dist.total_amount,
      dist.pricePerShare,
      dist.vault.decimals
    );

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
          fontSize: '$h2',
          fontFamily: 'Inter',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Text semibold font="inter" inline css={{ fontSize: '$h2' }}>
          {startDate.toFormat('MMMM')} {startDate.toFormat('d')} -{' '}
          {endDate.toFormat(endDateFormat)}
        </Text>
      </Box>
      <Panel nested>
        <Text variant="label">You received</Text>
        <Text bold font="inter" large css={{ mb: '$md' }}>
          {totalReceived} {tokenName}
        </Text>
        <Text variant="label">Total Distributed</Text>
        <Text bold font="inter" large>
          {totalAllocated} {tokenName}
        </Text>
        {dist && distAmount && (
          <AppLink to={paths.distributions(epoch.id)}>
            <Text bold large font="inter" css={{ color: '$secondaryText' }}>
              {distAmount.toString()} {dist.vault.symbol}
            </Text>
          </AppLink>
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
            color: '$text',
          }}
        >
          <Box css={{ display: 'flex', gap: '$md' }}>
            <Box>
              <Text variant="label">Notes Left</Text>
              <Text bold font="inter" large>
                {sent.filter(g => g.gift_private?.note).length}
              </Text>
            </Box>
            <Box>
              <Text variant="label">Received</Text>
              <Text bold font="inter" large>
                {received.filter(g => g.gift_private?.note).length}
              </Text>
            </Box>
          </Box>
          <button onClick={() => setShowLess(false)}>
            <Text
              variant="label"
              css={{ color: '$secondaryText', cursor: 'pointer' }}
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
                    variant="label"
                    css={{ color: tab === index ? '$text' : '$secondaryText' }}
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
                variant="label"
                css={{ color: '$secondaryText', cursor: 'pointer' }}
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
        <Text variant="label">
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
        <Box css={{ fontSize: '$small', color: '$secondaryText' }}>
          {gift.tokens} {tokenName} {received ? 'received from ' : 'sent to '}
          {other.name}
        </Box>
      </Box>
    </Box>
  );
};
