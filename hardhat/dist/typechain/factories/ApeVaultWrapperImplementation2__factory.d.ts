import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ApeVaultWrapperImplementation2, ApeVaultWrapperImplementation2Interface } from "../ApeVaultWrapperImplementation2";
export declare class ApeVaultWrapperImplementation2__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ApeVaultWrapperImplementation2>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): ApeVaultWrapperImplementation2;
    connect(signer: Signer): ApeVaultWrapperImplementation2__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060f18061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060505760003560e01c80634a627e6114605557806354fd4d50146070578063ba0bba40146076578063bcb4ab0e146091578063e1c7392a14609c575b600080fd5b605d60005481565b6040519081526020015b60405180910390f35b6002605d565b60015460829060ff1681565b60405190151581526020016067565b609a6016600055565b005b609a60015460ff161560ad57600080fd5b6001805460ff19168117905556fea264697066735822122059c2117746db5b85a65c77c76fd73079e9e9fed2a3d06908124aa169168ca3cd64736f6c63430008020033";
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
    static createInterface(): ApeVaultWrapperImplementation2Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): ApeVaultWrapperImplementation2;
}
