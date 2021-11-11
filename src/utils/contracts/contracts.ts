// - React Imports
import { useMemo } from 'react';

// - Web3 Import
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as ethers from 'ethers';
// import { Maybe } from 'true-myth';

// - Type Imports
import addresses from './address';
import { chainIdToNetworkType, defaultNetworkId } from './networks';
import { ApeRouter__factory, ApeRouter } from './typechain';
import { ApeVaultFactory } from './typechain/ApeVaultFactory';
import { ApeVaultWrapper } from './typechain/ApeVaultWrapper';
import { ApeVaultFactory__factory } from './typechain/factories/ApeVaultFactory__factory';
import { ApeVaultWrapper__factory } from './typechain/factories/ApeVaultWrapper__factory';
import { FeeRegistry__factory } from './typechain/factories/FeeRegistry__factory';
import { IApeVault__factory } from './typechain/factories/IApeVault__factory';
import { FeeRegistry } from './typechain/FeeRegistry';
import { IApeVault } from './typechain/IApeVault';
// import { VaultAPI } from '../../../hardhat/typechain/VaultAPI';

export interface ContractAddresses {
  ApeVaultFactory: string;
  FeeRegistry: string;
  IApeVault: string;
  ApeRouter: string;
  ApeVaultWrapper: string;
}

export interface Contracts {
  ApeVaultFactory: ApeVaultFactory;
  FeeRegistry: FeeRegistry;
  IApeVault: IApeVault;
  ApeRouter: ApeRouter;
  ApeVaultWrapper: ApeVaultWrapper;
}

function useVaultContracts(): Contracts | null {
  const context = useWeb3React<Web3Provider>();
  const { library, active, chainId } = context;
  const contract = useMemo((): Contracts | null => {
    let contracts;
    let signer: ethers.VoidSigner | ethers.Signer = new ethers.VoidSigner(
      ethers.constants.AddressZero
    );
    if (!library) {
      contracts = addresses[chainIdToNetworkType(defaultNetworkId)];
    } else {
      if (!chainId) {
        console.error(`No chainid detected;`);
        return null;
      }

      contracts = addresses[chainIdToNetworkType(chainId)];
      signer = library.getSigner();
    }

    if (!contracts) {
      console.error(`chain not supported`);
      return null;
    }
    return {
      ApeRouter: ApeRouter__factory.connect(contracts.ApeRouter, signer),
      ApeVaultFactory: ApeVaultFactory__factory.connect(
        contracts.ApeVaultFactory,
        signer
      ),
      ApeVaultWrapper: ApeVaultWrapper__factory.connect(
        contracts.ApeVaultWrapper,
        signer
      ),
      FeeRegistry: FeeRegistry__factory.connect(contracts.FeeRegistry, signer),
      IApeVault: IApeVault__factory.connect(contracts.IApeVault, signer),
    };
  }, [active, library, chainId]);
  return contract;
}

export { useVaultContracts };
