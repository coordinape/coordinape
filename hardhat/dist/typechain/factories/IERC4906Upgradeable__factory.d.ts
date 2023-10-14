import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IERC4906Upgradeable, IERC4906UpgradeableInterface } from "../IERC4906Upgradeable";
export declare class IERC4906Upgradeable__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
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
        anonymous?: undefined;
    })[];
    static createInterface(): IERC4906UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC4906Upgradeable;
}
