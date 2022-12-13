/* eslint-disable @typescript-eslint/no-unused-vars,no-console */

import { useEffect, useState } from 'react';

import { ERC20__factory } from '@coordinape/hardhat/dist/typechain';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { getMagic, getMagicProvider } from 'features/auth/magic';

import { Box, Button, Flex, Text } from 'ui';

const randomColor = () => {
  const chan = () => Math.round(Math.random() * 255).toString(16);
  const color = `#${chan()}${chan()}${chan()}`;
  return color;
};

const daiToken = (provider: Web3Provider) => {
  const address = '0x8e34054aA3F9CD541fE4B0fb9c4A45281178e7c6';
  return ERC20__factory.connect(address, provider.getSigner());
};

export const TroubleshootingContent = () => {
  const [balance, setBalance] = useState<string | undefined>();
  const [updaterOn, setUpdaterOn] = useState(false);
  const [provider, setProvider] = useState<Web3Provider>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    if (!provider) return;
    const callback = (num: number) => {
      (async () => {
        if (!provider || !address || !updaterOn) return;
        const token = daiToken(provider);
        console.log('updating balance...');
        const newBalance = await token.balanceOf(address);
        console.log('balance updated');
        setBalance(`${formatUnits(newBalance, 18)} at block ${num}`);
      })();
    };

    provider.on('block', callback);

    return () => {
      provider.off('block', callback);
    };
  }, [provider, address, updaterOn]);

  const connectMagic = async () => {
    const m = getMagic();
    (window as any).magic = m;
    const provider = await getMagicProvider();
    setProvider(provider);
    setAddress((await provider.send('eth_accounts', []))[0]);
  };

  const connectMetaMask = async () => {
    const provider = new Web3Provider((window as any).ethereum);
    setProvider(provider);
    setAddress((await provider.send('eth_accounts', []))[0]);
  };

  const approve = async () => {
    if (!provider || !address) {
      alert('connect first!');
      return;
    }
    const token = daiToken(provider);
    console.log('approving...');

    const tx = await token.approve(address, parseUnits('1', 18));
    console.log(`submitted ${tx.hash}`);

    await tx.wait();
    console.log(`got receipt`);
    alert('transaction done!');
  };

  const minimal = async () => {
    if (!provider || !address) {
      return;
    }
    const token = daiToken(provider);
    const promise = token.approve(address, parseUnits('1', 18));
    setTimeout(async () => {
      const newBalance = await token.balanceOf(address);
      console.log('got balance:', newBalance.toString());
    }, 10000);
    await promise;
    console.log('approval done');
  };

  return (
    <Flex
      column
      css={{ padding: '$xl', gap: '$md', alignContent: 'flex-start' }}
    >
      <Text>First, connect one provider below.</Text>
      <Flex row css={{ gap: '$sm' }}>
        <Button onClick={connectMagic}>Connect Magic</Button>
        <Button onClick={connectMetaMask}>Connect Metamask</Button>
      </Flex>
      <Text>Address: {address}</Text>
      <Box>
        <hr />
      </Box>
      <Box>
        <Button onClick={approve}>Send Approval</Button>
      </Box>
      <Text>
        Before activating the block listener (introducing concurrency), sending
        approval transactions with the button above works normally, as many
        times as you want.
      </Text>
      <Box>
        <Button onClick={() => setUpdaterOn(true)}>
          Activate Block Listener
        </Button>
      </Box>
      <Text>
        When using Magic, after activating the block listener, sending an
        approval transaction breaks. It may hang during the transaction, or it
        may succeed, but then not allow any transactions after that. There is no
        issue when doing this with MetaMask.
      </Text>
      <Text>
        Block listener {updaterOn ? 'on' : 'off'}. Balance: {balance}
      </Text>
      <Box>
        <hr />
      </Box>
      <Text>
        For an even simpler test case, click the button below after connecting a
        provider. This just starts an approval transaction and then tries to
        read a balance 10 seconds later. With Magic, the transaction and the
        call interfere with each other. One or the other will never finish.
      </Text>
      <Box>
        <Button onClick={minimal}>Go!</Button>
      </Box>
    </Flex>
  );
};
