import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { allVaultFields } from 'lib/gql/mutations';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { styled } from 'stitches.config';

import { Link, Panel, Text } from 'ui';
import { OrgLayout, SingleColumnLayout } from 'ui/layouts';

export const VaultTransactions = () => {
  const { address } = useParams();
  const { isLoading, isIdle, data } = useQuery(['vault', address], async () => {
    const result = await client.query(
      {
        vaults: [
          { where: { vault_address: { _eq: address } } },
          {
            ...allVaultFields,
            vault_transactions: [
              { order_by: [{ id: order_by.asc }] },
              {
                tx_hash: true,
                tx_type: true,
                created_at: true,
                profile: {
                  address: true,
                  users: [{}, { circle_id: true, name: true }],
                },
                distribution: {
                  epoch: { start_date: true, end_date: true, number: true },
                },
              },
            ],
            protocol: {
              name: true,
            },
          },
        ],
      },
      { operationName: 'getVault' }
    );
    result.vaults[0].vault_transactions[0];
    return result;
  });

  const vault = data?.vaults[0];

  if (!vault && !isLoading && !isIdle) {
    // TODO
    return <SingleColumnLayout>404</SingleColumnLayout>;
  }

  return (
    <OrgLayout name={data?.vaults[0].protocol.name}>
      <Panel>
        <Text h2 css={{ mb: '$md' }}>
          All Transactions for {vault?.symbol?.toUpperCase()} Vault
        </Text>
        <TransactionTable
          rows={[
            ...dummyTableData,
            ...dummyTableData.map(r => ({
              ...r,
              hash: r.hash.replace('a', 'b'),
            })),
            ...dummyTableData.map(r => ({
              ...r,
              hash: r.hash.replace('a', 'c'),
            })),
          ]}
        />
      </Panel>
    </OrgLayout>
  );
};

const Table = styled('table', {});

export const TransactionTable = ({ rows }: { rows: any[] }) => (
  <Table
    css={{
      width: '100%',
      borderSpacing: 0,
      fontFamily: 'Inter',
      th: {
        textAlign: 'left',
        color: '$secondaryText',
        textTransform: 'uppercase',
        fontSize: '$small',
        pb: '$sm',
        pl: '$sm',
      },
      tbody: { backgroundColor: '$white' },
      tr: {
        borderTop: '1px solid $border',
      },
      td: {
        padding: '$sm',
        color: '$text',
      },
    }}
  >
    <thead>
      <tr>
        <th>Date</th>
        <th>Circle</th>
        <th>Type</th>
        <th>Details</th>
        <th>Amount</th>
        <th>Transaction</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(row => (
        <tr key={row.hash}>
          <td>{row.date}</td>
          <td>{row.circle}</td>
          <td>{row.type}</td>
          <td>{row.details}</td>
          <td>{row.amount}</td>
          <td>
            <Link href={`https://etherscan.io/tx/${row.hash}`}>Etherscan</Link>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export const dummyTableData = [
  {
    date: 'Jan 14, 2022',
    circle: 'CoreDev',
    type: 'Budget Committed',
    details: 'Cycle: December 2022',
    amount: '50,000',
    hash: '0x54d11f37a2408b6968770696399cbcece3eaf45f80e92cf4ed77110e8fb31c1e',
  },
  {
    date: 'Jan 13, 2022',
    circle: 'Marketing',
    type: 'Distribution',
    details: 'Something goes here',
    amount: '20,000',
    hash: '0xb48e9b287ae05acce3f2f5ad6b4cf5eb390cab20b17500cffc44bf85baa23883',
  },
  {
    date: 'Jan 12, 2022',
    type: 'Deposit',
    details: 'By Alxx',
    amount: '20,000',
    hash: '0x9fae15349756b3338b240e1e6d96956dd1d7b7c625ffa708a35f2b28edfffcde',
  },
];
