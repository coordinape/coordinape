import { MouseEvent, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import isEmpty from 'lodash/isEmpty';
import { useController, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { styled } from 'stitches.config';
import { z } from 'zod';
import { zEthAddress, zEthAddressOrBlank } from 'forms/formHelpers';
import { useCurrentOrg } from 'hooks/gql';
import { useContracts } from 'hooks/useContracts';
import { useVaultFactory } from 'hooks/useVaultFactory';
import { DAIIcon, USDCIcon, USDTIcon, YFIIcon } from 'icons';
import { AssetEnum, Asset } from 'services/contracts';
import { Box, Button, Form, Text, TextField } from 'ui';

const schema = z
  .object({
    symbol: AssetEnum.optional(),
    customAddress: zEthAddressOrBlank,
  })
  .refine(
    async ({ symbol, customAddress }) => {
      return !!symbol || (await zEthAddress.spa(customAddress)).success;
      // TODO we could also check that the address is a valid ERC20 contract
      // here instead of during createVault
    },
    { message: 'Select an asset or enter a valid address' }
  );

type CreateVaultFormSchema = z.infer<typeof schema>;
const resolver = zodResolver(schema);

export const CreateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const navigate = useNavigate();
  const contracts = useContracts();
  const [asset, setAsset] = useState<Asset | undefined>();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateVaultFormSchema>({ resolver });
  const currentOrg = useCurrentOrg();
  const { createVault } = useVaultFactory(currentOrg?.id);

  const {
    field: { onChange },
  } = useController({ name: 'symbol', control });

  const { field } = useController({
    name: 'customAddress',
    defaultValue: '',
    control,
  });

  if (!contracts) return null;

  const pickAsset = (symbol: Asset | undefined, event?: MouseEvent) => {
    if (event) event.preventDefault();
    setAsset(symbol);
    onChange({ target: { value: symbol } });
  };

  const onSubmit = ({ symbol, customAddress }: any) => {
    createVault({ type: symbol, simpleTokenAddress: customAddress }).then(
      vault => {
        if (!vault) return;

        // eslint-disable-next-line no-console
        console.log('created vault:', vault);
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
            {icons[symbol]()}
            <Text css={{ ml: '$xs' }}>{symbol}</Text>
          </AssetButton>
        ))}
      </Box>
      <Text css={{ mb: '$md' }}>Or use a custom asset</Text>
      <Text variant="formLabel" css={{ width: '100%' }}>
        Token contract address
      </Text>
      <TextField
        onFocus={() => pickAsset(undefined)}
        placeholder="0x0000..."
        css={{ width: '100%' }}
        {...field}
      />
      <Button color="red" css={{ mt: '$lg', width: '100%' }}>
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

const icons: Record<Asset, () => JSX.Element> = {
  DAI: () => <DAIIcon height={25} width={22} />,
  USDC: () => <USDCIcon width={25} height={22} />,
  USDT: () => <USDTIcon height={25} width={25} />,
  YFI: () => <YFIIcon width={25} height={22} />,
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
