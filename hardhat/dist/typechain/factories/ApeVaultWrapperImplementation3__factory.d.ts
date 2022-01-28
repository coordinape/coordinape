import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ApeVaultWrapperImplementation3, ApeVaultWrapperImplementation3Interface } from "../ApeVaultWrapperImplementation3";
export declare class ApeVaultWrapperImplementation3__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ApeVaultWrapperImplementation3>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): ApeVaultWrapperImplementation3;
    connect(signer: Signer): ApeVaultWrapperImplementation3__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060f18061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060505760003560e01c80634a627e6114605557806354fd4d50146070578063ba0bba40146076578063bcb4ab0e146091578063e1c7392a14609c575b600080fd5b605d60005481565b6040519081526020015b60405180910390f35b6003605d565b60015460829060ff1681565b60405190151581526020016067565b609a6021600055565b005b609a60015460ff161560ad57600080fd5b6001805460ff19168117905556fea2646970667358221220a1895c1767347061f256e80f95f99226f4e72ecfaee48c91ae7355771e5ad42e64736f6c63430008020033";
    static readonly abi: {
        inputs: never[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): ApeVaultWrapperImplementation3Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): ApeVaultWrapperImplementation3;
}
