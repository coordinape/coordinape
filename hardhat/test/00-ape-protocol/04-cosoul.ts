import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';

import { CoSoul } from '../../typechain';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

let cosoul: CoSoul;

describe('CoSoul', () => {
  let deploymentInfo: DeploymentInfo;
  let snapshotId: string;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    cosoul = deploymentInfo.contracts.coSoul;
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('should be able to mint', async () => {
    const user1 = deploymentInfo.accounts[1];

    expect(await cosoul.balanceOf(user1.address)).to.eq(0);
    await cosoul.connect(user1.signer).mint();
    expect(await cosoul.balanceOf(user1.address)).to.eq(1);
  });

  it('should be return a tokenId for an address', async () => {
    const user1 = deploymentInfo.accounts[1];
    const user2 = deploymentInfo.accounts[2];

    await cosoul.connect(user1.signer).mint();
    await cosoul.connect(user2.signer).mint();

    const first = await cosoul.tokenOfOwnerByIndex(user1.address, 0);
    const sec = await cosoul.tokenOfOwnerByIndex(user2.address, 0);

    expect(first).to.eq(1);
    expect(sec).to.eq(2);
  });

  it('should be able to set a slot', async () => {
    const owner = deploymentInfo.deployer.signer;
    const user1 = deploymentInfo.accounts[1];

    // user mints
    await cosoul.connect(user1.signer).mint();
    const tokenId = await cosoul.tokenOfOwnerByIndex(user1.address, 0);
    // console.log({ cosoul, contract_owner });
    // expect(await owner.getAddress()).toeq(cosoul.);
    // owner sets a value
    await cosoul.connect(owner).setSlot(0, 6969, tokenId);

    console.log('beep pop boop');
    // get the value of the slot
    expect(await cosoul.connect(owner).getSlot(0, tokenId)).to.eq(6969);
  });
  xit('should be able to mint w/ a signature', async () => {
    const owner = deploymentInfo.deployer.signer;
    const user1 = deploymentInfo.accounts[1];
    const nonce = 0;

    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256'],
      [user1.address, nonce]
    );
    console.log({ user1, owner, hash });

    const signature = await owner.signMessage(ethers.utils.arrayify(hash));

    const idk = await deploymentInfo.contracts.coSoul
      .connect(user1.signer)
      .mintWithSignature(nonce, signature);

    console.log(idk);
  });
});
