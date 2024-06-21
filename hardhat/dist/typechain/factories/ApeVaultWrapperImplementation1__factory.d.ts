import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ApeVaultWrapperImplementation1, ApeVaultWrapperImplementation1Interface } from "../ApeVaultWrapperImplementation1";
export declare class ApeVaultWrapperImplementation1__factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ApeVaultWrapperImplementation1>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): ApeVaultWrapperImplementation1;
    connect(signer: Signer): ApeVaultWrapperImplementation1__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060f18061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060505760003560e01c80634a627e6114605557806354fd4d50146070578063ba0bba40146076578063bcb4ab0e146091578063e1c7392a14609c575b600080fd5b605d60005481565b6040519081526020015b60405180910390f35b6001605d565b60015460829060ff1681565b60405190151581526020016067565b609a600b600055565b005b609a60015460ff161560ad57600080fd5b6001805460ff19168117905556fea26469706673582212203e86e39933824268d540dc3af52640e0a772be724f944a02dd6feae26c5bd77b64736f6c63430008020033";
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
    static createInterface(): ApeVaultWrapperImplementation1Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): ApeVaultWrapperImplementation1;
}
