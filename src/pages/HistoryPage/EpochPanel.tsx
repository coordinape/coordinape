import fp from 'lodash/fp';
import round from 'lodash/round';
import { DateTime } from 'luxon';
import { CSS } from 'stitches.config';

import isFeatureEnabled from 'config/features';
import { useApiAdminCircle } from 'hooks';
import { paths } from 'routes/paths';
import { Box, Panel, Text, AppLink, Flex, Link, Button } from 'ui';

import type { QueryPastEpoch, QueryDistribution } from './getHistoryData';
import { NotesSection } from './Notes';

type EpochPanelProps = {
  circleId: number;
  circleName?: string;
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
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMM d';

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
        gridTemplateColumns: '23fr 87fr',
        gap: '$md',
        border: '1px solid $borderDim',
        '@sm': { display: 'flex' },
        ...css,
      }}
    >
      <Flex
        column
        css={{
          justifyContent: 'flex-start',
          gap: '$sm',
        }}
      >
        <Text semibold inline h2>
          {startDate.toFormat('MMM')} {startDate.toFormat('d')} -{' '}
          {endDate.toFormat(endDateFormat)}
        </Text>
        {epoch.description ? (
          <Text p>{epoch.description}</Text>
        ) : (
          <Text inline h3>
            Epoch {epoch.number}
          </Text>
        )}
      </Flex>
      <Flex column>
        <Flex
          css={{
            // display: 'grid',
            // gridTemplateColumns: '1fr 1fr 1fr',
            gap: '$2xl',
          }}
        >
          <Flex column>
            <Text variant="label">You Received</Text>
            <Text bold size="large" css={{ my: '$sm' }}>
              {totalReceived} {tokenName}
            </Text>
          </Flex>
          <Flex column>
            <Text variant="label">Total Distributed</Text>
            <Text bold size="large" css={{ my: '$sm' }}>
              {totalAllocated} {tokenName}
            </Text>
          </Flex>
          <Flex column>
            <DistributionSummary
              distributions={epoch.distributions as QueryDistribution[]}
              circleId={circleId}
              epochId={epoch.id}
            />
            {isAdmin && (
              <Box css={{ mt: '$lg' }}>
                {isFeatureEnabled('vaults') ? (
                  <Button
                    color="cta"
                    as={AppLink}
                    to={paths.distributions(circleId, epoch.id)}
                  >
                    Review &amp; Export
                  </Button>
                ) : (
                  <Link
                    href="#"
                    css={{ fontWeight: '$semibold' }}
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
                  </Link>
                )}
              </Box>
            )}
          </Flex>
        </Flex>

        <NotesSection sent={sent} received={received} tokenName={tokenName} />
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
