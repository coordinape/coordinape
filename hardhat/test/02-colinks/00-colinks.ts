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
  let user: any;
  let feeDestination: any;

  beforeEach(async () => {
    snapshotId = await takeSnapshot();
    deploymentInfo = await deployProtocolFixture();
    coLinks = deploymentInfo.contracts.coLinks;
  });

  afterEach(() => restoreSnapshot(snapshotId));

  it('works without any config set', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    const price = BigNumber.from(15625000000000);

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);

    await coLinks.connect(user.signer).buyLinks(subject.address, 1, {
      value: price,
    });

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(price);
  });

  it('errors if setProtocolFeePercent is above 10 percent', async () => {
    await expect(
      (async () =>
        await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI.mul(3)))()
    ).to.be.revertedWith('Fee too high');
  });

  it('allow setProtocolFeePercent up to 10 percent', async () => {
    await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI.mul(2));
    expect(await coLinks.protocolFeePercent()).to.eq(
      ethers.utils.parseUnits('0.10', 'ether')
    );
  });

  it('errors if setTargetFeePercent is above 10 percent', async () => {
    await expect(
      (async () =>
        await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI.mul(3)))()
    ).to.be.revertedWith('Fee too high');
  });

  it('allow setTargetFeePercent up to 10 percent', async () => {
    await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI.mul(2));
    expect(await coLinks.targetFeePercent()).to.eq(
      ethers.utils.parseUnits('0.10', 'ether')
    );
  });

  it('errors if setBaseFeeMax is above 1/1000 ether', async () => {
    await expect(
      (async () =>
        await coLinks.setBaseFeeMax(ethers.utils.parseUnits('2', 'finney')))()
    ).to.be.revertedWith('Fee too high');
  });

  it('allow setBaseFeeMax up to 1/1000 ether', async () => {
    await coLinks.setBaseFeeMax(ethers.utils.parseUnits('1', 'finney'));
    expect(await coLinks.baseFeeMax()).to.eq(
      ethers.utils.parseUnits('1', 'finney')
    );
  });

  it('allow setBaseFeeMax of .00042 eth', async () => {
    await coLinks.setBaseFeeMax(ethers.utils.parseUnits('0.00042', 'ether'));
    expect(await coLinks.baseFeeMax()).to.eq(
      ethers.utils.parseUnits('0.00042', 'ether')
    );
  });

  it('errors if too little value sent', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    // errors if price is too small (1 wei less than required)
    const price = BigNumber.from(15624999999999);

    await expect(
      coLinks.connect(user.signer).buyLinks(subject.address, 1, {
        value: price,
      })
    ).to.be.revertedWith('Inexact payment');
  });

  it('errors if excess value sent to buy', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    // errors if price is too small (1 wei more than required)
    const price = BigNumber.from(15625000000001);

    await expect(
      coLinks.connect(user.signer).buyLinks(subject.address, 1, {
        value: price,
      })
    ).to.be.revertedWith('Inexact payment');
  });

  it('works with protocol fees only (no base fee)', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];
    await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI);
    const fee_destination = deploymentInfo.accounts[9];
    await coLinks.setFeeDestination(fee_destination.address);
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    const exp_price = BigNumber.from(15625000000000).mul(105).div(100);
    const price = await coLinks.getPrice(1, 1);
    const buy_price = await coLinks.getBuyPriceAfterFee(subject.address, 1);

    expect(buy_price).to.eq(exp_price);

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);
    const fee_dest_bal_before = await ethers.provider.getBalance(
      fee_destination.address
    );

    await coLinks.connect(user.signer).buyLinks(subject.address, 1, {
      value: buy_price,
    });

    const fee_dest_bal = await ethers.provider.getBalance(
      fee_destination.address
    );
    const escrow_bal = await ethers.provider.getBalance(coLinks.address);

    const expected_fees = BigNumber.from(price)
      .mul(FIVE_PERCENT_IN_WEI)
      .div(ethers.utils.parseUnits('1', 'ether'));

    const expected_escrow = BigNumber.from(buy_price).div(105).mul(100);

    expect(fee_dest_bal).to.eq(fee_dest_bal_before.add(expected_fees));
    expect(escrow_bal).to.eq(expected_escrow);
  });

  it('buy and sell links with max fees does not error', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];
    await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI.mul(2));
    await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI.mul(2));
    const fee_destination = deploymentInfo.accounts[9];
    await coLinks.setFeeDestination(fee_destination.address);
    const base_fee = ethers.utils.parseUnits('1', 'finney');
    await coLinks.setBaseFeeMax(base_fee);
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);

    let buy_price: BigNumber;
    let price: BigNumber;
    let fees: BigNumber;
    let subject_bal_before: BigNumber;
    let subject_bal_after: BigNumber;

    const numFrenzy = 20;

    // buy 10
    for (let i = 1; i < numFrenzy; i++) {
      price = await coLinks.getPrice(i, 1);
      buy_price = await coLinks.getBuyPriceAfterFee(subject.address, 1);

      subject_bal_before = await ethers.provider.getBalance(subject.address);

      await coLinks.connect(user.signer).buyLinks(subject.address, 1, {
        value: buy_price,
      });

      subject_bal_after = await ethers.provider.getBalance(subject.address);
      fees = price.mul(10).div(100).add(base_fee.div(2));

      // expect subject to receive fees
      expect(subject_bal_after).to.eq(subject_bal_before.add(fees));
    }

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(
      await coLinks.getPrice(1, 19)
    );

    // sell them all
    for (let i = numFrenzy; i > 1; i--) {
      price = await coLinks.getSellPrice(subject.address, 1);
      subject_bal_before = await ethers.provider.getBalance(subject.address);

      await coLinks.connect(user.signer).sellLinks(subject.address, 1);
    }

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);
  });

  it('works with target fees only (no base fee)', async () => {
    const subject = deploymentInfo.accounts[7];
    const user = deploymentInfo.accounts[1];
    await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI);
    await coLinks.connect(subject.signer).buyLinks(subject.address, 1);

    const fee_destination = deploymentInfo.accounts[9];
    await coLinks.setFeeDestination(fee_destination.address);
    const price = BigNumber.from(15625000000000);
    const exp_price = price.mul(105).div(100);
    const price_with_fee = await coLinks.getBuyPriceAfterFee(
      subject.address,
      1
    );

    expect(price_with_fee).to.eq(exp_price);

    const subject_bal_before = await ethers.provider.getBalance(
      subject.address
    );

    expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);

    const fee_dest_bal_before = await ethers.provider.getBalance(
      fee_destination.address
    );

    await coLinks.connect(user.signer).buyLinks(subject.address, 1, {
      value: price_with_fee,
    });

    const fee_dest_bal = await ethers.provider.getBalance(
      fee_destination.address
    );
    const escrow_bal = await ethers.provider.getBalance(coLinks.address);
    const subject_bal = await ethers.provider.getBalance(subject.address);

    const expected_escrow = BigNumber.from(price_with_fee).div(105).mul(100);
    const expected_subject_bal = subject_bal_before.add(
      BigNumber.from(price).mul(5).div(100)
    );

    expect(fee_dest_bal).to.eq(fee_dest_bal_before); // no protocol fees set
    expect(escrow_bal).to.eq(expected_escrow);
    expect(subject_bal).to.eq(expected_subject_bal);
  });

  describe('with contract setup', () => {
    beforeEach(async () => {
      await coLinks.setTargetFeePercent(FIVE_PERCENT_IN_WEI);
      feeDestination = deploymentInfo.accounts[9];
      await coLinks.setFeeDestination(feeDestination.address);
      await coLinks.setProtocolFeePercent(FIVE_PERCENT_IN_WEI);
      await coLinks.setBaseFeeMax(BASE_FEES_IN_WEI);
      user = deploymentInfo.accounts[1];
      subject = deploymentInfo.accounts[7];
    });

    it('throws error if user tries to buy key before subject has bought one', async () => {
      // subject has to buy the first key
      expect(await coLinks.linkBalance(subject.address, subject.address)).to.eq(
        0
      );

      await expect(
        coLinks.connect(user.signer).buyLinks(subject.address, 1)
      ).to.be.revertedWith("Only the links' target can buy the first link");
    });

    it('allows subject to buy their own key for 0 price', async () => {
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
        await coLinks.connect(subject.signer).buyLinks(subject.address, 1);
      });

      it('properly handles bulk buys and bulk sells', async () => {
        expect(await coLinks.linkBalance(user.address, user.address)).to.eq(0);

        const userLink = coLinks.connect(user.signer);

        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          0
        );

        // price is sum of first 10 prices
        const priceVals = Object.values(prices).slice(1, 11);
        const expected_price = priceVals.reduce(
          (a, b) => BigNumber.from(a).add(BigNumber.from(b)),
          BigNumber.from(0)
        );

        const expected_price_with_fees = expected_price
          .mul(110)
          .div(100)
          .add(BASE_FEES_IN_WEI);

        const price_with_fees = await coLinks.getBuyPriceAfterFee(
          subject.address,
          10
        );

        expect(price_with_fees).to.eq(expected_price_with_fees);

        let subjectBalBefore = await ethers.provider.getBalance(
          subject.address
        );
        let feeDestBalBefore = await ethers.provider.getBalance(
          feeDestination.address
        );

        // buy 10 at once
        await userLink.buyLinks(subject.address, 10, {
          value: expected_price_with_fees,
        });
        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          10
        );

        // expect fees transferred to protocol address: 5% of price + 1/2 base fee
        let expected_fees = expected_price
          .mul(5)
          .div(100)
          .add(BASE_FEES_IN_WEI.div(2));
        expect(await ethers.provider.getBalance(feeDestination.address)).to.eq(
          feeDestBalBefore.add(expected_fees)
        );

        // expect fees transferred to subject address: 5% of price + 1/2 base fee
        expect(await ethers.provider.getBalance(subject.address)).to.eq(
          subjectBalBefore.add(expected_fees)
        );
        // expect price in escorw
        expect(await ethers.provider.getBalance(coLinks.address)).to.eq(
          expected_price
        );

        // sell 10 at once
        subjectBalBefore = await ethers.provider.getBalance(subject.address);
        feeDestBalBefore = await ethers.provider.getBalance(
          feeDestination.address
        );

        await userLink.sellLinks(subject.address, 10);
        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          0
        );

        // expect fees transferred to protocol address: 5% of price + 1/2 base fee
        expected_fees = expected_price
          .mul(5)
          .div(100)
          .add(BASE_FEES_IN_WEI.div(2));
        expect(await ethers.provider.getBalance(feeDestination.address)).to.eq(
          feeDestBalBefore.add(expected_fees)
        );

        // expect fees transferred to subject address: 5% of price + 1/2 base fee
        expect(await ethers.provider.getBalance(subject.address)).to.eq(
          subjectBalBefore.add(expected_fees)
        );

        // expect escrow to hold 0
        expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);
      });

      it('properly handles bulk buys and individual sells', async () => {
        expect(await coLinks.linkBalance(user.address, user.address)).to.eq(0);

        const userLink = coLinks.connect(user.signer);

        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          0
        );

        // price is sum of first 20 prices
        const priceVals = Object.values(prices).slice(1, 21);
        const expected_price = priceVals.reduce(
          (a, b) => BigNumber.from(a).add(BigNumber.from(b)),
          BigNumber.from(0)
        );

        const expected_price_with_fees = expected_price
          .mul(110)
          .div(100)
          .add(BASE_FEES_IN_WEI);

        const price_with_fees = await coLinks.getBuyPriceAfterFee(
          subject.address,
          20
        );

        expect(price_with_fees).to.eq(expected_price_with_fees);

        let userBalBefore = await ethers.provider.getBalance(user.address);
        let subjectBalBefore = await ethers.provider.getBalance(
          subject.address
        );
        let feeDestBalBefore = await ethers.provider.getBalance(
          feeDestination.address
        );

        // buy 20 at once
        const txr = await (
          await userLink.buyLinks(subject.address, 20, {
            value: expected_price_with_fees,
          })
        ).wait();
        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          20
        );

        // expect fees transferred to protocol address: 5% of price + 1/2 base fee
        let expected_fees = expected_price
          .mul(5)
          .div(100)
          .add(BASE_FEES_IN_WEI.div(2));
        expect(await ethers.provider.getBalance(feeDestination.address)).to.eq(
          feeDestBalBefore.add(expected_fees)
        );

        // expect fees transferred to subject address: 5% of price + 1/2 base fee
        expect(await ethers.provider.getBalance(subject.address)).to.eq(
          subjectBalBefore.add(expected_fees)
        );
        // expect price in escorw
        expect(await ethers.provider.getBalance(coLinks.address)).to.eq(
          expected_price
        );
        // expect user funds decreased by price + fees
        const gas = txr.gasUsed.mul(txr.effectiveGasPrice);
        expect(await ethers.provider.getBalance(user.address)).to.eq(
          userBalBefore.sub(expected_price_with_fees).sub(gas)
        );

        // sell 20 one by one
        for (let i = 20; i >= 1; i--) {
          userBalBefore = await ethers.provider.getBalance(user.address);
          subjectBalBefore = await ethers.provider.getBalance(subject.address);
          feeDestBalBefore = await ethers.provider.getBalance(
            feeDestination.address
          );

          expect(
            await coLinks.linkBalance(subject.address, user.address)
          ).to.eq(i);

          const priceAfterFees = await coLinks.getSellPriceAfterFee(
            subject.address,
            1
          );
          const price = BigNumber.from(prices[i]);
          const contractFees = (
            await coLinks.getSellPrice(subject.address, 1)
          ).sub(priceAfterFees);

          // sell one
          const tx = await userLink.sellLinks(subject.address, 1);
          expect(
            await coLinks.linkBalance(subject.address, user.address)
          ).to.eq(i - 1);

          // check fees

          // expect fees transferred to protocol address: 5% of price + 1/2 base fee
          let baseFees = price.div(10);

          if (baseFees.gte(BASE_FEES_IN_WEI)) {
            baseFees = BASE_FEES_IN_WEI;
          }

          expected_fees = price.mul(5).div(100).add(baseFees.div(2));

          expect(contractFees).to.eq(expected_fees.mul(2));

          // expect fees transferred to subject address: 5% of price + 1/2 base fee
          expect(await ethers.provider.getBalance(subject.address)).to.eq(
            subjectBalBefore.add(expected_fees)
          );

          expect(
            await ethers.provider.getBalance(feeDestination.address)
          ).to.eq(feeDestBalBefore.add(expected_fees));

          const txr = await tx.wait();
          const gas = txr.gasUsed.mul(txr.effectiveGasPrice);
          // expect user to receive price - fees
          expect(await ethers.provider.getBalance(user.address)).to.eq(
            userBalBefore.add(priceAfterFees).sub(gas)
          );

          // check escrow
          expect(await ethers.provider.getBalance(coLinks.address)).to.eq(
            Object.values(prices)
              .slice(1, i)
              .reduce(
                (a, b) => BigNumber.from(a).add(BigNumber.from(b)),
                BigNumber.from(0)
              )
          );
        }

        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          0
        );

        // expect escrow to hold 0
        expect(await ethers.provider.getBalance(coLinks.address)).to.eq(0);
      });

      it('multiple users buy a bunch of stuff and escrow is good', async () => {
        const a = deploymentInfo.accounts[1];
        const b = deploymentInfo.accounts[2];
        const c = deploymentInfo.accounts[3];
        const d = deploymentInfo.accounts[4];
        const e = deploymentInfo.accounts[5];

        const aLink = coLinks.connect(a.signer);
        const bLink = coLinks.connect(b.signer);
        const cLink = coLinks.connect(c.signer);
        const dLink = coLinks.connect(d.signer);
        const eLink = coLinks.connect(e.signer);

        const all = [a, b, c, d, e];

        // all buy their own keys
        Promise.all(
          all.map(async u => {
            await coLinks.connect(u.signer).buyLinks(u.address, 1);
          })
        );

        // a buys b, c, and d
        await checkPriceAndBuy(aLink, 1, b.address, 1);
        await checkPriceAndBuy(aLink, 1, c.address, 1);
        await checkPriceAndBuy(aLink, 1, d.address, 1);

        // b buys c, d, e
        await checkPriceAndBuy(bLink, 2, c.address, 1);
        await checkPriceAndBuy(bLink, 2, d.address, 1);
        await checkPriceAndBuy(bLink, 1, e.address, 1);

        // a sell d
        await checkPriceAndSell(aLink, 3, d.address, 1);

        // e buys a, b, c
        await checkPriceAndBuy(eLink, 1, a.address, 1);
        await checkPriceAndBuy(eLink, 2, b.address, 1);
        await checkPriceAndBuy(eLink, 3, c.address, 1);

        // a buy d
        await checkPriceAndBuy(aLink, 2, d.address, 1);

        // d buys a, b, d
        await checkPriceAndBuy(dLink, 2, a.address, 1);
        await checkPriceAndBuy(dLink, 3, b.address, 1);

        // a sells all d
        await checkPriceAndSell(aLink, 3, d.address, 1);

        // e sells a, b, c
        await checkPriceAndSell(eLink, 3, a.address, 1);
        await checkPriceAndSell(eLink, 4, b.address, 1);
        await checkPriceAndSell(eLink, 4, c.address, 1);
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

          expect(await coLinks.linkBalance(user.address, user.address)).to.eq(
            i
          );
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
          expect(await coLinks.linkBalance(user.address, user.address)).to.eq(
            i
          );
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

        expect(await coLinks.linkBalance(user.address, subject.address)).to.eq(
          0
        );

        const link_price = await coLinks.getBuyPriceAfterFee(
          subject.address,
          1
        );

        await coLinks.connect(user.signer).buyLinks(subject.address, 1, {
          value: link_price,
        });

        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          1
        );
      });

      it("user can buy many of subject's key", async () => {
        const user = deploymentInfo.accounts[1];

        expect(await coLinks.linkBalance(user.address, subject.address)).to.eq(
          0
        );

        const link_price = await coLinks.getBuyPriceAfterFee(
          subject.address,
          4
        );

        await coLinks.connect(user.signer).buyLinks(subject.address, 4, {
          value: link_price,
        });

        expect(await coLinks.linkBalance(subject.address, user.address)).to.eq(
          4
        );
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
        const fees = price.div(10).toString();

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

        const initialEthBalance = await ethers.provider.getBalance(
          user1.address
        );

        // sell one!
        const sellPrice = await coLinks.getSellPriceAfterFee(
          subject.address,
          1
        );
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
        // doesn't make sense
        const pricePlusFees = async (coLinks: CoLinks, supply: number) => {
          const price = await coLinks.getPrice(supply, 1);
          const fees = price.div(10).toString();
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
});

const prices: Record<number, string> = {
  0: '0',
  1: '15625000000000',
  2: '62500000000000',
  3: '140625000000000',
  4: '250000000000000',
  5: '390625000000000',
  6: '562500000000000',
  7: '765625000000000',
  8: '1000000000000000',
  9: '1265625000000000',
  10: '1562500000000000',
  11: '1890625000000000',
  12: '2250000000000000',
  13: '2640625000000000',
  14: '3062500000000000',
  15: '3515625000000000',
  16: '4000000000000000',
  17: '4515625000000000',
  18: '5062500000000000',
  19: '5640625000000000',
  20: '6250000000000000',
  21: '6890625000000000',
  22: '7562500000000000',
  23: '8265625000000000',
  24: '9000000000000000',
  25: '9765625000000000',
  26: '10562500000000000',
  27: '11390625000000000',
  28: '12250000000000000',
  29: '13140625000000000',
  30: '14062500000000000',
  31: '15015625000000000',
  32: '16000000000000000',
  33: '17015625000000000',
  34: '18062500000000000',
  35: '19140625000000000',
  36: '20250000000000000',
  37: '21390625000000000',
  38: '22562500000000000',
  39: '23765625000000000',
  40: '25000000000000000',
  41: '26265625000000000',
  42: '27562500000000000',
  43: '28890625000000000',
  44: '30250000000000000',
  45: '31640625000000000',
  46: '33062500000000000',
  47: '34515625000000000',
  48: '36000000000000000',
  49: '37515625000000000',
  50: '39062500000000000',
  51: '40640625000000000',
  52: '42250000000000000',
  53: '43890625000000000',
  54: '45562500000000000',
  55: '47265625000000000',
  56: '49000000000000000',
  57: '50765625000000000',
  58: '52562500000000000',
  59: '54390625000000000',
  60: '56250000000000000',
  61: '58140625000000000',
  62: '60062500000000000',
  63: '62015625000000000',
  64: '64000000000000000',
  65: '66015625000000000',
  66: '68062500000000000',
  67: '70140625000000000',
  68: '72250000000000000',
  69: '74390625000000000',
  70: '76562500000000000',
  71: '78765625000000000',
  72: '81000000000000000',
  73: '83265625000000000',
  74: '85562500000000000',
  75: '87890625000000000',
  76: '90250000000000000',
  77: '92640625000000000',
  78: '95062500000000000',
  79: '97515625000000000',
  80: '100000000000000000',
  81: '102515625000000000',
  82: '105062500000000000',
  83: '107640625000000000',
  84: '110250000000000000',
  85: '112890625000000000',
  86: '115562500000000000',
  87: '118265625000000000',
  88: '121000000000000000',
  89: '123765625000000000',
  90: '126562500000000000',
  91: '129390625000000000',
  92: '132250000000000000',
  93: '135140625000000000',
  94: '138062500000000000',
  95: '141015625000000000',
  96: '144000000000000000',
  97: '147015625000000000',
  98: '150062500000000000',
  99: '153140625000000000',
  100: '156250000000000000',
};

const buyPricesWithFees: Record<number, string> = {
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

const sellProceedsNet: Record<number, string> = {
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

const checkPriceAndBuy = async (
  coLinks: CoLinks,
  supply: number,
  subject: string,
  amount: number
) => {
  const user = await coLinks.signer.getAddress();
  const feeDestination = await coLinks.protocolFeeDestination();
  const { price, priceWithoutFees } = await checkBuyPrice(
    coLinks,
    supply,
    subject,
    amount
  );

  const fees = price.sub(priceWithoutFees);
  const supplyBefore = await coLinks.linkBalance(subject, user);

  // initialBals
  const userBalBefore = await ethers.provider.getBalance(user);
  const subjectBalBefore = await ethers.provider.getBalance(subject);
  const feeDestBalBefore = await ethers.provider.getBalance(feeDestination);
  const escrowBalBefore = await ethers.provider.getBalance(coLinks.address);

  // buy the link
  const tx = await coLinks.buyLinks(subject, amount, {
    value: price,
  });

  const txr = await tx.wait();
  const gas = txr.gasUsed.mul(txr.effectiveGasPrice);

  // afterBals
  const userBalAfter = await ethers.provider.getBalance(user);
  const subjectBalAfter = await ethers.provider.getBalance(subject);
  const feeDestBalAfter = await ethers.provider.getBalance(feeDestination);
  const escrowBalAfter = await ethers.provider.getBalance(coLinks.address);

  // check the balances
  expect(userBalAfter).to.eq(
    userBalBefore.sub(price).sub(gas),
    'user balance doesnt match'
  );

  expect(subjectBalAfter).to.eq(
    subjectBalBefore.add(fees.div(2)),
    'subject balance doesnt match'
  );

  expect(feeDestBalAfter).to.eq(
    feeDestBalBefore.add(fees.div(2)),
    'feeDest balance doesnt match'
  );

  // check the supply
  expect(await coLinks.linkBalance(subject, user)).to.eq(
    supplyBefore.add(BigNumber.from(amount)),
    'supply doesnt match'
  );

  // check escrow
  expect(escrowBalAfter).to.eq(
    escrowBalBefore.add(priceWithoutFees),
    'escrow dont match'
  );
};

const checkPriceAndSell = async (
  coLinks: CoLinks,
  supply: number,
  subject: string,
  amount: number
) => {
  const user = await coLinks.signer.getAddress();
  const feeDestination = await coLinks.protocolFeeDestination();
  const { price, priceWithoutFees } = await checkSellPrice(
    coLinks,
    supply,
    subject,
    amount
  );

  const fees = priceWithoutFees.sub(price);

  const supplyBefore = await coLinks.linkBalance(subject, user);

  // initialBals
  const userBalBefore = await ethers.provider.getBalance(user);
  const subjectBalBefore = await ethers.provider.getBalance(subject);
  const feeDestBalBefore = await ethers.provider.getBalance(feeDestination);
  const escrowBalBefore = await ethers.provider.getBalance(coLinks.address);

  // sell the link
  const tx = await coLinks.sellLinks(subject, amount);

  const txr = await tx.wait();
  const gas = txr.gasUsed.mul(txr.effectiveGasPrice);

  // afterBals
  const userBalAfter = await ethers.provider.getBalance(user);
  const subjectBalAfter = await ethers.provider.getBalance(subject);
  const feeDestBalAfter = await ethers.provider.getBalance(feeDestination);
  const escrowBalAfter = await ethers.provider.getBalance(coLinks.address);

  // check the balances
  expect(userBalAfter).to.eq(
    userBalBefore.add(price).sub(gas),
    'user balance doesnt match'
  );

  expect(subjectBalAfter).to.eq(
    subjectBalBefore.add(fees.div(2)),
    'subject balance doesnt match'
  );

  expect(feeDestBalAfter).to.eq(
    feeDestBalBefore.add(fees.div(2)),
    'feeDest balance doesnt match'
  );

  // check the supply
  expect(await coLinks.linkBalance(subject, user)).to.eq(
    supplyBefore.sub(BigNumber.from(amount)),
    'supply doesnt match'
  );

  // check escrow
  expect(escrowBalAfter).to.eq(
    escrowBalBefore.sub(priceWithoutFees),
    'escrowBal doesnt match'
  );
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
  const fees = priceFromContract.div(10).add(baseFee).toString();
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
  const p = buyPricesWithFees[supply];
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
    .div(10)
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
  const p = sellProceedsNet[supply - 1];
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

function ethToUsd(ethAmount: BigNumber, ethPriceInUsd: number) {
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
