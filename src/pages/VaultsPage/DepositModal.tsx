import assert from 'assert';
import { MouseEvent, useEffect, useMemo, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { createWeb3ReactRoot, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { getTokenAddress, Contracts } from 'lib/vaults';
import { useNavigate } from 'react-router-dom';

import { FormModal, FormTokenField } from 'components';
import SingleTokenForm from 'forms/SingleTokenForm';
import { useContracts } from 'hooks/useContracts';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { PlusCircleIcon } from 'icons';
import { Box, Button } from 'ui';
import { makeWalletConnectConnector } from 'utils/connectors';

export default function DepositModal({
  open,
  onDeposit,
  onClose,
  vault,
}: {
  onClose: () => void;
  onDeposit: () => void;
  open?: boolean;
  vault: GraphQLTypes['vaults'];
}) {
  const navigate = useNavigate();
  const [max, setMax] = useState<any>();
  const contracts = useContracts();
  (window as any).contracts = contracts;
  const [selectedContracts, setSelectedContracts] = useState<Contracts>();

  useEffect(() => {
    if (contracts) setSelectedContracts(contracts);
  }, [contracts]);

  const onConnectSecondWallet = (provider: Web3Provider) => {
    assert(contracts);
    const newContracts = new Contracts(contracts.chainId, provider);
    setSelectedContracts(newContracts);
    (window as any).contracts = newContracts;
  };

  const onDisconnectSecondWallet = () => setSelectedContracts(contracts);

  useEffect(() => {
    if (!selectedContracts) return;

    (async () => {
      const token = selectedContracts.getERC20(getTokenAddress(vault));
      const address = await selectedContracts.getMyAddress();
      if (address) {
        const balance = await token.balanceOf(address);
        setMax(ethers.utils.formatUnits(balance, vault.decimals));
      }
    })();
  }, [selectedContracts]);

  const source = useMemo(() => ({ starting: 0, balance: max }), [vault, max]);

  const { deposit } = useVaultRouter(selectedContracts);

  const handleSubmit = (amount: number) => {
    deposit(vault, amount.toString()).then(({ error }) => {
      if (error) return;
      onDeposit();
      onClose();
      navigate('/admin/vaults');
    });
  };

  return (
    <SingleTokenForm.FormController
      source={source}
      submit={({ amount }) => handleSubmit(amount)}
    >
      {({ fields, handleSubmit, changedOutput }) => (
        <FormModal
          onClose={onClose}
          open={open}
          title={`Deposit ${vault.symbol?.toUpperCase()}`}
          subtitle=""
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<PlusCircleIcon />}
          submitText={`Deposit ${vault.symbol?.toUpperCase()}`}
        >
          <Box css={{ my: '$2xl' }}>
            <SecondWallet
              onConnect={onConnectSecondWallet}
              onDisconnect={onDisconnectSecondWallet}
            />
            <FormTokenField
              {...fields.amount}
              max={max}
              symbol={vault.symbol as string}
              decimals={vault.decimals}
              label={`Available: ${max} ${vault.symbol?.toUpperCase()}`}
            />
          </Box>
        </FormModal>
      )}
    </SingleTokenForm.FormController>
  );
}

const ROOT_KEY = 'deposit';
const connector = makeWalletConnectConnector();

const SecondWalletInner = ({
  onConnect,
  onDisconnect,
}: {
  onConnect: (provider: Web3Provider) => void;
  onDisconnect: () => void;
}) => {
  const { activate, deactivate, account, library, error } =
    useWeb3React<Web3Provider>(ROOT_KEY);

  if (error) console.error(error);

  useEffect(() => {
    if (library) onConnect(library);
  }, [library]);

  const onClickStart = (event: MouseEvent) => {
    event.preventDefault();
    activate(connector);
  };

  const onClickStop = (event: MouseEvent) => {
    event.preventDefault();
    deactivate();
    onDisconnect();
  };

  return (
    <>
      {account ? (
        <>
          <p>
            connected to {account}
            <Button onClick={onClickStop} size="small">
              Deactivate
            </Button>
          </p>
        </>
      ) : (
        <button onClick={onClickStart}>
          Use a different wallet via WalletConnect
        </button>
      )}
    </>
  );
};

const SecondWalletProvider = createWeb3ReactRoot(ROOT_KEY);
const getLibrary = (provider: any) => new Web3Provider(provider);

const SecondWallet = (props: any) => {
  return (
    <SecondWalletProvider getLibrary={getLibrary}>
      <SecondWalletInner {...props} />
    </SecondWalletProvider>
  );
};
