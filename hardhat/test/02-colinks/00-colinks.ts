/* eslint-disable no-console */
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import { getPriceWithFees } from '../../../src/pages/colinks/explore/getPriceWithFees';
import { CoLinks } from '../../typechain';
import { DeploymentInfo, deployProtocolFixture } from '../utils/deployment';
import { restoreSnapshot, takeSnapshot } from '../utils/network';

chai.use(solidity);
const { expect } = chai;

const FIVE_PERCENT_IN_WEI = BigNumber.from('50000000000000000');
const BASE_FEES_IN_WEI = BigNumber.from('420000000000000');

describe('CoLinks', () => {
  let coLinks: CoLinks;

  let deploymentInfo: DeploymentInfo;
  let snapshotId: string;

  let subject: any;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    coLinks = deploymentInfo.contracts.coLinks;
    await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI);
    await coLinks.setFeeDestination(deploymentInfo.accounts[9].address);
    await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI);
    await coLinks.setBaseFeeMax(BASE_FEES_IN_WEI);
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('throws error if user tries to buy key before subject has bought one', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];

    // subject has to buy the first key
    expect(await coLinks.linkBalance(subject.address, subject.address)).to.eq(
      0
    );

    await expect(
      coLinks.connect(user.signer).buyLinks(subject.address, 1)
    ).to.be.revertedWith("Only the links' target can buy the first link");
  });

  it('allows subject to buy their own key for 0 price', async () => {
    subject = deploymentInfo.accounts[7];

    // ensure first key is free
    const initialPrice = await coLinks.getPrice(0, 1);
    expect(initialPrice).to.eq(0);

    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    expect(await coLinks.linkBalance(subject.address, subject.address)).to.eq(
      1
    );
  });

  describe('with subject has bought their own key already', () => {
    beforeEach(async () => {
      subject = deploymentInfo.accounts[7];
      await coLinks.connect(subject.signer).buyLinks(subject.address, 1);
    });

    it('pricing matches and escrow is good', async () => {
      const startingContractBalance = await ethers.provider.getBalance(
        coLinks.address
      );

      const user = deploymentInfo.accounts[3];
      const userLink = coLinks.connect(user.signer);

      expect(await coLinks.linkBalance(user.address, user.address)).to.eq(0);
      const { price } = await checkBuyPrice(userLink, 0, user.address, 1);

      let userBalance = await ethers.provider.getBalance(user.address);
      const firstBuy = await userLink.buyLinks(user.address, 1, {
        value: price,
      });

      let expectedUserBalance = userBalance;
      const txr = await firstBuy.wait();
      const gas = txr.gasUsed.mul(txr.effectiveGasPrice);
      expectedUserBalance = expectedUserBalance.sub(gas);
      userBalance = await ethers.provider.getBalance(user.address);
      expect(userBalance.toString()).eq(expectedUserBalance.toString());

      const balanceAfterFirstBuy = await ethers.provider.getBalance(
        coLinks.address
      );

      expect(balanceAfterFirstBuy.toString()).eq(startingContractBalance);
      let escrow = balanceAfterFirstBuy;

      const numToFrenzy = 100;
      expectedUserBalance = await ethers.provider.getBalance(user.address);
      // reset the balance
      for (let i = 1; i < numToFrenzy; i++) {
        userBalance = await ethers.provider.getBalance(user.address);

        expect(await coLinks.linkBalance(user.address, user.address)).to.eq(i);
        userBalance = await ethers.provider.getBalance(user.address);
        expect(expectedUserBalance.toString()).eq(userBalance);

        const { price, priceWithoutFees, baseFee } = await checkBuyPrice(
          userLink,
          i,
          user.address,
          1
        );

        userBalance = await ethers.provider.getBalance(user.address);
        expect(expectedUserBalance.toString()).eq(userBalance);

        const beforeTx = await ethers.provider.getBalance(user.address);
        const b = await userLink.buyLinks(user.address, 1, {
          value: price,
        });
        const txr = await b.wait();
        userBalance = await ethers.provider.getBalance(user.address);

        expectedUserBalance = beforeTx
          .sub(price)
          .add(priceWithoutFees.div(20))
          .add(baseFee.div(2));
        expectedUserBalance = expectedUserBalance.sub(
          txr.gasUsed.mul(txr.effectiveGasPrice)
        );

        expect(expectedUserBalance).to.eq(userBalance.toString());

        // make sure the tx cost the real price
        expect(b.value).eq(price);

        // ensure escrow is properly adjusted
        const balanceAfterBuy = await ethers.provider.getBalance(
          coLinks.address
        );
        const expectedEscrow = escrow.add(priceWithoutFees);
        expect(balanceAfterBuy.toString()).eq(expectedEscrow.toString());
        escrow = expectedEscrow;
      }

      expect(ethers.utils.formatEther(escrow)).to.eq('5.13046875');

      expectedUserBalance = await ethers.provider.getBalance(user.address);
      // ok now sell them all
      for (let i = numToFrenzy; i > 1; i--) {
        expect(await coLinks.linkBalance(user.address, user.address)).to.eq(i);
        const { priceWithoutFees, baseFee } = await checkSellPrice(
          userLink,
          i,
          user.address,
          1
        );
        expectedUserBalance = await ethers.provider.getBalance(user.address);

        const tx = await userLink.sellLinks(user.address, 1);
        const txr = await tx.wait();

        const gas = txr.gasUsed.mul(txr.effectiveGasPrice);
        const fees = baseFee.div(2).add(priceWithoutFees.div(20));
        const balanceAfterSell = await ethers.provider.getBalance(
          coLinks.address
        );
        const expectedEscrow = escrow.sub(priceWithoutFees);
        expect(balanceAfterSell.toString()).eq(expectedEscrow.toString());
        escrow = expectedEscrow;

        // check the user balance
        userBalance = await ethers.provider.getBalance(user.address);
        const expectedBalance = expectedUserBalance
          .add(priceWithoutFees)
          .sub(gas)
          .sub(fees);

        expect(expectedBalance.toString()).to.eq(userBalance.toString());
        expectedUserBalance = userBalance;
      }
      expect(ethers.utils.formatEther(escrow)).to.eq('0.0');
    });

    it("user can buy subject's key", async () => {
      const user = deploymentInfo.accounts[1];

      expect(await coLinks.linkBalance(user.address, subject.address)).to.eq(0);

      const link_price = await coLinks.getBuyPriceAfterFee(subject.address, 1);

      await coLinks.connect(user.signer).buyLinks(subject.address, 1, {
        value: link_price,
      });

      expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(1);
    });

    it("user can buy many of subject's key", async () => {
      const user = deploymentInfo.accounts[1];

      expect(await coLinks.linkBalance(user.address, subject.address)).to.eq(0);

      const link_price = await coLinks.getBuyPriceAfterFee(subject.address, 4);

      await coLinks.connect(user.signer).buyLinks(subject.address, 4, {
        value: link_price,
      });

      expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(4);
      expect(await coLinks.linkSupply(subject.address)).to.eq(5);
    });

    it('user buys a coLink, and pricing is correct', async () => {
      const user1 = deploymentInfo.accounts[1];

      // there should be 1 supply now and we can figure out price from that
      const supply = await coLinks.linkSupply(subject.address);
      expect(supply).to.eq(1);

      // now a user buys a key
      expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(
        0
      );

      const price = await coLinks.getPrice(supply, 1);
      expect(price.toString()).to.eq('15625000000000');
      const fees = price.mul(2).div(20 /* five percent */).toString();

      const buyPrice = await coLinks.getBuyPriceAfterFee(subject.address, 1);
      const expectedBuyPrice = price.add(fees).add(BASE_FEES_IN_WEI);
      expect(expectedBuyPrice.toString()).to.eq(buyPrice.toString());

      await coLinks.connect(user1.signer).buyLinks(subject.address, 1, {
        value: buyPrice,
      });

      expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(
        1
      );

      // expect funds transferred to protocol address
      expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(
        1
      );
    });

    it('user buys then sells a coLink', async () => {
      const user1 = deploymentInfo.accounts[1];

      expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(
        0
      );

      // buy the link
      const buyPrice = await coLinks.getBuyPriceAfterFee(subject.address, 1);
      await coLinks.connect(user1.signer).buyLinks(subject.address, 1, {
        value: buyPrice,
      });

      expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(
        1
      );

      // buy another share
      const buyPrice2 = await coLinks.getBuyPriceAfterFee(subject.address, 1);
      await coLinks.connect(user1.signer).buyLinks(subject.address, 1, {
        value: buyPrice2,
      });

      expect(await coLinks.linkBalance(subject.address, user1.address)).to.eq(
        2
      );

      const initialEthBalance = await ethers.provider.getBalance(user1.address);

      // sell one!
      const sellPrice = await coLinks.getSellPriceAfterFee(subject.address, 1);
      const tx = await coLinks
        .connect(user1.signer)
        .sellLinks(subject.address, 1);
      const txr = await tx.wait();

      const afterEthBalance = await ethers.provider.getBalance(user1.address);

      // make sure we got the proper amount of eth back
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

    xit('prints buyPrices manual calc', async () => {
      const pricePlusFees = async (coLinks: CoLinks, supply: number) => {
        const price = await coLinks.getPrice(supply, 1);
        const fees = price.mul(2).div(20 /* five percent */).toString();
        return price.add(fees);
      };

      for (let i = 0; i < 100; i++) {
        const ppf = await pricePlusFees(coLinks, i);
        console.log(i, ' pricePlusFees ', ethers.utils.formatEther(ppf));
      }
    });
  });

  xit('prints buy buyPrices from contract calc', async () => {
    for (let i = 0; i < 10000; i++) {
      const buy_price = await coLinks.getBuyPriceAfterFee(subject.address, 1);
      const supply = await coLinks.linkSupply(subject.address);
      await coLinks.connect(subject.signer).buyLinks(subject.address, 1, {
        value: buy_price,
      });

      console.log(
        i,
        '\t',
        'Link Supply\t',
        supply.toString(),
        'Buy Price (ETH)',
        ethers.utils.formatEther(buy_price),
        'Buy Price (USD)',
        ethToUsd(buy_price, 2205)
      );
    }
  });
});

