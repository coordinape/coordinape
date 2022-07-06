import assert from 'assert';
import { MouseEvent, useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWeb3ReactRoot, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { GraphQLTypes } from 'lib/gql/__generated__/zeus';
import { getTokenAddress, Contracts } from 'lib/vaults';
import { useForm, useController } from 'react-hook-form';
import * as z from 'zod';

import { FormTokenField } from 'components';
import { useContracts } from 'hooks/useContracts';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { Button, Form, Modal, Link } from 'ui';
import { makeWalletConnectConnector } from 'utils/connectors';

export type DepositModalProps = {
  onClose: () => void;
  onDeposit: () => void;
  vault: GraphQLTypes['vaults'];
};

export default function DepositModal({
  onDeposit,
  onClose,
  vault,
}: DepositModalProps) {
  const [max, setMax] = useState<any>();
  const [submitting, setSubmitting] = useState(false);
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

  const schema = z.object({ amount: z.number().min(0).max(max) }).strict();
  type DepositFormSchema = z.infer<typeof schema>;
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<DepositFormSchema>({
    mode: 'all',
    resolver: zodResolver(schema),
  });
  const { field: amountField } = useController({
    name: 'amount',
    control,
    defaultValue: 0,
  });

  const { deposit } = useVaultRouter(selectedContracts);

  const onSubmit = () => {
    setSubmitting(true);
    deposit(vault, amountField.value.toString()).then(({ error }) => {
      setSubmitting(false);
      if (error) return;
      onDeposit();
      onClose();
    });
  };

  return (
    <Modal
      title={`Deposit ${vault.symbol?.toUpperCase()}`}
      open={true}
      onClose={onClose}
    >
      <Form
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          padding: '0 0 $lg',
          overflowY: 'auto',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <SecondWallet
          onConnect={onConnectSecondWallet}
          onDisconnect={onDisconnectSecondWallet}
        />
        <FormTokenField
          max={max}
          symbol={vault.symbol as string}
          decimals={vault.decimals}
          label={`Available: ${max} ${vault.symbol?.toUpperCase()}`}
          error={!!errors.amount}
          errorText={errors.amount?.message}
          {...amountField}
        />
        <Button
          css={{ mt: '$lg', gap: '$xs', alignSelf: 'center' }}
          color="primary"
          outlined
          size="medium"
          type="submit"
          disabled={!isValid || submitting}
        >
          {submitting
            ? 'Depositing Funds...'
            : `Deposit ${vault.symbol.toUpperCase()}`}
        </Button>
      </Form>
    </Modal>
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
          Use a different wallet via <Link>WalletConnect</Link>
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
