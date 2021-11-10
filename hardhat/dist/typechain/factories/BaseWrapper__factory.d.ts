import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { BaseWrapper, BaseWrapperInterface } from "../BaseWrapper";
export declare class BaseWrapper__factory {
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
    static createInterface(): BaseWrapperInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): BaseWrapper;
}
