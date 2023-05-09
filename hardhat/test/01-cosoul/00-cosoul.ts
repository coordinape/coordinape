import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';

import { CoSoul } from '../../dist/typechain';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

let cosoul: CoSoul;

let deploymentInfo: DeploymentInfo;
let snapshotId: string;

beforeEach(async () => {
  snapshotId = await takeSnapshot();
  deploymentInfo = await deployProtocolFixture();
  cosoul = deploymentInfo.contracts.coSoul;
});

afterEach(() => restoreSnapshot(snapshotId));

it('mints a cosoul', async () => {
  const user1 = deploymentInfo.accounts[1];

  expect(await cosoul.balanceOf(user1.address)).to.eq(0);
  await cosoul.connect(user1.signer).mint();
  expect(await cosoul.balanceOf(user1.address)).to.eq(1);
});

it('returns a tokenId for an address', async () => {
  const user1 = deploymentInfo.accounts[1];
  const user2 = deploymentInfo.accounts[2];

  await cosoul.connect(user1.signer).mint();
  await cosoul.connect(user2.signer).mint();

  const first = await cosoul.tokenOfOwnerByIndex(user1.address, 0);
  const sec = await cosoul.tokenOfOwnerByIndex(user2.address, 0);

  expect(first).to.eq(1);
  expect(sec).to.eq(2);
});

it('setSlot sets data', async () => {
  const owner = deploymentInfo.deployer.signer;
  const user1 = deploymentInfo.accounts[1];

  // user mints
  await cosoul.connect(user1.signer).mint();
  const tokenId = await cosoul.tokenOfOwnerByIndex(user1.address, 0);
  // console.log({ cosoul, contract_owner });
  // expect(await owner.getAddress()).toeq(cosoul.);
  // owner sets a value
  await cosoul.connect(owner).setSlot(0, 6969, tokenId);

  // get the value of the slot
  expect(await cosoul.connect(owner).getSlot(0, tokenId)).to.eq(6969);
});
