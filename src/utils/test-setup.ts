import 'jest-ts-auto-mock';

const ignoreWarnings = [
  'Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead.',
];

(console as any).origWarn = console.warn;

console.warn = (...args) => {
  if (ignoreWarnings.some(x => x === args[0])) return;
  return (console as any).origWarn(...args);
};

// the DOMRect & ResizeObserver mocks help test libs like @radix-ui/popover
// https://github.com/radix-ui/primitives/issues/765

(global as any).DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }),
};

(global as any).ResizeObserver = class ResizeObserver {
  cb: any;

  constructor(cb: any) {
    this.cb = cb;
  }

  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }

  unobserve() {}
};
