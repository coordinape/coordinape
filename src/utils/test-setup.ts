import 'jest-ts-auto-mock';

const ignoreWarnings = [
  'Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead.',
];

(console as any).origWarn = console.warn;

console.warn = (...args) => {
  if (ignoreWarnings.some(x => x === args[0])) return;
  return (console as any).origWarn(...args);
};
