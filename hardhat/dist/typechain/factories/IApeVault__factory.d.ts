import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IApeVault, IApeVaultInterface } from "../IApeVault";
export declare class IApeVault__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IApeVaultInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IApeVault;
}
