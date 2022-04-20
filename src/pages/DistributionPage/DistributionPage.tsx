import assert from 'assert';

import { client } from 'lib/gql/client';
import { Contracts } from 'lib/vaults';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { styled } from 'stitches.config';

import { LoadingModal, NewApeAvatar } from 'components';
import { useContracts } from 'hooks';
import { Box, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { shortenAddress } from 'utils';
import { assertDef } from 'utils/tools';

const getDistributionData = async (
  id: number,
  contracts: Contracts | undefined
) => {
  assert(contracts);

  const gq = await client.query({
    distributions_by_pk: [
      { id },
      {
        created_at: true,
        total_amount: true,
        vault: {
          id: true,
          decimals: true,
          symbol: true,
          vault_address: true,
        },
        epoch: {
          number: true,
          circle: {
            id: true,
            name: true,
          },
        },
        claims: [
          {},
          {
            id: true,
            new_amount: true,
            user: {
              address: true,
              name: true,
              profile: {
                avatar: true,
              },
            },
          },
        ],
      },
    ],
  });

  const dist = assertDef(gq.distributions_by_pk, 'Distribution not found');

  return {
    ...dist,
    pricePerShare: await contracts.getPricePerShare(
      dist.vault.vault_address,
      dist.vault.symbol,
      dist.vault.decimals
    ),
  };
};

const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$3',
  tr: {
    borderBottom: '0.5px solid $lightBackground',
  },
  'thead tr': {
    backgroundColor: '$subtleGray',
    height: '$2xl',
    color: '$text',
  },
  'th, td': {
    textAlign: 'center',
    fontWeight: 'normal',
  },
  'th:first-child, td:first-child': {
    textAlign: 'left',
    paddingLeft: '$md',
  },
  'tbody tr': {
    backgroundColor: '$white',
    height: '$2xl',
  },
});

export const DistributionPage = () => {
  const { id } = useParams();
  const contracts = useContracts();
  const {
    isLoading,
    isError,
    error,
    data: dist,
  } = useQuery(
    ['distribution', id],
    () => getDistributionData(Number(id), contracts),
    { enabled: !!contracts, retry: false }
  );

  // FIXME if you came in directly through the page's URL, you might have the
  // wrong selected circle ID now...
  // const selectedCircleId = useRecoilValueLoadable(rSelectedCircleId);
  // useEffect(() => {
  //   const correctCircleId = dist?.epoch.circle?.id;
  //   if (!correctCircleId) return;
  // }, [dist, selectedCircleId]);

  if (isLoading) return <LoadingModal visible />;

  if (isError)
    return <SingleColumnLayout>{(error as any).message}</SingleColumnLayout>;

  const convertAmount = (x: number) =>
    (x * assertDef(dist).pricePerShare).toFixed(2);

  const symbol = dist?.vault.symbol;
  const date = dist?.created_at
    ? DateTime.fromISO(dist.created_at).toFormat('MMMM d, yyyy')
    : null;

  return (
    <SingleColumnLayout>
      <Panel>
        <Text variant="sectionHeader" css={{ mb: '$md' }}>
          {symbol} distribution on {date}
        </Text>
        <Text css={{ mb: '$lg' }}>
          For Epoch {dist?.epoch.number} in {dist?.epoch.circle?.name}
        </Text>

        {dist && (
          <Box
            css={{
              boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
              borderRadius: '$3',
              overflow: 'hidden',
            }}
          >
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ETH Address</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dist.claims.map(claim => (
                  <tr key={claim.id}>
                    <td>
                      <Box
                        css={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '$sm',
                        }}
                      >
                        <NewApeAvatar
                          name={claim.user.name}
                          path={claim.user.profile?.avatar}
                          style={{ height: '32px', width: '32px' }}
                        />
                        {claim.user.name}
                      </Box>
                    </td>
                    <td>{shortenAddress(claim.user.address)}</td>
                    <td>
                      {convertAmount(claim.new_amount)} {dist.vault.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        )}
      </Panel>
    </SingleColumnLayout>
  );
};
