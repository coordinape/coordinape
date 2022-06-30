import assert from 'assert';

import { Dictionary } from 'lodash';
import groupBy from 'lodash/groupBy';
import { useQuery } from 'react-query';

import { LoadingModal, makeTable } from 'components';
import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';
import { Box, Panel, Flex, Text, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getClaims, QueryClaim } from './queries';
import { useClaimAllocation } from './useClaimAllocation';

const currentClaims = (claims: QueryClaim[]) =>
  claims
    .sort(c => c.id)
    .reduce(
      (finalClaims, curr) =>
        finalClaims.filter(
          c =>
            c.distribution.vault.vault_address ==
              curr.distribution.vault.vault_address &&
            c.distribution.epoch.circle?.id ===
              curr.distribution.epoch.circle?.id
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
  const contracts = useContracts();
  const claimTokens = useClaimAllocation();
  const profile = useMyProfile();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: claims,
    refetch,
  } = useQuery(
    ['claims', profile.id],
    () => {
      assert(contracts);
      return getClaims(profile.id, contracts);
    },
    {
      enabled: !!(contracts && address),
      retry: false,
    }
  );

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

  const claimsGroupByVault = groupBy(
    claims.sort(c => c.id),
    c => c.distribution.epoch.circle?.id && c.distribution.vault.vault_address
  );

  const processClaim = async (claimId: number) => {
    const claim = claims.find(c => c.id === claimId);
    assert(claim);
    assert(address);
    const { index, proof, distribution } = claim;

    const { claims: jsonClaims } = JSON.parse(distribution.distribution_json);
    const amount = jsonClaims[address.toLowerCase()].amount;

    try {
      await claimTokens({
        claimId: claim.id,
        circleId: distribution.epoch.circle?.id,
        vault: distribution.vault,
        index: index,
        address,
        amount,
        proof: proof.split(','),
        distributionEpochId: distribution.distribution_epoch_id,
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      css={{
        margin: '$lg auto',
        padding: '$md',
        maxWidth: '$mediumScreen',
      }}
    >
      <Box
        css={{
          fontSize: '$h1',
          color: '$neutral',
          display: 'flex',
          alignItems: 'left',
        }}
      >
        Claim Your Allocations
      </Box>
      <Box css={{ color: '$neutral', maxWidth: '60%', my: '$lg' }}>
        You can claim all your rewards from this page. Note that you can claim
        them for all your epochs in one circle but each token requires its own
        claim transaction.
      </Box>

      <Panel css={{ my: '$lg', backgroundColor: '$border', mb: '$2xl' }}>
        <ClaimsTable
          headers={[
            { title: 'Organization', css: styles.th },
            { title: 'Circle', css: styles.th },
            { title: 'Epochs', css: styles.th },
            { title: 'Rewards', css: styles.thLast },
          ]}
          data={currentClaims(claims.filter(c => !c.txHash))}
          startingSortIndex={2}
          startingSortDesc
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ id, unwrappedAmount, distribution }) => (
            <ClaimRow
              {...{ id, unwrappedAmount, distribution }}
              key={id}
              onClickClaim={processClaim}
              claimsGroupByVault={claimsGroupByVault}
            />
          )}
        </ClaimsTable>
      </Panel>

      <Box
        css={{
          fontSize: '$h2',
          color: '$neutral',
          display: 'flex',
          alignItems: 'left',
          mt: '$2xl',
        }}
      >
        Claim History
      </Box>

      <Panel css={{ my: '$lg', backgroundColor: '$border' }}>
        <ClaimsTable
          headers={[
            { title: 'Organization', css: styles.th },
            { title: 'Circle', css: styles.th },
            { title: 'Epochs', css: styles.th },
            { title: 'Rewards', css: styles.thLast },
          ]}
          data={currentClaims(claims.filter(c => c.txHash))}
          startingSortIndex={2}
          startingSortDesc
          sortByColumn={() => {
            return c => c;
          }}
        >
          {({ id, amount, distribution }) => (
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
                {formatEpochDates(
                  claimsGroupByVault[distribution.vault.vault_address]
                )}
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
                      {amount} {distribution.vault.symbol}
                    </Text>
                    <Button
                      color="primary"
                      outlined
                      css={{
                        fontWeight: '$normal',
                        minHeight: '$xs',
                        px: '$sm',
                        minWidth: '5vw',
                        borderRadius: '$2',
                      }}
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
    </Box>
  );
}

type ClaimRowProps = {
  id: number;
  distribution: QueryClaim['distribution'];
  unwrappedAmount: QueryClaim['unwrappedAmount'];
  onClickClaim: (id: number) => void;
  claimsGroupByVault: Dictionary<QueryClaim[]>;
};
const ClaimRow = ({
  id,
  distribution,
  unwrappedAmount,
  onClickClaim,
  claimsGroupByVault,
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
          {formatEpochDates(
            claimsGroupByVault[distribution.vault.vault_address]
          )}
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
              {unwrappedAmount &&
                parseFloat(unwrappedAmount?.toString()).toFixed(2)}{' '}
              {distribution.vault.symbol}
            </Text>
            <Button
              color="primary"
              outlined
              css={{
                fontWeight: '$normal',
                minHeight: '$xs',
                px: '$sm',
                minWidth: '5vw',
                borderRadius: '$2',
              }}
              onClick={() => onClickClaim(id)}
            >
              Claim {distribution.vault.symbol}
            </Button>
          </Flex>
        </Flex>
      </td>
    </tr>
  );
};

function formatEpochDates(claims: QueryClaim[]) {
  const startDate = new Date(claims[0].distribution.epoch.start_date);
  const endDate = new Date(
    claims[claims.length - 1].distribution.epoch.end_date
  );
  const epochsPlural = claims.length > 1 ? 'Epochs:' : 'Epoch:';

  const monthName = (_date: Date) =>
    _date.toLocaleString('default', { month: 'long' });

  return `${claims.length} ${epochsPlural} ${monthName(
    startDate
  )} ${startDate.getDate()} - ${monthName(
    endDate
  )} ${endDate.getDate()} ${endDate.getFullYear()}`;
}
