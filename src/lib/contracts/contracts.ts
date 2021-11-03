// - React Imports
import { useMemo } from 'react';

// - Web3 Import
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as ethers from 'ethers';
// import { Maybe } from 'true-myth';

// - Type Imports
import { VaultAPI } from '../../types/VaultAPI';

import addresses from './address';
import { chainIdToNetworkType, defaultNetworkId } from './networks';

import { ApeVaultFactory } from 'types/ApeVaultFactory';
import { ApeVaultWrapper } from 'types/ApeVaultWrapper';
import { ApeVaultFactory__factory } from 'types/factories/ApeVaultFactory__factory';
import { ApeVaultWrapper__factory } from 'types/factories/ApeVaultWrapper__factory';
import { VaultAPI__factory } from 'types/factories/VaultAPI__factory';

export interface ContractAddresses {
  VaultAPI: string;
  ApeVaultFactory: string;
  ApeVaultWrapper: string;
}

export interface Contracts {
  vaultApi: VaultAPI; //(imported from ../../types/contractName)
  vaultFactory: ApeVaultFactory;
  vaultWrapper: ApeVaultWrapper;
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
      vaultApi: VaultAPI__factory.connect(contracts.VaultAPI, signer),
      vaultFactory: ApeVaultFactory__factory.connect(
        contracts.ApeVaultFactory,
        signer
      ),
      vaultWrapper: ApeVaultWrapper__factory.connect(
        contracts.ApeVaultWrapper,
        signer
      ),
    };
  }, [active, library, chainId]);
  return contract;
}

export { useVaultContracts };
