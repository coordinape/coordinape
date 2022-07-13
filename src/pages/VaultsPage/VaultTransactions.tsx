import { ContractsReadonly } from 'common-lib/contracts';
import { BigNumber } from 'ethers';
import { decodeCircleId } from 'lib/vaults';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { styled } from 'stitches.config';

import { LoadingModal } from 'components/LoadingModal/LoadingModal';
import { Link, Panel, Text } from 'ui';
import { OrgLayout, SingleColumnLayout } from 'ui/layouts';
import { getProviderForChain } from 'utils/provider';

import { getVaultAndTransactions } from './queries';

import { Awaited } from 'types/shim';

type VaultAndTransactions = Awaited<ReturnType<typeof getVaultAndTransactions>>;

export const VaultTransactions = () => {
  const { address } = useParams();
  const {
    isLoading,
    isIdle,
    data: vault,
  } = useQuery(['vault', address], async () => {
    const result = await getVaultAndTransactions(address);
    return result;
  });

  const { data: vaultTxList } = useOnChainTransactions(vault);

  if (!vaultTxList || !vault) {
    // TODO
    if (!isLoading && !isIdle)
      return <SingleColumnLayout>404</SingleColumnLayout>;
    return <LoadingModal visible />;
  }

  return (
    <OrgLayout name={vault.protocol.name}>
      <Panel>
        <Text h2 css={{ mb: '$md' }}>
          All Transactions for {vault?.symbol?.toUpperCase()} Vault
        </Text>
        <TransactionTable rows={vaultTxList} />
      </Panel>
    </OrgLayout>
  );
};

export function useOnChainTransactions(
  vault: VaultAndTransactions | undefined
) {
  return useQuery(
    ['vault-txs', vault?.id],
    async () => (vault ? getOnchainVaultTransactions(vault) : []),
    { initialData: [] }
  );
}

export async function getOnchainVaultTransactions(vault: VaultAndTransactions) {
  const { chain_id } = vault;
  const provider = getProviderForChain(chain_id);
  const contracts = new ContractsReadonly(chain_id, provider);
  const eventResults = await Promise.all([
    getDepositEvents(contracts, vault),
    getWithdrawEvents(contracts, vault),
    getDistributionEvents(contracts, vault),
  ]);
  const txs = eventResults.flat();
  // there are more efficient ways to sort the list since we can assume
  // each event-specific query returns results in ascending order by block
  // number
  txs.sort((a, b) => b.block - a.block);
  return txs;
}

//TODO Get unwrapped value of amounts
interface RawTransaction {
  block: number;
  date: string;
  type: string;
  details: string;
  amount: BigNumber;
  hash: string;
}
async function getDepositEvents(
  contracts: ContractsReadonly,
  {
    vault_address,
    deployment_block,
    token_address,
    simple_token_address,
    vault_transactions,
    decimals,
  }: VaultAndTransactions
): Promise<RawTransaction[]> {
  if (!(token_address || simple_token_address)) return [];
  const token = token_address || (simple_token_address as string);
  const depositFilter = contracts.router.filters.DepositInVault(vault_address);
  const depositEvents = await contracts.router.queryFilter(
    depositFilter,
    deployment_block
  );
  const erc20Contract = contracts.getERC20(token);
  const tokenFilter = erc20Contract.filters.Transfer(
    null,
    contracts.router.address
  );

  const deposits: RawTransaction[] = [];
  for (const event of depositEvents) {
    const tokenTransferEvents = await erc20Contract.queryFilter(
      tokenFilter,
      event.blockNumber,
      event.blockNumber
    );
    const transferEvent = tokenTransferEvents.find(
      e => e.transactionHash === event.transactionHash
    );
    if (!transferEvent) continue;
    const block = await event.getBlock();
    // might want to convert the tx list to a Record store keyed on txHashes
    // before lookups
    const txDetails = vault_transactions.find(
      tx => tx.tx_hash === event.transactionHash
    );
    if (
      txDetails?.tx_type === 'Deposit' &&
      txDetails.profile?.address === transferEvent.args.from.toLowerCase()
    ) {
      const user = txDetails.profile.users.pop();
      deposits.push({
        block: event.blockNumber,
        type: 'Deposit',
        amount: transferEvent.args.value.div(BigNumber.from(10).pow(decimals)),
        details: `By ${user?.name || transferEvent.args.from}`,
        date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
        hash: event.transactionHash,
      });
      continue;
    }
    /* log deposit from outide app
    deposits.push({
      block: event.blockNumber,
      type: 'Deposit',
      amount: event.args.amount.div(BigNumber.from(10).pow(decimals)),
      details: `By ${transferEvent.args.from}`,
      date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
      hash: event.transactionHash,
    });
    */
  }
  return deposits;
}

