import assert from 'assert';
import { MouseEvent, useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWeb3ReactRoot, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { getTokenAddress, Contracts, removeYearnPrefix } from 'lib/vaults';
import round from 'lodash/round';
import { useForm, useController } from 'react-hook-form';
import * as z from 'zod';

import { ReactComponent as WalletConnectSVG } from 'assets/svgs/wallet/wallet-connect.svg';
import { FormTokenField, zTokenString } from 'components';
import type { Vault } from 'hooks/gql/useVaults';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useContracts } from 'hooks/useContracts';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { Box, Button, Form, Link, Modal, Text } from 'ui';
import { numberWithCommas, shortenAddress } from 'utils';
import { makeWalletConnectConnector } from 'utils/connectors';

export type DepositModalProps = {
  onClose: () => void;
  onDeposit: () => void;
  vault: Vault;
};

export default function DepositModal({
  onDeposit,
  onClose,
  vault,
}: DepositModalProps) {
  const [max, setMax] = useState<any>();
  const [submitting, setSubmitting] = useState(false);
  const contracts = useContracts();

  const [selectedContracts, setSelectedContracts] = useState<Contracts>();
  const [isChainIdMatching, setIsChainIdMatching] = useState<boolean>(true);
  const [isSecondaryAccountActive, setIsSecondaryAccountActive] =
    useState<boolean>(false);

  useEffect(() => {
    if (contracts) setSelectedContracts(contracts);
  }, [contracts]);

  const onConnectSecondWallet = (provider: Web3Provider, chainId: number) => {
    assert(contracts);
    const newContracts = new Contracts(contracts.chainId, provider);
    setIsChainIdMatching(contracts.chainId === chainId.toString());
    setSelectedContracts(newContracts);
    setIsSecondaryAccountActive(true);
    // we have a web3 provider here so we can assume client side and that window is available -g
    (window as any).contracts = newContracts;
  };

  const onDisconnectSecondWallet = () => {
    setSelectedContracts(contracts);
    setIsSecondaryAccountActive(false);
  };

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
  }, [selectedContracts, isSecondaryAccountActive]);

  const schema = z
    .object({ amount: zTokenString('0', max, vault.decimals) })
    .strict();
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
    defaultValue: '',
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
      title={`Deposit ${removeYearnPrefix(vault.symbol).toUpperCase()}`}
      open={true}
      onClose={onClose}
    >
      <Form
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '$sm 0 $lg',
          overflowY: 'auto',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <SecondWallet
          onConnect={onConnectSecondWallet}
          onDisconnect={onDisconnectSecondWallet}
          validChainId={isChainIdMatching}
        />

        <FormTokenField
          max={max}
          symbol={removeYearnPrefix(vault.symbol)}
          decimals={vault.decimals}
          label={`Available: ${numberWithCommas(
            round(max, 4)
          )} ${removeYearnPrefix(vault.symbol).toUpperCase()}`}
          error={!!errors.amount}
          errorText={errors.amount?.message}
          {...amountField}
        />
        <Button
          css={{ mt: '$lg', gap: '$xs' }}
          color="primary"
          outlined
          size="large"
          type="submit"
          fullWidth
          disabled={!isChainIdMatching || !isValid || submitting}
        >
          {submitting
            ? 'Depositing Funds...'
            : `Approve and Deposit into ${vault.symbol} Vault`}
        </Button>
        <Text
          size="small"
          css={{ color: '$secondaryText', alignSelf: 'center', mt: '$sm' }}
        >
          You will sign two transactions: one for approval and one for deposit.
        </Text>
      </Form>
    </Modal>
  );
}

const ROOT_KEY = 'deposit';
const connector = makeWalletConnectConnector();

const SecondWalletInner = ({
  onConnect,
  onDisconnect,
  validChainId,
}: {
  onConnect: (provider: Web3Provider, chainId: number) => void;
  onDisconnect: () => void;
  validChainId: boolean;
}) => {
  const { activate, deactivate, account, library, error, chainId } =
    useWeb3React<Web3Provider>(ROOT_KEY);
  const { chainId: primaryChainId } = useWeb3React();

  if (error) console.error(error);

  useEffect(() => {
    if (library && chainId) onConnect(library, chainId);
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

  const address = useConnectedAddress();

  return (
    <>
      {account ? (
        <Box css={{ mb: '$md' }}>
          <Text variant="label" as="label" css={{ mb: '$xs' }}>
            From secondary wallet
          </Text>
          <Text inline h3 semibold>
            <Text css={{ mr: '$xs' }}>
              <WalletConnectSVG />
            </Text>
            {account && shortenAddress(account)}
          </Text>
          <Link onClick={onClickStop} css={{ ml: '$sm' }}>
            Disconnect this wallet
          </Link>
          {!validChainId && primaryChainId && (
            <Text variant="label" as="label" css={{ mb: '$xs' }} color="alert">
              Please set your network to{' '}
              {NetworkNames[primaryChainId.toString()]}
            </Text>
          )}
        </Box>
      ) : (
        <Box css={{ mb: '$md' }}>
          <Text variant="label" as="label" css={{ mb: '$xs' }}>
            From primary wallet
          </Text>
          <Text inline h3 semibold>
            {address && shortenAddress(address)}
          </Text>
          <Button
            css={{ ml: '$md', display: 'inline' }}
            type="button"
            size="large"
            color="primary"
            outlined
            onClick={onClickStart}
          >
            Use a different wallet
          </Button>
        </Box>
      )}
    </>
  );
};

const NetworkNames: Record<string, string> = {
  '5': 'Goerli',
  '1': 'Mainnet',
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
