import { useState } from 'react';

import fp from 'lodash/fp';
import round from 'lodash/round';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { CSS } from 'stitches.config';

import { NewApeAvatar } from 'components';
import isFeatureEnabled from 'config/features';
import { useApiAdminCircle } from 'hooks';
import { paths } from 'routes/paths';
import { Box, Panel, Text, Button, AppLink, Flex } from 'ui';

import type { QueryPastEpoch, QueryDistribution } from './getHistoryData';

type EpochPanelProps = {
  circleId: number;
  circleName?: string;
  protocolName?: string;
  epoch: QueryPastEpoch;
  tokenName: string;
  css?: CSS;
  isAdmin: boolean;
};
export const EpochPanel = ({
  circleId,
  epoch,
  tokenName,
  isAdmin,
  css = {},
}: EpochPanelProps) => {
  const [tab, setTab] = useState(0);
  const [showLess, setShowLess] = useState(true);
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMMM d';

  const { downloadCSV } = useApiAdminCircle(circleId);

  const received = epoch.receivedGifts;
  const sent = epoch.sentGifts;
  const totalAllocated =
    epoch.token_gifts_aggregate.aggregate?.sum?.tokens || 0;
  const totalReceived = received.map(g => g.tokens).reduce((a, b) => a + b, 0);

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
      <Box>
        <Panel nested>
          <Text variant="label">You received</Text>
          <Text bold font="inter" size="large" css={{ mb: '$md' }}>
            {totalReceived} {tokenName}
          </Text>
          <Text variant="label">Total Distributed</Text>
          <Text bold font="inter" size="large">
            {totalAllocated} {tokenName}
          </Text>
          <DistributionSummary
            distributions={epoch.distributions as QueryDistribution[]}
            circleId={circleId}
            epochId={epoch.id}
          />
          {isAdmin && (
            <>
              {isFeatureEnabled('vaults') ? (
                <AppLink
                  css={{
                    mt: '$md',
                    mx: '-$md',
                    mb: '-$md',
                  }}
                  to={paths.distributions(circleId, epoch.id)}
                >
                  <Button
                    fullWidth
                    color="primary"
                    css={{
                      whiteSpace: 'nowrap',
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                  >
                    Review / Export
                  </Button>
                </AppLink>
              ) : (
                <Button
                  color="primary"
                  css={{
                    whiteSpace: 'nowrap',
                    mt: '$md',
                    mx: '-$md',
                    mb: '-$md',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                  onClick={e => {
                    e.stopPropagation(),
                      (async () => {
                        // use the authed api to download the CSV
                        const csv = await downloadCSV(epoch.number, epoch.id);

                        if (csv?.file) {
                          const a = document.createElement('a');
                          a.href = csv.file;
                          a.click();
                          a.href = '';
                        }

                        return false;
                      })();
                  }}
                >
                  Export CSV
                </Button>
              )}
            </>
          )}
        </Panel>
      </Box>
      <Panel
        nested
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '$text',
        }}
      >
        <Flex
          css={{
            columnGap: '$3xl',
            rowGap: '$lg',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            '@xs': {
              flexDirection: 'column',
            },
          }}
        >
          <Flex column css={{ gap: '$sm' }}>
            <Text>Notes</Text>
            <Flex css={{ gap: '$md' }}>
              <Box css={{ display: 'flex', gap: '$sm', mb: '$xs' }}>
                <Button
                  outlined
                  size="small"
                  css={{ borderRadius: '$pill' }}
                  onClick={() => setTab(0)}
                >
                  <Text
                    variant="label"
                    css={{
                      color:
                        tab === 0 && !showLess ? '$text' : '$secondaryText',
                    }}
                  >
                    {received.filter(g => g.gift_private?.note).length} Received
                  </Text>
                </Button>
                <Button
                  outlined
                  size="small"
                  css={{ borderRadius: '$pill' }}
                  onClick={() => setTab(1)}
                >
                  <Text
                    variant="label"
                    css={{
                      color:
                        tab === 1 && !showLess ? '$text' : '$secondaryText',
                    }}
                  >
                    {sent.filter(g => g.gift_private?.note).length} Sent
                  </Text>
                </Button>
              </Box>
            </Flex>
          </Flex>
          <Box>
            {showLess ? (
              <button
                onClick={event => (setShowLess(true), event.stopPropagation())}
              >
                <Text
                  variant="label"
                  css={{ color: 'transparent', cursor: 'pointer' }}
                >
                  Show More
                </Text>
              </button>
            ) : (
              <button
                onClick={event => (setShowLess(true), event.stopPropagation())}
              >
                <Text
                  variant="label"
                  css={{ color: '$primary', cursor: 'pointer' }}
                >
                  Show Less
                </Text>
              </button>
            )}
          </Box>
        </Flex>

        {!showLess && (
          <Flex
            column
            css={{
              gap: '$md',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            {tab === 0 ? (
              <Notes tokenName={tokenName} data={received} received />
            ) : (
              <Notes tokenName={tokenName} data={sent} />
            )}
          </Flex>
        )}
      </Panel>
    </Panel>
  );
};

type QueryReceivedGift = QueryPastEpoch['receivedGifts'][0];
type QuerySentGift = QueryPastEpoch['sentGifts'][0];
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

const DistributionSummary = ({
  distributions,
  circleId,
  epochId,
}: {
  distributions: QueryDistribution[];
  circleId: number;
  epochId: number;
}) => {
  if (!isFeatureEnabled('vaults') || !distributions.length) return null;

  const tokens = fp.flow(
    fp.groupBy<QueryDistribution>(dist => dist.vault.symbol),
    fp.mapValues(fp.sumBy(d => d.gift_amount + d.fixed_amount))
  )(distributions);

  return (
    <AppLink to={paths.distributions(circleId, epochId)}>
      {Object.entries(tokens).map(([token, amount]) => (
        <Text
          key={token}
          bold
          font="inter"
          size="large"
          css={{ color: '$secondaryText' }}
        >
          {round(amount, 2)} {token}
        </Text>
      ))}
    </AppLink>
  );
};
