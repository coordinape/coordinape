import { LoadingModal, makeTable } from 'components';
import { Avatar, Box, Panel, Flex, Text, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { makeExplorerUrl } from 'utils/provider';

import { useClaimsTableData, ClaimsRowData } from './hooks';
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

const ClaimsRow: React.FC<ClaimsRowData> = ({ claim, group, children }) => {
  return (
    <tr>
      <td>
        <Flex>
          {claim.distribution.epoch.circle?.logo ? (
            <Avatar small path={claim.distribution.epoch.circle?.logo} />
          ) : (
            ''
          )}
          <Text>{claim.distribution.epoch.circle?.organization?.name}</Text>
        </Flex>
      </td>
      <td>
        <Flex css={{ gap: '$sm' }}>
          <Text>{claim.distribution.epoch.circle?.name}</Text>
        </Flex>
      </td>
      <td>
        <Text>{formatEpochDates(group)}</Text>
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
            <Text>{formatClaimAmount(group)}</Text>
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
          {({ claim, group }) => {
            const isClaiming = claiming[claim.id] === 'pending';
            const isClaimed = claiming[claim.id] === 'claimed';
            return (
              <ClaimsRow claim={claim} key={claim.id} group={group}>
                <Button
                  color="primary"
                  outlined
                  css={buttonStyles}
                  onClick={() => processClaim(claim.id)}
                  disabled={isClaiming || isClaimed}
                >
                  {isClaiming
                    ? 'Claiming...'
                    : isClaimed
                    ? 'Claimed'
                    : `Claim ${claim.distribution.vault.symbol}`}
                </Button>
              </ClaimsRow>
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
          {({ claim, group }) => (
            <ClaimsRow claim={claim} key={claim.id} group={group}>
              <Button
                color="primary"
                outlined
                css={buttonStyles}
                as="a"
                target="_blank"
                href={makeExplorerUrl(
                  claim.distribution.vault.chain_id,
                  claim.txHash
                )}
              >
                View on Etherscan
              </Button>
            </ClaimsRow>
          )}
        </ClaimsTable>
      </Panel>
    </SingleColumnLayout>
  );
}
