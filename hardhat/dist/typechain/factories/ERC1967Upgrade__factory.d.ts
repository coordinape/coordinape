import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC1967Upgrade, ERC1967UpgradeInterface } from "../ERC1967Upgrade";
export declare class ERC1967Upgrade__factory {
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
    static createInterface(): ERC1967UpgradeInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC1967Upgrade;
}
