import { useState } from 'react';

import { BigNumber } from 'ethers';

import { useBlockListener } from 'hooks/useBlockListener';
import { useContracts } from 'hooks/useContracts';
import { Box, Button, Text } from 'ui';

import AllocateModal from './AllocateModal';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

import { IVault } from 'types';

type ModalLabel = '' | 'deposit' | 'withdraw' | 'allocate' | 'edit';

export default function VaultRow({ vault }: { vault: IVault }) {
  const [modal, setModal] = useState<ModalLabel>('');
  const [balance, setBalance] = useState(0);
  const closeModal = () => setModal('');
  const contracts = useContracts();

  const updateBalance = () =>
    contracts
      ?.getVault(vault.id)
      .underlyingValue()
      .then(x => {
        setBalance(x.div(BigNumber.from(10).pow(vault.decimals)).toNumber());
      });

  useBlockListener(updateBalance, [vault.id]);

  return (
    <Box
      css={{
        background: '$surfaceGray',
        padding: '$lg',
        borderRadius: '$2',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {modal === 'allocate' ? (
        <AllocateModal onClose={closeModal} />
      ) : modal === 'withdraw' ? (
        <WithdrawModal onClose={closeModal} />
      ) : modal === 'deposit' ? (
        <DepositModal
          vault={vault}
          onClose={closeModal}
          onDeposit={updateBalance}
        />
      ) : null}
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '$md',
          mb: '$md',
        }}
      >
        <Text
          css={{
            fontSize: '$7',
            fontWeight: '$semibold',
            color: '$primary',
            flexGrow: 1,
          }}
        >
          {vault.type.toUpperCase()} Vault
        </Text>
        <Button color="red" size="small" onClick={() => setModal('deposit')}>
          Deposit
        </Button>
        <Button color="red" size="small" onClick={() => setModal('withdraw')}>
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
        <Box
          css={{
            fontSize: '$7',
            fontWeight: '$semibold',
            color: '$primary',
          }}
        >
          Current Balance
        </Box>
        <Text>
          {balance} {vault.type.toUpperCase()}
        </Text>
        <span></span>
        <Box css={{ fontSize: '$7', color: '$primary' }}>
          Funds After Commitment
        </Box>
        <Text>-1 {vault.type.toUpperCase()}</Text>
      </Box>
    </Box>
  );
}
