import { MouseEvent, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { Asset } from 'lib/vaults';
import type { Contracts } from 'lib/vaults';
import isEmpty from 'lodash/isEmpty';
import { useController, useForm } from 'react-hook-form';
import { styled } from 'stitches.config';
import { z } from 'zod';

import type { Vault } from 'hooks/gql/useVaults';
import { useContracts } from 'hooks/useContracts';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { Box, Button, Form, Text, TextField } from 'ui';

const useFormSetup = (
  contracts: Contracts | undefined,
  setCustomSymbol: (s: string | undefined) => void,
  existingVaults?: Vault[]
) => {
  const schema = z
    .object({
      symbol: z.nativeEnum(Asset).optional(),
      customAddress: z.string().optional(),
    })
    .refine(
      async ({ symbol, customAddress }) => {
        if (symbol) return true;

        if (!customAddress || !ethers.utils.isAddress(customAddress)) {
          setCustomSymbol(undefined);
          return false;
        }

        if (!contracts) return false;
        const token = contracts.getERC20(customAddress);
        try {
          await token.decimals(); // just ensuring that this call succeeds
          setCustomSymbol(await token.symbol());
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Select an asset or enter a valid ERC20 token address',
        path: ['customAddress'],
      }
    )
    .refine(
      async ({ symbol, customAddress }) => {
        if (symbol && existingVaults?.some(v => v.symbol === symbol))
          return false;

        if (
          customAddress &&
          existingVaults?.some(v => v.simple_token_address === customAddress)
        )
          return false;

        return true;
      },
      {
        message: 'You already have a vault for that token',
        path: ['customAddress'],
      }
    );

  type FormSchema = z.infer<typeof schema>;
  const resolver = zodResolver(schema);

  return useForm<FormSchema>({ resolver, mode: 'onBlur' });
};

export const CreateForm = ({
  onSuccess,
  orgId,
  setSaving,
  existingVaults,
}: {
  onSuccess: () => void;
  orgId: number;
  setSaving?: (saving: boolean) => void;
  existingVaults?: Vault[];
}) => {
  const contracts = useContracts();
  const { createVault } = useVaultFactory(orgId);
  const [asset, setAsset] = useState<Asset | undefined>();
  const [customSymbol, setCustomSymbol] = useState<string | undefined>();
  const [saving, setSavingLocal] = useState(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useFormSetup(contracts, setCustomSymbol, existingVaults);

  const {
    field: { onChange, onBlur },
  } = useController({ name: 'symbol', control });

  const { field: customAddressField } = useController({
    name: 'customAddress',
    defaultValue: '',
    control,
  });

  if (!contracts)
    return (
      <Text
        font="source"
        bold
        css={{
          display: 'block',
          mb: '$sm',
          textAlign: 'center',
        }}
      >
        Sorry, this network is not supported.
      </Text>
    );

  const pickAsset = (symbol: Asset | undefined, event?: MouseEvent) => {
    if (event) event.preventDefault();
    setAsset(symbol);
    onChange({ target: { value: symbol } });
    onBlur();

    if (symbol) {
      customAddressField.onChange({ target: { value: '' } });
      customAddressField.onBlur();
      setCustomSymbol(undefined);
    }
  };

  const onSubmit = ({ symbol, customAddress }: any) => {
    setSaving?.(true);
    setSavingLocal(true);
    createVault({
      type: symbol,
      simpleTokenAddress: customAddress,
      customSymbol,
    }).then(vault => {
      setSaving?.(false);
      setSavingLocal(false);
      if (!vault) return;
      onSuccess();
    });
  };

  if (saving) return <SavingInProgress />;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      css={{
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Text font="source" size="large" semibold css={{ mb: '$sm' }}>
        Select an Asset
      </Text>
      <Text font="source" size="medium" css={{ mb: '$sm' }}>
        CoVaults allow you to fund your circles with the asset of your choice.
      </Text>
      <Text font="source" size="medium" css={{ display: 'block' }}>
        Choose a token below to create a CoVault that uses{' '}
        <a href="https://docs.yearn.finance/">Yearn Vaults</a> to earn yield:
      </Text>
      <Box css={{ display: 'flex', gap: '$sm', my: '$lg' }}>
        {contracts.getAvailableTokens().map(symbol => (
          <AssetButton
            key={symbol}
            data-selected={symbol === asset}
            onClick={event => pickAsset(symbol, event)}
          >
            <img
              src={`/imgs/tokens/${symbol.toLowerCase()}.png`}
              alt={symbol}
              height={25}
              width={25}
              style={{ paddingRight: 0 }}
            />
            <Text css={{ ml: '$xs' }}>{symbol}</Text>
          </AssetButton>
        ))}
      </Box>
      <Text font="source" size="medium" css={{ mb: '$md' }}>
        Or create a CoVault with any ERC-20 token:
      </Text>
      <Text variant="label" css={{ width: '100%', mb: '$xs' }}>
        Token contract address
        {customSymbol && (
          <span>
            &nbsp;-{' '}
            <Text inline bold>
              {customSymbol}
            </Text>
          </span>
        )}
      </Text>
      <TextField
        onFocus={() => pickAsset(undefined)}
        placeholder="0x0000..."
        css={{ width: '100%' }}
        {...customAddressField}
      />
      <Button
        color="primary"
        outlined
        css={{ mt: '$lg', width: '100%' }}
        disabled={!isValid || saving}
      >
        {saving ? 'Saving...' : 'Create CoVault'}
      </Button>
      {!isEmpty(errors) && (
        <Text color="alert" css={{ mt: '$sm' }}>
          {Object.values(errors)
            .map(e => e.message)
            .join('. ')}
        </Text>
      )}
    </Form>
  );
};

const AssetButton = styled(Button, {
  pl: '$sm',
  pr: '$md',
  height: '37px',
  // have to use !important because otherwise styles from the default button
  // variants take precedence
  borderRadius: '20px !important',
  backgroundColor: '$surface !important',
  '&:hover, &[data-selected=true]': {
    backgroundColor: '$secondaryText !important',
    '> span': { color: 'white !important' },
  },
});

const SavingInProgress = () => {
  return (
    <>
      <Text p as="p" css={{ mb: '$md' }}>
        Please follow the prompts in your wallet to submit a transaction, then
        wait for the transaction to complete.
      </Text>
      <Text p as="p">
        Do not leave this page.
      </Text>
    </>
  );
};