const buyPrices: Record<number, string> = {
  0: '0',
  1: '437187500000000',
  2: '488750000000000',
  3: '574687500000000',
  4: '695000000000000',
  5: '849687500000000',
  6: '1038750000000000',
  7: '1262187500000000',
  8: '1520000000000000',
  9: '1812187500000000',
  10: '2138750000000000',
  11: '2499687500000000',
  12: '2895000000000000',
  13: '3324687500000000',
  14: '3788750000000000',
  15: '4287187500000000',
  16: '4820000000000000',
  17: '5387187500000000',
  18: '5988750000000000',
  19: '6624687500000000',
  20: '7295000000000000',
  21: '7999687500000000',
  22: '8738750000000000',
  23: '9512187500000000',
  24: '10320000000000000',
  25: '11162187500000000',
  26: '12038750000000000',
  27: '12949687500000000',
  28: '13895000000000000',
  29: '14874687500000000',
  30: '15888750000000000',
  31: '16937187500000000',
  32: '18020000000000000',
  33: '19137187500000000',
  34: '20288750000000000',
  35: '21474687500000000',
  36: '22695000000000000',
  37: '23949687500000000',
  38: '25238750000000000',
  39: '26562187500000000',
  40: '27920000000000000',
  41: '29312187500000000',
  42: '30738750000000000',
  43: '32199687500000000',
  44: '33695000000000000',
  45: '35224687500000000',
  46: '36788750000000000',
  47: '38387187500000000',
  48: '40020000000000000',
  49: '41687187500000000',
  50: '43388750000000000',
  51: '45124687500000000',
  52: '46895000000000000',
  53: '48699687500000000',
  54: '50538750000000000',
  55: '52412187500000000',
  56: '54320000000000000',
  57: '56262187500000000',
  58: '58238750000000000',
  59: '60249687500000000',
  60: '62295000000000000',
  61: '64374687500000000',
  62: '66488750000000000',
  63: '68637187500000000',
  64: '70820000000000000',
  65: '73037187500000000',
  66: '75288750000000000',
  67: '77574687500000000',
  68: '79895000000000000',
  69: '82249687500000000',
  70: '84638750000000000',
  71: '87062187500000000',
  72: '89520000000000000',
  73: '92012187500000000',
  74: '94538750000000000',
  75: '97099687500000000',
  76: '99695000000000000',
  77: '102324687500000000',
  78: '104988750000000000',
  79: '107687187500000000',
  80: '110420000000000000',
  81: '113187187500000000',
  82: '115988750000000000',
  83: '118824687500000000',
  84: '121695000000000000',
  85: '124599687500000000',
  86: '127538750000000000',
  87: '130512187500000000',
  88: '133520000000000000',
  89: '136562187500000000',
  90: '139638750000000000',
  91: '142749687500000000',
  92: '145895000000000000',
  93: '149074687500000000',
  94: '152288750000000000',
  95: '155537187500000000',
  96: '158820000000000000',
  97: '162137187500000000',
  98: '165488750000000000',
  99: '168874687500000000',
  100: '172295000000000000',
};

