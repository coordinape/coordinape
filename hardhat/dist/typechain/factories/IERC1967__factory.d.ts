import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IERC1967, IERC1967Interface } from "../IERC1967";
export declare class IERC1967__factory {
    static readonly abi: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    }[];
    static createInterface(): IERC1967Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC1967;
}
