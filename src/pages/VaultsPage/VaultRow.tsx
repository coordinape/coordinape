import { useState } from 'react';

import { BigNumber } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { CSS } from 'stitches.config';

import { useBlockListener } from 'hooks/useBlockListener';
import { useContracts } from 'hooks/useContracts';
import { paths } from 'routes/paths';
import { AppLink, Box, Button, Panel, Text } from 'ui';

import DepositModal from './DepositModal';
import { dummyTableData, TransactionTable } from './VaultTransactions';

type ModalLabel = '' | 'deposit' | 'withdraw' | 'allocate' | 'edit';

export function VaultRow({
  vault,
  css = {},
}: {
  vault: GraphQLTypes['vaults'];
  css?: CSS;
}) {
  const [modal, setModal] = useState<ModalLabel>('');
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

  return (
    <Panel css={css}>
      {modal === 'deposit' ? (
        <DepositModal
          vault={vault}
          onClose={closeModal}
          onDeposit={updateBalance}
        />
      ) : null}
      <Box
        css={{ display: 'flex', alignItems: 'center', gap: '$md', mb: '$md' }}
      >
        <Text h3 css={{ flexGrow: 1 }}>
          {vault.symbol || '...'} Vault
        </Text>
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
          onClick={() => alert('TODO')}
        >
          Withdraw
        </Button>
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