const sellPrices: Record<number, string> = {
  1: '12500000000000',
  2: '50000000000000',
  3: '112500000000000',
  4: '200000000000000',
  5: '312500000000000',
  6: '450000000000000',
  7: '612500000000000',
  8: '800000000000000',
  9: '1012500000000000',
  10: '1250000000000000',
  11: '1512500000000000',
  12: '1800000000000000',
  13: '2112500000000000',
  14: '2450000000000000',
  15: '2812500000000000',
  16: '3200000000000000',
  17: '3644062500000000',
  18: '4136250000000000',
  19: '4656562500000000',
  20: '5205000000000000',
  21: '5781562500000000',
  22: '6386250000000000',
  23: '7019062500000000',
  24: '7680000000000000',
  25: '8369062500000000',
  26: '9086250000000000',
  27: '9831562500000000',
  28: '10605000000000000',
  29: '11406562500000000',
  30: '12236250000000000',
  31: '13094062500000000',
  32: '13980000000000000',
  33: '14894062500000000',
  34: '15836250000000000',
  35: '16806562500000000',
  36: '17805000000000000',
  37: '18831562500000000',
  38: '19886250000000000',
  39: '20969062500000000',
  40: '22080000000000000',
  41: '23219062500000000',
  42: '24386250000000000',
  43: '25581562500000000',
  44: '26805000000000000',
  45: '28056562500000000',
  46: '29336250000000000',
  47: '30644062500000000',
  48: '31980000000000000',
  49: '33344062500000000',
  50: '34736250000000000',
  51: '36156562500000000',
  52: '37605000000000000',
  53: '39081562500000000',
  54: '40586250000000000',
  55: '42119062500000000',
  56: '43680000000000000',
  57: '45269062500000000',
  58: '46886250000000000',
  59: '48531562500000000',
  60: '50205000000000000',
  61: '51906562500000000',
  62: '53636250000000000',
  63: '55394062500000000',
  64: '57180000000000000',
  65: '58994062500000000',
  66: '60836250000000000',
  67: '62706562500000000',
  68: '64605000000000000',
  69: '66531562500000000',
  70: '68486250000000000',
  71: '70469062500000000',
  72: '72480000000000000',
  73: '74519062500000000',
  74: '76586250000000000',
  75: '78681562500000000',
  76: '80805000000000000',
  77: '82956562500000000',
  78: '85136250000000000',
  79: '87344062500000000',
  80: '89580000000000000',
  81: '91844062500000000',
  82: '94136250000000000',
  83: '96456562500000000',
  84: '98805000000000000',
  85: '101181562500000000',
  86: '103586250000000000',
  87: '106019062500000000',
  88: '108480000000000000',
  89: '110969062500000000',
  90: '113486250000000000',
  91: '116031562500000000',
  92: '118605000000000000',
  93: '121206562500000000',
  94: '123836250000000000',
  95: '126494062500000000',
  96: '129180000000000000',
  97: '131894062500000000',
  98: '134636250000000000',
  99: '137406562500000000',
  100: '140205000000000000',
};
const checkBuyPrice = async (
  coLinks: CoLinks,
  supply: number,
  subject: string,
  amount: number
) => {
  // price from contract
  const priceFromContract = await coLinks.getPrice(supply, 1);

  const baseFee = supply === 0 ? BigNumber.from(0) : BASE_FEES_IN_WEI;
  // manually calc the fees
  const fees = priceFromContract
    .mul(2)
    .div(20 /* five percent */)
    .add(baseFee)
    .toString();
  const priceWithManualFees = priceFromContract.add(fees);

  // price from contract with fees
  const priceFromContractWithFees = await coLinks.getBuyPriceAfterFee(
    subject,
    amount
  );
  expect(priceFromContractWithFees.toString()).to.eq(
    priceWithManualFees.toString(),
    'doesnt match manual fees'
  );

  // price from lookup table
  const p = buyPrices[supply];
  expect(p).to.eq(
    priceFromContractWithFees.toString(),
    'doesnt match lookup table'
  );

  // price from manual calc
  const priceFromManualCalc = ethers.utils.parseEther(getPriceWithFees(supply));
  expect(priceFromManualCalc).to.eq(
    priceFromContractWithFees.toString(),
    'doesnt match function'
  );
  return {
    price: priceFromContractWithFees,
    priceWithoutFees: priceFromContract,
    baseFee,
  };
};

