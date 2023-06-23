/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import sortBy from 'lodash/sortBy';

import { Avatar, Box, Button, Flex, MarkdownPreview, Panel, Text } from 'ui';

import { QueryPastEpoch } from './getHistoryData';

type QueryReceivedGift = QueryPastEpoch['receivedGifts'][0];
type QuerySentGift = QueryPastEpoch['sentGifts'][0];
type QueryGift = QueryReceivedGift | QuerySentGift;

export const NotesSection = ({
  received,
  sent,
  epochStatements,
  tokenName,
}: {
  received: QueryPastEpoch['receivedGifts'];
  sent?: QueryPastEpoch['sentGifts'];
  epochStatements?: QueryPastEpoch['epochStatements'];
  tokenName: string;
}) => {
  const receivedLength = received.filter(g => g.gift_private?.note).length;
  const sentLength = sent?.filter(g => g.gift_private?.note).length;
  const filteredEpochStatements = epochStatements?.filter(
    e => e.bio && e.bio.length > 0
  );
  const epochStatementsLength = filteredEpochStatements?.length;
  const [tab, setTab] = useState<
    'sent' | 'received' | 'epochStatements' | null
  >(null);

  return (
    <Flex column>
      <Flex
        css={{
          gap: '$sm',
          '@sm': {
            flexDirection: 'column',
          },
        }}
      >
        <Flex column css={{ gap: '$sm' }}>
          <Text variant="label" as="label">
            Your Notes
          </Text>
          <Box css={{ display: 'flex', gap: '$sm', mb: '$xs' }}>
            <Button
              color={tab === 'received' ? 'selectedSecondary' : 'secondary'}
              size="small"
              onClick={() =>
                setTab(prev => (prev === 'received' ? null : 'received'))
              }
            >
              {receivedLength} Received
            </Button>
            {!!sent?.length && (
              <Button
                className="sentButton"
                color={tab === 'sent' ? 'selectedSecondary' : 'secondary'}
                size="small"
                onClick={() =>
                  setTab(prev => (prev === 'sent' ? null : 'sent'))
                }
              >
                {sentLength} Sent
              </Button>
            )}
          </Box>
        </Flex>
        {!!epochStatementsLength && (
          <Flex
            column
            css={{
              gap: '$sm',
              ml: '$md',
              pl: '$lg',
              borderLeft: '1px solid $border',
              '@sm': {
                ml: 0,
                pl: 0,
                borderLeft: 'none',
              },
            }}
          >
            <Text variant="label" as="label">
              Circle
            </Text>
            <Box css={{ display: 'flex', gap: '$sm', mb: '$xs' }}>
              <Button
                className="epochStatementsButton"
                color={
                  tab === 'epochStatements' ? 'selectedSecondary' : 'secondary'
                }
                size="small"
                onClick={() =>
                  setTab(prev =>
                    prev === 'epochStatements' ? null : 'epochStatements'
                  )
                }
              >
                {epochStatementsLength} Epoch{' '}
                {epochStatementsLength == 1 ? 'Statement' : 'Statements'}
              </Button>
            </Box>
          </Flex>
        )}
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
          {tab === 'received' && (
            <Notes tokenName={tokenName} data={received} received />
          )}
          {!!sent?.length && tab === 'sent' && (
            <Notes tokenName={tokenName} data={sent} />
          )}
          {!!epochStatementsLength && tab === 'epochStatements' && (
            <>
              <EpochStatements epochStatements={filteredEpochStatements} />
            </>
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

const EpochStatements = ({
  epochStatements,
}: {
  epochStatements?: QueryPastEpoch['epochStatements'];
}) => (
  <Flex column css={{ gap: '$md', mt: '$md' }}>
    {epochStatements?.map(e => {
      return (
        <Panel
          nested
          key={e.id}
          css={{ flexDirection: 'row', gap: '$md', p: '$sm $md $sm $sm' }}
        >
          <Avatar
            path={e.user?.profile?.avatar}
            name={e.user?.profile?.name}
            address={e.user?.profile?.address}
            size="medium"
          />
          <Flex column css={{ gap: '$md' }}>
            <Text bold>{e.user?.profile?.name}</Text>
            <MarkdownPreview render source={e.bio} />
          </Flex>
        </Panel>
      );
    })}
  </Flex>
);

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
    (gift as QuerySentGift).recipient || { profile: { name: 'Deleted User' } };

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
          name={other.profile?.name}
          address={other.profile?.address}
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
          {other.profile?.name}
        </Box>
      </Box>
    </Box>
  );
};
