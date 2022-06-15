import assert from 'assert';

import { BigNumber } from 'ethers';
import { encodeCircleId } from 'lib/vaults';
import { useQuery } from 'react-query';

import { LoadingModal, makeTable } from 'components';
import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useMyProfile } from 'recoilState/app';
import { Box, Panel, Flex, Text, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getClaims, ClaimsResult } from './queries';
import { useClaimAllocation } from './useClaimAllocation';

export default function ClaimsPage() {
  // this causes errors if it's run at the top-level
  const ClaimsTable = makeTable<ClaimsResult>('ClaimsTable');

  const address = useConnectedAddress();
  const contracts = useContracts();
  const allocateClaim = useClaimAllocation();
  const profile = useMyProfile();

  assert(address || contracts);

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: claims,
  } = useQuery(['claims', profile.id], () => getClaims(profile.id), {
    enabled: !!(contracts && address),
    retry: false,
  });

  if (isIdle || isLoading) return <LoadingModal visible />;
  if (isError)
    return (
      <SingleColumnLayout>
        Error retreiving your claims. {error}
      </SingleColumnLayout>
    );
  if (!claims) return <SingleColumnLayout>No claims found</SingleColumnLayout>;

  const processClaim = async (claimId: number) => {
    const claim = claims.find(c => c.id === claimId);
    assert(claim);
    assert(address);
    const circleId = encodeCircleId(claim.distribution.epoch.circle?.id);
    const vault = claim.distribution.vault;
    const merkleIndex = BigNumber.from(claim.index);
    const distributionEpochId = BigNumber.from(claim.distribution.epoch.id);

    const { claims: jsonClaims } = JSON.parse(
      claim.distribution.distribution_json
    );
    const amount = jsonClaims[address.toLowerCase() as string].amount;

    try {
      allocateClaim({
        claimId: claim.id,
        circleId,
        vault,
        merkleIndex,
        address: address as string,
        amount,
        proof: claim.proof.split(','),
        distributionEpochId,
      });
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
            {
              title: 'Organization',
              css: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Circle',
              css: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Epochs',
              css: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Rewards',
              css: { textAlign: 'right', width: '98%' },
            },
          ]}
          data={claims.filter(c => !c.txHash)}
          startingSortIndex={2}
          startingSortDesc
          sortByColumn={() => {
            return c => c;
          }}
        >
          {claim => (
            <tr key={claim.id}>
              <td>
                <Text>
                  {claim.distribution.epoch.circle?.organization?.name}
                </Text>
              </td>
              <td>
                <Flex row css={{ gap: '$sm' }}>
                  <Text>{claim.distribution.epoch.circle?.name}</Text>
                </Flex>
              </td>
              <td>
                <Text>{3}</Text>
              </td>
              <td>
                <Flex
                  css={{
                    justifyContent: 'flex-end',
                  }}
                >
                  <Flex
                    css={{
                      minWidth: '10vw',
                      justifyContent: 'flex-end',
                      gap: '$md',
                      mr: '$md',
                      '@sm': {
                        minWidth: '20vw',
                      },
                    }}
                  >
                    <Text>
                      {claim.amount} {claim.distribution.vault.symbol}
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
                      onClick={() => processClaim(claim.id)}
                    >
                      Claim {claim.distribution.vault.symbol}
                    </Button>
                  </Flex>
                </Flex>
              </td>
            </tr>
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
            {
              title: 'Organization',
              css: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Circle',
              css: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Epoch',
              css: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Rewards',
              css: { textAlign: 'right', width: '98%' },
            },
          ]}
          data={claims.filter(c => c.txHash)}
          startingSortIndex={2}
          startingSortDesc
          sortByColumn={() => {
            return c => c;
          }}
        >
          {claim => (
            <tr key={claim.id}>
              <td>
                <Text>{claim.distribution.epoch.circle?.name}</Text>
              </td>
              <td>
                <Flex row css={{ gap: '$sm' }}>
                  <Text>{claim.distribution.epoch.circle?.name}</Text>
                </Flex>
              </td>
              <td>
                <Text>
                  Epoch {claim.distribution.epoch.number}
                  {': '}
                  {formatEpochDates(
                    claim.distribution.epoch.start_date,
                    claim.distribution.epoch.end_date
                  )}
                </Text>
              </td>
              <td>
                <Flex
                  css={{
                    justifyContent: 'flex-end',
                  }}
                >
                  <Flex
                    css={{
                      minWidth: '10vw',
                      justifyContent: 'flex-end',
                      gap: '$md',
                      mr: '$md',
                      '@sm': {
                        minWidth: '20vw',
                      },
                    }}
                  >
                    <Text>
                      {claim.amount} {claim.distribution.vault.symbol}
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

function formatEpochDates(_startDate: any, _endDate: any) {
  const startDate = new Date(_startDate);
  const endDate = new Date(_endDate);
  const month = startDate.toLocaleString('default', { month: 'long' });
  return `${month} ${startDate.getDate()} - ${endDate.getDate()} ${endDate.getFullYear()}`;
}
