import chai from 'chai';
import { solidity } from 'ethereum-waffle';

import { USDC_ADDRESS, USDC_YVAULT_ADDRESS } from '../../constants';
import { createApeVault } from '../utils/ApeVault/createApeVault';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { resetNetwork } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

describe('ApeVaultFactory', () => {
  let deploymentInfo: DeploymentInfo;

  beforeEach(async () => {
    deploymentInfo = await deployProtocolFixture();
  });

  it('should create vault successfully', async () => {
    const user0 = deploymentInfo.accounts[0];
    const vault = await createApeVault(
      deploymentInfo.contracts.apeToken,
      deploymentInfo.contracts.apeVaultFactory,
      user0
    );

    expect(await vault.owner()).to.equal(user0.address);
    expect(await vault.token()).to.equal(USDC_ADDRESS);
    expect(await vault.vault()).to.equal(USDC_YVAULT_ADDRESS);
  });

  afterEach(resetNetwork);
});
