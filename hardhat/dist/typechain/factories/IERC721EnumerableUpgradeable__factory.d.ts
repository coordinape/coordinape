import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IERC721EnumerableUpgradeable, IERC721EnumerableUpgradeableInterface } from "../IERC721EnumerableUpgradeable";
export declare class IERC721EnumerableUpgradeable__factory {
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
    static createInterface(): IERC721EnumerableUpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC721EnumerableUpgradeable;
}
