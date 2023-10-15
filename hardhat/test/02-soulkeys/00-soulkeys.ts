import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';

import { SoulKeys } from '../../typechain';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

const WEI = 0.000000001;
const FIVE_PERCENT_IN_WEI = (1.0 / WEI) * 0.05;

describe('SoulKeys', () => {
  let soulKeys: SoulKeys;

  let deploymentInfo: DeploymentInfo;
  let snapshotId: string;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    soulKeys = deploymentInfo.contracts.soulKeys;
    await soulKeys.setSubjectFeePercent(FIVE_PERCENT_IN_WEI); // TODO: figure out how to calculate a real percentage
    await soulKeys.setFeeDestination(deploymentInfo.accounts[9].address);
    await soulKeys.setProtocolFeePercent(FIVE_PERCENT_IN_WEI); // TODO: figure out how to calculate a real percentage
    const subject = deploymentInfo.accounts[8];
    await soulKeys.connect(subject.signer).buyShares(subject.address, 1);
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('subject can buy their key', async () => {
    const subject = deploymentInfo.accounts[7];
    // is the first key free?
    const initialPrice = await soulKeys.getPrice(0, 1);
    expect(initialPrice).to.eq(0);

    // subject has to buy the first key
    expect(
      await soulKeys.sharesBalance(subject.address, subject.address)
    ).to.eq(0);

    await soulKeys.connect(subject.signer).buyShares(subject.address, 1);

    expect(
      await soulKeys.sharesBalance(subject.address, subject.address)
    ).to.eq(1);
  });

  it('user buys a soulkey, and pricing is correct', async () => {
    const user1 = deploymentInfo.accounts[1];
    const subject = deploymentInfo.accounts[8];

    // there should be 1 supply now and we can figure out price from that
    const supply = await soulKeys.sharesSupply(subject.address);
    expect(supply).to.eq(1);

    // now a user buys a key
    expect(await soulKeys.sharesBalance(subject.address, user1.address)).to.eq(
      0
    );

    const price = await soulKeys.getPrice(supply, 1);
    const fees = price.mul(2).div(20 /* five percent */).toString();
    expect(price.toString()).to.eq('62500000000000');

    const buyPrice = await soulKeys.getBuyPriceAfterFee(subject.address, 1);
    const expectedBuyPrice = price.add(fees);

    expect(expectedBuyPrice.eq(buyPrice));

    await soulKeys.connect(user1.signer).buyShares(subject.address, 1, {
      value: buyPrice,
    });

    expect(await soulKeys.sharesBalance(subject.address, user1.address)).to.eq(
      1
    );
  });

  it('user buys then sells a soulkey', async () => {
    const user1 = deploymentInfo.accounts[1];
    const subject = deploymentInfo.accounts[8];

    expect(await soulKeys.sharesBalance(subject.address, user1.address)).to.eq(
      0
    );

    // buy the share
    const buyPrice = await soulKeys.getBuyPriceAfterFee(subject.address, 1);
    await soulKeys.connect(user1.signer).buyShares(subject.address, 1, {
      value: buyPrice,
    });

    expect(await soulKeys.sharesBalance(subject.address, user1.address)).to.eq(
      1
    );

    // buy another share
    const buyPrice2 = await soulKeys.getBuyPriceAfterFee(subject.address, 1);
    await soulKeys.connect(user1.signer).buyShares(subject.address, 1, {
      value: buyPrice2,
    });

    expect(await soulKeys.sharesBalance(subject.address, user1.address)).to.eq(
      2
    );

    const initialEthBalance = await ethers.provider.getBalance(user1.address);

    // sell one!
    const sellPrice = await soulKeys.getSellPriceAfterFee(subject.address, 1);
    const tx = await soulKeys
      .connect(user1.signer)
      .sellShares(subject.address, 1);
    const txr = await tx.wait();

    const afterEthBalance = await ethers.provider.getBalance(user1.address);

    // make sure we got the proper amount of eth back
    console.log('initial', ethers.utils.formatEther(initialEthBalance));
    console.log('after', ethers.utils.formatEther(afterEthBalance));
    expect(afterEthBalance.toString()).to.eq(
      initialEthBalance
        .add(sellPrice)
        .sub(txr.gasUsed.mul(txr.effectiveGasPrice))
        .toString()
    );

    const tradeSig =
      'Trade(address,address,bool,uint256,uint256,uint256,uint256,uint256)';
    const tradeTopic: string = ethers.utils.id(tradeSig);

    const currentBlock = await ethers.provider.getBlockNumber();
    const rawLogs = await ethers.provider.getLogs({
      address: soulKeys.address,
      topics: [tradeTopic],
      fromBlock: currentBlock - 10,
      toBlock: currentBlock,
    });

    console.log(
      '===>000',
      soulKeys.interface.decodeEventLog(tradeSig, rawLogs[0].data)
    );
    console.log('=====>', rawLogs);
  });
});

// for (let i = 0; i < 100; i++) {
//   const ppf = await pricePlusFees(soulKeys, i);
//   console.log(i, ethers.utils.formatEther(ppf));
// }

// const pricePlusFees = async (soulKeys: SoulKeys, supply: number) => {
//   const price = await soulKeys.getPrice(supply, 1);
//   const fees = price.mul(2).div(20 /* five percent */).toString();
//   return price.add(fees);
// };
