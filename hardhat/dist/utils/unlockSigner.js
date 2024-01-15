"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockSigner = void 0;
const providers_1 = require("@ethersproject/providers");
const constants_1 = require("../constants");
async function unlockSigner(address, { ethers, network }) {
    const { provider, name } = network;
    if (name === constants_1.GANACHE_NETWORK_NAME) {
        await provider.request({ method: 'evm_addAccount', params: [address, ''] });
        await provider.request({
            method: 'personal_unlockAccount',
            params: [address, '', 0],
        });
        // we do this because Hardhat's provider code doesn't allow
        // the account to be used even after it's unlocked
        const newProvider = new providers_1.JsonRpcProvider(constants_1.GANACHE_URL);
        return newProvider.getSigner(address);
    }
    await provider.request({
        method: 'hardhat_impersonateAccount',
        params: [address],
    });
    return ethers.provider.getSigner(address);
}
exports.unlockSigner = unlockSigner;
