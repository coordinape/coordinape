import assert from 'assert';
import { useState } from 'react';

import { Dictionary } from 'lodash';

import { LoadingModal, makeTable } from 'components';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Box, Panel, Flex, Text, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { makeExplorerUrl } from 'utils/provider';

import { useClaimsTableData } from './hooks';
import { QueryClaim } from './queries';
import { useClaimAllocation } from './useClaimAllocation';
import { formatEpochDates, formatClaimAmount, claimsRowKey } from './utils';

// claimRows: reduce all claims into one row per group of {vault, circle,
// txHash}, for representing a group of claims into one row per set
// of batch claimable claims. If you can claim them all together, display
// them all together. If they were claimed in same tx, display them as one row
// with link to the claim on etherscan)
const claimRows = (claims: QueryClaim[]) =>
  claims
    .sort(c => -c.id)
    .reduce(
      (finalClaims, curr) =>
        finalClaims.filter(
          c =>
            c.distribution.vault.vault_address ===
              curr.distribution.vault.vault_address &&
            c.distribution.epoch.circle?.id ===
              curr.distribution.epoch.circle?.id &&
            c.txHash === curr.txHash
        ).length > 0
          ? finalClaims
          : [...finalClaims, curr],
      [] as QueryClaim[]
    );

const styles = {
  th: { whiteSpace: 'nowrap', textAlign: 'left' },
  thLast: { textAlign: 'right', width: '98%' },
};

export default function ClaimsPage() {
  // this causes errors if it's run at the top-level
  const ClaimsTable = makeTable<QueryClaim>('ClaimsTable');

  const address = useConnectedAddress();
  const claimTokens = useClaimAllocation();
  const [claiming, setClaiming] = useState<Record<number, boolean>>({});

  const {
    isIdle,
    isLoading,
    isError,
    error,
    claims,
    refetch,
    claimedClaimsGroupByRow,
    unclaimedClaimsGroupByRow,
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

  const processClaim = async (claimId: number) => {
    const claim = claims.find(c => c.id === claimId);
    assert(claim);
    assert(address);
    const { index, proof, distribution } = claim;

    const { claims: jsonClaims } = JSON.parse(distribution.distribution_json);
    const amount = jsonClaims[address.toLowerCase()].amount;

    setClaiming(val => ({ ...val, [claim.id]: true }));
    const hash = await claimTokens({
      claimId: claim.id,
      circleId: distribution.epoch.circle?.id,
      vault: distribution.vault,
      index: index,
      address,
      amount,
      proof: proof.split(','),
      distributionEpochId: distribution.distribution_epoch_id,
    });
    if (hash) refetch();
    setClaiming(val => ({ ...val, [claim.id]: false }));
  };

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
          data={claimRows(claims.filter(c => !c.txHash))}
          startingSortIndex={2}
          startingSortDesc
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ id, unwrappedNewAmount, distribution }) => (
            <ClaimRow
              {...{ id, unwrappedNewAmount, distribution }}
              key={id}
              onClickClaim={() => processClaim(id)}
              claiming={claiming[id]}
              claimsGroupByRow={unclaimedClaimsGroupByRow}
            />
          )}
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
          data={claimRows(claims.filter(c => c.txHash))}
          startingSortIndex={2}
          startingSortDesc
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ id, distribution, txHash }) => (
            <tr key={id}>
              <td>
                <Text>{distribution.epoch.circle?.organization?.name}</Text>
              </td>
              <td>
                <Flex row css={{ gap: '$sm' }}>
                  <Text>{distribution.epoch.circle?.name}</Text>
                </Flex>
              </td>
              <td>
                <Text>
                  {formatEpochDates(
                    claimedClaimsGroupByRow[claimsRowKey(distribution, txHash)]
                  )}
                </Text>
              </td>
              <td>
                <Flex css={{ justifyContent: 'flex-end' }}>
                  <Flex
                    css={{
                      minWidth: '11vw',
                      justifyContent: 'flex-end',
                      gap: '$md',
                      mr: '$md',
                      '@sm': { minWidth: '20vw' },
                    }}
                  >
                    <Text>
                      {formatClaimAmount(
                        claimedClaimsGroupByRow[
                          claimsRowKey(distribution, txHash)
                        ]
                      )}
                    </Text>
                    <Button
                      color="primary"
                      outlined
                      css={{
                        fontWeight: '$medium',
                        minHeight: '$xs',
                        px: '$sm',
                        minWidth: '15vw',
                        borderRadius: '$2',
                      }}
                      as="a"
                      target="_blank"
                      href={makeExplorerUrl(
                        distribution.vault.chain_id,
                        txHash
                      )}
                    >
                      View on Etherscan
                    </Button>
                  </Flex>
                </Flex>
              </td>
            </tr>
          )}
        </ClaimsTable>
      </Panel>
    </SingleColumnLayout>
  );
}

type ClaimRowProps = {
  distribution: QueryClaim['distribution'];
  unwrappedNewAmount: QueryClaim['unwrappedNewAmount'];
  onClickClaim: () => void;
  claimsGroupByRow: Dictionary<QueryClaim[]>;
  claiming: boolean;
};
const ClaimRow = ({
  distribution,
  onClickClaim,
  claimsGroupByRow,
  claiming,
}: ClaimRowProps) => {
  return (
    <tr>
      <td>
        <Text>{distribution.epoch.circle?.organization?.name}</Text>
      </td>
      <td>
        <Flex row css={{ gap: '$sm' }}>
          <Text>{distribution.epoch.circle?.name}</Text>
        </Flex>
      </td>
      <td>
        <Text>
          {formatEpochDates(claimsGroupByRow[claimsRowKey(distribution)])}
        </Text>
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
            <Text>
              {formatClaimAmount(claimsGroupByRow[claimsRowKey(distribution)])}
            </Text>
            <Button
              color="primary"
              outlined
              css={{
                fontWeight: '$medium',
                minHeight: '$xs',
                px: '$sm',
                minWidth: '11vw',
                borderRadius: '$2',
              }}
              onClick={onClickClaim}
              disabled={claiming}
            >
              {claiming ? 'Claiming...' : `Claim ${distribution.vault.symbol}`}
            </Button>
          </Flex>
        </Flex>
      </td>
    </tr>
  );
};
