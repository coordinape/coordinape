import assert from 'assert';

import _ from 'lodash';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Button, Text } from '../../ui';

import { chain } from './chains';
import { MintOrBurnButton } from './MintOrBurnButton';
import { useCoSoulContracts } from './useCoSoulContracts';

export const CoSoulButton = ({ onReveal }: { onReveal(): void }) => {
  const { library, chainId, account } = useWeb3React();
  const contracts = useCoSoulContracts();
  const { showError } = useToast();

  const onCorrectChain = chainId === Number(chain.chainId);

  const switchToCorrectChain = async () => {
    try {
      assert(library);
      // add and/or switch to the proper chain
      await library.send('wallet_addEthereumChain', [
        // use chain options without 'gasSettings' key
        _.omit(chain, 'gasSettings'),
      ]);
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };

  if (chain && !onCorrectChain) {
    return (
      <Button color="cta" size="large" onClick={switchToCorrectChain}>
        Switch to {chain.chainName} to Mint
      </Button>
    );
  }

  if (!contracts || !account) {
    // FIXME: better loading state
    return <Text>Loading...</Text>;
  }

  return (
    <MintOrBurnButton
      contracts={contracts}
      address={account}
      onReveal={onReveal}
    />
  );
};
