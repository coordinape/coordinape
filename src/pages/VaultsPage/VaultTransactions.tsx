import { useParams } from 'react-router-dom';
import { styled } from 'stitches.config';

import { useCurrentOrg } from 'hooks/gql';
import { useVaults } from 'recoilState/vaults';
import { Link, Panel, Text } from 'ui';
import { OrgLayout } from 'ui/layouts';

export const VaultTransactions = () => {
  const { id } = useParams();

  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);
  const vault = vaults.find(v => v.id === id);

  if (!vault) {
    // TODO
    return <>404</>;
  }

  return (
    <OrgLayout>
      <Panel>
        <Text
          css={{
            fontSize: '$8',
            fontWeight: '$bold',
            mb: '$lg',
            display: 'block',
            textAlign: 'center',
          }}
        >
          All Transactions for {vault.type.toUpperCase()} Vault
        </Text>
        <TransactionTable
          rows={[...dummyTableData, ...dummyTableData, ...dummyTableData]}
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
        color: '$gray400',
        textTransform: 'uppercase',
        fontSize: '$3',
        pb: '$sm',
        pl: '$sm',
      },
      tbody: { backgroundColor: '$almostWhite' },
      tr: {
        borderTop: '1px solid $gray400',
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
