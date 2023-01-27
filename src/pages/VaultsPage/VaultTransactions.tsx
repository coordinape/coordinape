import assert from 'assert';
import { useEffect, useState } from 'react';

import { TypedEventFilter } from '@coordinape/hardhat/dist/typechain/commons';
import { DebugLogger } from 'common-lib/log';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import {
  decodeCircleId,
  getDisplayTokenString,
  hasSimpleToken,
} from 'lib/vaults';
import { Contracts } from 'lib/vaults/contracts';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { makeTable } from '../../components';
import { LoadingModal } from 'components/LoadingModal';
import { useContracts } from 'hooks';
import { Link, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { numberWithCommas } from 'utils';
import { makeExplorerUrl } from 'utils/provider';

import { OwnerProfileLink, VaultExternalLink } from './components';
import { getVaultAndTransactions } from './queries';

import { Awaited } from 'types/shim';

const logger = new DebugLogger('VaultTransactions');

type VaultAndTransactions = Awaited<ReturnType<typeof getVaultAndTransactions>>;

// TODO: type guard the VaultTxList or make circle optional???
// TODO: figure out how to test

export const VaultTransactions = () => {
  const { address } = useParams();
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const {
    isLoading,
    isIdle,
    data: vault,
  } = useQuery(['vault', address], async () => {
    const result = await getVaultAndTransactions(address);
    return result;
  });

  const { data: vaultTxList } = useOnChainTransactions(vault);
  const contracts = useContracts();

  useEffect(() => {
    const updateOwner = async () => {
      if (vault) {
        const currentVault = contracts?.getVault(vault.vault_address);
        const ownerAddress = await currentVault?.owner();
        if (ownerAddress) setOwnerAddress(ownerAddress.toLowerCase());
      }
    };
    updateOwner();
  }, [contracts, vault]);

  if (!vaultTxList || !vault) {
    // TODO
    if (!isLoading && !isIdle)
      return <SingleColumnLayout>404</SingleColumnLayout>;
    return <LoadingModal visible />;
  }

  return (
    <SingleColumnLayout>
      <Panel>
        <Text h2>
          All Transactions for {getDisplayTokenString(vault)} Vault
          <VaultExternalLink
            chainId={vault.chain_id}
            vaultAddress={vault.vault_address}
          />
        </Text>
        <OwnerProfileLink ownerAddress={ownerAddress}></OwnerProfileLink>
        {/* @ts-ignore */}
        <TransactionTable chainId={vault.chain_id} rows={vaultTxList} />
      </Panel>
    </SingleColumnLayout>
  );
};

export const QUERY_KEY_VAULT_TXS = 'vault-txs';

export function useOnChainTransactions(
  vault: VaultAndTransactions | undefined
) {
  const contracts = useContracts();
  return useQuery(
    [QUERY_KEY_VAULT_TXS, vault?.id],
    async () => {
      assert(contracts && vault);
      return getOnchainVaultTransactions(vault, contracts);
    },
    {
      placeholderData: [],
      enabled: !!(contracts && vault),
      staleTime: Infinity,
    }
  );
}

export async function getOnchainVaultTransactions(
  vault: VaultAndTransactions,
  contracts: Contracts
) {
  const { chain_id } = vault;
  assert(
    chain_id.toString() === contracts.chainId,
    'chain id of vault and provider do not match'
  );
  logger.log('getOnchainVaultTransactions');
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

interface RawTransaction {
  block: number;
  date: string;
  type: string;
  details: string;
  amount: string | number;
  hash: string;
}

async function getDepositEvents(
  contracts: Contracts,
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
  const isSimpleToken = hasSimpleToken({ simple_token_address });
  const token = isSimpleToken
    ? (simple_token_address as string)
    : token_address;
  const erc20Contract = contracts.getERC20(token);
  const depositFilter = isSimpleToken
    ? erc20Contract.filters.Transfer(null, vault_address)
    : contracts.router.filters.DepositInVault(vault_address);
  const eventsContract = isSimpleToken ? erc20Contract : contracts.router;
  const depositEvents = await eventsContract.queryFilter(
    depositFilter,
    deployment_block
  );
  logger.log(
    `${vault_address.substring(0, 6)}: deposit events: ${depositEvents.length}`
  );

  const tokenFilter = erc20Contract.filters.Transfer(
    null,
    contracts.router.address
  );
  const deposits: RawTransaction[] = [];
  for (const event of depositEvents) {
    let transferEvent;
    if (!isSimpleToken) {
      const tokenTransferEvents = await erc20Contract.queryFilter(
        tokenFilter,
        event.blockNumber,
        event.blockNumber
      );
      transferEvent = tokenTransferEvents.find(
        e => e.transactionHash === event.transactionHash
      );
      if (!transferEvent) continue;
    } else {
      transferEvent = event;
    }

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
        amount: formatUnits(transferEvent.args.value, decimals),
        details: `By ${
          (txDetails.profile.name ?? user?.name) || transferEvent.args.from
        }`,
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
  contracts: Contracts,
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
  const isSimpleToken = hasSimpleToken({ simple_token_address });
  const token = isSimpleToken
    ? (simple_token_address as string)
    : token_address;
  const erc20Contract = contracts.getERC20(token);
  const withdrawFilter: TypedEventFilter<
    [string, string, BigNumber],
    { vault: string; token: string; amount: BigNumber }
  > = isSimpleToken
    ? erc20Contract.filters.Transfer(vault_address)
    : contracts.router.filters.WithdrawFromVault();
  const eventsContract = isSimpleToken ? erc20Contract : contracts.router;
  const allWithdrawEvents = await eventsContract.queryFilter(
    withdrawFilter,
    deployment_block
  );
  const eventTxInfo = await Promise.all(
    allWithdrawEvents.map(e => e.getTransactionReceipt())
  );
  const withdrawEvents = allWithdrawEvents.filter(
    (_, idx) => eventTxInfo[idx].to.toLowerCase() === vault_address
  );
  logger.log(
    `${vault_address.substring(0, 6)}: withdraw events: ${
      withdrawEvents.length
    }`
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
        details: `By ${
          (txDetails.profile.name ?? user?.name) || transferEvent.args.from
        }`,
        amount: formatUnits(transferEvent.args.value, decimals),
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
  contracts: Contracts,
  { vault_address, deployment_block, vault_transactions }: VaultAndTransactions
): Promise<RawDistributionTx[]> {
  const distroFilter = contracts.distributor.filters.EpochFunded(vault_address);
  const distroEvents = await contracts.distributor.queryFilter(
    distroFilter,
    deployment_block
  );
  logger.log(
    `${vault_address.substring(0, 6)}: distro events: ${distroEvents.length}`
  );

  const distributions: RawDistributionTx[] = [];
  for (const event of distroEvents) {
    const block = await event.getBlock();
    const txDetails = vault_transactions.find(
      tx => tx.tx_hash === event.transactionHash
    );
    if (txDetails?.tx_type === 'Distribution') {
      const distribution = txDetails.distribution;
      if (!distribution) {
        console.warn(`Missing distribution for tx ${txDetails.tx_hash}`);
        continue;
      }
      const { epoch, fixed_amount, gift_amount } = distribution;
      distributions.push({
        block: event.blockNumber,
        type: 'Distribution',
        circle: epoch.circle?.name || 'unknown',
        amount: fixed_amount + gift_amount,
        details: `Distribution for Epoch ${epoch.number}`,
        date: DateTime.fromSeconds(block.timestamp).toFormat('DD'),
        hash: event.transactionHash,
        circleId: decodeCircleId(event.args.circle),
      });
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

const TransactionTableLayout = makeTable<RawDistributionTx>('TransactionTable');

const styles = {
  alignRight: { textAlign: 'right' },
};

export const TransactionTable = ({
  rows,
  chainId,
}: {
  rows: RawDistributionTx[];
  chainId: number;
}) => (
  <TransactionTableLayout
    headers={[
      { title: 'Date' },
      { title: 'Circle' },
      { title: 'Type' },
      { title: 'Details' },
      { title: 'Amount', css: styles.alignRight },
      { title: 'Transaction', css: styles.alignRight },
    ]}
    data={rows}
    startingSortIndex={0}
    startingSortDesc={true}
    sortByColumn={() => {
      return c => c;
    }}
  >
    {row => (
      <tr key={row.hash}>
        <td>{row.date}</td>
        <td>{row.circle}</td>
        <td>{row.type}</td>
        <td>{row.details}</td>
        <td className="alignRight">{numberWithCommas(row.amount, 2)}</td>
        <td className="alignRight">
          <Link target="_blank" href={makeExplorerUrl(chainId, row.hash)}>
            View on Etherscan
          </Link>
        </td>
      </tr>
    )}
  </TransactionTableLayout>
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
