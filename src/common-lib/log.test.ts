import { vi } from 'vitest';

const { DebugLogger } = await vi.importActual('./log');

vi.mock('debug', () => ({
  __esModule: true,
  default: vi.fn(() => {
    function logger(...args: string[]) {
      logger.log(...args);
    }
    logger.log = console.error;
    return logger;
  }),
}));

const consoleLogMock = vi.spyOn(console, 'log').mockImplementation();
const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation();

afterEach(() => {
  consoleLogMock.mockClear();
  consoleErrorMock.mockClear();
});
it('can log to stdout', () => {
  const logger = new DebugLogger('test');
  logger.log('hello');
  expect(consoleLogMock).toBeCalledTimes(1);
  expect(consoleErrorMock).toBeCalledTimes(0);
  expect(consoleLogMock).toBeCalledWith('hello');
});

it('can log to stderr', () => {
  const logger = new DebugLogger('test');
  logger.error('alert!');
  expect(consoleLogMock).toBeCalledTimes(0);
  expect(consoleErrorMock).toBeCalledTimes(1);
  expect(consoleErrorMock).toBeCalledWith('alert!');
});

export {};
