import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import { CoLinks } from '../../typechain';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

const FIVE_PERCENT_IN_WEI = BigNumber.from('50000000000000000');

describe('CoLinks', () => {
  let coLinks: CoLinks;

  let deploymentInfo: DeploymentInfo;
  let snapshotId: string;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    coLinks = deploymentInfo.contracts.coLinks;
    await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI);
    await coLinks.setFeeDestination(deploymentInfo.accounts[9].address);
    await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI);
    const subject = deploymentInfo.accounts[8];
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('subject can buy their key', async () => {
    const subject = deploymentInfo.accounts[7];
    // is the first key free?
    const initialPrice = await coLinks.getPrice(0, 1);
    expect(initialPrice).to.eq(0);

    // subject has to buy the first key
    expect(await coLinks.linkBalance(subject.address, subject.address)).to.eq(
      0
    );

    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    expect(await coLinks.linkBalance(subject.address, subject.address)).to.eq(
      1
    );
  });

  it('user buys a coLink, and pricing is correct', async () => {
    const user1 = deploymentInfo.accounts[1];
    const subject = deploymentInfo.accounts[8];

    // there should be 1 supply now and we can figure out price from that
    const supply = await coLinks.linkSupply(subject.address);
    expect(supply).to.eq(1);

    // now a user buys a key
    expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(0);

    const price = await coLinks.getPrice(supply, 1);
    const fees = price.mul(2).div(20 /* five percent */).toString();
    expect(price.toString()).to.eq('62500000000000');

    const buyPrice = await coLinks.getBuyPriceAfterFee(subject.address, 1);
    const expectedBuyPrice = price.add(fees);
    // console.log('buyPrice', ethers.utils.formatEther(buyPrice));
    // console.log('expectedBuyPrice', ethers.utils.formatEther(expectedBuyPrice));
    expect(expectedBuyPrice.toString()).to.eq(buyPrice.toString());

    await coLinks.connect(user1.signer).buyLinks(subject.address, 1, {
      value: buyPrice,
    });

    expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(1);
  });

  it('user buys then sells a coLink', async () => {
    const user1 = deploymentInfo.accounts[1];
    const subject = deploymentInfo.accounts[8];

    expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(0);

    // buy the share
    const buyPrice = await coLinks.getBuyPriceAfterFee(subject.address, 1);
    await coLinks.connect(user1.signer).buyLinks(subject.address, 1, {
      value: buyPrice,
    });

    expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(1);

    // buy another share
    const buyPrice2 = await coLinks.getBuyPriceAfterFee(subject.address, 1);
    await coLinks.connect(user1.signer).buyLinks(subject.address, 1, {
      value: buyPrice2,
    });

    expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(2);

    const initialEthBalance = await ethers.provider.getBalance(user1.address);

    // sell one!
    const sellPrice = await coLinks.getSellPriceAfterFee(subject.address, 1);
    const tx = await coLinks
      .connect(user1.signer)
      .sellLinks(subject.address, 1);
    const txr = await tx.wait();

    const afterEthBalance = await ethers.provider.getBalance(user1.address);

    // make sure we got the proper amount of eth back
    // console.log('initial', ethers.utils.formatEther(initialEthBalance));
    // console.log('after', ethers.utils.formatEther(afterEthBalance));
    expect(afterEthBalance.toString()).to.eq(
      initialEthBalance
        .add(sellPrice)
        .sub(txr.gasUsed.mul(txr.effectiveGasPrice))
        .toString()
    );

    const tradeSig =
      'LinkTx(address,address,bool,uint256,uint256,uint256,uint256,uint256)';
    const tradeTopic: string = ethers.utils.id(tradeSig);

    const currentBlock = await ethers.provider.getBlockNumber();
    const rawLogs = await ethers.provider.getLogs({
      address: coLinks.address,
      topics: [tradeTopic],
      fromBlock: currentBlock - 10,
      toBlock: currentBlock,
    });

    expect(rawLogs.length).to.eq(4);
  });
});

// for (let i = 0; i < 100; i++) {
//   const ppf = await pricePlusFees(coLinks, i);
//   console.log(i, ethers.utils.formatEther(ppf));
// }

// const pricePlusFees = async (coLinks: CoLinks, supply: number) => {
//   const price = await coLinks.getPrice(supply, 1);
//   const fees = price.mul(2).div(20 /* five percent */).toString();
//   return price.add(fees);
// };
