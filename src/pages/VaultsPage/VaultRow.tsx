import { useState, useEffect, useRef } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { vault_tx_types_enum } from 'lib/gql/__generated__/zeus';
import { removeYearnPrefix } from 'lib/vaults';
import { CSS } from 'stitches.config';

import type { Vault } from 'hooks/gql/useVaults';
import { useBlockListener } from 'hooks/useBlockListener';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useContracts } from 'hooks/useContracts';
import { paths } from 'routes/paths';
import { AppLink, Box, Button, Panel, Text } from 'ui';
import { smartRounding } from 'utils';

import { OwnerProfileLink, VaultExternalLink } from './components';
import DepositModal, { DepositModalProps } from './DepositModal';
import { TransactionTable, useOnChainTransactions } from './VaultTransactions';
import WithdrawModal, { WithdrawModalProps } from './WithdrawModal';

export function VaultRow({
  vault,
  css = {},
  showRecentTransactions = true,
}: {
  vault: Vault;
  css?: CSS;
  showRecentTransactions?: boolean;
}) {
  const myAddress = useConnectedAddress();
  const [modal, setModal] = useState<ModalLabel>('');
  const [userIsOwner, setUserIsOwner] = useState<boolean>(false);
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [balance, setBalance] = useState(0);
  const closeModal = () => setModal('');
  const contracts = useContracts();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const updateBalance = () =>
    contracts?.getVaultBalance(vault).then(x => {
      if (!mounted.current) return;
      setBalance(Number(formatUnits(x, vault.decimals).toString()));
    });

  useBlockListener(updateBalance, [vault.id]);
  // for UI updates when the user is switching between orgs quickly
  useEffect(() => {
    updateBalance();
  }, [vault.id]);

  useEffect(() => {
    const updateOwner = async () => {
      const currentVault = contracts?.getVault(vault.vault_address);
      if (!currentVault || !contracts) {
        setUserIsOwner(false);
        return;
      }
      const ownerAddress = await currentVault.owner();
      if (!mounted.current) return;
      setOwnerAddress(ownerAddress.toLowerCase());
      setUserIsOwner(ownerAddress.toLowerCase() === myAddress?.toLowerCase());
    };
    updateOwner();
  }, [myAddress, contracts, vault.id]);

  const distributionCount = getDistributions(vault).length;
  const uniqueContributors = getUniqueContributors(vault);

  return (
    <Panel css={css}>
      <VaultModal
        modal={modal}
        onClose={closeModal}
        vault={vault}
        balance={balance}
        onUpdateBalance={updateBalance}
      />
      <Box
        css={{ display: 'flex', alignItems: 'center', gap: '$md', mb: '$xs' }}
      >
        <Text h3 css={{ flexGrow: 1 }}>
          {vault.symbol || '...'} CoVault
          <VaultExternalLink
            chainId={vault.chain_id}
            vaultAddress={vault.vault_address}
          />
        </Text>

        {userIsOwner && (
          <>
            <Button
              color="primary"
              outlined
              size="small"
              onClick={() => setModal('deposit')}
            >
              Deposit
            </Button>
            <Button
              color="primary"
              outlined
              size="small"
              onClick={() => setModal('withdraw')}
            >
              Withdraw
            </Button>
          </>
        )}
      </Box>
      <OwnerProfileLink ownerAddress={ownerAddress} />
      <Box
        css={{
          width: '100%',
          padding: '$md',
          marginTop: '$md',
          backgroundColor: '$white',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 2fr',
          gridGap: '$md',
          alignItems: 'center',
        }}
      >
        <Text h3>Current Balance</Text>
        <Text h3>
          {smartRounding(balance)}{' '}
          {removeYearnPrefix(vault.symbol).toUpperCase()}
        </Text>
        <Text css={{ display: 'block' }}>
          <strong>{distributionCount}</strong> Distribution
          {distributionCount !== 1 && 's'} -{' '}
          <strong>{uniqueContributors}</strong> Unique Contributors Paid
        </Text>
      </Box>
      {showRecentTransactions && <RecentTransactions vault={vault} />}
    </Panel>
  );
}

const RecentTransactions = ({ vault }: { vault: Vault }) => {
  const { data: vaultTxList, isFetching } = useOnChainTransactions(vault);

  return (
    <>
      <Text
        css={{
          color: '$secondaryText',
          fontSize: '$large',
          marginTop: '$lg',
          marginBottom: '$md',
        }}
      >
        Recent Transactions
      </Text>
      <Box>
        {isFetching ? (
          'Loading...'
        ) : vaultTxList?.length ? (
          <TransactionTable
            chainId={vault.chain_id}
            rows={vaultTxList.slice(0, 3)}
          />
        ) : (
          'No Transactions Yet'
        )}

        {!!vaultTxList?.length && (
          <Box css={{ textAlign: 'center', mt: '$md' }}>
            <AppLink
              css={{ color: '$secondaryText' }}
              to={paths.vaultTxs(vault.vault_address)}
            >
              View All Transactions
            </AppLink>
          </Box>
        )}
      </Box>
    </>
  );
};

const getDistributions = (vault: Vault) => {
  return vault.vault_transactions.filter(
    t => t.tx_type === vault_tx_types_enum.Distribution
  );
};

const getUniqueContributors = (vault: Vault): number =>
  new Set(
    getDistributions(vault).flatMap(d =>
      d.distribution?.claims.map(c => c.profile_id)
    )
  ).size;

type ModalLabel = '' | 'deposit' | 'withdraw' | 'allocate' | 'edit';

type ModalProps =
  | { modal: ModalLabel; onUpdateBalance: () => void } & Omit<
      DepositModalProps,
      'onDeposit'
    > &
      Omit<WithdrawModalProps, 'onWithdraw'>;

function VaultModal<T extends ModalProps>(props: T) {
  switch (props.modal) {
    case 'deposit':
      return (
        <DepositModal
          vault={props.vault}
          onClose={props.onClose}
          onDeposit={props.onUpdateBalance}
        />
      );
    case 'withdraw':
      return (
        <WithdrawModal
          vault={props.vault}
          onClose={props.onClose}
          onWithdraw={props.onUpdateBalance}
          balance={props.balance}
        />
      );
    default:
      return <></>;
  }
}