// These functions are not very DRY yet, but given how different the
// event patterns are for each tx, this isn't a trivial refactor
async function getWithdrawEvents(
  contracts: ContractsReadonly,
  {
    vault_address,
    deployment_block,
    token_address,
    simple_token_address,
    vault_transactions,
    decimals,
  }: VaultAndTransactions
): Promise<RawTransaction[]> {
  if (!(token_address || simple_token_address)) return [];
  const token = token_address || (simple_token_address as string);
  const withdrawFilter = contracts.router.filters.WithdrawFromVault();
  const allWithdrawEvents = await contracts.router.queryFilter(
    withdrawFilter,
    deployment_block
  );
  const eventTxInfo = await Promise.all(
    allWithdrawEvents.map(e => e.getTransactionReceipt())
  );
  const erc20Contract = contracts.getERC20(token);
  const withdrawEvents = allWithdrawEvents.filter(
    (_, idx) => eventTxInfo[idx].to.toLowerCase() === vault_address
  );

  const withdraws: RawTransaction[] = [];
  for (const event of withdrawEvents) {
    const tokenFilter = erc20Contract.filters.Transfer(event.args.vault);
    const tokenTransferEvents = await erc20Contract.queryFilter(
      tokenFilter,
      event.blockNumber,
      event.blockNumber
    );
    const transferEvent = tokenTransferEvents.find(
      e => e.transactionHash === event.transactionHash
    );
    if (!transferEvent) continue;
    const block = await event.getBlock();
    const txDetails = vault_transactions.find(
      tx => tx.tx_hash === event.transactionHash
    );
    if (
      txDetails?.tx_type === 'Withdraw' &&
      txDetails.profile?.address === transferEvent.args.to.toLowerCase()
    ) {
      const user = txDetails.profile.users.pop();
      withdraws.push({
        block: event.blockNumber,
        type: 'Withdraw',
        details: `By ${user?.name || transferEvent.args.from}`,
        amount: transferEvent.args.value.div(BigNumber.from(10).pow(decimals)),
        date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
        hash: event.transactionHash,
      });
      continue;
    }
    /* log from outside app
    withdraws.push({
      block: event.blockNumber,
      type: 'Withdraw',
      details: `By ${transferEvent.args.from}`,
      amount: event.args.amount.div(BigNumber.from(10).pow(decimals)),
      date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
      hash: event.transactionHash,
    });
    */
  }
  return withdraws;
}

interface RawDistributionTx extends RawTransaction {
  circleId: number;
  circle: string;
}
async function getDistributionEvents(
  contracts: ContractsReadonly,
  { vault_address, deployment_block, vault_transactions }: VaultAndTransactions
): Promise<RawDistributionTx[]> {
  const distroFilter = contracts.distributor.filters.EpochFunded(vault_address);
  const distroEvents = await contracts.distributor.queryFilter(
    distroFilter,
    deployment_block
  );

  const distributions: RawDistributionTx[] = [];
  for (const event of distroEvents) {
    const block = await event.getBlock();
    const txDetails = vault_transactions.find(
      tx => tx.tx_hash === event.transactionHash
    );
    if (txDetails?.tx_type === 'Distribution') {
      const distribution = txDetails.distribution;
      const epoch = distribution?.epoch;
      if (!epoch) throw new Error(`Missing epoch for tx ${txDetails.tx_hash}`);
      distributions.push({
        block: event.blockNumber,
        type: 'Distribution',
        circle: txDetails.distribution?.epoch?.circle?.name || 'unknown',
        amount: BigNumber.from(distribution.fixed_amount || 0).add(
          BigNumber.from(distribution.gift_amount || 0)
        ),
        details: `Distribution for Epoch ${epoch.number}`,
        date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
        hash: event.transactionHash,
        circleId: decodeCircleId(event.args.circle),
      });
      continue;
    }
    /* log from outside app
    distributions.push({
      block: event.blockNumber,
      type: 'Distribution',
      amount: event.args.amount.div(BigNumber.from(10).pow(decimals)),
      date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
      hash: event.transactionHash,
      circle: circleName,
      circleId: decodeCircleId(event.args.circle),
      details: 'Distribution for epoch ' + event.args.epochId.toNumber(),
    });
    */
  }
  return distributions;
}

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
          <td>{row.amount.toString()}</td>
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
