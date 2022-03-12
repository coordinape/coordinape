import { Signer } from 'ethers';
export declare function unlockSigner(address: string, { ethers, network }: {
    ethers: any;
    network: any;
}): Promise<Signer>;
