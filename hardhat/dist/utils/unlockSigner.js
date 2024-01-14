import { JsonRpcProvider } from '@ethersproject/providers';
import { GANACHE_URL, GANACHE_NETWORK_NAME } from '../constants';
export async function unlockSigner(address, { ethers, network }) {
    const { provider, name } = network;
    if (name === GANACHE_NETWORK_NAME) {
        await provider.request({ method: 'evm_addAccount', params: [address, ''] });
        await provider.request({
            method: 'personal_unlockAccount',
            params: [address, '', 0],
        });
        // we do this because Hardhat's provider code doesn't allow
        // the account to be used even after it's unlocked
        const newProvider = new JsonRpcProvider(GANACHE_URL);
        return newProvider.getSigner(address);
    }
    await provider.request({
        method: 'hardhat_impersonateAccount',
        params: [address],
    });
    return ethers.provider.getSigner(address);
}
