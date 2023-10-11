import { useEffect, useRef } from 'react';

import fp from 'lodash/fp';
import round from 'lodash/round';
import { DateTime } from 'luxon';
import { CSS } from 'stitches.config';

import { paths } from 'routes/paths';
import { Box, Panel, Text, AppLink, Flex, Button } from 'ui';

import type { QueryPastEpoch, QueryDistribution } from './getHistoryData';
import { NotesSection } from './Notes';

type EpochPanelProps = {
  circleId: number;
  circleName?: string;
  epoch: QueryPastEpoch;
  tokenName: string;
  css?: CSS;
  isAdmin: boolean;
  targetEpoch: boolean;
};
export const EpochPanel = ({
  circleId,
  epoch,
  tokenName,
  isAdmin,
  targetEpoch,
  css = {},
}: EpochPanelProps) => {
  const targetEpochRef = useRef<null | HTMLLabelElement>(null);
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMM d';

  const received = epoch.receivedGifts;
  const sent = epoch.sentGifts;
  const epochStatements = epoch.epochStatements;
  const totalAllocated =
    epoch.token_gifts_aggregate.aggregate?.sum?.tokens || 0;
  const totalReceived = received.map(g => g.tokens).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (targetEpochRef.current && targetEpoch) {
      targetEpochRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetEpoch, targetEpochRef]);

  return (
    <Panel
      css={{
        p: '$lg',
        alignItems: 'start',
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '$md',
        '@sm': { gridTemplateColumns: '1fr', p: '$md' },
        ...css,
      }}
    >
      <Flex column css={{ gap: '$sm' }}>
        <Text semibold inline h1>
          {startDate.toFormat('MMM')} {startDate.toFormat('d')} -{' '}
          {endDate.toFormat(endDateFormat)}
        </Text>
        <Text p as="p">
          {epoch.description ? (
            <>{epoch.description}</>
          ) : (
            <>Epoch {epoch.number}</>
          )}
        </Text>
      </Flex>
      <Flex
        column
        css={{
          borderLeft: '1px solid $border',
          pl: '$xl',
          gap: '$lg',
          '@sm': {
            borderLeft: 'none',
            pl: 0,
          },
        }}
      >
        <Flex
          row
          css={{
            alignItems: 'flex-end',
            gap: '$2xl',
            '@sm': {
              alignItems: 'flex-start',
              flexDirection: 'column',
              gap: '$md',
            },
          }}
        >
          <Flex row css={{ gap: '$lg' }}>
            <Flex column css={{ gap: '$sm' }}>
              <Text variant="label">You Received</Text>
              <Text bold size="large" color="heading">
                {totalReceived} {tokenName}
              </Text>
            </Flex>
            <Flex column css={{ gap: '$sm' }}>
              <Text variant="label">Total Distributed</Text>
              <Text bold size="large" color="heading">
                {totalAllocated} {tokenName}
              </Text>
            </Flex>
          </Flex>
          <Flex column>
            <DistributionSummary
              distributions={epoch.distributions as QueryDistribution[]}
              circleId={circleId}
              epochId={epoch.id}
            />
            <Flex css={{ gap: '$sm' }}>
              {isAdmin && (
                <Box>
                  <Button
                    color="cta"
                    as={AppLink}
                    to={paths.distributions(circleId, epoch.id)}
                  >
                    Review & Export
                  </Button>
                </Box>
              )}
              <Button
                color="cta"
                as={AppLink}
                to={paths.map(circleId, { epochId: epoch.id })}
              >
                View Map
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <NotesSection
          ref={targetEpochRef}
          sent={sent}
          received={received}
          tokenName={tokenName}
          epochStatements={epochStatements}
          targetEpoch={targetEpoch}
        />
      </Flex>
    </Panel>
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
  if (!distributions.length) return null;

  const tokens = fp.flow(
    fp.groupBy<QueryDistribution>(dist => dist.vault.symbol),
    fp.mapValues(fp.sumBy(d => d.gift_amount + d.fixed_amount))
  )(distributions);

  return (
    <AppLink to={paths.distributions(circleId, epochId)}>
      {Object.entries(tokens).map(([token, amount]) => (
        <Text key={token} bold size="large" css={{ color: '$secondaryText' }}>
          {round(amount, 2)} {token}
        </Text>
      ))}
    </AppLink>
  );
};
