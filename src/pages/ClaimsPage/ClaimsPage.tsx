import { LoadingModal, makeTable } from 'components';
import { Box, Panel, Flex, Text, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { makeExplorerUrl } from 'utils/provider';

import { useClaimsTableData, ClaimsRowData } from './hooks';
import { QueryClaim } from './queries';
import { formatEpochDates, formatClaimAmount } from './utils';

const styles = {
  th: { whiteSpace: 'nowrap', textAlign: 'left' },
  thLast: { textAlign: 'right', width: '98%' },
};

const buttonStyles = {
  fontWeight: '$medium',
  minHeight: '$xs',
  px: '$sm',
  minWidth: '11vw',
  borderRadius: '$2',
};

type ClaimRowProps = {
  claimsRow: QueryClaim;
  claimsGroup: QueryClaim[];
};

const ClaimRow: React.FC<ClaimRowProps> = ({
  claimsRow,
  claimsGroup,
  children,
}) => {
  return (
    <tr>
      <td>
        <Text>{claimsRow.distribution.epoch.circle?.organization?.name}</Text>
      </td>
      <td>
        <Flex row css={{ gap: '$sm' }}>
          <Text>{claimsRow.distribution.epoch.circle?.name}</Text>
        </Flex>
      </td>
      <td>
        <Text>{formatEpochDates(claimsGroup)}</Text>
      </td>
      <td>
        <Flex css={{ justifyContent: 'flex-end' }}>
          <Flex
            css={{
              minWidth: '10vw',
              justifyContent: 'flex-end',
              gap: '$md',
              mr: '$md',
              '@sm': { minWidth: '20vw' },
            }}
          >
            <Text>{formatClaimAmount(claimsGroup)}</Text>
            {children}
          </Flex>
        </Flex>
      </td>
    </tr>
  );
};

export default function ClaimsPage() {
  // this causes errors if it's run at the top-level
  const ClaimsTable = makeTable<ClaimsRowData>('ClaimsTable');

  const {
    isIdle,
    isLoading,
    isError,
    error,
    claims,
    claimedClaimsRows,
    unclaimedClaimsRows,
    claiming,
    processClaim,
  } = useClaimsTableData();

  if (isIdle || isLoading) return <LoadingModal visible />;
  if (isError || !claims)
    return (
      <SingleColumnLayout>
        {!claims ? (
          <>No claims found.</>
        ) : (
          <>Error retrieving your claims. {error}</>
        )}
      </SingleColumnLayout>
    );

  return (
    <SingleColumnLayout>
      <Text h1>Claim Your Allocations</Text>
      <Box css={{ color: '$neutral', maxWidth: '60%' }}>
        You can claim all your rewards from this page. Note that you can claim
        them for all your epochs in one circle but each token requires its own
        claim transaction.
      </Box>

      <Panel css={{ mb: '$lg' }}>
        <ClaimsTable
          headers={[
            { title: 'Organization', css: styles.th },
            { title: 'Circle', css: styles.th },
            { title: 'Epochs', css: styles.th },
            { title: 'Rewards', css: styles.thLast },
          ]}
          data={unclaimedClaimsRows}
          startingSortIndex={2}
          startingSortDesc={false}
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ claimsRow, group }) => {
            const isClaiming = claiming[claimsRow.id] === 'pending';
            const isClaimed = claiming[claimsRow.id] === 'claimed';
            return (
              <ClaimRow
                claimsRow={claimsRow}
                key={claimsRow.id}
                claimsGroup={group}
              >
                <Button
                  color="primary"
                  outlined
                  css={buttonStyles}
                  onClick={() => processClaim(claimsRow.id)}
                  disabled={isClaiming || isClaimed}
                >
                  {isClaiming
                    ? 'Claiming...'
                    : isClaimed
                    ? 'Claimed'
                    : `Claim ${claimsRow.distribution.vault.symbol}`}
                </Button>
              </ClaimRow>
            );
          }}
        </ClaimsTable>
      </Panel>

      <Text h2 css={{ mb: '$sm' }}>
        Claims History
      </Text>
      <Panel>
        <ClaimsTable
          headers={[
            { title: 'Organization', css: styles.th },
            { title: 'Circle', css: styles.th },
            { title: 'Epochs', css: styles.th },
            { title: 'Rewards', css: styles.thLast },
          ]}
          data={claimedClaimsRows}
          startingSortIndex={2}
          startingSortDesc={false}
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ claimsRow, group }) => (
            <ClaimRow
              claimsRow={claimsRow}
              key={claimsRow.id}
              claimsGroup={group}
            >
              <Button
                color="primary"
                outlined
                css={buttonStyles}
                as="a"
                target="_blank"
                href={makeExplorerUrl(
                  claimsRow.distribution.vault.chain_id,
                  claimsRow.txHash
                )}
              >
                View on Etherscan
              </Button>
            </ClaimRow>
          )}
        </ClaimsTable>
      </Panel>
    </SingleColumnLayout>
  );
}
