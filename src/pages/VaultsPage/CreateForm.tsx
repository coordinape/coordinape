import { MouseEvent, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { Asset } from 'lib/vaults';
import type { Contracts } from 'lib/vaults';
import isEmpty from 'lodash/isEmpty';
import { useController, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { styled } from 'stitches.config';
import { z } from 'zod';

import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { useContracts } from 'hooks/useContracts';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { Box, Button, Form, Text, TextField } from 'ui';

const useFormSetup = (
  contracts: Contracts | undefined,
  setCustomSymbol: (s: string | undefined) => void
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
    );

  type FormSchema = z.infer<typeof schema>;
  const resolver = zodResolver(schema);

  return useForm<FormSchema>({ resolver, mode: 'onBlur' });
};

export const CreateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const navigate = useNavigate();
  const contracts = useContracts();
  const currentOrg = useCurrentOrg();
  const { createVault } = useVaultFactory(currentOrg.data?.id);
  const [asset, setAsset] = useState<Asset | undefined>();
  const [customSymbol, setCustomSymbol] = useState<string | undefined>();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useFormSetup(contracts, setCustomSymbol);

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
          fontSize: '$5',
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
    createVault({ type: symbol, simpleTokenAddress: customAddress }).then(
      vault => {
        if (!vault) return;
        navigate('/admin/vaults');
        onSuccess();
      }
    );
  };

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
      <Text font="source" bold css={{ fontSize: '$5', mb: '$sm' }}>
        Select a Vault Asset
      </Text>
      <Text font="source" css={{ fontSize: '$4' }}>
        Vaults allow you to fund your circles with the asset of your choice.
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
            />
            <Text css={{ ml: '$xs' }}>{symbol}</Text>
          </AssetButton>
        ))}
      </Box>
      <Text css={{ mb: '$md' }}>Or use a custom asset</Text>
      <Text variant="formLabel" css={{ width: '100%', mb: '$xs' }}>
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
        color="red"
        css={{ mt: '$lg', width: '100%' }}
        disabled={!isValid}
      >
        Create Vault
      </Button>
      {!isEmpty(errors) && (
        <Text color="red" css={{ mt: '$sm' }}>
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
  backgroundColor: '$surfaceGray !important',
  '&:hover, &[data-selected=true]': {
    backgroundColor: '$mediumGray !important',
    '> span': { color: 'white !important' },
  },
});
