import assert from 'assert';

import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';

import { CoSoul } from '../../typechain';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

const paddedHex = (
  n: number,
  length: number = 8,
  prefix: boolean = false
): string => {
  const _hex = n.toString(16); // convert number to hexadecimal
  const hexLen = _hex.length;
  const extra = '0'.repeat(length - hexLen);
  let pre = '0x';
  if (!prefix) {
    pre = '';
  }
  if (hexLen === length) {
    return pre + _hex;
  } else if (hexLen < length) {
    return pre + extra + _hex;
  } else {
    return '?'.repeat(length); //it's hardf for pgive to need more than four bytes
  }
};

const getPayload = (pGIVE: number, tokenId: number): string =>
  paddedHex(pGIVE) + paddedHex(tokenId);

chai.use(solidity);
const { expect } = chai;

describe('CoSoul', () => {
  let cosoul: CoSoul;

  let deploymentInfo: DeploymentInfo;
  let snapshotId: string;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    cosoul = deploymentInfo.contracts.coSoul;
    assert(process.env.COSOUL_BASE_URI);
    await cosoul.setBaseURI(process.env.COSOUL_BASE_URI);
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('mints a cosoul', async () => {
    const user1 = deploymentInfo.accounts[1];

    expect(await cosoul.balanceOf(user1.address)).to.eq(0);
    await cosoul
      .connect(user1.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });
    expect(await cosoul.balanceOf(user1.address)).to.eq(1);
  });

  it('returns a tokenId for an address', async () => {
    const user1 = deploymentInfo.accounts[1];
    const user2 = deploymentInfo.accounts[2];

    await cosoul
      .connect(user1.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });
    await cosoul
      .connect(user2.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });

    const first = await cosoul.tokenOfOwnerByIndex(user1.address, 0);
    const sec = await cosoul.tokenOfOwnerByIndex(user2.address, 0);

    expect(first).to.eq(1);
    expect(sec).to.eq(2);
  });

  it('setSlot sets data and emits event', async () => {
    const owner = deploymentInfo.deployer.signer;
    const user1 = deploymentInfo.accounts[1];

    // user mints
    await cosoul
      .connect(user1.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });
    const tokenId = await cosoul.tokenOfOwnerByIndex(user1.address, 0);

    const contract = cosoul.connect(owner);
    // owner sets a value
    await expect(contract.setSlot(0, 6969, tokenId))
      .to.emit(cosoul, 'MetadataUpdate')
      .withArgs(tokenId);

    // get the value of the slot
    expect(await cosoul.connect(owner).getSlot(0, tokenId)).to.eq(6969);
  });

  it('returns a tokenId for addresses set by as batch', async () => {
    const owner = deploymentInfo.deployer.signer;
    const user1 = deploymentInfo.accounts[1];
    const user2 = deploymentInfo.accounts[2];

    await cosoul
      .connect(user1.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });
    await cosoul
      .connect(user2.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });
    const first = await cosoul.tokenOfOwnerByIndex(user1.address, 0);
    const sec = await cosoul.tokenOfOwnerByIndex(user2.address, 0);

    let payload = paddedHex(0, 2, true) + getPayload(6969, first.toNumber());
    payload += getPayload(420, sec.toNumber());
    const contract = cosoul.connect(owner);
    await contract.batchSetSlot_UfO(payload);
    expect(await cosoul.connect(owner).getSlot(0, first)).to.eq(6969);
    expect(await cosoul.connect(owner).getSlot(0, sec)).to.eq(420);
  });

  it('tokenURI returns the full URI', async () => {
    const user1 = deploymentInfo.accounts[1];

    // user mints
    await cosoul
      .connect(user1.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });

    expect(await cosoul.tokenURI(1)).to.eq(process.env.COSOUL_BASE_URI + '1');
  });

  it('setBaseURI changes baseURI', async () => {
    const user1 = deploymentInfo.accounts[1];
    const owner = deploymentInfo.deployer.signer;

    // user mints
    await cosoul
      .connect(user1.signer)
      .mint({ value: ethers.utils.parseUnits('10', 'gwei') });
    expect(await cosoul.tokenURI(1)).to.eq(process.env.COSOUL_BASE_URI + '1');

    // owner changes baseURI
    await cosoul.connect(owner).setBaseURI('https://api.coordinoop.com/nft/');

    expect(await cosoul.tokenURI(1)).to.eq('https://api.coordinoop.com/nft/1');
  });

  it('setBaseURI errors if not owner', async () => {
    const user1 = deploymentInfo.accounts[1];

    // user mints and it throws an exception
    await expect(
      cosoul.connect(user1.signer).setBaseURI('https://api.coordinoop.com/nft/')
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  describe('cosoul mint fees', () => {
    let user1, owner;
    beforeEach(async () => {
      user1 = deploymentInfo.accounts[1].signer;
      owner = deploymentInfo.deployer.signer;
      // set mint fee from owner
      await cosoul
        .connect(owner)
        .setMintFee(ethers.utils.parseUnits('.0032', 'ether'));
    });

    it("errors if mint fee isn't passed", async () => {
      // try to mint with no fee - expect error
      await expect(cosoul.connect(user1).mint({ value: 0 })).to.be.revertedWith(
        'CoSoul: Insufficient mint fee'
      );
    });

    it('errors if mint fee is too low', async () => {
      // try to mint with inadequate fee - expect error
      await expect(
        cosoul.connect(user1).mint({ value: 10 })
      ).to.be.revertedWith('CoSoul: Insufficient mint fee');
    });

    it('succeeds with exact mint fee', async () => {
      // try to mint with correct fee - success

      const prevBalance = await ethers.provider.getBalance(owner.address);

      await cosoul
        .connect(user1)
        .mint({ value: ethers.utils.parseUnits('.0032', 'ether') });

      // expect owner to have received mint fee
      const newBalance = await ethers.provider.getBalance(owner.address);
      expect(newBalance.sub(prevBalance)).to.eq(
        ethers.utils.parseUnits('.0032', 'ether')
      );
    });

    it('succeeds with excess mint fee', async () => {
      await cosoul
        .connect(user1)
        .mint({ value: ethers.utils.parseUnits('.32', 'ether') });
    });
  });

  describe('mintTo', () => {
    it('allows signer to mintTo another address', async () => {
      const user1 = deploymentInfo.accounts[1];
      const owner = deploymentInfo.deployer.signer;

      expect(await cosoul.connect(owner).mintTo(user1.address));
    });

    it('prohibits non authorized mintTo', async () => {
      const user1 = deploymentInfo.accounts[1];
      const user2 = deploymentInfo.accounts[2];

      await expect(
        cosoul.connect(user1.signer).mintTo(user2.address)
      ).to.be.revertedWith('');
    });

    it('errors if address already has a cosoul', async () => {
      const user3 = deploymentInfo.accounts[3];
      const owner = deploymentInfo.deployer.signer;

      await cosoul.connect(user3.signer).mint();

      await expect(
        cosoul.connect(owner).mintTo(user3.address)
      ).to.be.revertedWith('Address already has a cosoul');
    });
  });
});
export {};
