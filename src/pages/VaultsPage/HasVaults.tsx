import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'ethers';

import { useContracts } from 'hooks/useContracts';
import { Box, Button, Text } from 'ui';

import AllocateModal from './AllocateModal';
import DepositModal from './DepositModal';
import EditModal from './EditModal';
import WithdrawModal from './WithdrawModal';

import { IVault } from 'types';

type ModalLabel = '' | 'deposit' | 'withdraw' | 'allocate' | 'edit';

export default function HasVaults({ vault }: { vault: IVault }) {
  const [modal, setModal] = useState<ModalLabel>('');
  const closeModal = () => setModal('');
  const contracts = useContracts();
  const vaultContract = useMemo(
    () => contracts?.getVault(vault.id),
    [contracts]
  );

  // TODO: update balance automatically after deposit
  // FIXME: logic for fetching & formatting balance shouldn't live here
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const vaultType = vault.type;
    if (vaultType === 'OTHER') {
      // TODO: need to get decimals from token contract
      setBalance(-1);
      return;
    }

    vaultContract?.underlyingValue().then(x => {
      setBalance(x.div(BigNumber.from(10).pow(vault.decimals)).toNumber());
    });
  }, [vault.id, vaultContract]);

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
      ) : modal === 'edit' ? (
        <EditModal onClose={closeModal} />
      ) : modal === 'withdraw' ? (
        <WithdrawModal onClose={closeModal} />
      ) : modal === 'deposit' ? (
        <DepositModal vault={vault} onClose={closeModal} />
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
