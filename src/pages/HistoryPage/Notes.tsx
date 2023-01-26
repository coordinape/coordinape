import { useState } from 'react';

import sortBy from 'lodash/sortBy';

import { Avatar, Box, Button, Flex, MarkdownPreview, Text } from '../../ui';

import { QueryPastEpoch } from './getHistoryData';

type QueryReceivedGift = QueryPastEpoch['receivedGifts'][0];
type QuerySentGift = QueryPastEpoch['sentGifts'][0];
type QueryGift = QueryReceivedGift | QuerySentGift;

export const NotesSection = ({
  received,
  sent,
  tokenName,
}: {
  received: QueryPastEpoch['receivedGifts'];
  sent: QueryPastEpoch['sentGifts'];
  tokenName: string;
}) => {
  const [tab, setTab] = useState<'sent' | 'received' | null>(null);

  return (
    <Flex column>
      <Flex column css={{ gap: '$sm' }}>
        <Text variant="label" as="label">
          Notes
        </Text>
        <Flex css={{ gap: '$md' }}>
          <Box css={{ display: 'flex', gap: '$sm', mb: '$xs' }}>
            <Button
              color={tab === 'received' ? 'selectedSecondary' : 'secondary'}
              size="small"
              onClick={() =>
                setTab(prev => (prev === 'received' ? null : 'received'))
              }
            >
              {received.filter(g => g.gift_private?.note).length} Received
            </Button>
            <Button
              color={tab === 'sent' ? 'selectedSecondary' : 'secondary'}
              size="small"
              onClick={() => setTab(prev => (prev === 'sent' ? null : 'sent'))}
            >
              {sent.filter(g => g.gift_private?.note).length} Sent
            </Button>
          </Box>
        </Flex>
      </Flex>
      {tab !== null && (
        <Flex
          column
          alignItems="start"
          css={{
            gap: '$md',
            justifyContent: 'space-between',
          }}
        >
          {tab === 'received' ? (
            <Notes tokenName={tokenName} data={received} received />
          ) : (
            <Notes tokenName={tokenName} data={sent} />
          )}
        </Flex>
      )}
    </Flex>
  );
};

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
    <Flex column css={{ rowGap: '$md', mt: '$md' }}>
      {sorted.map(gift => (
        <NotesItem
          key={gift.id}
          gift={gift}
          received={received}
          tokenName={tokenName}
        />
      ))}
    </Flex>
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
    <Box
      css={{
        display: 'grid',
        gridTemplateColumns: '1fr 15fr',
        borderRadius: '$3',
        p: '$sm',
        background: '$dim',
      }}
    >
      <Box css={{ mr: '$md' }}>
        <Avatar
          path={other.profile?.avatar}
          name={other.profile?.name ?? other.name}
          size="medium"
        />
      </Box>
      <Box css={!note ? { alignItems: 'center', display: 'flex' } : {}}>
        {note && (
          <MarkdownPreview
            render
            css={{
              p: 0,
            }}
            source={note}
          />
        )}
        <Box
          css={{ fontSize: '$small', color: '$cta', fontWeight: '$semibold' }}
        >
          {gift.tokens} {tokenName} {received ? 'received from ' : 'sent to '}
          {other.profile?.name ?? other.name}
        </Box>
      </Box>
    </Box>
  );
};
