import assert from 'assert';

import { BigNumber } from 'ethers';
import { encodeCircleId } from 'lib/vaults';
import { useQuery } from 'react-query';

import { LoadingModal, makeTable } from 'components';
import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Box, Panel, Flex, Text, Button } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getClaims, ClaimsResult } from './queries';
import { useClaimAllocation } from './useClaimAllocation';

const ClaimsTable = makeTable<ClaimsResult>('ClaimsTable');

export default function ClaimsPage() {
  const address = useConnectedAddress();
  const contracts = useContracts();
  const allocateClaim = useClaimAllocation();

  assert(address || contracts);

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: claims,
  } = useQuery(['claims', 1], () => getClaims(1), {
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

      <Panel css={{ my: '$lg', backgroundColor: '$border' }}>
        <ClaimsTable
          headers={[
            {
              title: 'Organization',
              style: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Circle',
              style: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Epochs',
              style: { whiteSpace: 'nowrap', textAlign: 'left' },
            },
            {
              title: 'Rewards',
              style: { textAlign: 'right', width: '98%' },
            },
          ]}
          data={claims}
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
                      onClick={() => {
                        allocateClaim({
                          claimId: claim.id,
                          circleId: encodeCircleId(
                            claim.distribution.epoch.circle?.id
                          ),
                          vault: claim.distribution.vault,
                          merkleIndex: BigNumber.from(claim.index),
                          address: address as string,
                          amount: BigNumber.from(claim.amount).mul(
                            BigNumber.from(10).pow(
                              claim.distribution.vault.decimals
                            )
                          ),
                          proof: claim.proof.split(','),
                          distributionEpochId: BigNumber.from(
                            claim.distribution.distribution_epoch_id
                          ),
                        });
                      }}
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
    </Box>
  );
}
