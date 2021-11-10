import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Coordinape, CoordinapeInterface } from "../Coordinape";
export declare class Coordinape__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<Coordinape>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): Coordinape;
    connect(signer: Signer): Coordinape__factory;
    static readonly bytecode = "0x610154610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100565760003560e01c806308bd6e7e1461005b578063ad7430cc14610079578063f384524b14610097578063f3e4b0b9146100b5575b600080fd5b6100636100d3565b60405161007091906100f6565b60405180910390f35b6100816100d8565b60405161008e91906100f6565b60405180910390f35b61009f6100dd565b6040516100ac91906100f6565b60405180910390f35b6100bd6100e2565b6040516100ca91906100f6565b60405180910390f35b600481565b600281565b600081565b600181565b6100f081610111565b82525050565b600060208201905061010b60008301846100e7565b92915050565b600060ff8216905091905056fea2646970667358221220dd2b7b0ce3c889dfdc987206e76e412fd6e53a0b751e070a2357cd095523743d64736f6c63430008020033";
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
    static createInterface(): CoordinapeInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Coordinape;
}
