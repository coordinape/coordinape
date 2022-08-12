import { useState } from 'react';

import { render, screen, act, fireEvent } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { FormTokenField } from './FormTokenField';

const handleChange = jest.fn();
const mockProps = {
  value: '2500',
  symbol: 'MOCK',
  decimals: 18,
  max: '3700',
  onChange: handleChange,
  helperText: 'derp',
};

const MockTokenPage = () => {
  const [value, setValue] = useState('');
  return (
    <TestWrapper>
      <FormTokenField {...mockProps} value={value} onChange={setValue} />
    </TestWrapper>
  );
};

test('can render a valid token amount', () => {
  act(() => {
    render(<MockTokenPage />);
  });
  const input: HTMLInputElement = screen.getByTestId('FormTokenField');
  fireEvent.change(input, { target: { value: '1.12' } });
  expect(input.value).toBe('1.12');
  fireEvent.change(input, { target: { value: '1' } });
  expect(input.value).toBe('1');
  fireEvent.change(input, { target: { value: '.12' } });
  expect(input.value).toBe('.12');
});
test('can remove invalid characters', () => {
  act(() => {
    render(<MockTokenPage />);
  });
  const input: HTMLInputElement = screen.getByTestId('FormTokenField');
  fireEvent.change(input, { target: { value: '1.12adfa' } });
  expect(input.value).toBe('1.12');
});
test('can truncate excess decimals', () => {
  act(() => {
    render(<MockTokenPage />);
  });
  const input: HTMLInputElement = screen.getByTestId('FormTokenField');
  fireEvent.change(input, { target: { value: '1.12345678901234567890' } });
  expect(input.value).toBe('1.123456789012345678');
});
