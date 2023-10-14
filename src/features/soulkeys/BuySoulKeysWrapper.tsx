import assert from 'assert';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Button, Text } from '../../ui';
import { chain } from '../cosoul/chains';
import { useCoSoulContracts } from '../cosoul/useCoSoulContracts';
import { switchToCorrectChain } from '../web3/chainswitch';

import { BuyOrSellSoulKeys } from './BuyOrSellSoulKeys';

export const BuySoulKeysWrapper = ({ subject }: { subject: string }) => {
  const { library, chainId, account } = useWeb3React();
  const contracts = useCoSoulContracts();
  const { showError } = useToast();

  const onCorrectChain = chainId === Number(chain.chainId);

  const safeSwitchToCorrectChain = async () => {
    try {
      assert(library);
      await switchToCorrectChain(library);
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };

  if (chain && !onCorrectChain) {
    return (
      <Button color="cta" size="large" onClick={safeSwitchToCorrectChain}>
        Switch to {chain.chainName} to Use SoulKeys
      </Button>
    );
  }

  if (!contracts || !account) {
    // FIXME: better loading state
    return <Text>Loading...</Text>;
  }

  return (
    <BuyOrSellSoulKeys
      subject={subject}
      address={account}
      contracts={contracts}
    />
  );
};