const checkSellPrice = async (
  coLinks: CoLinks,
  supply: number,
  subject: string,
  amount: number
) => {
  // price from contract
  const priceFromContract = await coLinks.getPrice(supply - 1, 1);

  const maxBaseFee = BASE_FEES_IN_WEI;
  let baseFee = priceFromContract.div(10);
  if (baseFee.gt(maxBaseFee)) {
    baseFee = maxBaseFee;
  }

  // manually calc the fees
  const fees = priceFromContract
    .mul(2)
    .div(20 /* five percent */)
    .add(supply === 0 ? 0 : baseFee)
    .toString();
  const priceWithManualFees = priceFromContract.sub(fees);

  // price from contract with fees
  const priceFromContractWithFees = await coLinks.getSellPriceAfterFee(
    subject,
    amount
  );

  expect(priceFromContractWithFees.toString()).to.eq(
    priceWithManualFees.toString(),
    'doesnt match manual fees'
  );

  // price from lookup table
  const p = sellPrices[supply - 1];
  expect(p).to.eq(
    priceFromContractWithFees.toString(),
    'doesnt match lookup table'
  );

  // price from manual calc
  const priceFromManualCalc = ethers.utils.parseEther(
    getPriceWithFees(supply - 1, 'sell')
  );
  expect(priceFromManualCalc.toString()).to.eq(
    priceFromContractWithFees.toString(),
    'doesnt match function'
  );
  return {
    price: priceFromContractWithFees,
    priceWithoutFees: priceFromContract,
    baseFee,
  };
};

function ethToUsd(ethAmount, ethPriceInUsd) {
  // Convert ETH to Wei
  const weiAmount = ethers.utils.parseEther(ethAmount.toString());

  // Calculate the USD value
  const usdValue = weiAmount
    .mul(ethPriceInUsd)
    .div(ethers.constants.WeiPerEther);

  // return usdValue.toString();
  // Convert back to a readable number
  return ethers.utils.formatUnits(usdValue, 'ether');
}
