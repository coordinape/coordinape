import { render, screen, fireEvent } from '@testing-library/react';

import { GiveAllocator } from './GiveAllocator';
import { Gift } from './index';

describe('Test for GiveAllocator', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockAdjust = jest.fn((recipientId: number, amount: number) => {
    return true;
  });
  const mockGift: Gift = {
    note: '',
    recipient_id: 99,
    tokens: 3,
  };

  test('basic render', async () => {
    render(
      <GiveAllocator
        adjustGift={mockAdjust}
        gift={mockGift}
        disabled={false}
        maxedOut={false}
        optedOut={false}
      />
    );
    const tokenCount: HTMLInputElement = await screen.findByTestId(
      'tokenCount'
    );
    expect(tokenCount.value).toEqual('3');
  });

  test('increment happily', async () => {
    const { rerender } = render(
      <GiveAllocator
        adjustGift={mockAdjust}
        gift={mockGift}
        disabled={false}
        maxedOut={false}
        optedOut={false}
      />
    );
    mockAdjust.mockReturnValueOnce(true);
    const increment: HTMLButtonElement = await screen.findByTestId('increment');
    fireEvent.click(increment);
    expect(mockAdjust.mock.calls[0][0]).toBe(99);
    expect(mockAdjust.mock.calls[0][1]).toBe(1);

    // update with the new updated gift object
    rerender(
      <GiveAllocator
        adjustGift={mockAdjust}
        gift={{ ...mockGift, tokens: 4 }}
        disabled={false}
        maxedOut={false}
        optedOut={false}
      />
    );
    const tokenCount: HTMLInputElement = await screen.findByTestId(
      'tokenCount'
    );
    expect((tokenCount as HTMLInputElement).value).toEqual('4');
  });

  test('maxed out', async () => {
    // max it out and now we shouldnt be able to increment and adjust shouldnt be called
    render(
      <GiveAllocator
        adjustGift={mockAdjust}
        gift={{ ...mockGift, tokens: 4 }}
        disabled={false}
        maxedOut={true}
        optedOut={false}
      />
    );
    mockAdjust.mockClear();
    const increment: HTMLButtonElement = await screen.findByTestId('increment');
    fireEvent.click(increment);

    expect(mockAdjust.mock.calls.length).toEqual(0);
  });

  test('decrement', async () => {
    render(
      <GiveAllocator
        adjustGift={mockAdjust}
        gift={{ ...mockGift, tokens: 4 }}
        disabled={false}
        maxedOut={false}
        optedOut={false}
      />
    );
    const decrement: HTMLButtonElement = await screen.findByTestId('decrement');
    fireEvent.click(decrement);
    fireEvent.click(decrement);
    expect(mockAdjust.mock.calls[0][0]).toBe(99);
    expect(mockAdjust.mock.calls[0][1]).toBe(-1);

    expect(mockAdjust.mock.calls[1][0]).toBe(99);
    expect(mockAdjust.mock.calls[1][1]).toBe(-1);
  });

  test("don't go below zero", async () => {
    render(
      <GiveAllocator
        adjustGift={mockAdjust}
        gift={{ ...mockGift, tokens: 0 }}
        disabled={false}
        maxedOut={false}
        optedOut={false}
      />
    );

    // now decrement below 0
    const decrement: HTMLButtonElement = await screen.findByTestId('decrement');
    mockAdjust.mockClear();
    // now we shouldn't be able to decrement
    fireEvent.click(decrement);
    expect(mockAdjust.mock.calls.length).toEqual(0);
  });
});
