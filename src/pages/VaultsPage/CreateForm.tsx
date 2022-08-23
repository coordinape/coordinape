/* eslint-disable @typescript-eslint/no-unused-vars */
import { MouseEvent, useState, useEffect, useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { Asset } from 'lib/vaults';
import type { Contracts } from 'lib/vaults';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { useController, useForm } from 'react-hook-form';
import { styled } from 'stitches.config';
import { z } from 'zod';

import type { Vault } from 'hooks/gql/useVaults';
import { useContracts } from 'hooks/useContracts';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { Increase } from 'icons/__generated';
import { Box, Button, Form, HR, Link, Panel, Text, TextField } from 'ui';

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
  const [asset, setAsset] = useState<string | undefined>();
  const [displayCustomToken, setDisplayCustomToken] = useState(false);
  const [activeVaultPanel, setActiveVaultPanel] = useState<string | undefined>(
    'simple'
  );
  const [customSymbol, setCustomSymbol] = useState<string | undefined>();
  const [saving, setSavingLocal] = useState(false);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    clearErrors,
    trigger,
  } = useFormSetup(contracts, setCustomSymbol, existingVaults);

  const {
    field: { onChange, onBlur },
  } = useController({ name: 'symbol', control });

  const { field: customAddressField } = useController({
    name: 'customAddress',
    defaultValue: '',
    control,
  });

  const checkCustomAddress = useCallback(
    debounce(() => trigger('customAddress'), 200),
    [trigger]
  );

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

  const pickAsset = (
    vaultType: 'yearn' | 'simple',
    symbol: string,
    event: MouseEvent
  ) => {
    if (event) event.preventDefault();

    setAsset(symbol + vaultType);
    clearErrors('customAddress');

    // customAddress should be empty for Yearn Vaults
    // customAddress should be defined for simple vaults
    if (symbol == 'custom') {
      setDisplayCustomToken(true);
      customAddressField.onChange({ target: { value: '' } });
      onChange({ target: { value: undefined } });
    } else if (vaultType == 'simple') {
      setDisplayCustomToken(false);
      if (symbol == 'USDC') {
        customAddressField.onChange({
          target: { value: contracts.getTokenAddress('USDC') },
        });
        onChange({ target: { value: symbol } });
      } else if (symbol == 'DAI') {
        customAddressField.onChange({
          target: { value: contracts.getTokenAddress('DAI') },
        });
        onChange({ target: { value: symbol } });
      }
    }

    if (vaultType == 'yearn') {
      customAddressField.onChange({ target: { value: '' } });
      onChange({ target: { value: symbol } });
      setDisplayCustomToken(false);
      setActiveVaultPanel('yearn');
    } else {
      setActiveVaultPanel('simple');
    }

    onBlur();
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
      css={{ display: 'flex', flexDirection: 'column' }}
    >
      <Panel
        invertForm={activeVaultPanel === 'simple'}
        nested={activeVaultPanel !== 'simple'}
        css={{ gap: '$md' }}
      >
        <Text h3>CoVault</Text>
        <Text p as="p">
          CoVaults allow you to fund your circles with any ERC-20 token as your
          asset.
        </Text>
        <Box css={{ display: 'flex', gap: '$sm', flexWrap: 'wrap' }}>
          {contracts.getAvailableTokens().map(symbol => (
            <AssetButton
              pill
              color="surface"
              key={symbol}
              data-selected={`${symbol}simple` === asset}
              onClick={event => pickAsset('simple', symbol, event)}
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
          <AssetButton
            pill
            color="surface"
            data-selected={'customsimple' === asset}
            onClick={e => pickAsset('simple', 'custom', e)}
          >
            <Increase size="lg" color="neutral" />
            <Text css={{ ml: '$xs' }}>{'Other ERC-20 Token'}</Text>
          </AssetButton>
        </Box>
        {displayCustomToken && (
          <Box>
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
              placeholder="0x0000..."
              css={{ width: '100%' }}
              {...customAddressField}
              onChange={event => {
                customAddressField.onChange(event);
                checkCustomAddress();
              }}
            />
          </Box>
        )}
      </Panel>
      <HR />
      <Panel
        invertForm={activeVaultPanel === 'yearn'}
        nested={activeVaultPanel !== 'yearn'}
        css={{ gap: '$md' }}
      >
        <Text h3>Yield-Generating CoVault</Text>
        <Text p as="p">
          Create a CoVault that receives DAI or USDC, and will use{'  '}
          <Link href="https://docs.yearn.finance/">Yearn Vaults</Link> to earn
          yield in the background.
        </Text>
        <Box css={{ display: 'flex', gap: '$sm', flexWrap: 'wrap' }}>
          {contracts.getAvailableTokens().map(symbol => (
            <AssetButton
              pill
              color="surface"
              key={symbol}
              data-selected={`${symbol}yearn` === asset}
              onClick={event => pickAsset('yearn', symbol, event)}
            >
              <img
                src={`/imgs/tokens/${symbol.toLowerCase()}.png`}
                alt={symbol}
                height={25}
                width={25}
                style={{ paddingRight: 0 }}
              />
              <Text css={{ ml: '$xs' }}>Yearn {symbol}</Text>
            </AssetButton>
          ))}
        </Box>
      </Panel>
      <Button
        color="primary"
        outlined
        size="large"
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
