import assert from 'assert';

/* eslint-disable no-console */
import { IN_DEVELOPMENT } from '../../config/env';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Button } from '../../ui';

import { useCoSoulContracts } from './useCoSoulContracts';

const TEST_NETWORK = true;

const optimism = {
  chainId: '0xa',
  chainName: 'Optimism',
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
};

const optimismTestNetwork = {
  chainId: '0x1A4',
  chainName: 'Optimism Goerli',
  rpcUrls: ['https://goerli.optimism.io'],
  blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
};
const localhost = {
  chainId: '0x53A',
  chainName: 'Localhost 8546',
  rpcUrls: ['http://localhost:8546'], // TOOD: idk if this is work
  blockExplorerUrls: ['https://goerli-explorer.optimism.io'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
};

const network = IN_DEVELOPMENT
  ? localhost
  : TEST_NETWORK
  ? optimismTestNetwork
  : optimism;

export const MintButton = () => {
  const { library, chainId } = useWeb3React();
  const contracts = useCoSoulContracts();

  // From https://docs.metamask.io/guide/ethereum-provider.html#chain-ids
  // const defaultMetaMaskChains = [1, 3, 4, 5, 42];

  const f = async () => {
    // TODO: do better than assert
    console.log('checking provider');
    console.log('libbers', library);
    assert(library);
    console.log('have provider');
    const addOptimism = await library.send('wallet_addEthereumChain', [
      network,
    ]);
    console.log(addOptimism);
  };

  // const switchNetwork = async (
  //   connector: AbstractConnector,
  //   desiredNetwork: AddEthereumChainParameter | number
  // ): Promise<void> => {
  //   const chainId =
  //     typeof desiredNetwork === 'number'
  //       ? desiredNetwork
  //       : desiredNetwork.chainId;
  //   const chainIdHex = `0x${chainId.toString(16)}`;
  //   const isDefaultMetaMaskChain = defaultMetaMaskChains.includes(chainId);
  //   // only use wallet_switchEthereumChain if using default MetaMask chains
  //   if (isDefaultMetaMaskChain || typeof desiredNetwork === 'number') {
  //     await connector.provider?.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId: chainIdHex }],
  //     });
  //   } else {
  //     await connector.provider?.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [{ ...desiredNetwork, chainId: chainIdHex }],
  //     });
  //   }
  // };

  // enqueue a mint cosoul transaction
  const mint = async () => {
    console.log('minty clicky', chainId);
    if (chainId !== Number(network.chainId)) {
      await f();
    } else {
      // TODO: this is not helpful, it just disappears in the onclick event
      // TODO: we need to handle the wrong chain etc etc here
      console.log('going in to mint');
      assert(contracts, 'contracts undefined');
      console.log('now minting');
      try {
        console.log('tryna mint');
        // TODO: this hangs
        const transactionResponse = await contracts.cosoul.mint();
        console.log('did da mint');
        console.log({ transactionResponse });
      } catch (e) {
        console.log('errorminiting', e);
      }
    }
  };
  return <Button onClick={mint}>MANTY</Button>;
};
