import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC165Upgradeable, ERC165UpgradeableInterface } from "../ERC165Upgradeable";
export declare class ERC165Upgradeable__factory {
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
    static createInterface(): ERC165UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC165Upgradeable;
}
