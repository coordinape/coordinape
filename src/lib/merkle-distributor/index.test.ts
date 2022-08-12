import { BigNumber } from '@ethersproject/bignumber';
import padStart from 'lodash/padStart';

import { createDistribution } from '.';

const addr = (num: number) => '0xabc' + padStart(num.toString(), 37, '0');

test('amounts', () => {
  const { claims } = createDistribution(
    {
      [addr(1)]: 10,
      [addr(2)]: 20,
      [addr(3)]: 30,
    },
    {},
    BigNumber.from('500000000'),
    BigNumber.from('500000000')
  );

  expect(claims[addr(1)].amount).toEqual('83333333');
  expect(claims[addr(2)].amount).toEqual('166666666');
  expect(claims[addr(3)].amount).toEqual('250000001');
});

test('dust limit', () => {
  const randint = (max: number) => 1 + Math.floor(Math.random() * max);

  for (let i = 0; i < 20; i++) {
    const totalAmount = BigNumber.from(Math.floor(Math.random() * 100000000));
    createDistribution(
      {
        [addr(2)]: randint(10),
        [addr(4)]: randint(100),
        [addr(6)]: randint(200),
        [addr(8)]: randint(500),
        [addr(10)]: randint(1000),
      },
      {},
      totalAmount,
      totalAmount
    );
  }
});

test('combined root', () => {
  const previousDist = {
    claims: {
      [addr(1)]: { index: 0, amount: '0x04f790d5', proof: ['mock'] }, // 83333333
      [addr(2)]: { index: 1, amount: '0x09ef21aa', proof: ['mock'] }, // 166666666
      [addr(3)]: { index: 2, amount: '0x0ee6b281', proof: ['mock'] }, // 250000001
    },
    tokenTotal: '500000000',
  };

  const dist = createDistribution(
    {
      [addr(1)]: 100,
      [addr(2)]: 100,
      [addr(4)]: 100,
    },
    {},
    BigNumber.from('600000000'),
    BigNumber.from('600000000'),
    previousDist
  );

  expect(dist.claims[addr(1)].amount).toEqual('283333333');
  expect(dist.claims[addr(2)].amount).toEqual('366666666');
  expect(dist.claims[addr(3)].amount).toEqual('250000001');
  expect(dist.claims[addr(4)].amount).toEqual('200000000');
  expect(dist.tokenTotal).toEqual('1100000000');
  expect(dist.previousTotal).toEqual('500000000');
});
