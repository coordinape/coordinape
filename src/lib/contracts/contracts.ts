// - React Imports
import { useMemo } from 'react';

// - Web3 Import
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import * as ethers from 'ethers';
// import { Maybe } from 'true-myth';

// - Type Imports
// import types/contract
// import types/factories/contract_factory

import addresses from './address';
import { chainIdToNetworkType, defaultNetworkId } from './networks';

export interface ContractAddresses {
  contractName: string;
}

export interface Contracts {
  //Cntrct: ContractName; //(imported from ../../types/contractName)
  Ralph: string; //Just to get rid of a typescript error
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
      // Temp disable because signer is used in the return statement
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      signer = library.getSigner();
    }

    if (!contracts) {
      console.error(`chain not supported`);
      return null;
    }

    return {
      Ralph: 'placeholder',
      // ContractName: contract_factory.connect(contracts.ContractName, signer)
    };
  }, [active, library, chainId]);
  return contract;
}

export { useVaultContracts };
