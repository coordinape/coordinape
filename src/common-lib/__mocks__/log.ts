export const mockLog = jest.fn();
export const mockError = jest.fn();

export const DebugLogger = jest.fn().mockImplementation(() => {
  return { log: mockLog, error: mockError };
});
