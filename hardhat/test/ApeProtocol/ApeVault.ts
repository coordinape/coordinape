import { Contract, Signer } from 'ethers';
import { ethers, deployments } from 'hardhat';
import { expect } from 'chai';

import {
  ApeVaultFactory__factory,
  ApeVaultWrapper__factory,
} from '../../typechain';

describe('Ape Vault', () => {
  const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  let accounts: Signer[];

  before(async () => {
    accounts = await ethers.getSigners();
    await deployments.fixture();
  });

  it('Test vault creation', async () => {
    const apeVaultFactoryAddress = (await deployments.get('ApeVaultFactory'))
      .address;
    const apeVaultFactory = ApeVaultFactory__factory.connect(
      apeVaultFactoryAddress,
      accounts[0]
    );

    const tx = await apeVaultFactory.createApeVault(ZERO_ADDRESS, ZERO_ADDRESS);
    const receipt = await tx.wait();
    receipt &&
      receipt.events?.forEach(async event => {
        if (event?.event == 'VaultCreated') {
          const vaultAddress = event.args?.vault;
          const vault = ApeVaultWrapper__factory.connect(
            vaultAddress,
            accounts[0]
          );
          expect(await vault.owner()).to.equal(await accounts[0].getAddress());
        }
      });
  });
});
