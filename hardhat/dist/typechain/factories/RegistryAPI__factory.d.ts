import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { RegistryAPI, RegistryAPIInterface } from "../RegistryAPI";
export declare class RegistryAPI__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): RegistryAPIInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RegistryAPI;
}
