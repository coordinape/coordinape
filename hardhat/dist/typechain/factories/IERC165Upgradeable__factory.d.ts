import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IERC165Upgradeable, IERC165UpgradeableInterface } from "../IERC165Upgradeable";
export declare class IERC165Upgradeable__factory {
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
    static createInterface(): IERC165UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC165Upgradeable;
}
