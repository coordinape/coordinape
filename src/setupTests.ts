// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// import { randomUUID } from 'node:crypto';

vi.mock('./ui/MarkdownPreview/MarkdownPreview.tsx', () => {
  return vi.importActual('../__mocks__/ReactMarkdown.tsx');
});

vi.mock('fs/promises', () => {});

// Save the original fetch function
const originalFetch = global.fetch;
global.fetch = async (req, ...args) => {
  let url = req as string;
  if (!url.startsWith('http')) {
    url = 'http://localhost:3007' + url;
  }
  return originalFetch(url, ...args);
};

// for radix/userEvent testing
// https://github.com/radix-ui/primitives/issues/1822
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
globalThis.window.origin = 'http://localhost:3007';
//
// // Mock global fetch to prepend the base URL for relative paths
// global.fetch = async (req, ...args) => {
//   req.url = req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`;
//   const baseUrl = 'http://localhost:3000';
//   const fullUrl = req.url.startsWith('http') ? url : `${baseUrl}${url}`;
//   return originalFetch(fullUrl, ...args);
// };
// vi.mock('uint8arrays', () => {
