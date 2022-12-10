import { useEffect, useRef, useState } from 'react';

import { parseUnits } from '@ethersproject/units';
import { DebugLogger } from 'common-lib/log';
import { getMagic, getMagicProvider } from 'features/auth/magic';

import { useContracts } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';
import { VaultRow } from 'pages/VaultsPage/VaultRow';
import { Box, Button, Flex, Text } from 'ui';

const randomColor = () => {
  const chan = () => Math.round(Math.random() * 255).toString(16);
  const color = `#${chan()}${chan()}${chan()}`;
  return color;
};

const logger = new DebugLogger('troubleshooting');

export const TroubleshootingContent = () => {
  const web3 = useWeb3React();
  const contracts = useContracts();
  const [lastAlive, setLastAlive] = useState<number>(Date.now());
  const [status, setStatus] = useState<string | undefined>();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!web3.active) return;

    const poll = setInterval(async () => {
      await getMagic().connect.getWalletInfo();
      if (!mounted.current) return;
      setLastAlive(Date.now());
    }, 2000);

    const updateUI = setInterval(() => {
      const seconds = Math.round((Date.now() - lastAlive) / 1000);
      if (seconds < 5) setStatus('ok');
      else setStatus(`no response for ${seconds} seconds`);
    }, 1000);

    return () => {
      clearInterval(poll);
      clearInterval(updateUI);
    };
  }, [web3.active, lastAlive]);

  const connectMagic = async () => {
    const p = await getMagicProvider();
    web3.setProvider(p, 'magic');
  };

  const approve = async () => {
    if (!contracts || !web3.account) {
      alert('connect first!');
      return;
    }
    const token = contracts.getToken('DAI');
    logger.log('approving...');
    const tx = await token.approve(web3.account, parseUnits('1', 18));
    logger.log(`submitted ${tx.hash}`);
    const receipt = await tx.wait();
    logger.log(`got receipt`);
    logger.log(receipt);
  };

  return (
    <Box
      css={{
        padding: '$md',
        border: '3px solid',
        borderColor: randomColor(),
        minHeight: '100vh',
      }}
    >
      <Text h1>Troubleshooting</Text>
      <Flex column css={{ gap: '$md', mt: '$xl' }}>
        <Text>Address: {web3.account}</Text>
        <Text>Magic status: {status}</Text>
        <Button onClick={connectMagic}>Connect Magic</Button>
        <Button onClick={approve}>Send Approval</Button>
        <VaultRow vault={vault} showRecentTransactions={false} />
      </Flex>
    </Box>
  );
};

const vault = {
  id: 6,
  created_at: '2022-12-08T01:04:11.332953+00:00',
  created_by: 366,
  decimals: 18,
  simple_token_address: '0x8e34054aA3F9CD541fE4B0fb9c4A45281178e7c6',
  symbol: 'DAI',
  token_address: '0x0000000000000000000000000000000000000000',
  updated_at: '2022-12-08T01:04:11.332953+00:00',
  vault_address: '0xae052fef0ebc16783173d8caba3694efe479d036',
  chain_id: 5,
  deployment_block: 8063601,
  organization: { name: 'Org for Claims' },
  vault_transactions: [],
};
