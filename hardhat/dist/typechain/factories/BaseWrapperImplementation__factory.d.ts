import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { BaseWrapperImplementation, BaseWrapperImplementationInterface } from "../BaseWrapperImplementation";
export declare class BaseWrapperImplementation__factory {
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
    static createInterface(): BaseWrapperImplementationInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): BaseWrapperImplementation;
}
