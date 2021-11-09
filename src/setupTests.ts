// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Hacky workarounds to fix issues with CRA / jest with webpack5 for self.id libs
// https://github.com/ipfs/js-ipfs/issues/3620
global.TextEncoder = TextEncoder;
// @ts-expect-error mismatched versions of typings
global.TextDecoder = TextDecoder;

jest.mock('uint8arrays', () => {
  return {
    compare: jest.fn(() => ({})),
    concat: jest.fn(() => ({})),
    equals: jest.fn(() => ({})),
    fromString: jest.fn(() => ({})),
    toString: jest.fn(() => ({})),
    xor: jest.fn(() => ({})),
  };
});

jest.mock('uint8arrays/from-string', () => ({}));
jest.mock('uint8arrays/to-string', () => ({}));
