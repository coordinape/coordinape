import { useState, useEffect } from 'react';

import { BigNumber } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { CSS } from 'stitches.config';

import { useBlockListener } from 'hooks/useBlockListener';
import { useContracts } from 'hooks/useContracts';
import { paths } from 'routes/paths';
import { AppLink, Box, Button, Panel, Text } from 'ui';

import DepositModal, { DepositModalProps } from './DepositModal';
import { dummyTableData, TransactionTable } from './VaultTransactions';
import WithdrawModal, { WithdrawModalProps } from './WithdrawModal';

export function VaultRow({
  vault,
  css = {},
}: {
  vault: GraphQLTypes['vaults'];
  css?: CSS;
}) {
  const [modal, setModal] = useState<ModalLabel>('');
  const [userIsOwner, setUserIsOwner] = useState<boolean>(false);
  const [balance, setBalance] = useState(0);
  const closeModal = () => setModal('');
  const contracts = useContracts();

  const updateBalance = () =>
    contracts
      ?.getVault(vault.vault_address)
      .underlyingValue()
      .then(x => {
        setBalance(x.div(BigNumber.from(10).pow(vault.decimals)).toNumber());
      });

  useBlockListener(updateBalance, [vault.id]);

  useEffect(() => {
    const updateOwner = async () => {
      const currentVault = contracts?.getVault(vault.vault_address);
      if (!currentVault || !contracts) {
        setUserIsOwner(false);
        return;
      }
      const [ownerAddress, userAddress] = await Promise.all([
        currentVault.owner(),
        contracts.getMyAddress(),
      ]);
      setUserIsOwner(ownerAddress.toLowerCase() === userAddress.toLowerCase());
    };
    updateOwner();
  }, [contracts, vault.id]);

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
        css={{ display: 'flex', alignItems: 'center', gap: '$md', mb: '$md' }}
      >
        <Text h3 css={{ flexGrow: 1 }}>
          {vault.symbol || '...'} CoVault
        </Text>
        <Button
          color="primary"
          outlined
          size="small"
          onClick={() => setModal('deposit')}
        >
          Deposit
        </Button>
        {userIsOwner && (
          <Button
            color="primary"
            outlined
            size="small"
            onClick={() => setModal('withdraw')}
          >
            Withdraw
          </Button>
        )}
      </Box>
      <Box
        css={{
          width: '100%',
          padding: '$md',
          backgroundColor: '$white',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 2fr',
          gridGap: '$md',
          verticalAlign: 'middle',
        }}
      >
        <Text font="source" h3>
          Current Balance
        </Text>
        <Text font="source" h3>
          {balance} {vault.symbol?.toUpperCase()}
        </Text>
        <Text font="source">
          <strong>5</strong>&nbsp;Distributions -&nbsp;<strong>255</strong>
          &nbsp;Unique Contributors Paid
        </Text>
      </Box>
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
        <TransactionTable rows={dummyTableData} />

        <Box css={{ textAlign: 'center', mt: '$md' }}>
          <AppLink
            css={{ color: '$secondaryText' }}
            to={paths.vaultTxs(vault.vault_address)}
          >
            View All Transactions
          </AppLink>
        </Box>
      </Box>
    </Panel>
  );
}

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
