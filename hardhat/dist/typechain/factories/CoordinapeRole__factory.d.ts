import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CoordinapeRole, CoordinapeRoleInterface } from "../CoordinapeRole";
export declare class CoordinapeRole__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<CoordinapeRole>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): CoordinapeRole;
    connect(signer: Signer): CoordinapeRole__factory;
    static readonly bytecode = "0x610112610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060475760003560e01c80631c681a4214604c5780632a0acc6a1460665780637a2800b7146080575b600080fd5b6052609a565b604051605d919060b6565b60405180910390f35b606c609f565b6040516077919060b6565b60405180910390f35b608660a4565b6040516091919060b6565b60405180910390f35b600181565b600481565b600281565b60b08160cf565b82525050565b600060208201905060c9600083018460a9565b92915050565b600060ff8216905091905056fea264697066735822122042e1fda78a1d004c201e742fd0002ffea51176670842d6d1cc16cdc8a1d06efc64736f6c63430008020033";
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
    static createInterface(): CoordinapeRoleInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): CoordinapeRole;
}
