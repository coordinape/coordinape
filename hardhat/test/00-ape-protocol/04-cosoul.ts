import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';

import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

chai.use(solidity);
// const { expect } = chai;

describe('CoSoul', () => {
  let deploymentInfo: DeploymentInfo;
  let snapshotId: string;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('should be able to mint w/ a signature', async () => {
    const owner = deploymentInfo.deployer.signer;
    const user1 = deploymentInfo.accounts[1];
    const nonce = 0;

    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [user1.address, nonce]
    );
    const signature = await owner.signMessage(ethers.utils.arrayify(hash));

    const idk = await deploymentInfo.contracts.coSoul
      .connect(user1.signer)
      .mintWithSignature(nonce, signature);

    console.log(idk);
  });
});
