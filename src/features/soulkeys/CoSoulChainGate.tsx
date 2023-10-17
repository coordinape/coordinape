import assert from 'assert';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Button, Text } from '../../ui';
import { chain } from '../cosoul/chains';
import { Contracts } from '../cosoul/contracts';
import { useCoSoulContracts } from '../cosoul/useCoSoulContracts';
import { switchToCorrectChain } from '../web3/chainswitch';

interface WrapperProps {
  children: (
    contracts: Contracts,
    currentUserAddress: string
  ) => React.ReactNode;
  actionName: string;
}

export const CoSoulChainGate: React.FC<WrapperProps> = ({
  actionName,
  children,
}) => {
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
      <Button
        color="cta"
        size="large"
        onClick={safeSwitchToCorrectChain}
        css={{ m: '$4xl' }}
      >
        Switch to {chain.chainName} to {actionName}
      </Button>
    );
  }

  if (!contracts || !account) {
    // FIXME: better loading state
    return <Text>Loading...</Text>;
  }

  return <>{children(contracts, account)}</>;
};
