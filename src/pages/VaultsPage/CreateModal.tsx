import { useState } from 'react';
import { styled } from 'stitches.config';
import { z } from 'zod';
import { useContracts } from 'hooks/useContracts';
import { DAIIcon, USDCIcon, USDTIcon, YFIIcon } from 'icons';
import { Box, Button, Modal, Text, TextField } from 'ui';

const symbols = ['DAI', 'USDC', 'USDT', 'YFI'] as const;
const AssetEnum = z.enum(symbols);
type Asset = z.infer<typeof AssetEnum>;

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

export const CreateModal = ({ onClose }: { onClose: () => void }) => {
  const contracts = useContracts();
  const [asset, setAsset] = useState<Asset>();
  if (!contracts) return null;

  const tokens = symbols.filter(s => !!contracts.getTokenAddress(s));

  return (
    <Modal
      onClose={onClose}
      title="Create a New Vault"
      css={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}
    >
      <Text font="source" bold css={{ fontSize: '$5', mb: '$sm' }}>
        Select a Vault Asset
      </Text>
      <Text font="source" css={{ fontSize: '$4' }}>
        Vaults allow you to fund your circles with the asset of your choice.
      </Text>
      <Box css={{ display: 'flex', gap: '$sm', my: '$lg' }}>
        {tokens.map(symbol => (
          <AssetButton
            key={symbol}
            data-selected={symbol === asset}
            onClick={() => setAsset(symbol)}
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
      <TextField placeholder="0x0000..." css={{ width: '100%' }} />
      <Button color="red" css={{ mt: '$lg', width: '100%' }}>
        Create Vault
      </Button>
    </Modal>
  );
};
