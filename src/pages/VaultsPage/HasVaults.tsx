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

export default function HasVaults({ vault }: { vault: IVault }) {
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
        alignItems: 'center',
        gap: '$md',
      }}
    >
      {modal === 'allocate' ? (
        <AllocateModal onClose={closeModal} />
      ) : modal === 'withdraw' ? (
        <WithdrawModal vault={vault} onClose={closeModal} />
      ) : modal === 'deposit' ? (
        <DepositModal
          vault={vault}
          onClose={closeModal}
          onDeposit={updateBalance}
        />
      ) : null}
      <Text
        css={{ fontSize: '$7', fontWeight: '$semibold', color: '$primary' }}
      >
        {vault.type.toUpperCase()} Vault
      </Text>
      <Button color="red" size="small" onClick={() => setModal('deposit')}>
        Deposit
      </Button>
      <Button color="red" size="small" onClick={() => setModal('withdraw')}>
        Withdraw
      </Button>
      <Text
        css={{
          flexGrow: 1,
          justifyContent: 'end',
          fontSize: '$7',
          fontWeight: '$semibold',
          color: '$primary',
        }}
      >
        {balance} {vault.type.toUpperCase()}
      </Text>
    </Box>
  );
}
